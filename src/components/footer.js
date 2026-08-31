// @ts-check

import { html } from "../lib/html.js";
import { FOOTER_COLUMNS, SITE } from "../data/site.js";
import { externalAttrs } from "./shared.js";

/** Site footer: logo, address, link columns, legal line. */
export function siteFooter() {
  return html`
    <footer class="sc-footer">
      <div class="sc-wrap sc-pad">
        <div class="sc-split sc-footer__top">
          <div style="flex: 0 0 auto">
            <img
              class="sc-footer__logo"
              src="assets/saints-crew-logo-white.png"
              alt="${SITE.name}"
              width="170"
              height="83"
              loading="lazy"
            />
            <p class="sc-footer__addrtitle">Address</p>
            <p class="sc-footer__addr">${SITE.address.street}<br />${SITE.address.postcode}</p>
          </div>

          <div class="sc-footcols">
            ${FOOTER_COLUMNS.map(
              (column) => html`
                <div>
                  <p class="sc-footer__coltitle">${column.title}</p>
                  <div class="sc-footer__links">
                    ${column.items.map(
                      (item) => html`<a
                        class="sc-footer__link"
                        href="${item.href}"
                        ${externalAttrs(item.external)}
                        >${item.label}</a
                      >`,
                    )}
                  </div>
                </div>
              `,
            )}
          </div>
        </div>

        <div class="sc-footer__legal">
          <p>${SITE.copyright}</p>
          <p>${SITE.city}</p>
        </div>
      </div>
    </footer>
  `;
}
