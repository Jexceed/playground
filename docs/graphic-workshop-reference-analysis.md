# 图形工坊参考分析与出题边界

Created: 2026-07-07

This note records the current source-of-truth interpretation of
`references/001上实幼升小资料合集` for the first 图形工坊 implementation.

## Source Corpus Summary

- `2024上实机考模拟题【学生版】.pdf`: closest to app-native format; contains visual search, classification, matrix completion, folder-grid placement, overlay matching, and short visual memory.
- `上实100机考真题（22年）` and `上实习题/*.jpg`: strongest source for visual-reasoning distractors; repeated patterns include same count but wrong position, same outline but wrong color, correct rotation but mirrored direction, and one-attribute-only near misses.
- `31页搞定上实幼升小逻辑推理题.pdf`, `上实幼升小常考七大专题密训.pdf`, and `图推1000题`: useful for task taxonomy and difficulty ladders, but too worksheet-like or abstract to copy directly.
- `学而思幼升小计算衔接课`: useful for decomposing operators such as observation, number pattern, memory, substitution, and spatial imagination.
- `百花思维训练`: useful for low-age observation and paper-pencil operations, but many tasks are not app-native.

## First-Pass Taxonomy

图形工坊 owns task families where the child primarily needs visual processing
that is not already owned by 逻辑屋. The first implementation deliberately avoids
plain exact matching, repeated visual patterns, row-column grids, ordinary
part-whole missing pieces, arrow rotation, and short visual memory because those
operations already exist in 逻辑屋.

The current first pass keeps six drawn families with eight rounds each. Each
round must show a drawn stem and four drawn A/B/C/D answer choices; abstract
labels, generic token cards, and text-only choices are not acceptable.

The rendered colored figures use local image-gen sticker assets from
`public/images/items/graphic-workshop/`. Dynamic operations such as silhouettes,
occlusion covers, overlap positioning, code-table grouping, and missing-edge
masks are composed in the renderer from those local assets so the questions stay
auditable while avoiding crude geometric placeholder art.

- `影子配对`: match a colored object to its silhouette by outside contour,
  ignoring color and decorative detail. Distractors use nearby animal or object
  outlines such as long ears versus short ears, fish tail versus leaf point, or
  apple leaf versus plain circle.
- `遮挡还原`: infer a hidden whole from visible edges, corners, ears, leaves, or
  other partial cues. Distractors share one visible feature but fail on the
  covered part.
- `局部找整体`: use an enlarged local feature such as an ear, tail, leaf, sharp
  point, or rounded corner to identify the whole object. Distractors are complete
  figures with similar local edges, so the child must compare the exact feature.
- `透明叠叠板`: compare two transparent shapes and choose the correct overlap
  result. Distractors reverse top/bottom order, shift the overlap center, or swap
  one shape for a nearby outline.
- `图形密码机`: read a drawn graph-to-graph mapping table and choose the mapped
  answer for a query shape. Distractors are valid mappings from neighboring rows.
- `缺口补一补`: use an incomplete outline to identify the whole shape that can
  close the missing edge. Distractors share a nearby edge or corner but fail on
  direction, curve, point, leaf, or tail.

These are separate from:

- `数字岛`: quantity, comparison, grouping, and arithmetic meaning.
- `逻辑屋`: rules, conditions, evidence, planning, priority, and explanatory reasoning.

## Reinforcement Rationale

Existing-world reinforcement is intentionally capped for this first pass.
The source corpus contains many numeric and logic-adjacent drills, but adding
them all would create redundant volume.

Current additions are limited to three `logic-number-pattern-trail` rounds:

- before/after skip-counting: `6, 8, 10, 12, ?, 16`;
- descending even-number pattern: `18, 16, 14, ?, 10, 8`;
- middle missing step with a +3 rule: `3, 6, 9, ?, 15`.

These stay in 逻辑屋 because their core assessment is numeric sequence reasoning,
not visual-spatial manipulation. They differ from earlier rounds by asking the
child to confirm a missing middle value from both sides or to count backwards by
a step larger than one.

## Distractor Rules

Use distractors that represent plausible child mistakes:

- same outline family but wrong corner or edge type;
- visible part confused with the covered whole;
- local detail matched to an attractive but wrong whole;
- same rounded edge but missing the leaf, ear, tail, or point that identifies
  the whole.
- top layer and bottom layer reversed;
- code-table mapping read from the neighboring row;
- missing edge direction confused with a similar curve or point.

Avoid:

- trick wording;
- double negatives;
- unrelated distractors;
- adding many icon-swapped copies of the same task.

## Follow-Up

Future passes should keep this boundary explicit. If a visual-spatial 逻辑屋
cluster such as matrix, memory, route, address, position, rotation, part-whole,
mirror, or three-view is migrated later, it should happen through a separate
Spec Kit feature instead of being duplicated under 图形工坊.

Layer, code, and closure families are now included only because they have
dedicated drawn stems and drawn answer choices. Future 图形工坊 families should
meet the same standard before being added.
