// Serve src/ for development.
//
//   npm run dev            → http://localhost:5173
//   npm run dev -- 8080    → a different port
//
// No bundling and no watcher: the browser loads the ES modules and the stylesheet
// exactly as they are on disk, so a save and a refresh is the whole loop. What
// you see here is what `npm run build` will bundle.

import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(dirname(fileURLToPath(import.meta.url))), "src");
const port = Number(process.argv[2] ?? process.env.PORT ?? 5173);

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const server = createServer(async (req, res) => {
  // Strip the query and refuse anything trying to climb out of src/.
  const path = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const safe = normalize(path).replace(/^(\.\.[/\\])+/, "");
  let file = join(root, safe === "/" ? "index.html" : safe);

  try {
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
  } catch {
    // Unknown paths fall through to the app, which routes on the hash.
    file = join(root, "index.html");
  }

  try {
    await stat(file);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Not found");
    return;
  }

  res.writeHead(200, {
    "content-type": TYPES[extname(file)] ?? "application/octet-stream",
    "cache-control": "no-store",
  });
  createReadStream(file).pipe(res);
});

server.on("error", (err) => {
  if (/** @type {any} */ (err).code === "EADDRINUSE") {
    console.error(`Port ${port} is already in use. Try: npm run dev -- ${port + 1}`);
    process.exit(1);
  }
  throw err;
});

server.listen(port, () => {
  console.log(`Saints Crew — http://localhost:${port}`);
});
