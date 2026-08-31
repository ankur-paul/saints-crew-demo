// @ts-check

import { html } from "../lib/html.js";
import { SIZE_GUIDE } from "../data/content.js";
import { LINKS } from "../data/site.js";

export const title = "Size guide — Saints Crew";

/** Size guide. The chart artwork has not been shot yet — see README.md. */
export function render() {
  return html`
    <main id="main" class="sc-wrap-narrow sc-pad sc-sec-page sc-anim-fade">
      <p class="t-eyebrow">Info</p>
      <h1 class="t-h1-policy" style="margin-bottom: 24px">Size guide</h1>
      <p class="t-prose" style="margin: 0 0 48px; max-width: 60ch">${SIZE_GUIDE.intro}</p>

      <h2 class="t-h3" style="font-size: 26px; margin: 0 0 20px">Upper body</h2>
      <div class="sc-sizeplate">
        <img src="assets/tex-linen.jpg" alt="Linen weave" loading="lazy" />
        <div class="sc-sizeplate__note"><p>${SIZE_GUIDE.plateNote}</p></div>
      </div>
      <p style="font-size: 15px; line-height: 1.7; color: var(--sc-mute); margin: 0 0 48px; font-weight: 300">
        ${SIZE_GUIDE.ranges}
      </p>

      <h2 class="t-h-label" style="margin: 0 0 18px">Read more</h2>
      <div class="sc-policy__foot" style="border-top: 1px solid var(--sc-rule-firm); padding-top: 24px">
        <a class="t-action-sm" href="#/shipping">Shipping &amp; returns</a>
        <a class="t-action-sm" href="${LINKS.privacy}" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        <a class="t-action-sm" href="${LINKS.terms}" target="_blank" rel="noopener noreferrer">Terms conditions</a>
      </div>
    </main>
  `;
}
