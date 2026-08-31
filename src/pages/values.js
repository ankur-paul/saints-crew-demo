// @ts-check

import { html } from "../lib/html.js";
import { COPY, STANDS, STEPS } from "../data/content.js";

export const title = "Our values — Saints Crew";

/** How a garment is made, step by step, and what the company stands for. */
export function render() {
  return html`
    <main id="main" class="sc-anim-fade">
      <section class="sc-wrap-read sc-pad" style="padding-top: 96px; padding-bottom: 56px">
        <p class="t-eyebrow">Our values</p>
        <h1 class="t-display">${COPY.valuesTitle}</h1>
        <p class="t-lead" style="max-width: 60ch">${COPY.valuesLede}</p>
      </section>

      <section class="sc-wrap-mid sc-pad" style="padding-top: 40px; padding-bottom: 96px">
        ${STEPS.map(
          (step) => html`
            <div class="sc-split sc-step">
              <p class="sc-step__n">${step.n}</p>
              <div class="sc-step__body">
                <h3 class="sc-step__title">${step.title}</h3>
                <p class="sc-step__text">${step.body}</p>
              </div>
            </div>
          `,
        )}
      </section>

      <section class="sc-quoteband">
        <div class="sc-wrap-mid sc-pad" style="padding-top: 88px; padding-bottom: 88px">
          <h2 class="t-h2-alt">What we stand for</h2>
          <div class="sc-grid-stands">
            ${STANDS.map(
              (stand) => html`
                <div>
                  <h3 class="t-h3">${stand.title}</h3>
                  <p class="t-body-sm">${stand.body}</p>
                </div>
              `,
            )}
          </div>
        </div>
      </section>
    </main>
  `;
}
