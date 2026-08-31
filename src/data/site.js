// @ts-check

/**
 * Site-wide facts: where it lives, how to reach it, and the commercial rules
 * that appear in more than one place.
 *
 * TODO before launch — placeholders carried over from the design:
 *   - `address` and `phone` are not real
 *   - `privacyUrl` / `termsUrl` must exist on the live domain
 *   - `facebook` and `whatsapp` point at site roots, not accounts
 * See README.md, "Left as-is".
 */

export const SITE = {
  name: "Saints Crew",
  origin: "https://www.saintscrew.co.in",
  tagline: "Cloth that keeps its word",
  description:
    "Knitwear, shirting and trousers cut in small runs from natural fibre. Made in Ludhiana, Punjab. Made to be worn, mended and worn again.",
  email: "hello@saintscrew.co.in",
  phone: "+91 123 456 7890",
  phoneHref: "tel:+911234567890",
  address: { street: "Name of street 12, Ludhiana,", postcode: "Post code 141001" },
  city: "Ludhiana, India",
  copyright: "© 2026 Saints Crew. All rights reserved.",
};

export const LINKS = {
  instagram: "https://www.instagram.com/saintscrewoutfits",
  facebook: "https://www.facebook.com",
  whatsapp: "https://www.whatsapp.com/",
  privacy: `${SITE.origin}/privacy-policy`,
  terms: `${SITE.origin}/terms-and-conditions`,
};

/** Orders at or above this many rupees ship free. Shown in the bar and the bag. */
export const FREE_SHIPPING_FROM = 6000;

/** Primary navigation: label paired with the route name it points at. */
export const NAV = /** @type {const} */ ([
  { label: "Shop", route: "shop" },
  { label: "About", route: "about" },
  { label: "Our values", route: "values" },
  { label: "Contact", route: "contact" },
]);

/** The four material tiles on the home page. Each opens the shop pre-filtered. */
export const CATEGORY_TILES = [
  { label: "Knitwear", sub: "Undyed lambswool", img: "assets/tex-knit.jpg" },
  { label: "Shirts", sub: "Washed linen", img: "assets/tex-linen.jpg" },
  { label: "Trousers", sub: "Heavy cotton", img: "assets/tex-fabric.jpg" },
  { label: "Outerwear", sub: "Canvas and wool", img: "assets/tex-cotton.jpg" },
];

/**
 * @typedef {object} FooterLink
 * @property {string} label
 * @property {string} href
 * @property {boolean} [external] opens in a new tab
 */

/** @type {ReadonlyArray<{ title: string, items: ReadonlyArray<FooterLink> }>} */
export const FOOTER_COLUMNS = [
  {
    title: "Shop",
    items: [
      { label: "Knitwear", href: "#/shop?cat=Knitwear" },
      { label: "Shirts", href: "#/shop?cat=Shirts" },
      { label: "Trousers", href: "#/shop?cat=Trousers" },
      { label: "Outerwear", href: "#/shop?cat=Outerwear" },
      { label: "Blog", href: "#/blog" },
    ],
  },
  {
    title: "Info",
    items: [
      { label: "Shipping & returns", href: "#/shipping" },
      { label: "Size guide", href: "#/size-guide" },
      { label: "Privacy Policy", href: LINKS.privacy, external: true },
      { label: "Terms conditions", href: LINKS.terms, external: true },
    ],
  },
  {
    title: "Follow",
    items: [
      { label: "Facebook", href: LINKS.facebook, external: true },
      { label: "Instagram", href: LINKS.instagram, external: true },
      { label: "WhatsApp", href: LINKS.whatsapp, external: true },
    ],
  },
  {
    title: "Contact us",
    items: [
      { label: SITE.email, href: `mailto:${SITE.email}`, external: true },
      { label: SITE.phone, href: SITE.phoneHref, external: true },
    ],
  },
];
