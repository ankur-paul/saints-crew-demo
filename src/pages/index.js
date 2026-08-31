// @ts-check

import * as home from "./home.js";
import * as shop from "./shop.js";
import * as product from "./product.js";
import * as about from "./about.js";
import * as values from "./values.js";
import * as contact from "./contact.js";
import * as blog from "./blog.js";
import * as shipping from "./shipping.js";
import * as sizeGuide from "./size-guide.js";

/**
 * The page registry, keyed by route name.
 *
 * Each page module exports `render(state)` and a `title` — either a fixed string,
 * a function of state, or `null` to use the site default. Adding a page means
 * adding a module here and a pattern to `ROUTES` below.
 *
 * @typedef {object} Page
 * @property {(state: import("../state/store.js").State) => import("../lib/html.js").SafeHtml} render
 * @property {string | null | ((state: import("../state/store.js").State) => string | null)} [title]
 */

/** @type {Record<string, Page>} */
export const PAGES = {
  home,
  shop,
  product,
  about,
  values,
  contact,
  blog,
  shipping,
  sizeguide: sizeGuide,
};

/**
 * Hash patterns, tried in order. Named groups become `route.params`.
 * @type {ReadonlyArray<import("../lib/router.js").RouteDef>}
 */
export const ROUTES = [
  { name: "home", pattern: /^\/$/ },
  { name: "shop", pattern: /^\/shop$/ },
  { name: "product", pattern: /^\/product\/(?<id>[A-Za-z0-9_-]+)$/ },
  { name: "about", pattern: /^\/about$/ },
  { name: "values", pattern: /^\/values$/ },
  { name: "contact", pattern: /^\/contact$/ },
  { name: "blog", pattern: /^\/blog$/ },
  { name: "shipping", pattern: /^\/shipping$/ },
  { name: "sizeguide", pattern: /^\/size-guide$/ },
];
