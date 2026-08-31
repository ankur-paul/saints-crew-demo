// Browser tests for the built site.
//
//   npm run build && npm run test:e2e
//
// Builds nothing itself: it serves dist/ and drives headless Chrome over the
// DevTools protocol, so it exercises the same bundle that gets deployed. Chrome
// is found via CHROME (env) or the usual binary names.
//
// These cover the behaviour unit tests cannot reach: routing, the bag surviving a
// reload, focus and scroll locking, and that no page logs an error.

import { spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { mkdtemp, rm, stat } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const dist = join(root, "dist");
const PORT = 8899;
const DEBUG_PORT = 9333;
const BASE = `http://localhost:${PORT}`;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
};

/* ------------------------------------------------------------ harness */

const results = [];
let failures = 0;

/**
 * @param {string} name
 * @param {boolean} ok
 * @param {string} [detail] shown when the check fails
 */
function check(name, ok, detail = "") {
  if (!ok) failures += 1;
  results.push(`${ok ? "  ok  " : "FAIL  "}${name}${!ok && detail ? `  — got ${detail}` : ""}`);
}

function startServer() {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent((req.url ?? "/").split("?")[0]);
    const file = join(dist, normalize(path) === "/" ? "index.html" : normalize(path).replace(/^\/+/, ""));
    try {
      await stat(file);
    } catch {
      res.writeHead(404).end();
      return;
    }
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

function findChrome() {
  return process.env.CHROME ?? "google-chrome";
}

/** Minimal CDP client: evaluate expressions and collect console errors. */
async function connect() {
  // A private profile per run, so two runs can never share state or contend
  // over the same profile lock.
  const profile = await mkdtemp(join(tmpdir(), "saints-crew-e2e-"));

  const chrome = spawn(
    findChrome(),
    [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--no-default-browser-check",
      `--user-data-dir=${profile}`,
      `--remote-debugging-port=${DEBUG_PORT}`,
      "--remote-allow-origins=*",
      "about:blank",
    ],
    { stdio: "ignore", detached: true },
  );

  /** @type {any} */
  let target;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    await new Promise((r) => setTimeout(r, 250));
    try {
      const list = await (await fetch(`http://localhost:${DEBUG_PORT}/json/list`)).json();
      target = list.find((t) => t.type === "page");
      if (target) break;
    } catch {
      /* not up yet */
    }
  }
  if (!target) throw new Error("could not reach headless Chrome");

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let nextId = 0;
  const pending = new Map();
  /** @type {string[]} */
  const logs = [];

  ws.onmessage = (event) => {
    const msg = JSON.parse(String(event.data));
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    }
    if (msg.method === "Runtime.consoleAPICalled" && msg.params.type === "error") {
      logs.push(msg.params.args.map((a) => a.value ?? a.description).join(" "));
    }
    if (msg.method === "Runtime.exceptionThrown") {
      logs.push(msg.params.exceptionDetails.exception?.description ?? msg.params.exceptionDetails.text);
    }
  };
  await new Promise((r) => (ws.onopen = r));

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const id = (nextId += 1);
      pending.set(id, resolve);
      ws.send(JSON.stringify({ id, method, params }));
    });

  await send("Runtime.enable");
  await send("Page.enable");

  return {
    logs,
    /** @param {string} expression */
    async evaluate(expression) {
      const res = await send("Runtime.evaluate", {
        expression,
        returnByValue: true,
        awaitPromise: true,
      });
      return res.result?.result?.value;
    },
    /** @param {string} path */
    async go(path) {
      await send("Page.navigate", { url: BASE + path });
      await new Promise((r) => setTimeout(r, 900));
    },
    async click(selector) {
      await this.evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
      await new Promise((r) => setTimeout(r, 250));
    },
    async text() {
      return (await this.evaluate("document.body.innerText")) ?? "";
    },
    async close() {
      ws.close();
      // Chrome forks helper processes; killing the group stops all of them, so
      // the debug port is free for the next run.
      try {
        if (chrome.pid) process.kill(-chrome.pid, "SIGKILL");
      } catch {
        chrome.kill("SIGKILL");
      }
      await rm(profile, { recursive: true, force: true });
    },
  };
}

/* -------------------------------------------------------------- tests */

const server = await startServer();
const page = await connect();

try {
  // --- routing ---------------------------------------------------------
  await page.go("/#/product/p1");
  check("product page sets its own title", (await page.evaluate("document.title")) === "Aran Cable Sweater — Saints Crew");

  await page.go("/#/product/no-such-garment");
  check(
    "unknown product id redirects to the collection",
    (await page.evaluate("location.hash")) === "#/shop",
    await page.evaluate("location.hash"),
  );

  await page.go("/#/total-nonsense");
  check("unknown route falls back to home", (await page.text()).includes("Cloth that keeps its word"));

  await page.go("/#/shop?cat=Trousers&gender=Men");
  check("filters read from the URL", (await page.text()).includes("Nothing in this combination yet."));
  await page.click('[data-action="reset-filters"]');
  check("resetting filters restores the collection", (await page.text()).includes("7 pieces in stock."));

  await page.go("/#/shop?cat=Nonsense");
  check("an invalid filter in the URL is ignored", (await page.text()).includes("7 pieces in stock."));

  // --- the bag ---------------------------------------------------------
  await page.go("/#/product/p1");
  await page.click('[data-action="set-size"][data-value="L"]');
  check("choosing a size is reflected back", (await page.text()).includes("Size L selected."));

  await page.click('[data-action="add-to-bag"]');
  check("adding to the bag opens the drawer", await page.evaluate('!!document.getElementById("sc-cartpanel")'));
  check("the bag counter updates", (await page.text()).toUpperCase().includes("BAG (1)"));
  check("the subtotal is shown", (await page.text()).includes("₹5,400"));
  check("the shipping shortfall is shown", (await page.text()).includes("₹600 to go"));
  check("the page behind the drawer cannot scroll", await page.evaluate('document.body.classList.contains("is-locked")'));
  check("focus moves into the drawer", await page.evaluate('document.getElementById("sc-cartpanel").contains(document.activeElement)'));

  await page.click('[data-action="add-to-bag"]');
  check("adding the same size again merges the line", (await page.text()).toUpperCase().includes("BAG (2)"));

  await page.go("/#/shop");
  check("the bag survives a reload", (await page.text()).toUpperCase().includes("BAG (2)"));

  await page.click('[data-action="toggle-cart"]');
  await page.click('[data-action="remove-line"]');
  check("removing a line empties the bag", (await page.text()).toUpperCase().includes("BAG (0)"));
  check("the empty bag explains itself", (await page.text()).includes("Nothing in here yet."));
  check("checkout is disabled on an empty bag", await page.evaluate('document.querySelector(\'[data-action="checkout"]\').disabled'));

  // --- overlays --------------------------------------------------------
  await page.evaluate('document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))');
  await new Promise((r) => setTimeout(r, 250));
  check("Escape closes the drawer", await page.evaluate('!document.getElementById("sc-cartpanel")'));
  check("the scroll lock is released", await page.evaluate('!document.body.classList.contains("is-locked")'));

  // --- forms -----------------------------------------------------------
  await page.go("/#/contact");
  check("the email field uses native validation", (await page.evaluate('document.getElementById("sc-email").type')) === "email");
  check("an empty contact form does not submit", await page.evaluate('!document.querySelector("[data-form=contact]").checkValidity()'));
  await page.evaluate(`
    document.getElementById("sc-name").value = "A";
    document.getElementById("sc-email").value = "a@b.co";
    document.getElementById("sc-msg").value = "hello";
    document.querySelector('[data-form="contact"] button[type=submit]').click();
  `);
  await new Promise((r) => setTimeout(r, 300));
  check("a valid contact form is acknowledged", (await page.text()).includes("Thank you."));

  await page.go("/#/");
  await page.evaluate(`
    document.querySelector('[data-form="newsletter"] input').value = "x@y.co";
    document.querySelector('[data-form="newsletter"] button').click();
  `);
  await new Promise((r) => setTimeout(r, 300));
  check("the newsletter is acknowledged", (await page.text()).includes("You're on the list."));

  // --- every page renders ---------------------------------------------
  for (const [path, marker] of [
    ["/#/", "Four materials, chosen properly."],
    ["/#/shop", "The collection"],
    ["/#/product/p8", "Tailored Wool Blazer"],
    ["/#/about", "one hat to rule them both"],
    ["/#/values", "What we stand for"],
    ["/#/contact", "Talk to us"],
    ["/#/blog", "No posts yet."],
    ["/#/shipping", "Returns & Refunds policy"],
    ["/#/size-guide", "Size guide"],
  ]) {
    await page.go(path);
    check(`${path} renders`, (await page.text()).includes(marker));
  }

  check("no page logged an error", page.logs.length === 0, page.logs.join(" | "));
} finally {
  console.log(results.join("\n"));
  console.log(`\n${results.length - failures}/${results.length} checks passed`);
  await page.close();
  server.close();
}

process.exit(failures === 0 ? 0 : 1);
