// @ts-check

import { html } from "../lib/html.js";
import { ACTIONS, ACTION_ATTR, VALUE_ATTR } from "../actions.js";
import { COPY } from "../data/content.js";
import { CATEGORIES, GENDERS, filterProducts } from "../data/products.js";
import { productCard } from "../components/product-card.js";

export const title = "The collection — Saints Crew";

/**
 * The collection, filtered by category and gender.
 * @param {import("../state/store.js").State} state
 */
export function render(state) {
  const shown = filterProducts(state.category, state.gender);
  const stockLine = shown.length === 1 ? "1 piece in stock." : `${shown.length} pieces in stock.`;

  return html`
    <main id="main" class="sc-wrap sc-pad sc-sec-shop sc-anim-fade">
      <h1 class="t-h1">The collection</h1>
      <p class="sc-shop__lede">${stockLine} ${COPY.shopLede}</p>

      <div class="sc-filters">
        <div class="sc-filters__group">
          ${CATEGORIES.map((label) =>
            filterButton({ label, active: state.category === label, action: ACTIONS.setCategory }),
          )}
        </div>
        <div class="sc-filters__group sc-filters__group--gender">
          ${GENDERS.map((label) =>
            filterButton({
              label,
              active: state.gender === label,
              action: ACTIONS.setGender,
              gender: true,
            }),
          )}
        </div>
      </div>

      <div class="sc-grid-shop">${shown.map(productCard)}</div>

      ${shown.length === 0
        ? html`
            <div class="sc-noresults">
              <h2 class="sc-noresults__title">${COPY.noResultsTitle}</h2>
              <p class="sc-noresults__body">${COPY.noResultsBody}</p>
              <a
                class="t-action t-underline"
                style="display: inline-block"
                href="#/shop"
                ${ACTION_ATTR}="${ACTIONS.resetFilters}"
                >Show the whole collection</a
              >
            </div>
          `
        : ""}
    </main>
  `;
}

/**
 * @param {object} options
 * @param {string} options.label
 * @param {boolean} options.active
 * @param {string} options.action
 * @param {boolean} [options.gender]
 */
function filterButton({ label, active, action, gender = false }) {
  return html`<button
    type="button"
    class="t-nav sc-filter ${gender ? "sc-filter--gender" : ""}"
    ${ACTION_ATTR}="${action}"
    ${VALUE_ATTR}="${label}"
    aria-pressed="${active}"
  >
    ${label}
  </button>`;
}
