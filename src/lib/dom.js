// @ts-check

import { SafeHtml } from "./html.js";

/**
 * Replace an element's contents with rendered markup.
 * @param {Element} target
 * @param {SafeHtml} markup
 */
export function mount(target, markup) {
  target.innerHTML = markup.value;
}

/**
 * Delegate an event to elements carrying a `data-*` attribute.
 *
 * One listener on a stable container survives every re-render, so handlers never
 * have to be rebound and nothing leaks when the markup is thrown away.
 *
 * @param {Element} container
 * @param {string} type      DOM event name, e.g. `"click"`
 * @param {string} attribute the data attribute to look for, e.g. `"data-action"`
 * @param {(name: string, element: HTMLElement, event: Event) => void} handler
 */
export function delegate(container, type, attribute, handler) {
  container.addEventListener(type, (event) => {
    const start = event.target;
    if (!(start instanceof Element)) return;
    const el = start.closest(`[${attribute}]`);
    if (!(el instanceof HTMLElement) || !container.contains(el)) return;
    handler(el.getAttribute(attribute) ?? "", el, event);
  });
}

/**
 * Move keyboard focus to the first focusable control inside a container, so a
 * dialog that has just opened is immediately operable from the keyboard.
 * @param {ParentNode | null} container
 */
export function focusFirst(container) {
  if (!container) return;
  const el = container.querySelector("button, [href], input, textarea, select");
  if (el instanceof HTMLElement) el.focus();
}
