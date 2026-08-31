# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Saints Crew is a storefront for a Ludhiana clothing label — knitwear, shirting and
trousers. It is a static site of plain ES modules and CSS with **no runtime
dependencies**: the deployed page loads one fingerprinted script and one
stylesheet and nothing else. esbuild is a build-time dependency only; TypeScript
is present purely to type-check JSDoc.

The project began as a Claude Design canvas (`Saints Crew.dc.html` + `support.js`,
still in the repo for reference) which was converted by hand into `src/`. Those
two files are not part of the site — do not import from them or treat them as
source of truth for behaviour.

## Commands

```
npm install
npm run dev                    # serves src/ unbundled at http://localhost:5173
npm run dev -- 8080            # different port
npm run build                  # → dist/
npm test                       # unit, then e2e
npm run test:unit
npm run test:e2e               # requires a current dist/ — run build first
npm run check                  # tsc --noEmit over src/ (JSDoc types)
npm run images                 # regenerate src/assets/ from assets/ (needs ImageMagick 7 `magick`)
```

Running a single unit test:

```
node --test tests/unit/cart.test.js
node --test --test-name-pattern "sanitize" tests/unit/cart.test.js
```

`npm run dev` has no watcher and no transform — the browser loads the modules and
stylesheet exactly as they sit on disk, so save-and-refresh is the whole loop, and
what you see in dev is what gets bundled.

`tests/e2e.mjs` builds nothing: it serves `dist/` and drives headless Chrome over
the DevTools protocol. It asserts against the deployed bundle, so **always
`npm run build` before `npm run test:e2e`**. Set `CHROME=/path/to/binary` if
`google-chrome` isn't on PATH. There is no test-name filter for the e2e suite.

## Architecture

**One store, one render, one subscriber.** `src/state/store.js` holds the entire
`State` (route name, product id, filters, cart, overlay flags, form flags).
`setState` merges a patch and notifies subscribers; `src/main.js` is the only
subscriber and re-renders the whole page into `#app`. There is no partial
updating and no component-local state — when the screen is wrong there is exactly
one place to look. Re-rendering everything is affordable because a page is ~40 kB
of string building.

`setState` also persists the cart (key `sc.cart.v1`) whenever the `cart` field
changes identity, so it is impossible to change the bag and forget to save it. If
the line shape ever changes incompatibly, bump the key rather than migrating.

**Markup is only ever built with `html\`\``** (`src/lib/html.js`), a tagged
template that escapes every interpolated value. Arrays flatten and join;
`null`/`undefined`/`false` render as nothing so `cond && html\`…\`` works; `true`
renders as `"true"` so `aria-pressed="${on}"` is correct; nested `html` results
pass through. Never concatenate markup strings. `raw()` is the explicit,
audited-only escape hatch.

**Events are delegated, never bound.** Templates carry `data-action="…"` (and
`data-value` for the argument); `main.js` registers one delegated click listener
on `#app`, plus one `submit` listener keyed on `data-form`. Nothing needs
rebinding after a re-render and no handler can leak. Every action and form name
lives in `src/actions.js` and is imported by both the template and the handler, so
a typo is a reference error rather than a dead button.

**Routing is hash-only** (`src/lib/router.js`), which is why the site needs no
rewrite rules on any host. `src/pages/index.js` holds both the `PAGES` registry
(keyed by route name; each module exports `render(state)` and a `title`) and the
`ROUTES` regex table. `main.js:onRoute` translates a hash into a state patch, and
it validates: an unknown product id **redirects to `#/shop`** rather than
rendering a fallback garment, and a shop filter not in `CATEGORIES`/`GENDERS` is
treated as `"All"`.

**Untrusted input is sanitized at the boundary.** `sanitizeCart` in
`src/state/cart.js` coerces whatever comes back from localStorage into valid
lines, dropping anything referring to a product that has left the catalogue.
Everything else in `cart.js` is pure and returns new arrays — never mutate a line
object, since the previous state may still hold it.

**Content is data, not markup.** `src/data/` (`products.js`, `site.js`,
`content.js`) holds the catalogue, domain/contact/nav/footer, and editorial copy,
with no HTML in it. `SITE.origin` is the single declaration of the domain — the
build derives `robots.txt`, `sitemap.xml`, the canonical URL and the Open Graph
tags from it.

**Styles are classes, not inline attributes.** `src/styles/tokens.css` declares
every colour, font and measure once; the rest uses those variables. Class names
say what a thing *is* (`.sc-drawer__panel`, `.t-eyebrow`). A few genuinely one-off
values remain inline in templates by choice.

**Types without TypeScript.** Every module in `src/` is `// @ts-check`'d and
annotated with JSDoc, verified by `npm run check` under `strict`. Nothing
compiles. `jsconfig.json` deliberately scopes checking to `src/` — `scripts/` and
`tests/` are Node-side glue.

### Build pipeline (`scripts/build.mjs`)

Wipes `dist/`, bundles and minifies `src/main.js` and `src/styles/index.css`,
fingerprints both (`app.1f2e64f6.js`) and rewrites the shell to point at them and
to substitute `%ORIGIN%`, copies `src/assets/` and `public/` verbatim, then
generates `robots.txt`, `sitemap.xml` and `_headers` (security headers, CSP,
`immutable` caching). Because the bundle is an external file, `script-src` is
`'self'` with no `'unsafe-inline'` — **any script or third-party origin you add
must also be allowed in the CSP in `scripts/build.mjs` and in
`public/vercel.json`**, or the browser will block it.

`assets/` holds full-resolution masters and is never deployed; `src/assets/` holds
the derivatives, generated by `npm run images` but committed so a build needs
nothing but Node. `uploads/` and `.thumbnail` are design-canvas scratch and are
gitignored.

## Conventions worth knowing

- **Product ids are permanent.** They appear in URLs and in saved bags, so
  renaming one breaks existing links and orphans a customer's line. Add new ids;
  gaps are fine (there is already no `p5`).
- **Adding a garment:** an object in `PRODUCTS` (`src/data/products.js`) plus a
  photo in `assets/`, then `npm run images`. The grid, filters, product page,
  stock count and featured row all read from that array.
- **Adding a page:** `src/pages/whatever.js` exporting `render(state)` and
  `title`, then register it in `PAGES` and add a pattern to `ROUTES` in
  `src/pages/index.js`.
- **In the e2e suite, each navigation tears the document down first.** Moving
  between two hashes is a same-document navigation, so "has it rendered yet"
  otherwise passes instantly against the previous page's markup — that is what
  made an earlier version of the suite flaky. Keep that teardown.

## Known gaps (see README.md for the full list)

Do not treat these as bugs to fix incidentally; they are pending decisions.

- **No payment gateway.** `startCheckout` in `src/main.js` composes a `mailto:`
  order enquiry.
- **Forms have no backend.** Contact and newsletter validate and confirm, but
  send nothing.
- **Stock is static** — quantities are not tracked and nothing sells out.
- **Placeholder copy** — address, phone, social links, policy URLs, an unfinished
  size chart, and an unverifiable sustainability certification claim in
  `STANDS[0]` (`src/data/content.js`). Copy was deliberately left untouched;
  changing it needs whoever owns it.
