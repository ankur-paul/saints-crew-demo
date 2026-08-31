// @ts-check

import { html } from "../lib/html.js";
import { ACTIONS, ACTION_ATTR } from "../actions.js";
import { NAV, SITE, LINKS } from "../data/site.js";

/** Id used to move focus into the panel when it opens. */
export const NAV_PANEL_ID = "sc-navpanel";

/**
 * Full-screen menu shown on handsets. Rendered only while open, so nothing
 * hidden is left in the tab order.
 */
export function mobileNav() {
  return html`
    <div
      id="${NAV_PANEL_ID}"
      class="sc-navpanel sc-anim-fade"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
    >
      <div class="sc-navpanel__top">
        <span class="sc-navpanel__mark">${SITE.name}</span>
        <button type="button" class="sc-close" ${ACTION_ATTR}="${ACTIONS.toggleNav}" aria-label="Close menu">
          ×
        </button>
      </div>

      <nav class="sc-navpanel__links" aria-label="Mobile">
        ${NAV.map((item) => html`<a href="#/${item.route}">${item.label}</a>`)}
      </nav>

      <div class="sc-navpanel__social">
        <a class="t-nav" href="${LINKS.instagram}" target="_blank" rel="noopener noreferrer">Instagram</a>
        <a class="t-nav" href="${LINKS.whatsapp}" target="_blank" rel="noopener noreferrer">WhatsApp</a>
      </div>
    </div>
  `;
}
