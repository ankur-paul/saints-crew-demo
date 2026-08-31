// @ts-check

import { html } from "../lib/html.js";
import { FORMS, FORM_ATTR } from "../actions.js";
import { COPY } from "../data/content.js";

/**
 * Sign-up band shown at the foot of every page.
 *
 * The field is a real `<input type="email" required>` inside a real `<form>`, so
 * the browser does the validation and reports it in the visitor's own language.
 *
 * NOTE: submitting only flips a flag — nothing is sent anywhere yet. See README.
 *
 * @param {boolean} subscribed
 */
export function newsletter(subscribed) {
  return html`
    <section class="sc-news">
      <div class="sc-news__inner">
        <h2 class="sc-news__title">${COPY.newsletterTitle}</h2>
        <p class="sc-news__body">${COPY.newsletterBody}</p>
        ${subscribed
          ? html`<p class="sc-news__done">${COPY.newsletterDone}</p>`
          : html`
              <form class="sc-news__form" ${FORM_ATTR}="${FORMS.newsletter}">
                <label class="sc-sr" for="sc-sub-email">Email address</label>
                <input
                  class="sc-input"
                  id="sc-sub-email"
                  name="email"
                  type="email"
                  required
                  autocomplete="email"
                  placeholder="Email address"
                />
                <button type="submit" class="sc-btn sc-btn--wide">Submit</button>
              </form>
            `}
      </div>
    </section>
  `;
}
