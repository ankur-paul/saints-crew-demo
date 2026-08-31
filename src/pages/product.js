// @ts-check

import { html } from "../lib/html.js";
import { money } from "../lib/money.js";
import { ACTIONS, ACTION_ATTR, VALUE_ATTR } from "../actions.js";
import { findProduct, sizesFor } from "../data/products.js";
import { backgroundImage } from "../components/shared.js";

/**
 * @param {import("../state/store.js").State} state
 * @returns {string | null}
 */
export function title(state) {
  const product = findProduct(state.pid);
  return product ? `${product.name} — Saints Crew` : null;
}

/**
 * A single garment.
 *
 * The router guarantees `state.pid` names a real product before this renders, so
 * an unknown id can never quietly show the wrong garment.
 *
 * @param {import("../state/store.js").State} state
 */
export function render(state) {
  const product = findProduct(state.pid);
  if (!product) return html``;

  const hint = state.size ? `Size ${state.size} selected.` : "Select a size. Unsure? See the size guide.";

  return html`
    <main id="main" class="sc-wrap sc-pad sc-anim-fade" style="padding-top: 32px; padding-bottom: 100px">
      <a class="t-action sc-pdp__back" href="#/shop">← Back to collection</a>

      <div class="sc-split sc-pdp">
        <div class="sc-pdp__media">
          ${backgroundImage({ src: product.img, label: product.name, className: "sc-pdp__img" })}
        </div>

        <div class="sc-pdp__info sc-sticky">
          <p class="sc-pdp__cat">${product.cat}</p>
          <h1 class="sc-pdp__name">${product.name}</h1>
          <p class="sc-pdp__price t-num">${money(product.price)}</p>
          <p class="sc-pdp__desc">${product.desc}</p>

          <p class="t-label" style="margin: 0 0 12px">Size</p>
          <div class="sc-pdp__sizes" role="group" aria-label="Size">
            ${sizesFor(product).map(
              (label) => html`<button
                type="button"
                class="sc-size"
                ${ACTION_ATTR}="${ACTIONS.setSize}"
                ${VALUE_ATTR}="${label}"
                aria-pressed="${state.size === label}"
              >
                ${label}
              </button>`,
            )}
          </div>
          <p class="sc-pdp__hint">${hint}</p>

          <button type="button" class="sc-btn sc-btn--block" ${ACTION_ATTR}="${ACTIONS.addToBag}">
            Add to bag
          </button>

          <div class="sc-pdp__specs">
            ${product.specs.map(
              ([key, value]) => html`
                <div class="sc-spec">
                  <span class="sc-spec__k">${key}</span>
                  <span class="sc-spec__v">${value}</span>
                </div>
              `,
            )}
          </div>
        </div>
      </div>
    </main>
  `;
}
