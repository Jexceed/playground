import { readFileSync } from "node:fs";
import test from "node:test";
import assert from "node:assert/strict";

const appSource = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const stylesSource = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

test("growth record caps visible ability tags and reports hidden count", () => {
  assert.match(appSource, /const maxVisibleProgressTags = 12;/);
  assert.match(appSource, /const visibleProgressTags = progress\.abilityTags\.slice\(0, maxVisibleProgressTags\);/);
  assert.match(appSource, /const hiddenProgressTagCount = Math\.max\(0, progress\.abilityTags\.length - visibleProgressTags\.length\);/);
  assert.match(appSource, /visibleProgressTags\.map\(\(tag\) =>/);
  assert.match(appSource, /hiddenProgressTagCount > 0/);
  assert.match(appSource, /还有 \{hiddenProgressTagCount\} 个/);
});

test("growth record overflow marker is visually subdued", () => {
  assert.match(stylesSource, /\.tag-list \.tag-overflow\s*\{/);
  assert.match(stylesSource, /\.tag-list \.tag-overflow\s*\{[\s\S]*background: #f2f4f7;/);
});
