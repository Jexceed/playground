# Curriculum Integrity Audit Contract

`pnpm audit:curriculum` exits 0 only when:

1. Every game/choice-count bucket has max-minus-min position count <= 1.
2. No bucket repeats one correct position more than twice consecutively.
3. Graphic choice values and drawn option values have identical order and labels A-D.
4. Known answer-leaking bridge and rotation wording is absent.
5. Spilled-water tasks seek direct evidence rather than accusing the nearest character.
6. Clock guidance mentions `时针（短针）` before `分针（长针）`.
7. Manifest provider/voice are standard Edge Xiaoxiao, failures are empty, and
   all entries use the standard directory.
8. Every file below `public/audio/voice/zh-CN/` is referenced by the manifest.

Failures identify the game/round or asset path and violated rule.

