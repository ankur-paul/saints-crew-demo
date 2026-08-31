# Saints Crew

A storefront for Saints Crew — knitwear, shirting and trousers, made in Ludhiana.

Plain ES modules and CSS. No framework, no runtime dependencies: the deployed site
loads one script and one stylesheet and nothing else. The only build-time
dependency is esbuild, which bundles and minifies.

## Getting started

```
npm install
npm run dev            # http://localhost:5173
```

`npm run dev` serves `src/` exactly as it is on disk — the browser loads the
modules and the stylesheet unbundled, so a save and a refresh is the whole loop.
There is no watcher and no transform, which means what you see in development is
what gets bundled.

```
npm run build          # → dist/, ready to deploy
npm test               # unit tests, then browser tests against dist/
npm run check          # type-check the JSDoc annotations
npm run images         # regenerate src/assets/ from the masters in assets/
```

## Layout

```
src/
├── index.html          page shell: meta, fonts, the #app mount point
├── main.js             entry point — renders, routes, handles events
├── actions.js          the names shared between templates and handlers
├── data/               content, with no markup in it
│   ├── products.js       the catalogue
│   ├── site.js           domain, contact details, navigation, footer
│   └── content.js        editorial copy
├── state/
│   ├── store.js          the single source of truth
│   └── cart.js           bag arithmetic — pure, unit-tested
├── lib/                  primitives with no knowledge of this site
│   ├── html.js           auto-escaping template literal
│   ├── router.js         hash parsing and matching
│   ├── dom.js            mount, event delegation, focus
│   ├── money.js          rupee formatting
│   └── storage.js        localStorage that cannot throw
├── components/         chrome shared by more than one page
├── pages/              one module per route, plus the route table
├── styles/             tokens, base, typography, layout, components, pages
└── assets/             web-ready images (generated; committed)

assets/                 full-resolution masters — never deployed
public/                 copied into dist/ verbatim (404, host configs)
scripts/                dev server, build, image pipeline
tests/                  unit tests and the browser suite
dist/                   generated; not in version control
```

## How it fits together

**One store, one render.** `state/store.js` holds everything the page shows.
`setState` merges a patch and notifies subscribers; `main.js` is the only
subscriber, and it re-renders the whole page. There is no partial updating and no
component-local state, so when the screen is wrong there is exactly one place to
look. Re-rendering everything is affordable because the whole page is about 40 kB
of string building.

**Markup is built with `html\`\`\`.** The tagged template in `lib/html.js` escapes
every interpolated value automatically. Arrays are joined, `false`/`null` render as
nothing so `condition && html\`…\`` works, and nested templates pass through
unescaped. Never build markup by concatenating strings; if you genuinely need to
inject prepared markup, `raw()` says so explicitly.

**Events are delegated, not bound.** Templates carry `data-action="…"`, and
`main.js` registers one listener on `#app`. Nothing needs rebinding after a
re-render and no handler can leak. Action names live in `actions.js` and are
imported by both sides, so a typo is a reference error rather than a dead button.

**Styles are classes, not inline attributes.** `styles/tokens.css` declares every
colour, font and measure once; the rest of the stylesheet uses those variables.
Class names say what a thing *is* (`.sc-drawer__panel`, `.t-eyebrow`), not what it
looks like. A handful of genuinely one-off values are still inline in the
templates — a section's padding, a `max-width` in `ch` — which is deliberate:
promoting those to named classes would add vocabulary without adding meaning.

**Types without TypeScript.** Every module is annotated with JSDoc and checked by
`tsc --checkJs --strict` under `npm run check`. Nothing compiles; the annotations
are only there to be checked. `jsconfig.json` scopes this to `src/` — the scripts
and tests are Node-side glue where the checking would cost more than it returns.

### Adding a garment

Add an object to `PRODUCTS` in `src/data/products.js` and put its photograph in
`assets/`, then run `npm run images`. The shop grid, filters, product page, stock
count and featured row all read from that array.

Product ids are permanent: they appear in URLs and in saved bags, so changing one
breaks existing links and orphans a customer's saved line. Add new ids rather than
renumbering — gaps are fine, and there is already no `p5`.

### Adding a page

Create `src/pages/whatever.js` exporting `render(state)` and a `title`, then add it
to `PAGES` and add a pattern to `ROUTES`, both in `src/pages/index.js`.

### Changing the brand

Colours, type and spacing are all in `src/styles/tokens.css`. The domain, contact
details, navigation and footer links are in `src/data/site.js` — and the build
derives `robots.txt`, `sitemap.xml` and the canonical and Open Graph URLs from
`SITE.origin`, so the domain is written down once.

## Testing

`npm run test:unit` covers the logic that does not need a browser — cart
arithmetic, escaping, route parsing, money formatting — including the cases that
matter and are easy to get wrong: a saved bag that has been tampered with, a
product that has left the catalogue, an attribute value trying to break out of its
quotes.

`npm run test:e2e` builds nothing and assumes `dist/` is current. It serves the
built site and drives headless Chrome over the DevTools protocol, so it exercises
the same bundle that gets deployed: routing, filters read from the URL, the bag
surviving a reload, focus moving into the drawer, Escape closing it, scroll
locking, both forms, and that no page logs an error. Set `CHROME` if the binary is
not `google-chrome`.

Each navigation in the browser suite tears the document down before loading the
next URL. Without that, moving between two hashes is a same-document navigation
and "has it rendered yet" passes instantly against the previous page's markup —
which is what made an earlier version of the suite flaky.

## Deploying

`npm run build` writes everything to `dist/`: a fingerprinted script and
stylesheet, the images, the files from `public/`, and generated `robots.txt`,
`sitemap.xml` and `_headers`. Publish that directory.

```
npx netlify-cli deploy --dir=dist --prod     # Netlify
npx vercel --prod dist                       # Vercel
npx wrangler pages deploy dist               # Cloudflare Pages
```

**GitHub Pages** — push the contents of `dist/` to `gh-pages`. `.nojekyll` is
included. Pages ignores `_headers`, so the security headers will not apply.

**Any static host** — copy `dist/` to the web root. Routing is on the hash, so no
rewrite rules are needed; every URL resolves to `index.html`.

The script and stylesheet are fingerprinted (`app.1f2e64f6.js`) and served
`immutable`, so returning visitors re-download them only when they change.

## What the review changed

The project arrived as a Claude Design canvas — `Saints Crew.dc.html`, which
renders only through `support.js`, a runtime that pulled React, ReactDOM and Babel
Standalone (about 2.5 MB) from unpkg on every page load and transpiled JSX in the
browser before anything appeared. Fine for design review; wrong for a storefront,
which is slow on first paint and blank if unpkg is unreachable.

That canvas was converted by hand to the code in `src/`. The design is unchanged
and the copy is verbatim. Twelve of thirteen page-and-viewport screenshots are
pixel-identical to the pre-refactor build; the thirteenth differs by two pixels of
text antialiasing.

**Architecture** — removed the React and Babel CDN dependency; added an entry
point (there was no `index.html`, and the only page had a space in its filename);
added hash routing, so pages are linkable and the Back button works, where
previously the whole site was one URL held in memory.

**Correctness** — an unknown product id used to fall back to `PRODUCTS[0]`, so a
stale link showed the wrong garment as though it were right; it now redirects to
the collection. `add()` shallow-copied the cart and then mutated a line object
shared with the previous state. The Checkout button had no handler at all. Contact
and newsletter submits silently did nothing when the email failed an
`indexOf("@") > 0` check, with no message to the customer; both are now real forms
using native validation. The bag emptied on every refresh, and now persists, with
what comes back out of storage validated before it is trusted.

**Weight** — images went from 7.8 MB to 1.6 MB. Seven unused photographs are no
longer shipped, and the design-canvas scratch files in `uploads/` are excluded.

**Metadata** — added per-page titles, meta description, canonical, Open Graph and
Twitter cards, `theme-color`, favicon, `robots.txt`, `sitemap.xml` and a styled
`404.html`. The original had none of these.

**Accessibility** — skip link, focus rings, `aria-expanded` / `aria-pressed` /
`aria-current`, `role="dialog"` with `aria-modal`, Escape to close, focus moved
into overlays, scroll locked behind them, `prefers-reduced-motion`,
`rel="noopener noreferrer"` on external links, and a `<noscript>` fallback instead
of a blank page.

**Security** — a Content-Security-Policy verified not to break the page. Because
the bundle is an external file rather than an inline script, `script-src` is
`'self'` with no `'unsafe-inline'`.

## Left as-is

Copy was left untouched, as asked. These want a decision before launch:

- **Placeholder address.** "Name of street 12, Ludhiana, Post code 141001" appears
  in the footer, on the Contact page, and in the Returns policy as the return
  address. (`SITE.address` in `src/data/site.js`.)
- **Placeholder phone.** "+91 123 456 7890", including as a live `tel:` link.
- **Size guide is unfinished.** A "Size chart artwork goes here" plate sits over a
  linen texture, and the intro still reads as an instruction to the author.
- **Unverifiable certification claim.** The Values page states products are "fully
  certified sustainable by the Jackson Foundation Sustainability Board". That body
  could not be verified to exist. An unsubstantiated certification claim on a
  commercial storefront is a real legal exposure — worth confirming with whoever
  owns the copy. (`STANDS[0]` in `src/data/content.js`.)
- **Mismatched quotation marks.** The About page pull quote opens with a curly `“`
  and closes with a straight `"`.
- **Policy links may be dead.** Privacy Policy and Terms point at
  `saintscrew.co.in/privacy-policy` and `/terms-and-conditions`, linked from the
  footer and three other pages. Those must exist before launch.
- **Placeholder social links.** Facebook points at `facebook.com` and WhatsApp at
  `whatsapp.com` — site roots, not accounts. Only Instagram is real.
- **One Trousers product, women's only**, so Trousers + Men is empty. The empty
  state handles it, but the homepage promotes Trousers as a full category.

## Before launch

1. **Checkout.** There is no payment gateway. The button composes an order enquiry
   email (`startCheckout` in `src/main.js`). Wire up Razorpay, Stripe, Shopify Buy
   or whatever you are using.
2. **Forms have no backend.** Contact and newsletter validate and confirm, but
   nothing is sent. Point them at Netlify Forms, Formspree or your own endpoint.
3. **Set the real domain.** `SITE.origin` in `src/data/site.js` feeds the canonical
   URL, the Open Graph and Twitter tags, `sitemap.xml` and `robots.txt`.
4. **Analytics and consent.** None is installed. Any script you add must also be
   allowed by the `Content-Security-Policy` generated in `scripts/build.mjs` and by
   `public/vercel.json`, or the browser will block it.
5. **Stock is static.** Quantities are not tracked; nothing ever sells out.
