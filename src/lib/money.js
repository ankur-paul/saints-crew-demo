// @ts-check

/** Everything is priced in whole rupees; there are no paise anywhere in the catalogue. */
const FORMAT = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

/**
 * Format a rupee amount the way the storefront shows it: `₹5,400`.
 * @param {number} amount whole rupees
 * @returns {string}
 */
export function money(amount) {
  return "₹" + FORMAT.format(amount);
}
