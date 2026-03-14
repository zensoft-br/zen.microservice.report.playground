import { watch } from "chokidar";
import fs from "fs/promises";
import  * as sass from "sass";
import http from "http";
import net from "net";
import open from "open";
import path from "path";
import { fileURLToPath } from "url";

// Configuration

const REPORT_API =
  process.env.REPORT_API ?? "https://report.zensoft.com.br";

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

// Utilities

function fileExists(p) {
  return fs
    .stat(p)
    .then(() => true)
    .catch(() => false);
}

async function readJson(p, fallback) {
  if (!(await fileExists(p))) return fallback;
  try {
    return JSON.parse(await fs.readFile(p, "utf8"));
  } catch (e) {
    throw new Error(`Invalid JSON in ${path.basename(p)}: ${e.message}`);
  }
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (m) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "\"": "&quot;",
        "'": "&#039;",
      })[m],
  );
}

async function fetchWithTimeout(url, options = {}, ms = 15000) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { ...options, signal: ctrl.signal }).finally(() =>
    clearTimeout(id),
  );
}

// Recursively find all folders containing a template.json
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

// Deep merges two objects. 
function deepMerge(source, patch) {
  // If patch isn't an object, it's a primitive; return it as the new value
  if (patch === null || typeof patch !== "object" || Array.isArray(patch)) {
    return patch;
  }

  // Create a copy of the source to keep the function pure
  const result = { ...source };

  Object.keys(patch).forEach(key => {
    const sourceValue = result[key];
    const patchValue = patch[key];

    if (sourceValue && typeof sourceValue === "object" && !Array.isArray(sourceValue) &&
            patchValue && typeof patchValue === "object" && !Array.isArray(patchValue)) {
      // Both are objects, recurse
      result[key] = deepMerge(sourceValue, patchValue);
    } else {
      // Otherwise, patch value wins
      result[key] = patchValue;
    }
  });

  return result;
}

// Core logic

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
      i18n: config.i18n,
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

    // Process scripts (@file: logic)
    if (renderRequest.assets?.scripts) {
      const processed = await Promise.all(
        Object.entries(renderRequest.assets.scripts).map(async ([key, s]) => {
          if (typeof s === "string" && s.startsWith("@file:")) {
            const filePath = s.slice(6);
      
            let scriptPath;
            if (filePath.startsWith("/")) {
              scriptPath = path.join(process.cwd(), "playground", filePath);
            } else {
              scriptPath = path.resolve(reportFolder, filePath);
            }

            try {
              return { [key]: await fs.readFile(scriptPath, "utf8") };
            } catch (err) {
              console.warn(
                `\x1b[33m[WARN]\x1b[0m Script missing: ${filePath}\n Resolved as: ${scriptPath}`,
              );
              return null;
            }
          }
          return { [key]: s };
        }),
      );

      renderRequest.assets.scripts = processed.reduce((acc, val) => ({ ...acc, ...val }), {});
    }

    // Process styles (@file: logic)
    if (renderRequest.assets?.styles) {
      const styles = renderRequest.assets.styles;
      const isArray = Array.isArray(styles);
      const styleEntries = isArray ? styles : [styles];

      const processed = await Promise.all(
        styleEntries.map(async (s) => {
          if (typeof s === "string" && s.startsWith("@file:")) {
            const filePath = s.slice(6);
      
            let cssPath;
            if (filePath.startsWith("/")) {
              cssPath = path.join(process.cwd(), "playground", filePath);
            } else {
              cssPath = path.resolve(reportFolder, filePath);
            }

            try {
              return await fs.readFile(cssPath, "utf8");
            } catch (err) {
              console.warn(
                `\x1b[33m[WARN]\x1b[0m CSS missing: ${filePath}\n Resolved as: ${cssPath}`,
              );
              return null;
            }
          }
          return s;
        }),
      );

      renderRequest.assets.styles = isArray ? processed : processed[0];
    }

    // Inject i18n defaults and merge with template config
    const i18n = {
      locale: "pt-BR",
      timeZone: "America/Sao_Paulo",
      fallbackLocale: "pt-BR",
      resources: {  
        "en-US": "https://zenerp.app.br/resources.en-US.json",
        "es-ES": "https://zenerp.app.br/resources.es-ES.json",
        "pt-BR": "https://zenerp.app.br/resources.pt-BR.json",
        "zh-CN": "https://zenerp.app.br/resources.zh-CN.json",
      },
    };

    const mergedRequest = {
      ...renderRequest,
      i18n: {
        ...deepMerge(i18n, renderRequest.i18n || {}),
      },
    };

    if (config.metadata) {
      renderRequest.metadata = config.metadata;
    }

    const genRes = await fetchWithTimeout(`${REPORT_API}/report/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mergedRequest),
    });

    if (!genRes.ok) throw new Error(await genRes.text());
    const { url } = await genRes.json();
    const html = await (await fetchWithTimeout(url)).text();

    // console.log(url);
    
    // Save outputs
    // eslint-disable-next-line no-unused-vars
    const { data, ...buildInfo } = renderRequest;
    await fs.writeFile(buildFile, JSON.stringify(buildInfo, null, 2));
    await fs.writeFile(outFile, html);

    console.log(`\x1b[32m[REPORT]\x1b[0m ${relativeBase}`);
    triggerReload();
  } catch (err) {
    console.error(`\x1b[31m[REPORT ERROR]\x1b[0m ${relativeBase}:`, err.message);
    const errorHtml = `<!doctype html><html><body style="font-family:sans-serif;padding:24px;"><h1>Error: ${relativeBase}</h1><pre style="background:#111;color:#eee;padding:16px;white-space:pre-wrap;">${escapeHtml(err.stack)}</pre></body></html>`;
    await fs.writeFile(outFile, errorHtml).catch(() => {});
    triggerReload();
  }
}

export async function compileAll() {
  const folders = await findReportFolders(playgroundDir);
  await Promise.all(folders.map(compile));
}

// Server & Watcher

let clients = [];

const RELOAD_SCRIPT = "<script>new EventSource('/__reload').onmessage=()=>location.reload()</script>";

function triggerReload() {
  clients.forEach((res) => res.write("data: reload\n\n"));
}

async function onChange(filePath) {
  const fullPath = path.resolve(filePath);
  const dirPath = path.dirname(fullPath);
  const name = path.basename(fullPath);
  const ext = path.extname(fullPath);

  if (ext === ".scss") {
    try {
      const result = await sass.compileAsync(fullPath);
      await fs.writeFile(path.join(dirPath, path.parse(fullPath).name + ".css"), result.css + "\n");
      console.log(`\x1b[32m[SCSS]\x1b[0m ${fullPath}`);
    } catch (err) {
      console.error(`\x1b[31m[SASS ERROR]\x1b[0m ${fullPath}:`, err);
    }
    return;
  }
    
  // Only trigger if there is a template.json in the same folder
  const template = path.join(path.dirname(fullPath), "template.json");
  if (!(await fileExists(template))) {
    return;
  }

  if (!(
    name === "build.json" ||
    name === "report.html" ||
    ext === ".scss" 
  )) {
    await compile(path.dirname(fullPath));
    return;
  }
}

export async function startWatcher() {
  console.log("Starting watcher...");

  watch(playgroundDir, { depth: 10, ignoreInitial: true })
    .on("add", onChange)
    .on("change", onChange)
    .on("unlink", triggerReload)
    .on("addDir", triggerReload)
    .on("unlinkDir", triggerReload);
}

export async function startServer() {
  const port = await new Promise((resolve) => {
    const tryPort = (p) => {
      const s = net
        .createServer()
        .once("error", () => tryPort(p + 1))
        .once("listening", () => s.close(() => resolve(p)))
        .listen(p);
    };
    tryPort(8100);
  });

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
