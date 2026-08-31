import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { money } from "../../src/lib/money.js";

describe("money", () => {
  it("groups in the Indian system, not thousands", () => {
    assert.equal(money(5400), "₹5,400");
    assert.equal(money(100000), "₹1,00,000");
  });

  it("shows no decimals", () => {
    assert.equal(money(0), "₹0");
    assert.equal(money(3200), "₹3,200");
  });
});
