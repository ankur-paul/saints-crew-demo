// @ts-check

import { readJson, writeJson } from "../lib/storage.js";
import { sanitizeCart } from "./cart.js";

/**
 * The single source of truth for everything the page shows.
 *
 * There is one store, one `setState`, and one subscriber (the renderer in
 * `main.js`). Anything that changes what the visitor sees goes through here, so
 * there is exactly one place to look when the screen is wrong.
 */

/**
 * Bumping this key retires every saved bag. Do that if the line shape ever
 * changes incompatibly, rather than trying to migrate in place.
 */
const CART_KEY = "sc.cart.v1";

/**
 * @typedef {object} State
 * @property {string} page      route name, e.g. `"home"`, `"product"`
 * @property {string | null} pid  product id when `page === "product"`
 * @property {string} category  active shop filter, or `"All"`
 * @property {string} gender    active shop filter, or `"All"`
 * @property {string | null} size  size chosen on the product page
 * @property {import("./cart.js").CartLine[]} cart
 * @property {boolean} cartOpen
 * @property {boolean} navOpen
 * @property {boolean} subscribed  newsletter form has been submitted
 * @property {boolean} sent        contact form has been submitted
 */

/** @returns {State} */
function initialState() {
  return {
    page: "home",
    pid: null,
    category: "All",
    gender: "All",
    size: null,
    cart: sanitizeCart(readJson(CART_KEY)),
    cartOpen: false,
    navOpen: false,
    subscribed: false,
    sent: false,
  };
}

/** @type {State} */
let state = initialState();

/** @type {Set<(state: State) => void>} */
const listeners = new Set();

/** @returns {Readonly<State>} */
export function getState() {
  return state;
}

/**
 * Merge a patch into the state and notify subscribers.
 *
 * The bag is written to storage here rather than at each call site, so it is
 * impossible to change the cart and forget to persist it.
 *
 * @param {Partial<State>} patch
 */
export function setState(patch) {
  const cartChanged = "cart" in patch && patch.cart !== state.cart;
  state = { ...state, ...patch };
  if (cartChanged) writeJson(CART_KEY, state.cart);
  for (const listener of listeners) listener(state);
}

/**
 * @param {(state: State) => void} listener
 * @returns {() => void} unsubscribe
 */
export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Close both overlays. Used on navigation and on Escape. */
export function closeOverlays() {
  if (state.cartOpen || state.navOpen) setState({ cartOpen: false, navOpen: false });
}
