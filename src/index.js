import { watch } from "chokidar";
import fs from "fs/promises";
import http from "http";
import net from "net";
import open from "open";
import path from "path";
import { fileURLToPath } from "url";

const REPORT_API = process.env.REPORT_API ?? "https://report.microservice.zensoft.com.br";

const ENGINE_EXTENSIONS = {
  eta: [".eta"],
  handlebars: [".handlebars"],
  jsx: [".jsx"],
  liquid: [".liquid"],
  nunjucks: [".nunjucks"],
};

const EXTENSIONS = Object.values(ENGINE_EXTENSIONS).flat();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const playgroundDir = path.resolve(__dirname, "../playground");

async function fileExists(p) {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

function getSourceCandidates(base, engine) {
  const exts = ENGINE_EXTENSIONS[engine];
  if (!exts) {
    throw new Error(`Unknown engine: ${engine}`);
  }

  return exts.map(ext => path.join(playgroundDir, `${base}${ext}`));
}

async function readJson(p, fallback) {
  if (!(await fileExists(p))) {
    return fallback;
  }
  const text = await fs.readFile(p, "utf8");
  return JSON.parse(text);
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#039;");
}

function errorToHtml(base, err) {
  const message = escapeHtml(err?.message ?? String(err));
  const stack = escapeHtml(err?.stack ?? "");
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(base)} - erro</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; }
    pre { white-space: pre-wrap; background: #111; color: #eee; padding: 16px; border-radius: 8px; }
    h1 { margin-top: 0; }
  </style>
</head>
<body>
  <h1>Erro ao compilar: ${escapeHtml(base)}</h1>
  <p><strong>${message}</strong></p>
  ${stack ? `<pre>${stack}</pre>` : ""}
</body>
</html>`;
}

async function compile(base) {
  const templateFile = path.join(playgroundDir, `${base}.template.json`);
  const dataFile = path.join(playgroundDir, `${base}.data.json`);
  const outFile = path.join(playgroundDir, `${base}.html`);

  try {
    if (!(await fileExists(templateFile))) return;

    const templateConfig = await readJson(templateFile, null);
    if (!templateConfig || typeof templateConfig !== "object") {
      throw new Error("template.json inválido (esperado objeto)");
    }

    if (!templateConfig.engine) {
      throw new Error("template.engine é obrigatório");
    }

    // resolve source
    const sourceCandidates = getSourceCandidates(base, templateConfig.engine);

    let sourceFile;
    for (const p of sourceCandidates) {
      if (await fileExists(p)) {
        sourceFile = p;
        break;
      }
    }

    if (!sourceFile) {
      throw new Error(
        `Template source não encontrado. Esperado: ${sourceCandidates
          .map(p => path.basename(p))
          .join(" ou ")}`,
      );
    }

    const source = await fs.readFile(sourceFile, "utf8");
    const data = await fileExists(dataFile) ? await fs.readFile(dataFile, "utf8") : undefined;

    // render request
    const renderRequest = {
      engine: templateConfig.engine,
      template: {
        source,
      },
      data: undefined,
      assets: templateConfig.assets,
    };

    if (data) {
      if (data.length <= 3096) {
        renderRequest.data = JSON.parse(data);
      } else {
        // prepare data upload
        const preparedData = await fetchWithTimeout(`${REPORT_API}/report/prepare`, {
          method: "POST",
          // headers: { "Content-Type": "application/json" },
          // body: "{}",
        });

        if (!preparedData.ok) {
          throw new Error("Falha no /report/prepare");
        }

        const { key, uploadUrl } = await preparedData.json();

        // upload data 
        const response = await fetchWithTimeout(uploadUrl, {
          method: "PUT",
          // headers: { "Content-Type": "text/plain" },
          body: data,
        });
        if (!response.ok) {
          throw new Error("Falha ao enviar template para storage");
        }

        renderRequest.data = "@url:" + key;
      }
    }

    if (renderRequest.assets?.styles?.startsWith("@file:")) {
      const cssFile = renderRequest.assets.styles.slice(6);
      const cssPath = path.join(playgroundDir, cssFile);

      renderRequest.assets.styles = await fs.readFile(cssPath, "utf8");
    }

    const generateRes = await fetchWithTimeout(`${REPORT_API}/report/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(renderRequest),
    });

    if (!generateRes.ok) {
      const err = await generateRes.text();
      throw new Error(err);
    }

    const { url } = await generateRes.json();

    // download HTML
    const htmlRes = await fetchWithTimeout(url);
    const html = await htmlRes.text();

    await fs.writeFile(outFile, html, "utf8");
    console.log(`${base}.html updated`);
    triggerReload();
  } catch (err) {
    console.error(`${base}:`, err?.message ?? err);

    try {
      await fs.writeFile(outFile, errorToHtml(base, err), "utf8");
      triggerReload();
    } catch {
      // ignore
    }
  }
}

async function compileAll() {
  const files = await fs.readdir(playgroundDir);
  const bases = new Set(
    files
      .filter(f => f.endsWith(".template.json"))
      .map(f => f.replace(/\.template\.json$/, "")),
  );
  for (const b of bases) {
    await compile(b);
  }
}

async function listHtmlFiles() {
  const files = await fs.readdir(playgroundDir);
  return files.filter(f => f.endsWith(".html"));
}

let clients = [];

function triggerReload() {
  for (const res of clients) {
    res.write("data: reload\n\n");
  }
}

function findPort(start) {
  return new Promise(resolve => {
    function tryPort(p) {
      const server = net.createServer();
      server.once("error", () => tryPort(p + 1));
      server.once("listening", () => {
        server.close(() => resolve(p));
      });
      server.listen(p, "0.0.0.0");
    }
    tryPort(start);
  });
}

function startServer(port) {
  const server = http.createServer(async (req, res) => {
    if (req.url === "/__reload") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      });
      res.write("\n");
      clients.push(res);
      req.on("close", () => {
        clients = clients.filter(c => c !== res);
      });
      return;
    }

    if (req.url === "/") {
      const files = await listHtmlFiles();
      const links = files
        .map(f => `<li><a href="/${encodeURIComponent(f)}">${escapeHtml(f)}</a></li>`)
        .join("");

      const html = `<!doctype html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>Playground</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 24px; }
    li { margin: 6px 0; }
  </style>
</head>
<body>
  <h1>Playground reports</h1>

  <p>Arquivos esperados por report:</p>
  <ul>
    <li>
      <code>name.<a href="https://eta.js.org/">eta</a></code>, 
      <code>name.<a href="https://handlebarsjs.com/">handlebars</a></code>, 
      <code>name.<a href="https://www.w3schools.com/react/react_jsx.asp">jsx</a></code>, 
      <code>name.<a href="https://shopify.github.io/liquid/">liquid</a></code>, 
      <code>name.<a href="https://mozilla.github.io/nunjucks/">nunjucks</a></code>
    </li>
    <li><code>name.template.json</code></li>
    <li><code>name.data.json</code> (opcional)</li>
  </ul>

  <h2>Gerados:</h2>
  <ul>${links || "<li><em>No reports yet</em></li>"}</ul>

  <script>
    const es = new EventSource('/__reload');
    es.onmessage = () => location.reload();
  </script>
</body>
</html>`;

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
      return;
    }

    const filePath = path.join(playgroundDir, decodeURIComponent(req.url ?? ""));

    try {
      let html = await fs.readFile(filePath, "utf8");

      if (filePath.endsWith(".html")) {
        html = html.replace(
          "</body>",
          `<script>
  const es = new EventSource('/__reload');
  es.onmessage = () => location.reload();
</script>\n</body>`,
        );
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  });

  server.listen(port, () => {
    const url = `http://localhost:${port}/`;
    console.log(`Playground server: ${url}`);
    open(url);
  });
}

function extractBase(file) {
  const name = file.replace(/^.*[\\/]/, "");
  if (name.endsWith(".template.json")) return name.replace(/\.template\.json$/, "");
  if (name.endsWith(".data.json")) return name.replace(/\.data\.json$/, "");
  return path.parse(name).name;
}

async function onChange(file) {
  const { name, ext } = path.parse(file);

  // ext aqui é só a última extensão; para ".template.json" precisa tratar separado
  const isTemplateJson = file.endsWith(".template.json");
  const isDataJson = file.endsWith(".data.json");
  const isSource = EXTENSIONS.includes(ext);

  if (isTemplateJson || isDataJson || isSource) {
    const base = extractBase(file);

    await compile(base);
  }
}

async function onDelete(file) {
  const { name, ext } = path.parse(file);

  const isTemplateJson = file.endsWith(".template.json");
  const isDataJson = file.endsWith(".data.json");
  const isSource = EXTENSIONS.includes(ext);

  const base = extractBase(file);
  if (!base) {
    return;
  }

  // Se apagou template/source, apaga html
  if (isTemplateJson || isSource) {
    try {
      await fs.unlink(path.join(playgroundDir, `${base}.html`));
      triggerReload();
    } catch {
      // ignore
    }
    return;
  }

  // Se apagou data, recompila com {}
  if (isDataJson) {
    if (await fileExists(path.join(playgroundDir, `${base}.template.json`))) {
      await compile(base);
    }
  }
}

async function fetchWithTimeout(url, options = {}, ms = 15000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...options, signal: ctrl.signal })
    .finally(() => clearTimeout(id));
}

console.log("Playground watching...");

await compileAll();

const watcher = watch(playgroundDir, { depth: 0, ignoreInitial: true });

watcher.on("add", f => onChange(f));
watcher.on("change", f => onChange(f));
watcher.on("unlink", f => onDelete(f));

const port = await findPort(8090);
startServer(port);