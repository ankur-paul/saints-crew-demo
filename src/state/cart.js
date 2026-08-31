// @ts-check

import { findProduct } from "../data/products.js";
import { FREE_SHIPPING_FROM } from "../data/site.js";

/**
 * Bag arithmetic.
 *
 * Every function here is pure and takes the bag as an argument, so the rules can
 * be unit-tested without a browser (see `tests/unit/cart.test.js`). Persistence
 * lives in `store.js`; this module only knows about shapes and sums.
 *
 * A "line" is one product in one size. Adding the same product in a different
 * size makes a second line, which is why lines are keyed on both.
 */

/**
 * @typedef {object} CartLine
 * @property {string} id    a `Product.id`
 * @property {string} size
 * @property {number} qty   whole units, at least 1
 */

const MAX_QTY = 99;

/**
 * Add one unit, merging into an existing line for the same product and size.
 * Returns a new array; the input is never mutated.
 *
 * @param {ReadonlyArray<CartLine>} cart
 * @param {string} id
 * @param {string} size
 * @returns {CartLine[]}
 */
export function addLine(cart, id, size) {
  const next = cart.map((line) => ({ ...line }));
  const existing = next.find((line) => line.id === id && line.size === size);
  if (existing) existing.qty = Math.min(MAX_QTY, existing.qty + 1);
  else next.push({ id, size, qty: 1 });
  return next;
}

/**
 * Drop the line at `index`. Out-of-range indices are ignored rather than
 * throwing, because the index comes from markup that may be a render behind.
 *
 * @param {ReadonlyArray<CartLine>} cart
 * @param {number} index
 * @returns {CartLine[]}
 */
export function removeLine(cart, index) {
  return cart.filter((_, i) => i !== index);
}

/**
 * @param {ReadonlyArray<CartLine>} cart
 * @returns {number} total units, for the "Bag (n)" counter
 */
export function countItems(cart) {
  return cart.reduce((total, line) => total + line.qty, 0);
}

/**
 * @param {ReadonlyArray<CartLine>} cart
 * @returns {number} subtotal in whole rupees
 */
export function subtotal(cart) {
  return cart.reduce((total, line) => {
    const product = findProduct(line.id);
    return product ? total + product.price * line.qty : total;
  }, 0);
}

/**
 * How much more is needed to earn free shipping, or 0 once it is earned.
 * @param {number} amount
 * @returns {number}
 */
export function shortfallToFreeShipping(amount) {
  return Math.max(0, FREE_SHIPPING_FROM - amount);
}

/**
 * Expand saved lines into the products they refer to, dropping any whose product
 * has since left the catalogue.
 *
 * @param {ReadonlyArray<CartLine>} cart
 * @returns {Array<{ line: CartLine, product: import("../data/products.js").Product, index: number }>}
 */
export function resolveLines(cart) {
  return cart.flatMap((line, index) => {
    const product = findProduct(line.id);
    return product ? [{ line, product, index }] : [];
  });
}

/**
 * Coerce anything read back from storage into a valid bag.
 *
 * Saved data is untrusted: it may have been written by an older version of the
 * site, hand-edited, or corrupted. Anything that does not describe a garment we
 * still sell is discarded silently rather than breaking the page.
 *
 * @param {unknown} value
 * @returns {CartLine[]}
 */
export function sanitizeCart(value) {
  if (!Array.isArray(value)) return [];
  /** @type {CartLine[]} */
  const clean = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const { id, size, qty } = /** @type {Record<string, unknown>} */ (entry);
    if (typeof id !== "string" || !findProduct(id)) continue;
    if (typeof size !== "string" || size === "") continue;
    if (typeof qty !== "number" || !Number.isFinite(qty) || qty < 1) continue;
    clean.push({ id, size, qty: Math.min(MAX_QTY, Math.floor(qty)) });
  }
  return clean;
}
