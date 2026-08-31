// @ts-check

import { html } from "./lib/html.js";
import { mount, delegate, focusFirst } from "./lib/dom.js";
import { matchRoute, replaceHash, startRouter } from "./lib/router.js";
import { ACTIONS, ACTION_ATTR, FORM_ATTR, FORMS, VALUE_ATTR } from "./actions.js";
import { PAGES, ROUTES } from "./pages/index.js";
import { announceBar, siteHeader } from "./components/header.js";
import { mobileNav, NAV_PANEL_ID } from "./components/mobile-nav.js";
import { cartDrawer, CART_PANEL_ID } from "./components/cart-drawer.js";
import { newsletter } from "./components/newsletter.js";
import { siteFooter } from "./components/footer.js";
import { closeOverlays, getState, setState, subscribe } from "./state/store.js";
import { addLine, countItems, removeLine } from "./state/cart.js";
import { CATEGORIES, GENDERS, defaultSize, findProduct } from "./data/products.js";
import { SITE } from "./data/site.js";

/**
 * Application entry point: renders the shell, routes the URL, and translates
 * clicks and submits into state changes. Nothing else touches the DOM.
 */

const DEFAULT_TITLE = `${SITE.name} — ${SITE.tagline}`;

const app = document.getElementById("app");
if (!app) throw new Error("#app is missing from the page shell");

/* --------------------------------------------------------------- rendering */

/**
 * Compose the full page: chrome, the current page, and the overlays.
 * @param {import("./state/store.js").State} state
 */
function view(state) {
  const page = PAGES[state.page] ?? PAGES.home;
  return html`
    <div class="sc-page">
      ${announceBar()}
      ${siteHeader({ page: state.page, count: countItems(state.cart), navOpen: state.navOpen })}
      ${state.navOpen ? mobileNav() : ""}
      ${page.render(state)}
      ${state.cartOpen ? cartDrawer(state.cart) : ""}
      ${newsletter(state.subscribed)}
      ${siteFooter()}
    </div>
  `;
}

/**
 * @param {import("./state/store.js").State} state
 * @returns {string}
 */
function titleFor(state) {
  const page = PAGES[state.page];
  const title = typeof page?.title === "function" ? page.title(state) : page?.title;
  return title ?? DEFAULT_TITLE;
}

/** @param {import("./state/store.js").State} state */
function render(state) {
  mount(/** @type {Element} */ (app), view(state));
  document.title = titleFor(state);

  // An overlay must trap neither scroll nor keyboard focus behind it.
  document.body.classList.toggle("is-locked", state.navOpen || state.cartOpen);
  if (state.cartOpen) focusFirst(document.getElementById(CART_PANEL_ID));
  else if (state.navOpen) focusFirst(document.getElementById(NAV_PANEL_ID));
}

/* ----------------------------------------------------------------- routing */

/**
 * Apply a hash to the state.
 *
 * An unknown product id is redirected rather than rendered, because falling back
 * to some other garment would show the visitor the wrong thing as though it were
 * right — the worst outcome available.
 *
 * @param {string} hash
 */
function onRoute(hash) {
  const route = matchRoute(hash, ROUTES, "home");

  if (route.name === "product") {
    if (!findProduct(route.params.id)) {
      replaceHash("#/shop");
      return;
    }
    setState({ page: "product", pid: route.params.id, size: null, navOpen: false, cartOpen: false });
  } else if (route.name === "shop") {
    setState({
      page: "shop",
      pid: null,
      // Only accept filters the shop actually offers; anything else means "All".
      category: CATEGORIES.includes(/** @type {any} */ (route.query.cat)) ? route.query.cat : "All",
      gender: GENDERS.includes(/** @type {any} */ (route.query.gender)) ? route.query.gender : "All",
      navOpen: false,
      cartOpen: false,
    });
  } else {
    setState({ page: route.name, pid: null, navOpen: false, cartOpen: false });
  }

  window.scrollTo(0, 0);
}

/* ---------------------------------------------------------------- handlers */

/**
 * @param {string} action
 * @param {HTMLElement} el
 * @param {Event} event
 */
function onAction(action, el, event) {
  const state = getState();
  const value = el.getAttribute(VALUE_ATTR) ?? "";

  switch (action) {
    case ACTIONS.toggleNav:
      setState({ navOpen: !state.navOpen, cartOpen: false });
      break;

    case ACTIONS.toggleCart:
      setState({ cartOpen: !state.cartOpen, navOpen: false });
      break;

    case ACTIONS.setCategory:
      setState({ category: value });
      break;

    case ACTIONS.setGender:
      setState({ gender: value });
      break;

    case ACTIONS.setSize:
      setState({ size: value });
      break;

    case ACTIONS.resetFilters:
      // The link already points at #/shop; if we are there, the hash will not
      // change and no route event would fire, so clear the filters directly.
      event.preventDefault();
      setState({ category: "All", gender: "All" });
      break;

    case ACTIONS.removeLine:
      setState({ cart: removeLine(state.cart, Number(value)) });
      break;

    case ACTIONS.addToBag:
      addCurrentProduct();
      break;

    case ACTIONS.checkout:
      startCheckout();
      break;
  }
}

/** Add the product being viewed, defaulting the size if none was chosen. */
function addCurrentProduct() {
  const state = getState();
  const product = findProduct(state.pid);
  if (!product) return;

  const size = state.size ?? defaultSize(product);
  setState({ cart: addLine(state.cart, product.id, size), size, cartOpen: true });
}

/**
 * There is no payment gateway yet, so checkout composes an order enquiry the
 * studio can answer by hand. Replace this with the real gateway before launch —
 * see README.md, "Before launch".
 */
function startCheckout() {
  const { cart } = getState();
  if (cart.length === 0) return;

  const body = cart
    .map((line) => {
      const product = findProduct(line.id);
      return product ? `${product.name} — size ${line.size} × ${line.qty}` : "";
    })
    .filter(Boolean)
    .join("\n");

  const params = new URLSearchParams({ subject: "Order enquiry", body });
  window.location.href = `mailto:${SITE.email}?${params.toString()}`;
}

/**
 * Both forms validate natively and then record that they were sent. Neither
 * delivers anything yet — see README.md, "Before launch".
 * @param {string} name
 */
function onSubmit(name) {
  if (name === FORMS.newsletter) setState({ subscribed: true });
  else if (name === FORMS.contact) setState({ sent: true });
}

/* -------------------------------------------------------------------- boot */

subscribe(render);

delegate(app, "click", ACTION_ATTR, onAction);

app.addEventListener("submit", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLFormElement)) return;
  const name = target.getAttribute(FORM_ATTR);
  if (!name) return;
  event.preventDefault();
  onSubmit(name);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeOverlays();
});

startRouter(onRoute);
render(getState());
