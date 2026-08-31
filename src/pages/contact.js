// @ts-check

import { html } from "../lib/html.js";
import { FORMS, FORM_ATTR } from "../actions.js";
import { CONTACT_ROWS, COPY } from "../data/content.js";
import { LINKS } from "../data/site.js";

export const title = "Talk to us — Saints Crew";

/**
 * Contact details beside a message form.
 *
 * NOTE: submitting only flips a flag — nothing is sent anywhere yet. See README.
 *
 * @param {import("../state/store.js").State} state
 */
export function render(state) {
  return html`
    <main id="main" class="sc-wrap-wide sc-pad sc-sec" style="padding-bottom: 100px">
      <div class="sc-split sc-contact">
        <div class="sc-contact__col">
          <h1 class="t-h1-tight">${COPY.contactTitle}</h1>
          ${COPY.contactBody.map(
            (para, i) =>
              html`<p class="t-body" style="max-width: ${i === 0 ? "46ch" : "44ch"}; margin: 0 0 ${i === 0 ? "20px" : "44px"}">
                ${para}
              </p>`,
          )}

          ${CONTACT_ROWS.map(
            (row) => html`
              <div class="sc-contact__row">
                <p class="sc-contact__k">${row.k}</p>
                <p class="sc-contact__v">${row.v}</p>
              </div>
            `,
          )}

          <div style="padding-top: 40px">
            <p class="sc-contact__k" style="margin-bottom: 16px">Other pages</p>
            <div class="sc-contact__links">
              <a class="t-underline-thin" href="#/shipping">Shipping &amp; returns</a>
              <a class="t-underline-thin" href="${LINKS.privacy}" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              <a class="t-underline-thin" href="${LINKS.terms}" target="_blank" rel="noopener noreferrer">Terms conditions</a>
              <a class="t-underline-thin" href="#/size-guide">Size guide</a>
            </div>
          </div>
        </div>

        <div class="sc-contact__panel sc-sticky">
          ${state.sent
            ? html`
                <div class="sc-thanks">
                  <h3>${COPY.contactThanksTitle}</h3>
                  <p>${COPY.contactThanksBody}</p>
                </div>
              `
            : html`
                <form class="sc-form" ${FORM_ATTR}="${FORMS.contact}">
                  ${field({ id: "sc-name", label: "Name", type: "text", autocomplete: "name" })}
                  ${field({ id: "sc-email", label: "Email", type: "email", autocomplete: "email" })}
                  <div class="sc-field">
                    <label class="t-label sc-field__label" for="sc-msg">Message</label>
                    <textarea class="sc-input sc-input--area" id="sc-msg" name="msg" rows="6" required></textarea>
                  </div>
                  <button type="submit" class="sc-btn sc-btn--inline">Send</button>
                </form>
              `}
        </div>
      </div>
    </main>
  `;
}

/**
 * @param {object} options
 * @param {string} options.id
 * @param {string} options.label
 * @param {string} options.type
 * @param {string} options.autocomplete
 */
function field({ id, label, type, autocomplete }) {
  return html`
    <div class="sc-field">
      <label class="t-label sc-field__label" for="${id}">${label}</label>
      <input
        class="sc-input"
        id="${id}"
        name="${id.replace("sc-", "")}"
        type="${type}"
        autocomplete="${autocomplete}"
        required
      />
    </div>
  `;
}
