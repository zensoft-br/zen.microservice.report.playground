import { watch } from "chokidar";
import fs from "fs/promises";
import http from "http";
import net from "net";
import open from "open";
import path from "path";
import { fileURLToPath } from "url";

/*
 * Configuration
 */

const REPORT_API =
  process.env.REPORT_API ?? "https://report.microservice.zensoft.com.br";

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

// --- Utilities ---
const fileExists = (p) =>
  fs
    .stat(p)
    .then(() => true)
    .catch(() => false);

async function readJson(p, fallback) {
  if (!(await fileExists(p))) return fallback;
  try {
    return JSON.parse(await fs.readFile(p, "utf8"));
  } catch (e) {
    throw new Error(`Invalid JSON in ${path.basename(p)}: ${e.message}`);
  }
}

const escapeHtml = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[m],
  );

async function fetchWithTimeout(url, options = {}, ms = 15000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...options, signal: ctrl.signal }).finally(() =>
    clearTimeout(id),
  );
}

/** Recursively find all folders containing a template.json */
async function findReportFolders(dir) {
  let results = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (await fileExists(path.join(fullPath, "template.json"))) {
          results.push(fullPath);
        }
        results = results.concat(await findReportFolders(fullPath));
      }
    }
  } catch (_) {
    // Ignore errors
  }
  return results;
}

// --- Core Logic ---

async function compile(reportFolder) {
  const relativeBase = path.relative(playgroundDir, reportFolder);
  const templateFile = path.join(reportFolder, "template.json");
  const dataFile = path.join(reportFolder, "data.json");
  const outFile = path.join(reportFolder, "report.html");
  const buildFile = path.join(reportFolder, "build.json");

  try {
    const config = await readJson(templateFile, null);
    if (!config?.engine) throw new Error("template.engine is required");

    // Find source file
    const exts = ENGINE_EXTENSIONS[config.engine] || [];
    let sourceContent;
    for (const ext of exts) {
      const p = path.join(reportFolder, `source${ext}`);
      if (await fileExists(p)) {
        sourceContent = await fs.readFile(p, "utf8");
        break;
      }
    }
    if (!sourceContent)
      throw new Error(`Source file missing in ${relativeBase}`);

    const dataText = (await fileExists(dataFile))
      ? await fs.readFile(dataFile, "utf8")
      : null;

    const renderRequest = {
      engine: config.engine,
      template: { source: sourceContent },
      assets: JSON.parse(JSON.stringify(config.assets || {})),
      data: undefined,
    };

    // Handle Data (Upload if large)
    if (dataText) {
      if (dataText.length <= 3096) {
        renderRequest.data = JSON.parse(dataText);
      } else {
        const prep = await fetchWithTimeout(
          `${REPORT_API}/report/prepare-upload`,
          { method: "POST" },
        );
        const { key, uploadUrl } = await prep.json();
        await fetchWithTimeout(uploadUrl, { method: "PUT", body: dataText });
        renderRequest.data = key;
      }
    }

    // Process Styles (@file: logic)
    if (renderRequest.assets?.styles) {
      const styles = renderRequest.assets.styles;
      const isArray = Array.isArray(styles);
      const styleEntries = isArray ? styles : [styles];

      const processed = await Promise.all(
        styleEntries.map(async (s) => {
          if (typeof s === "string" && s.startsWith("@file:")) {
            const relativeCssPath = s.slice(6);
            const cssPath = path.resolve(reportFolder, relativeCssPath);
            try {
              return await fs.readFile(cssPath, "utf8");
            } catch (err) {
              console.warn(
                `\x1b[33m[WARN]\x1b[0m CSS missing: ${relativeCssPath} in ${relativeBase}`,
              );
              return null;
            }
          }
          return s;
        }),
      );
      renderRequest.assets.styles = isArray ? processed : processed[0];
    }

    // Remote Generate
  renderRequest.template.source = await localizeContent(renderRequest.template.source);

    const genRes = await fetchWithTimeout(`${REPORT_API}/report/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(renderRequest),
    });

    if (!genRes.ok) throw new Error(await genRes.text());
    const { url } = await genRes.json();
    const html = await (await fetchWithTimeout(url)).text();

    // Save outputs
    // eslint-disable-next-line no-unused-vars
    const { data, ...buildInfo } = renderRequest;
    await fs.writeFile(buildFile, JSON.stringify(buildInfo, null, 2));
    await fs.writeFile(outFile, html);

    console.log(`\x1b[32m[OK]\x1b[0m ${relativeBase}`);
    triggerReload();
  } catch (err) {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${relativeBase}:`, err.message);
    const errorHtml = `<!doctype html><html><body style="font-family:sans-serif;padding:24px;"><h1>Error: ${relativeBase}</h1><pre style="background:#111;color:#eee;padding:16px;white-space:pre-wrap;">${escapeHtml(err.stack)}</pre></body></html>`;
    await fs.writeFile(outFile, errorHtml).catch(() => {});
    triggerReload();
  }
}

/**
 * Fetches localization resources and replaces placeholders in a template string.
 * @param {string} template - The string containing @@:key placeholders.
 * @returns {Promise<string>} - The processed string with values injected.
 */
async function localizeContent(template) {
  const url = 'https://zenerp.app.br/resources.pt-BR.json';

    const response = await fetch(url);
    if (!response.ok) 
      throw new Error(`Failed to load resources: ${response.statusText}`);
    
    const resources = await response.json();

    return template.replace(/@@:([/@\w.-]+)/g, (match, key) => {
      return resources[key] !== undefined ? resources[key] : "xx";
    });
}

/*
 * Server & Watcher ---
 */

let clients = [];

const triggerReload = () =>
  clients.forEach((res) => res.write("data: reload\n\n"));

const RELOAD_SCRIPT = `<script>new EventSource('/__reload').onmessage=()=>location.reload()</script>`;

async function startServer(port) {
  http
    .createServer(async (req, res) => {
      const url = decodeURIComponent(req.url || "");

      if (url === "/__reload") {
        res.writeHead(200, {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        });
        res.write("\n");
        return clients.push(res);
      }

      if (url === "/") {
        const folders = await findReportFolders(playgroundDir);
        const links = folders
          .map((f) => {
            const rel = path.relative(playgroundDir, f);
            // Encode path for URL, but keep it readable for the label
            return `<li><a href="/${rel.split(path.sep).map(encodeURIComponent).join("/")}/report.html" target="_blank">${escapeHtml(rel)}</a></li>`;
          })
          .join("");

        res.writeHead(200, { "Content-Type": "text/html" });
        return res.end(
          `<html><body style="font-family:sans-serif;padding:24px;"><h1>Reports Playground</h1><ul>${links || "<li>No reports found.</li>"}</ul>${RELOAD_SCRIPT}</body></html>`,
        );
      }

      const filePath = path.join(playgroundDir, url);
      try {
        let content = await fs.readFile(filePath, "utf8");
        if (filePath.endsWith(".html")) {
          content = content.replace("</body>", `${RELOAD_SCRIPT}</body>`);
        }
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end("Not found");
      }
    })
    .listen(port, () => {
      console.log(`Server: http://localhost:${port}/`);
      open(`http://localhost:${port}/`);
    });
}

async function onChange(filePath) {
  const fullPath = path.resolve(filePath);
  const name = path.basename(fullPath);
  const ext = path.extname(fullPath);

  if (
    name === "template.json" ||
    name === "data.json" ||
    (name.startsWith("source.") && EXTENSIONS.includes(ext))
  ) {
    await compile(path.dirname(fullPath));
    return;
  }

  if (ext === ".css") {
    const folders = await findReportFolders(playgroundDir);
    for (const folder of folders) {
      const config = await readJson(path.join(folder, "template.json"), {});
      const styles = [].concat(config.assets?.styles || []);
      const isLinked = styles.some(
        (s) =>
          typeof s === "string" &&
          s.startsWith("@file:") &&
          path.resolve(folder, s.slice(6)) === fullPath,
      );
      if (isLinked) await compile(folder);
    }
  }
}

const port = await new Promise((resolve) => {
  const tryPort = (p) => {
    const s = net
      .createServer()
      .once("error", () => tryPort(p + 1))
      .once("listening", () => s.close(() => resolve(p)))
      .listen(p);
  };
  tryPort(8090);
});

console.log("Starting watcher...");

// const folders = await findReportFolders(playgroundDir);
// await Promise.all(folders.map(compile));

watch(playgroundDir, { depth: 10, ignoreInitial: true })
  .on("add", onChange)
  .on("change", onChange)
  .on("unlink", triggerReload)
  .on("addDir", triggerReload)
  .on("unlinkDir", triggerReload);

startServer(port);
