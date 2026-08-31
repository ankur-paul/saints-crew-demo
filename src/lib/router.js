// @ts-check

/**
 * Hash routing.
 *
 * The site is served as a single static file from any host, including ones that
 * cannot rewrite unknown paths to `index.html` (GitHub Pages, plain S3). Hash
 * routes work identically everywhere and need no server configuration, at the
 * cost of not being separately indexable — an acceptable trade for a seven-piece
 * catalogue.
 */

/**
 * @typedef {object} Route
 * @property {string} name    matched route name, e.g. `"shop"` or `"product"`
 * @property {Record<string, string>} params  path segments, e.g. `{ id: "p3" }`
 * @property {Record<string, string>} query   parsed query string
 */

/**
 * @typedef {object} RouteDef
 * @property {string} name
 * @property {RegExp} pattern  must use named capture groups for parameters
 */

/**
 * Split a hash into its path and query halves.
 * @param {string} hash raw `location.hash`, with or without the leading `#`
 * @returns {{ path: string, query: Record<string, string> }}
 */
export function parseHash(hash) {
  const trimmed = hash.replace(/^#/, "");
  const cut = trimmed.indexOf("?");
  let path = cut === -1 ? trimmed : trimmed.slice(0, cut);
  const search = cut === -1 ? "" : trimmed.slice(cut + 1);

  if (path && !path.startsWith("/")) path = "/" + path;
  if (path === "") path = "/";

  /** @type {Record<string, string>} */
  const query = {};
  for (const pair of search.split("&")) {
    if (!pair) continue;
    const eq = pair.indexOf("=");
    const key = decode(eq === -1 ? pair : pair.slice(0, eq));
    query[key] = eq === -1 ? "" : decode(pair.slice(eq + 1));
  }

  return { path, query };
}

/**
 * @param {string} value
 * @returns {string}
 */
function decode(value) {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

/**
 * Match a hash against a route table, falling back to `fallback` when nothing fits.
 * @param {string} hash
 * @param {readonly RouteDef[]} routes
 * @param {string} fallback name to use when no pattern matches
 * @returns {Route}
 */
export function matchRoute(hash, routes, fallback) {
  const { path, query } = parseHash(hash);
  for (const route of routes) {
    const found = route.pattern.exec(path);
    if (found) return { name: route.name, params: { ...found.groups }, query };
  }
  return { name: fallback, params: {}, query };
}

/**
 * Call `onChange` for the current hash and again whenever it changes.
 * @param {(hash: string) => void} onChange
 * @returns {() => void} unsubscribe
 */
export function startRouter(onChange) {
  const handle = () => onChange(window.location.hash);
  window.addEventListener("hashchange", handle);
  handle();
  return () => window.removeEventListener("hashchange", handle);
}

/**
 * Replace the current hash without adding a history entry. Used when a URL is
 * invalid — a bad link should not become a back-button trap.
 * @param {string} hash
 */
export function replaceHash(hash) {
  window.location.replace(hash);
}
