// @ts-check

import { html } from "../lib/html.js";
import { ABOUT_QUOTE, COPY, STORY } from "../data/content.js";

export const title = "About us — Saints Crew";

/** How the company started, and what it is aiming at. */
export function render() {
  return html`
    <main id="main" class="sc-anim-fade">
      <section class="sc-wrap-read sc-pad" style="padding-top: 96px; padding-bottom: 64px">
        <p class="t-eyebrow">About us</p>
        <h1 class="t-display">${COPY.aboutTitle}</h1>
        <p class="t-lead">${COPY.aboutLede}</p>
      </section>

      <section style="background: var(--sc-stone)">
        <img class="sc-hero-strip" src="assets/wide-knit.jpg" alt="Saints Crew knitwear" loading="lazy"
             style="object-position: 74% center" />
      </section>

      <section class="sc-wrap-read sc-pad" style="padding-top: 72px; padding-bottom: 96px">
        <div class="sc-grid-story">
          ${STORY.map(
            (passage) => html`
              <div>
                <h3 class="t-h3-sm">${passage.title}</h3>
                <p class="t-body-sm">${passage.body}</p>
              </div>
            `,
          )}
        </div>
      </section>

      <section class="sc-quoteband">
        <div class="sc-wrap-read sc-pad" style="padding-top: 88px; padding-bottom: 88px">
          <p class="sc-quoteband__statement">${ABOUT_QUOTE.statement}</p>
          <blockquote class="sc-quote">
            <p>${ABOUT_QUOTE.text}</p>
            <footer>${ABOUT_QUOTE.attribution}</footer>
          </blockquote>
        </div>
      </section>
    </main>
  `;
}
