import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { matchRoute, parseHash } from "../../src/lib/router.js";
import { ROUTES } from "../../src/pages/index.js";

describe("parseHash", () => {
  it("treats an empty hash as the root", () => {
    assert.deepEqual(parseHash(""), { path: "/", query: {} });
    assert.deepEqual(parseHash("#"), { path: "/", query: {} });
  });

  it("adds the leading slash a bare hash omits", () => {
    assert.equal(parseHash("#shop").path, "/shop");
  });

  it("splits the query off the path", () => {
    assert.deepEqual(parseHash("#/shop?cat=Knitwear&gender=Men"), {
      path: "/shop",
      query: { cat: "Knitwear", gender: "Men" },
    });
  });

  it("decodes percent escapes and plus signs", () => {
    assert.equal(parseHash("#/shop?cat=Wool%20%26%20Linen").query.cat, "Wool & Linen");
    assert.equal(parseHash("#/shop?q=a+b").query.q, "a b");
  });

  it("survives a malformed escape rather than throwing", () => {
    assert.equal(parseHash("#/shop?cat=%E0%A4%A").query.cat, "%E0%A4%A");
  });
});

describe("matchRoute", () => {
  const match = (hash) => matchRoute(hash, ROUTES, "home");

  it("matches each page", () => {
    assert.equal(match("#/").name, "home");
    assert.equal(match("#/shop").name, "shop");
    assert.equal(match("#/about").name, "about");
    assert.equal(match("#/values").name, "values");
    assert.equal(match("#/contact").name, "contact");
    assert.equal(match("#/blog").name, "blog");
    assert.equal(match("#/shipping").name, "shipping");
    assert.equal(match("#/size-guide").name, "sizeguide");
  });

  it("captures a product id", () => {
    const route = match("#/product/p3");
    assert.equal(route.name, "product");
    assert.equal(route.params.id, "p3");
  });

  it("falls back to home for anything unrecognised", () => {
    assert.equal(match("#/nope").name, "home");
    assert.equal(match("#/product/").name, "home");
    assert.equal(match("#/shop/extra").name, "home");
  });

  it("does not let a path separator into a product id", () => {
    assert.equal(match("#/product/../../etc").name, "home");
  });
});
