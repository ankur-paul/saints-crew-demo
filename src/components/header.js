// @ts-check

import { html } from "../lib/html.js";
import { ACTIONS, ACTION_ATTR } from "../actions.js";
import { NAV, SITE } from "../data/site.js";
import { COPY } from "../data/content.js";

/** The shipping promise bar above the header. */
export function announceBar() {
  return html`<div class="sc-announce">${COPY.announce}</div>`;
}

/**
 * Sticky site header: menu button on handsets, nav on desktop, wordmark, bag.
 *
 * @param {object} options
 * @param {string} options.page   current route name, for the active nav mark
 * @param {number} options.count  items in the bag
 * @param {boolean} options.navOpen
 */
export function siteHeader({ page, count, navOpen }) {
  return html`
    <header class="sc-header">
      <div class="sc-wrap sc-pad sc-header__bar">
        <div class="sc-mobile sc-header__burger-slot">
          <button
            type="button"
            class="sc-burger"
            ${ACTION_ATTR}="${ACTIONS.toggleNav}"
            aria-label="Open menu"
            aria-expanded="${navOpen ? "true" : "false"}"
          >
            <span></span><span></span>
          </button>
        </div>

        <nav class="sc-desktop sc-header__nav" aria-label="Primary">
          ${NAV.map(
            (item) => html`<a
              class="t-nav sc-navlink"
              href="#/${item.route}"
              ${page === item.route ? html`aria-current="page"` : ""}
              >${item.label}</a
            >`,
          )}
        </nav>

        <a class="sc-wordmark" href="#/">${SITE.name}</a>

        <div class="sc-header__end">
          <button
            type="button"
            class="t-nav sc-bagbtn"
            ${ACTION_ATTR}="${ACTIONS.toggleCart}"
            aria-label="Open bag, ${count} ${count === 1 ? "item" : "items"}"
          >
            Bag (${count})
          </button>
        </div>
      </div>
    </header>
  `;
}
