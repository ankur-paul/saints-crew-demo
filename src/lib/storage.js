// @ts-check

/**
 * `localStorage` that never throws.
 *
 * Reading or writing storage raises in a handful of real situations — Safari
 * private browsing, browsers configured to block site data, embedded webviews —
 * and an uncaught error there would take the whole page down. Every call is
 * guarded, and a failed read is indistinguishable from an empty one.
 */

/**
 * @param {string} key
 * @returns {unknown} the parsed value, or `null` if absent or unreadable
 */
export function readJson(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw === null ? null : JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * @param {string} key
 * @param {unknown} value
 * @returns {boolean} whether the write landed
 */
export function writeJson(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}
