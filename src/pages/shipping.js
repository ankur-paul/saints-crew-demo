// @ts-check

import { html } from "../lib/html.js";
import { RETURNS } from "../data/content.js";
import { LINKS, SITE } from "../data/site.js";

export const title = "Returns & Refunds policy — Saints Crew";

/** Returns and refunds. Structure comes from `RETURNS` so the copy stays editable. */
export function render() {
  const mail = html`<a class="sc-inline-link" href="mailto:${SITE.email}">${SITE.email}</a>`;

  return html`
    <main id="main" class="sc-wrap-policy sc-pad sc-sec-page sc-anim-fade sc-policy">
      <p class="t-eyebrow">Info</p>
      <h1 class="t-h1-policy">Returns &amp; Refunds policy</h1>

      <div class="sc-policy__stack t-prose">
        ${RETURNS.intro.map((para) => html`<p>${para}</p>`)}
        <p>${RETURNS.cancelBefore}${mail}${RETURNS.cancelAfter}</p>
        <p>${RETURNS.reimburse}</p>
      </div>

      <h2 class="t-h-label">Conditions for returns</h2>
      <p class="t-prose" style="margin: 0 0 14px">${RETURNS.conditionsLead}</p>
      <ul>
        ${RETURNS.conditions.map((item) => html`<li>${item}</li>`)}
      </ul>

      <p class="t-prose" style="margin: 0 0 14px">${RETURNS.exclusionsLead}</p>
      <ul>
        ${RETURNS.exclusions.map((item) => html`<li>${item}</li>`)}
      </ul>
      <p class="t-prose" style="margin: 0">${RETURNS.discretion}</p>

      <h2 class="t-h-label">Returning goods</h2>
      ${RETURNS.returning.map(
        (para, i) => html`<p class="t-prose" style="margin: 0 0 ${i === 0 ? "18px" : "0"}">${para}</p>`,
      )}

      <h2 class="t-h-label">Gifts</h2>
      ${RETURNS.gifts.map(
        (para, i) => html`<p class="t-prose" style="margin: 0 0 ${i === 0 ? "18px" : "0"}">${para}</p>`,
      )}

      <h2 class="t-h-label">Contact us</h2>
      <p class="t-prose" style="margin: 0 0 40px">${RETURNS.contactBefore}${mail}${RETURNS.contactAfter}</p>

      <div class="sc-policy__foot">
        <a class="t-action-sm" href="#/size-guide">Size guide</a>
        <a class="t-action-sm" href="${LINKS.privacy}" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
        <a class="t-action-sm" href="${LINKS.terms}" target="_blank" rel="noopener noreferrer">Terms conditions</a>
      </div>
    </main>
  `;
}
