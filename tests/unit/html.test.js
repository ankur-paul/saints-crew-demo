import { strict as assert } from "node:assert";
import { describe, it } from "node:test";

import { cx, escapeHtml, html, raw } from "../../src/lib/html.js";

describe("html", () => {
  it("escapes interpolated text", () => {
    const evil = '<script>alert("x")</script>';
    assert.equal(String(html`<p>${evil}</p>`), "<p>&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;</p>");
  });

  it("escapes quotes so an attribute cannot be broken out of", () => {
    assert.equal(String(html`<a title="${'" onclick="steal()'}">x</a>`), '<a title="&quot; onclick=&quot;steal()">x</a>');
  });

  it("renders null, undefined and false as nothing", () => {
    assert.equal(String(html`a${null}${undefined}${false}b`), "ab");
  });

  it('renders true as "true", so aria-pressed="${on}" works', () => {
    assert.equal(String(html`<b aria-pressed="${true}"></b>`), '<b aria-pressed="true"></b>');
  });

  it("joins arrays with no separator", () => {
    assert.equal(String(html`${[1, 2, 3]}`), "123");
  });

  it("nests without double-escaping", () => {
    const inner = html`<em>${"a&b"}</em>`;
    assert.equal(String(html`<p>${inner}</p>`), "<p><em>a&amp;b</em></p>");
  });

  it("lets raw() through untouched", () => {
    assert.equal(String(html`${raw("<br>")}`), "<br>");
  });
});

describe("escapeHtml", () => {
  it("covers every character that can change parsing", () => {
    assert.equal(escapeHtml(`&<>"'`), "&amp;&lt;&gt;&quot;&#39;");
  });
});

describe("cx", () => {
  it("drops falsy names", () => {
    assert.equal(cx("a", false, null, undefined, "b"), "a b");
  });
});
