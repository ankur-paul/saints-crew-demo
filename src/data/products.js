// @ts-check

/**
 * The catalogue.
 *
 * To add a garment: drop its photograph in `src/assets/`, add an entry here, and
 * nothing else needs to change — the shop grid, filters, product page, featured
 * row and stock count all read from this array.
 *
 * Ids are permanent. They appear in URLs (`#/product/p3`) and in saved bags, so
 * changing one breaks existing links and orphans a customer's saved line. Add new
 * ids rather than renumbering; gaps are fine.
 */

/**
 * @typedef {"Knitwear" | "Shirts" | "Trousers" | "Outerwear"} Category
 * @typedef {"Men" | "Women"} Gender
 */

/**
 * @typedef {object} Product
 * @property {string} id       permanent, URL-safe
 * @property {string} name
 * @property {Category} cat
 * @property {Gender} gender
 * @property {number} price    whole rupees
 * @property {string} img      path relative to the site root
 * @property {string} fibre    short material line shown under the name
 * @property {string} desc
 * @property {ReadonlyArray<readonly [string, string]>} specs  label/value pairs
 */

/** @type {ReadonlyArray<Product>} */
export const PRODUCTS = [
  {
    id: "p1",
    name: "Aran Cable Sweater",
    cat: "Knitwear",
    gender: "Men",
    price: 5400,
    img: "assets/card-knit.jpg",
    fibre: "Undyed lambswool",
    desc: "Hand-framed cables in undyed lambswool, knitted to a heavy 7-gauge so it holds its shape through a winter of wearing. Ribbed cuffs, saddle shoulder, no lining and nothing to shed.",
    specs: [
      ["Fibre", "100% undyed lambswool"],
      ["Made in", "Ludhiana, Punjab"],
      ["Care", "Hand wash cool, dry flat"],
      ["Fit", "Relaxed — size down for a close fit"],
    ],
  },
  {
    id: "p2",
    name: "Ribbed Knit Polo",
    cat: "Knitwear",
    gender: "Women",
    price: 4200,
    img: "assets/card-trouser.jpg",
    fibre: "Fine merino",
    desc: "A short-sleeve polo in fine-gauge merino rib, open at the collar and cut boxy through the body. Fully fashioned, so the seams follow the shoulder rather than being cut through the knit.",
    specs: [
      ["Fibre", "100% extra-fine merino"],
      ["Made in", "Ludhiana, Punjab"],
      ["Care", "Machine wash wool cycle"],
      ["Fit", "Boxy, true to size"],
    ],
  },
  {
    id: "p3",
    name: "Washed Linen Shirt",
    cat: "Shirts",
    gender: "Women",
    price: 3200,
    img: "assets/card-shirt.jpg",
    fibre: "Washed linen",
    desc: "Washed European linen, softened before it is cut so it arrives already broken in. Long in the body, dropped shoulder, mother-of-pearl buttons. It creases. That is the point.",
    specs: [
      ["Fibre", "100% washed linen"],
      ["Made in", "Ludhiana, Punjab"],
      ["Care", "Machine wash cool, line dry"],
      ["Fit", "Easy through the body"],
    ],
  },
  {
    id: "p4",
    name: "Cotton Poplin Shirt",
    cat: "Shirts",
    gender: "Men",
    price: 3600,
    img: "assets/card-hero.jpg",
    fibre: "Organic poplin",
    desc: "A clean organic poplin shirt with a soft collar that stands without fusing. Single-needle side seams, split yoke, cut to be worn open over a tee or closed under knitwear.",
    specs: [
      ["Fibre", "100% organic cotton poplin"],
      ["Made in", "Ludhiana, Punjab"],
      ["Care", "Machine wash 30°"],
      ["Fit", "Regular"],
    ],
  },
  {
    id: "p6",
    name: "Wide-Leg Cotton Trouser",
    cat: "Trousers",
    gender: "Women",
    price: 3900,
    img: "assets/card-trouser-w.jpg",
    fibre: "Heavy cotton",
    desc: "A wide, high-rise trouser in a heavy cotton that holds a line without stiffness. Deep pockets, plain front, cut to fall straight from the hip.",
    specs: [
      ["Fibre", "100% organic cotton"],
      ["Made in", "Ludhiana, Punjab"],
      ["Care", "Machine wash 30°"],
      ["Hem", "Left long — we will finish it free"],
    ],
  },
  {
    id: "p7",
    name: "Cotton Chore Jacket",
    cat: "Outerwear",
    gender: "Men",
    price: 5800,
    img: "assets/card-cb2.jpg",
    fibre: "Cotton canvas",
    desc: "A workwear jacket in undyed cotton canvas that stiffens in the rain and softens again as it dries. Three patch pockets, tack-stitched at every stress point.",
    specs: [
      ["Fibre", "100% cotton canvas"],
      ["Made in", "Ludhiana, Punjab"],
      ["Care", "Machine wash 30°, tumble low"],
      ["Fit", "Roomy, sized to layer"],
    ],
  },
  {
    id: "p8",
    name: "Tailored Wool Blazer",
    cat: "Outerwear",
    gender: "Women",
    price: 7900,
    img: "assets/card-studio.jpg",
    fibre: "Wool suiting",
    desc: "A soft-shouldered single-breasted blazer in wool suiting, half-canvassed so it moulds to the wearer instead of holding a fixed line. Two buttons, patch pockets, unlined sleeves.",
    specs: [
      ["Fibre", "100% wool suiting"],
      ["Made in", "Ludhiana, Punjab"],
      ["Care", "Dry clean"],
      ["Fit", "Clean through the waist"],
    ],
  },
];

/** Filter chips on the shop page, in order. `"All"` must come first. */
export const CATEGORIES = /** @type {const} */ (["All", "Knitwear", "Shirts", "Trousers", "Outerwear"]);

/** Gender filters, in order. */
export const GENDERS = /** @type {const} */ (["All", "Women", "Men"]);

/** The four garments promoted on the home page, by id. */
export const FEATURED_IDS = ["p1", "p3", "p6", "p8"];

/** Size runs differ by category; trousers are sold by waist measurement. */
const TROUSER_SIZES = ["28", "30", "32", "34", "36"];
const GARMENT_SIZES = ["XS", "S", "M", "L", "XL"];

/**
 * @param {Product} product
 * @returns {readonly string[]}
 */
export function sizesFor(product) {
  return product.cat === "Trousers" ? TROUSER_SIZES : GARMENT_SIZES;
}

/**
 * The size assumed when someone adds to bag without choosing one.
 * @param {Product} product
 * @returns {string}
 */
export function defaultSize(product) {
  return product.cat === "Trousers" ? "32" : "M";
}

/**
 * @param {string | null | undefined} id
 * @returns {Product | undefined}
 */
export function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

/**
 * @param {string} category `"All"` matches everything
 * @param {string} gender   `"All"` matches everything
 * @returns {ReadonlyArray<Product>}
 */
export function filterProducts(category, gender) {
  return PRODUCTS.filter(
    (p) => (category === "All" || p.cat === category) && (gender === "All" || p.gender === gender),
  );
}
