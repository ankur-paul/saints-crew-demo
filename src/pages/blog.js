// @ts-check

import { html } from "../lib/html.js";
import { COPY } from "../data/content.js";

export const title = "Blog — Saints Crew";

/** Journal index. There are no posts yet. */
export function render() {
  return html`
    <main id="main" class="sc-wrap-read sc-pad sc-sec-page sc-anim-fade">
      <p class="t-eyebrow">Journal</p>
      <h1 class="t-display">Blog</h1>
      <div class="sc-blog__body">
        <p>${COPY.blogBody}</p>
        <a class="t-action t-underline" href="#/shop">Shop the collection</a>
      </div>
    </main>
  `;
}
