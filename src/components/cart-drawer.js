// @ts-check

import { html } from "../lib/html.js";
import { money } from "../lib/money.js";
import { ACTIONS, ACTION_ATTR, VALUE_ATTR } from "../actions.js";
import { COPY } from "../data/content.js";
import { FREE_SHIPPING_FROM } from "../data/site.js";
import { countItems, resolveLines, shortfallToFreeShipping, subtotal } from "../state/cart.js";
import { backgroundImage } from "./shared.js";

/** Id used to move focus into the drawer when it opens. */
export const CART_PANEL_ID = "sc-cartpanel";

/**
 * The line under the subtotal: either a reward or how far off it is.
 * @param {number} amount subtotal in rupees
 */
function shippingNote(amount) {
  const shortfall = shortfallToFreeShipping(amount);
  return shortfall === 0
    ? "Shipping is on us."
    : `Free shipping from ${money(FREE_SHIPPING_FROM)} — ${money(shortfall)} to go.`;
}

/**
 * Slide-over bag.
 *
 * Removal is addressed by index rather than id because the same garment can
 * appear twice in different sizes.
 *
 * @param {ReadonlyArray<import("../state/cart.js").CartLine>} cart
 */
export function cartDrawer(cart) {
  const lines = resolveLines(cart);
  const amount = subtotal(cart);

  return html`
    <div class="sc-drawer">
      <div class="sc-drawer__scrim sc-anim-fade" ${ACTION_ATTR}="${ACTIONS.toggleCart}"></div>

      <aside
        id="${CART_PANEL_ID}"
        class="sc-drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
      >
        <div class="sc-drawer__head">
          <p class="sc-drawer__title">Your bag (${countItems(cart)})</p>
          <button type="button" class="sc-close" ${ACTION_ATTR}="${ACTIONS.toggleCart}" aria-label="Close bag">
            ×
          </button>
        </div>

        <div class="sc-drawer__body">
          ${lines.length === 0
            ? html`
                <div class="sc-empty">
                  <p class="sc-empty__title">${COPY.bagEmptyTitle}</p>
                  <p class="sc-empty__body">${COPY.bagEmptyBody}</p>
                  <a class="t-action t-underline" href="#/shop">Shop the collection</a>
                </div>
              `
            : lines.map(({ line, product, index }) => cartLine(line, product, index))}
        </div>

        <div class="sc-drawer__foot">
          <div class="sc-drawer__row">
            <span>Subtotal</span>
            <span class="t-num">${money(amount)}</span>
          </div>
          <p class="t-meta" style="margin-bottom: 20px">${shippingNote(amount)}</p>
          <button
            type="button"
            class="sc-btn sc-btn--block"
            ${ACTION_ATTR}="${ACTIONS.checkout}"
            ${lines.length === 0 ? html`disabled` : ""}
          >
            Checkout
          </button>
        </div>
      </aside>
    </div>
  `;
}

/**
 * @param {import("../state/cart.js").CartLine} line
 * @param {import("../data/products.js").Product} product
 * @param {number} index position in the bag, used to address removal
 */
function cartLine(line, product, index) {
  return html`
    <div class="sc-line">
      <div class="sc-line__thumb">
        ${backgroundImage({ src: product.img, label: product.name, className: "sc-line__img" })}
      </div>
      <div class="sc-line__main">
        <p class="sc-line__name">${product.name}</p>
        <p class="sc-line__spec">Size ${line.size} · Qty ${line.qty}</p>
        <button
          type="button"
          class="sc-line__remove"
          ${ACTION_ATTR}="${ACTIONS.removeLine}"
          ${VALUE_ATTR}="${index}"
          aria-label="Remove ${product.name} from bag"
        >
          Remove
        </button>
      </div>
      <p class="sc-line__total t-num">${money(product.price * line.qty)}</p>
    </div>
  `;
}
