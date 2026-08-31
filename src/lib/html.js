// @ts-check

/**
 * A tagged template literal that escapes every interpolated value by default.
 *
 * This is the only way markup should be built in this project. Because escaping
 * happens automatically, a template can never accidentally inject unescaped text
 * — the failure mode of hand-written `"<p>" + value + "</p>"` strings.
 *
 *   html`<p>${untrusted}</p>`          // escaped
 *   html`<ul>${items.map(itemTpl)}</ul>` // arrays are joined
 *   html`<div>${raw(prebuiltMarkup)}</div>` // opt out, deliberately
 *
 * Values are handled as follows:
 *   - `null`, `undefined` and `false` render as nothing, so `cond && html`…`` works
 *   - `true` renders as the text "true", so `aria-pressed="${isOn}"` is correct
 *   - arrays are flattened and joined with no separator
 *   - anything returned by `html` or `raw` is inserted verbatim
 *   - everything else is stringified and HTML-escaped
 */

/** Markup that is already safe to insert. */
export class SafeHtml {
  /** @param {string} value */
  constructor(value) {
    /** @type {string} */
    this.value = value;
  }
  toString() {
    return this.value;
  }
}

/** @type {Record<string, string>} */
const ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

/**
 * Escape a string for interpolation into HTML text or a quoted attribute.
 * @param {string} value
 * @returns {string}
 */
export function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (c) => ESCAPES[c]);
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function format(value) {
  if (value === null || value === undefined || value === false) return "";
  if (value instanceof SafeHtml) return value.value;
  if (Array.isArray(value)) return value.map(format).join("");
  return escapeHtml(String(value));
}

/**
 * Mark a string as trusted markup, bypassing escaping. Only ever call this on
 * markup this codebase produced — never on anything a visitor supplied.
 * @param {string} value
 * @returns {SafeHtml}
 */
export function raw(value) {
  return new SafeHtml(value);
}

/**
 * @param {TemplateStringsArray} strings
 * @param {...unknown} values
 * @returns {SafeHtml}
 */
export function html(strings, ...values) {
  let out = strings[0];
  for (let i = 0; i < values.length; i += 1) out += format(values[i]) + strings[i + 1];
  return new SafeHtml(out);
}

/**
 * Build a `class` attribute from names, dropping any that are falsy.
 *   cx("sc-btn", isBlock && "sc-btn--block")
 * @param {...(string | false | null | undefined)} names
 * @returns {string}
 */
export function cx(...names) {
  return names.filter(Boolean).join(" ");
}
