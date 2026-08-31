// @ts-check

import { html, raw } from "../lib/html.js";

/**
 * Attributes for a link that leaves the site. `noopener noreferrer` keeps the
 * new tab from reaching back into this one.
 * @param {boolean | undefined} external
 */
export function externalAttrs(external) {
  return external ? raw(' target="_blank" rel="noopener noreferrer"') : raw("");
}

/**
 * A photograph inside a fixed-ratio frame that zooms when its link is hovered.
 * Used by product cards, category tiles and the product page.
 *
 * @param {object} options
 * @param {string} options.src
 * @param {string} options.alt
 * @param {boolean} [options.lazy]  defer loading (anything below the fold)
 */
export function zoomImage({ src, alt, lazy = true }) {
  return html`<img
    class="sc-zoom"
    src="${src}"
    alt="${alt}"
    ${lazy ? raw('loading="lazy"') : raw('fetchpriority="high"')}
  />`;
}

/**
 * A photograph rendered as a background, for the cases where the image must fill
 * a box whose height is set by its siblings. Announced to assistive technology
 * with `role="img"` since there is no `<img>` to carry the alt text.
 *
 * @param {object} options
 * @param {string} options.src
 * @param {string} options.label
 * @param {string} options.className
 */
export function backgroundImage({ src, label, className }) {
  // The URL is a catalogue path, never visitor input, so it is safe in `url()`.
  return html`<div
    class="${className}"
    role="img"
    aria-label="${label}"
    style="background-image: url(${src})"
  ></div>`;
}
