import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const appSource = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

test("world switcher exposes expanded and collapsed states", () => {
  assert.match(appSource, /activeWorld === world\.id \? "active expanded" : "collapsed"/);
  assert.match(appSource, /aria-expanded=\{activeWorld === world\.id\}/);
});

test("collapsed world buttons are compact and hide summaries", () => {
  assert.match(stylesSource, /\.world-switcher\s*\{[\s\S]*gap: 6px;/);
  assert.match(stylesSource, /\.world-button\.expanded\s*\{[\s\S]*min-height: 70px;/);
  assert.match(stylesSource, /\.world-button\.expanded > span:not\(\.world-icon\)\s*\{[\s\S]*grid-template-areas:[\s\S]*"title count"[\s\S]*"summary summary"/);
  assert.match(stylesSource, /\.world-button\.expanded em\s*\{[\s\S]*grid-area: count;/);
  assert.match(stylesSource, /\.world-button\.collapsed\s*\{/);
  assert.match(stylesSource, /\.world-button\.collapsed \.world-icon\s*\{/);
  assert.match(stylesSource, /\.world-button\.collapsed small\s*\{/);
  assert.match(stylesSource, /\.world-button\.collapsed small\s*\{[\s\S]*display: none;/);
  assert.match(stylesSource, /\.world-button\.collapsed\s*\{[\s\S]*min-height: 40px;/);
  assert.match(stylesSource, /\.world-button\.collapsed > span:not\(\.world-icon\)\s*\{[\s\S]*display: flex;/);
});
