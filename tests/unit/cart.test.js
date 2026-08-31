import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import {
  addLine,
  countItems,
  removeLine,
  resolveLines,
  sanitizeCart,
  shortfallToFreeShipping,
  subtotal,
} from "../../src/state/cart.js";

// p1 Aran Cable Sweater ₹5,400 · p3 Washed Linen Shirt ₹3,200
describe("addLine", () => {
  it("adds a new line", () => {
    assert.deepEqual(addLine([], "p1", "M"), [{ id: "p1", size: "M", qty: 1 }]);
  });

  it("merges the same product in the same size", () => {
    const once = addLine([], "p1", "M");
    assert.deepEqual(addLine(once, "p1", "M"), [{ id: "p1", size: "M", qty: 2 }]);
  });

  it("keeps the same product in a different size as its own line", () => {
    const cart = addLine(addLine([], "p1", "M"), "p1", "L");
    assert.equal(cart.length, 2);
  });

  it("never mutates the cart it was given", () => {
    const before = [{ id: "p1", size: "M", qty: 1 }];
    const snapshot = structuredClone(before);
    addLine(before, "p1", "M");
    assert.deepEqual(before, snapshot);
  });

  it("caps a line at 99", () => {
    const cart = addLine([{ id: "p1", size: "M", qty: 99 }], "p1", "M");
    assert.equal(cart[0].qty, 99);
  });
});

describe("removeLine", () => {
  const cart = [
    { id: "p1", size: "M", qty: 1 },
    { id: "p3", size: "S", qty: 2 },
  ];

  it("removes by position", () => {
    assert.deepEqual(removeLine(cart, 0), [{ id: "p3", size: "S", qty: 2 }]);
  });

  it("ignores an index that is not there", () => {
    assert.deepEqual(removeLine(cart, 9), cart);
  });
});

describe("totals", () => {
  const cart = [
    { id: "p1", size: "M", qty: 2 }, // 10,800
    { id: "p3", size: "S", qty: 1 }, //  3,200
  ];

  it("counts units, not lines", () => {
    assert.equal(countItems(cart), 3);
  });

  it("sums the subtotal", () => {
    assert.equal(subtotal(cart), 14000);
  });

  it("ignores a line whose product has left the catalogue", () => {
    assert.equal(subtotal([...cart, { id: "gone", size: "M", qty: 1 }]), 14000);
  });

  it("reports the shortfall to free shipping, and zero once earned", () => {
    assert.equal(shortfallToFreeShipping(5400), 600);
    assert.equal(shortfallToFreeShipping(6000), 0);
    assert.equal(shortfallToFreeShipping(9000), 0);
  });
});

describe("resolveLines", () => {
  it("drops lines whose product no longer exists, keeping indices honest", () => {
    const resolved = resolveLines([
      { id: "gone", size: "M", qty: 1 },
      { id: "p1", size: "M", qty: 1 },
    ]);
    assert.equal(resolved.length, 1);
    assert.equal(resolved[0].index, 1, "index must still address the real cart");
  });
});

describe("sanitizeCart", () => {
  it("accepts a well-formed cart", () => {
    const cart = [{ id: "p1", size: "M", qty: 2 }];
    assert.deepEqual(sanitizeCart(cart), cart);
  });

  it("rejects anything that is not an array", () => {
    for (const junk of [null, undefined, 0, "", {}, "[]"]) {
      assert.deepEqual(sanitizeCart(junk), []);
    }
  });

  it("drops entries that do not describe a garment we sell", () => {
    const dirty = [
      { id: "p1", size: "M", qty: 1 },
      { id: "does-not-exist", size: "M", qty: 1 },
      { id: "p3", size: "", qty: 1 },
      { id: "p3", size: "S", qty: 0 },
      { id: "p3", size: "S", qty: -4 },
      { id: "p3", size: "S", qty: Number.NaN },
      { id: 7, size: "S", qty: 1 },
      null,
      "nonsense",
    ];
    assert.deepEqual(sanitizeCart(dirty), [{ id: "p1", size: "M", qty: 1 }]);
  });

  it("rounds and caps a suspicious quantity", () => {
    assert.deepEqual(sanitizeCart([{ id: "p1", size: "M", qty: 2.7 }]), [{ id: "p1", size: "M", qty: 2 }]);
    assert.deepEqual(sanitizeCart([{ id: "p1", size: "M", qty: 1e6 }]), [{ id: "p1", size: "M", qty: 99 }]);
  });
});
