// @ts-check

/**
 * Names used by the click delegate.
 *
 * Templates write `data-action="${ACTIONS.addToBag}"` and `main.js` switches on
 * the same constant, so a typo is a build-time reference error rather than a
 * button that silently does nothing.
 */
export const ACTIONS = /** @type {const} */ ({
  toggleNav: "toggle-nav",
  toggleCart: "toggle-cart",
  setCategory: "set-category",
  setGender: "set-gender",
  setSize: "set-size",
  resetFilters: "reset-filters",
  removeLine: "remove-line",
  addToBag: "add-to-bag",
  checkout: "checkout",
});

/** Attribute the delegate listens on. */
export const ACTION_ATTR = "data-action";

/** Attribute carrying an action's argument (a category, size, or line index). */
export const VALUE_ATTR = "data-value";

/** Names used by the submit delegate. */
export const FORMS = /** @type {const} */ ({
  newsletter: "newsletter",
  contact: "contact",
});

export const FORM_ATTR = "data-form";
