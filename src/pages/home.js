// @ts-check

import { html } from "../lib/html.js";
import { COPY, PILLARS } from "../data/content.js";
import { CATEGORY_TILES } from "../data/site.js";
import { FEATURED_IDS, findProduct } from "../data/products.js";
import { productCard } from "../components/product-card.js";
import { zoomImage } from "../components/shared.js";

export const title = null; // uses the site default

/** Landing page: hero, materials, featured garments, the story band, pillars. */
export function render() {
  const featured = FEATURED_IDS.map(findProduct).filter(Boolean);

  return html`
    <main id="main">
      <section class="sc-hero">
        <img class="sc-hero__img" src="assets/wide-hero.jpg" alt="Saints Crew autumn collection" fetchpriority="high" />
        <div class="sc-hero__veil"></div>
        <div class="sc-wrap sc-pad sc-hero__body sc-anim-rise">
          <p class="sc-hero__eyebrow">${COPY.heroEyebrow}</p>
          <h1 class="sc-hero__title">${COPY.heroTitle}</h1>
          <p class="sc-hero__lede">${COPY.heroLede}</p>
          <div class="sc-hero__actions">
            <a class="sc-btn-light" href="#/shop">Shop the collection</a>
            <a class="sc-btn-ghost" href="#/values">How it's made</a>
          </div>
        </div>
      </section>

      <section class="sc-wrap sc-pad" style="padding-top: 100px; padding-bottom: 20px">
        <h2 class="t-h2-lg" style="max-width: 20ch">${COPY.materialsTitle}</h2>
      </section>

      <section class="sc-wrap sc-pad" style="padding-top: 48px; padding-bottom: 100px">
        <div class="sc-grid-cats">
          ${CATEGORY_TILES.map(
            (tile) => html`
              <a class="sc-frame sc-frame--tile" href="#/shop?cat=${encodeURIComponent(tile.label)}">
                ${zoomImage({ src: tile.img, alt: tile.label })}
                <div class="sc-tile__veil"></div>
                <div class="sc-tile__cap">
                  <div>
                    <h3 class="sc-tile__name">${tile.label}</h3>
                    <p class="sc-tile__sub">${tile.sub}</p>
                  </div>
                  <span class="sc-tile__arrow" aria-hidden="true">→</span>
                </div>
              </a>
            `,
          )}
        </div>
      </section>

      <section class="sc-featured">
        <div class="sc-wrap sc-pad">
          <div class="sc-featured__head">
            <h2 class="t-h2">${COPY.featuredTitle}</h2>
            <a class="t-action t-underline" href="#/shop">View all</a>
          </div>
          <div class="sc-grid-cards">${featured.map((p) => productCard(/** @type {any} */ (p)))}</div>
        </div>
      </section>

      <section class="sc-split sc-band">
        <div class="sc-band__text">
          <div class="sc-band__inner">
            <p class="sc-band__eyebrow">Who we are</p>
            <h2 class="sc-band__title">${COPY.bandTitle}</h2>
            ${COPY.bandBody.map((para) => html`<p class="sc-band__body">${para}</p>`)}
            <div class="sc-band__actions">
              <a class="t-action sc-link-dark" href="#/about">About us</a>
              <a class="t-action sc-link-dark" href="#/values">Our values</a>
            </div>
          </div>
        </div>
        <div class="sc-band__media">
          <img src="assets/wide-atelier.jpg" alt="In the workshop" loading="lazy" />
        </div>
      </section>

      <section class="sc-wrap sc-pad sc-sec">
        <div class="sc-grid-pillars">
          ${PILLARS.map(
            (pillar) => html`
              <div class="sc-pillar">
                <p class="sc-pillar__title">${pillar.title}</p>
                <p class="sc-pillar__body">${pillar.body}</p>
              </div>
            `,
          )}
        </div>
      </section>
    </main>
  `;
}
