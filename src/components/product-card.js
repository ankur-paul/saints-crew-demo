// @ts-check

import { html } from "../lib/html.js";
import { money } from "../lib/money.js";
import { backgroundImage } from "./shared.js";

/**
 * One garment in a grid: photograph, name, price, fibre.
 * @param {import("../data/products.js").Product} product
 */
export function productCard(product) {
  const href = `#/product/${product.id}`;
  return html`
    <div>
      <a class="sc-frame sc-frame--card sc-card__frame" href="${href}">
        ${backgroundImage({ src: product.img, label: product.name, className: "sc-zoom" })}
      </a>
      <div class="sc-card__meta">
        <a class="sc-card__name" href="${href}">${product.name}</a>
        <span class="sc-card__price t-num">${money(product.price)}</span>
        <p class="t-caption sc-card__fibre">${product.fibre}</p>
      </div>
    </div>
  `;
}
