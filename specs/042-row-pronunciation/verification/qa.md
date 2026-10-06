# Row pronunciation verification — 2026-10-06

## Delivered behavior

156 exported row/column voice entries now have explicit hang2 synthesis input. The internal homophone 航 is used only for the synthesis/fallback input; the question, accessible labels, original lookup text, IDs and progress data retain their original wording. Protected xing words are unchanged, including when they share a sentence with a row reference.

`row-lines.json` contains the complete reviewed corpus: 182 entries containing 行, 156 row-context entries and 26 preserved xing entries. An initial review caught four whole-row occurrences (一整行) omitted by the first rule draft; the rule was extended, four affected clips regenerated, and the final ledger has no unclassified occurrence. The first generation log is retained as intermediate evidence, not the final pack claim.

## Pack and regression checks

- `tests-before.log` records two row-reading failures against the identity preparation function. `tests.log` has **34 passing regressions** covering contextual readings, protected meanings, locale/idempotence, filename cache identity, original-text local hits, missing/failed-media fallback, cancellation, required listening, media pruning and navigation.
- `voice-generation-final.log`: **4043 entries, zero failures**, Edge `zh-CN-XiaoxiaoNeural`, rate -12%, pitch +2Hz; existing English locale voices retained. No macOS say or mixed-local fallback.
- `pack-comparison.json`: all original voice-line text, IDs, contexts and locale values are unchanged; **156 new URLs** and **3887 unchanged URLs**. All 26 protected xing clips are byte-identical to the prior pack. Of the newly synthesized row clips, 139 have different bytes and 17 match the prior bytes; the latter are not claimed to have contained an audible error before.
- `old-row-voices.json` preserves the prior entry metadata and audio hashes. `voice-prune.log` records removal of obsolete original and intermediate files. Current runtime assets are all referenced by the final manifest.
- `voice-audit.log`: all **4043** files pass media integrity/duration checks. `curriculum-audit.log`: **115 groups / 1110 rounds, zero problems**, including current pronunciation metadata/filename checks.
- `mac-install.log` includes a successful production TypeScript/Vite build, native bundle, signing and installation. `mac-integrity.txt` confirms matching built/installed executable SHA-256 `c636446d850cfba7d716d038a563da68dba30b2dcd0389fc434469fd390a249a` and strict deep signature validation. This remains a local signed build, not a public notarization claim.

The optional segment-generation path applies the common full-text preparation before splitting and records spokenText. There are zero active segment entries in this release; no new segment pack was generated or acoustically accepted here.

## Native integration

The actual `/Applications/小小思考屋.app` was quit before replacement and reopened after installation. Startup retained 探索 / 看过哪些朋友 / round 1. Native UI checks exercised:

- 图形补一补: the visible instruction still says “先读完整的第一行”; its 听题 and 听家长提示 controls were exercised (`native-row-*.txt`, `native-row-question.jpg`).
- 地图找宝物: the visible instruction still says “字母行”; its 听题 control was exercised (`native-letter-row-*.txt`, `native-letter-row-question.jpg`).
- Original section/group entry restored afterward; completion totals remain **273/489 enlightenment** and **74/621 exploration**. No correct submissions, hint/reveal or clear-progress actions were used.

These native records establish current installation, original display text and control integration. They do not prove that a listener heard a particular phoneme. Original-text lookup and corrected-URL behavior are independently covered by the speech regression harness and current manifest audit.

## Acoustic boundary and review samples

The current assistant tool returned “audio content omitted because you do not support audio input” when attempting to inspect the short generated sample. Therefore no model-heard acoustic pass is claimed. A user audition question was sent with `pronunciation-sample.mp3`; no listening confirmation has arrived at the time of this record.

Retained actual pack samples:

- `before-rows.mp3` / `after-rows.mp3`: 第一行 2 块，第二行 1 块，一共 3 块。
- `before-letter.mp3` / `after-letter.mp3`: A1 是 A 行 1 列，格子里是小鸟。
- `after-matrix.mp3`: 空格里应该放什么？先读完整的第一行，再用同样规则补第三行。
- `pronunciation-sample.mp3`: a separate short synthesis probe containing 第一行、第二行、第三行 and 开始行动.

The engineering correction, regenerated assets and installation are verified; **human listening confirmation remains pending**. This work does not close the existing full acoustic-review or other-polyphonic-word TODO.
