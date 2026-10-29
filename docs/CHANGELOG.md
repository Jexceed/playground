# Changelog

## 2026-10-30

### Validate the everyday-English delivery checkpoint

- Kept the frozen 040–059 curriculum snapshots intact while explicitly separating 060's three new groups, twelve activities and six scene registrations from historical comparisons. Guard tests ensure unknown additions, old-content changes and reused identities cannot disappear from those comparisons.
- Re-ran the complete regression suite: 295/297 passed. The same two existing failures reproduce with source and tests from `8fb7e58c`; no additional failures remain. Build, curriculum, illustration and voice-media audits pass. See [commit validation](../specs/060-everyday-english/verification/commit-validation-2026-10-30.md).

## 2026-10-29

### Use the logo girl in everyday English scenes

- Replaced the boy in all six everyday-English situations with the current logo's girl: high ponytail, pink hair tie, cream top and pink overalls. The zipper-help scene retains the teal jacket; the blue-dress friend remains distinct. Original gestures and situation clues are preserved.
- Aligned image descriptions and Chinese pronouns with the girl. Re-exported and checked all 4397 Edge voice lines; seven superseded male-pronoun files were backed up outside the runtime directory. The 12 activity IDs, accepted answers, English dialogue and parent-observation rules are unchanged.
- Kept original and edited image sources, exact prompts and hashes. See [061 validation](../specs/061-family-girl-character/verification/acceptance.md) for build, curriculum, media and Mac checks.

### Add illustrated everyday English to Language Garden

- Added “英语日常说” under 探索 → 语言花园, with three groups: 见面与告别、谢谢与抱歉、我需要帮助. Six illustrated situations each have a choice activity and a parent-child conversation, covering 11 distinct model expressions. Speaking is recorded through parent observation, without automatic pronunciation scores.
- Added six local 1200×675 picture-book scenes, their generation originals and prompt records. Each activity shows one situation; English options use text and audio, and completed choices give way to bilingual dialogue examples.
- Added explicit English pronunciation for option cards and individual dialogue playback. Existing English listening questions retain replay after completion without clearing the answer.
- Kept the 71 reference-aligned families / 597 activities unchanged. Exploration now contains 78 groups / 633 activities, including 24 pilot and 12 original supplement activities; reference audit totals now distinguish those scopes.
- See [060 validation](../specs/060-everyday-english/verification/acceptance.md) for build, resource, regression and native installation evidence. Parent-child play calibration remains pending.

## 2026-10-26

### Record the 053–059 delivery checkpoint

- Saved the current interaction, picture, speech and readability changes with their specifications and review evidence. Feature 059 remains in progress; its remaining 91 groups retain their review tasks.
- Re-exported 4287 voice lines and verified the matching Edge manifest, curriculum and illustration audits, production build, and a fresh Mac installation. The installed app reopens the existing word-picture activity and displays its local enlarged image.
- Ran all 282 regression tests: 280 passed. Both failures also reproduce with source and tests from `014a56a3`; the stale Douyin export and duplicate-path story-art assertion are recorded in TODO. See [checkpoint verification](../specs/059-chapter-readability/verification/commit-checkpoint-2026-10-26.md).

### Align equivalent text between curriculum sections

- Removed smaller exploration-only type rules. Question prompts, instructions, topic names, chapter names and stage labels now share the corresponding enlightenment sizes, including rule-machine and card-flip pages. Kept the restored question-number/count/progress-tag hierarchy.
- Adjusted only the exploration topic cards' inner spacing for full names. Checked all 115 navigation labels at the current Mac size, a long prompt and the toy-specific styles; rebuilt, installed and compared the same enlightenment/exploration pages in the native app without altering progress.

### Restore the original type hierarchy

- Corrected the interpretation of “no small-print instructions”: removed the blanket 18px rule and restored 268 mechanically enlarged declarations to their saved pre-review values. Question navigation, stage labels, counts, progress tags and supporting controls again use their original hierarchy; the original font family was never changed.
- Restored compact exploration topic buttons and natural spacing around chapter counts while retaining aligned completion marks. Kept local images, playable models, answers and progress intact. Essential task cues use a local 16px style rather than scaling the whole interface.
- Removed duplicate standing instructions and the small-print footnote from matching pages; the main instruction remains, and contextual guidance appears after selecting a card. Existing unlink, undo, clear and narration remain available.

### Fix the current Mac chapter list and continue the visual review

- Fixed completed chapter rows pushing the question count onto a new line. The completion mark, left-aligned title and count now occupy stable columns. Removed the repeated “动手” prefix from exploration counts so ordinary titles fit; kept the frame, font sizes and colors. The current-window navigation audit covers all 115 chapter entries, including a completed row.
- Replaced the two static groups in all 12 “小鸟飞走了” questions with one branch scene. The authored number of birds visibly flies away, the others stay in place, and children can return to the beginning. Added two local image_gen assets and 19 Edge voice lines; existing questions, answers and progress remain unchanged.
- Fixed native clock rounds 7–9 being blocked by preloading unused historical pictures. Readiness now follows the pictures actually used by the model; real picture dependencies still load before answering. Enlarged model views now enlarge the clocks and objects themselves.
- Completed browser review of the remaining seven enlightenment math chapters, bringing the math review to 24 groups/266 questions. Full content review of the other 91 groups remains tracked in [059](../specs/059-chapter-readability/verification.md). Completed the previously blocked installed-app contour and word-picture checks.

## 2026-10-25

### Improve reading size and begin the chapter-by-chapter review

- Raised 268 undersized CSS declarations to at least 18px, enlarged primary exploration instructions/actions, and let long chapter names wrap. Kept the existing palette and button styling; compact world navigation now gives names a full row.
- Fixed narrow-screen clipping in counting comparison panels and object groups. Moved bridge gap/material text out of shrinking SVGs, enlarged covered-image text, and checked all 12 enlightenment clock rounds at desktop/375px, including feedback and four time-conversion scenes.
- Started the full 115-group/1110-round review in [059](../specs/059-chapter-readability/spec.md). Initial desktop and mobile states were collected for every group; later rounds, memory/listening phases, embedded bitmap text and remaining model improvements are still tracked as pending. This checkpoint is not completion of the whole review.

### Replace abstract word cards with concrete paired pictures

- Redrew 高/低 as one kite above/below the same tree, 上/下 as the same kitten on/under one table, 长/短 as the same pencil at a fixed scale, and 多/少 as six/two strawberries on the same plate. Eight local image_gen assets replace 22 references across six “词语有朋友” matching rounds; the clear open/closed boxes remain.
- Enlarged only E01 picture cards and retained one readable word per card. Matching, speech, answers, identities, progress, the three parent-observation activities and shared buttons remain unchanged. Full comparison canvases prevent the short pencil from being enlarged to the long pencil's size.
- Audited 32 exact relative-word token uses and related comparison/reasoning contexts. Prompts, originals, hashes, the visual review and delivery checks are recorded in [058 verification](../specs/058-concrete-word-pictures/verification.md).

### Redraw the visual-closure contours

- Redrew the ten shapes used by all eight “缺口补一补” rounds with balanced proportions, smooth curves and consistent line weights. Enlarged the main figure and answer figures while keeping the existing cards and controls.
- Replaced the dotted full outline and generic erasing rectangle with one exact missing interval in the shared contour. The apple now genuinely loses its top edge and leaf, the fish loses its tail, and the flower has a clean unified perimeter. Stem and complete options share their geometry.
- All 1110 question records and 4259 voice lines remain unchanged. Verification, the eight-round review sheet and Mac installation evidence: [057 verification](../specs/057-contour-redraw/verification.md).
- Completed the previously blocked native acceptance for 054–056 after unlock: number-walk same-cell/undo/clear, chess trial/independent selection, and island bridge deficits/excess/fixed-bridge reset. No native answers were submitted, and the prior positions were restored.

## 2026-10-24

### Show each island's bridge requirement as countable slots

- All nine “小岛连桥” rounds now explicitly label “要 N 座桥” and show N bridge slots. Built bridges fill the slots, empty slots remain visible, and excess bridges appear separately in red with “多 N 座”. Replaced the ambiguous bare target number and “已连” overlay with “还差 / 刚好 / 多”.
- Added a pictured example of one bridge counting at both ends, per-island target narration and matching hints/feedback. Existing bridges, double bridges, edge cycling, island-to-island input, undo, clear and global connectivity/crossing evaluation stay intact. Six-island maps scroll locally on narrow screens; shared controls keep their theme.
- Fixed Edge voice-cache reuse after changes beyond a truncated voice-line ID. Cache reuse now also requires the previous full text, spoken text, locale, voice/rate/pitch and source path to match. Regenerated the six confirmed affected prompts and saved before/after hashes and durations.
- Verification, visual states and Mac installation status: [056 verification](../specs/056-island-bridge-goals/verification.md).

### Make empty chess squares and independent trial moves explicit

- Replaced all nine “棋盘下一步” numbered reference boards and repeated small answer diagrams with one large interactive board. Fixed black/white pieces, dashed empty candidate circles and the single highlighted trial stone have distinct appearances; position numbers no longer fill empty squares.
- Clicking a candidate only tries one black stone. “选这个空格” records the independent choice, then removes the trial stone. Other selections remain check marks, so several answers never create a misleading simultaneous winning line. Original candidate sets, answer IDs, positions and scoring are preserved.
- Added pictured three-in-a-line and capture rules, local spoken instructions, keyboard operation and responsive layouts. Existing shared confirm/reset/clear styles remain in use. Browser cases, tests and Mac installation status: [055 verification](../specs/055-board-move-clarity/verification.md).

### Put the two walking friends on an interactive number path

- Replaced all nine “两位朋友走格子” abstract reference strips and repeated number-card trays with a pictured model. Rabbit and puppy pieces stand on their actual starting squares; one- or two-square direction diagrams and paired footprints show the move size and number of turns.
- Children select a friend and click a number square, or drag the piece there. Both friends can occupy the same square without obscuring each other or its number. Initial pieces show their starts without filling an answer; shared undo, clear and evaluation remain in charge.
- Kept the shared frame/button theme, existing question identities, revisions, answers and progress. Reused registered local character art. Narrow screens keep one continuous path with local horizontal scrolling and at least 46×48 px number targets.
- Spoken instructions now begin with the actual start/direction/turn rules; each pictured rule can be replayed. Rebuilt local Edge prompts. Verification and Mac delivery: [054 verification](../specs/054-number-walk-model/verification.md).

## 2026-10-23

### Speak the actual flip instruction first

- All nine “翻牌小机关” rounds now begin their entry/read-again narration with the actual ordered operations, such as “第1步，翻第3张。”. Removed the three generic spoken lead-in sentences from this narration so the child hears the required action immediately.
- Main narration, individual step buttons, curriculum clues and voice export share the same structured-step formatter. Repeated targets in three-step rounds remain spoken in order. Question content, answers, artwork and saved progress are unchanged.
- Regenerated the local Edge prompt clips and removed nine superseded clips. Verification and Mac installation evidence: [053 verification](../specs/053-card-flip-speech/verification.md).

### Restore shared controls and complete the image review

- Restored the rule-play confirm/reset/clear colors, borders, shadows and corner radii to the shared theme. The machine’s demonstration buttons use the existing green accent again. Picture styling is confined to the activity artwork.
- Reviewed all 1176 existing image files, 74 registered illustration frames and the old SVG glyph routes. Added 16 original local image_gen assets, reused appropriate detailed pictures for old fallback routes, and refined 111 generated quantity/clock/phonics/facing/reference images while retaining all 858 authored drawing models.
- Added actual island art and clearer bridge surfaces to “小岛连桥”; node locations, edge paths, bridge counts and input behavior stay data-driven. Existing precise bridge, grid, projection and silhouette drawings were retained with review reasons.
- Improved quantity pictures in comparison and memory surfaces, separated crowded Hanzi/pinyin references, and fixed mobile phonics-card squeezing. The 1110 question contracts and 4224 existing voice entries remain unchanged.
- Added rendering and shared-style guards; preserved historical baselines with exact declared-change normalization. Validation, the image ledger and local Mac installation evidence are in [052 verification](../specs/052-art-review-framework-guard/verification.md).

### Redesign the rule toys with generated artwork

- Rebuilt the two exploration boards around four original transparent image_gen sprites: a jade wooden machine, maple tray, ivory cloud card and golden sun card. Exact counting chips, answers and card positions remain controlled by the activity data.
- Replaced nested grey-green boxes with a warm toy-table composition, quieter borders, terracotta controls and coordinated typography. The machine itself is the demonstration control; wooden cards flip in 3D and preserve keyboard, undo and reset behavior.
- The 18 activities retain their content, IDs, answers, progress and all 4224 existing local voice entries. Source images and generation prompts are saved beside the registered runtime assets. Validation and installed Mac screenshots are recorded in [051 verification](../specs/051-rule-play-art/verification.md).

### Make rule learning and card flipping concrete

- Reworked all 18 “学会新规则 / 翻牌小机关” exploration activities. Children add local picture chips in a small example, see a second equal group for doubling, then choose among actual quantities. Card flipping now happens directly on large cards, with a visible initial reference, pictured operation order, an independent practice card, undo and reset.
- Replaced repeated small instruction strips with short, larger labels and spoken controls. Example narration and the new question are separate; replay preserves the selected answer. Five-chip trays adapt to narrow screens, and keyboard/reduced-motion support is included.
- Preserved IDs, revisions, answer values, option ordering and stored progress. The other 579 authored exploration activities compare unchanged. Existing registered PNG chips are reused.
- Passed 28 focused regressions, production build, the 115-group / 1110-activity curriculum audit, and all 4224 aligned Edge voice entries with no failures or fallback. Browser interaction checks cover every changed question; native installation and checks are recorded in [050 verification](../specs/050-concrete-rule-play/verification.md).

## 2026-10-20

### Fix enlightenment replay and end-of-group navigation

- Fixed “完成关卡” appearing in the middle of previously completed groups and leaving children on the same question. Every non-final correct answer now offers “下一题”, independently of historical completion.
- At the last question, continue to the first missing question or start the next group in the same theme at question 1. Search filters and the next group's old resume position do not change that destination. The theme's final group shows visible completion feedback and “再玩一遍”.
- Passed 45 related regressions, including navigation checks across all 40 enlightenment groups, production build and curriculum audit. Browser checks covered replay, gap recovery, filtered next-group navigation, reload, wrong answers, memory and timed observation. The rebuilt Applications app passed real question/group transitions, final completion and replay checks; existing completion stayed 274/489 and the original position was restored.
- Curriculum content, answers, pictures and the 4210 aligned Edge voice entries are unchanged. Evidence: [049 verification](../specs/049-enlightenment-next-round/verification.md).

## 2026-10-19

### Use main as the default working branch

- Fast-forwarded the validated curriculum and interaction work through `f8157e7c` onto `main`, following the user’s explicit request. Future routine work and requested pushes default to `main`; existing branches and unrelated local files are preserved.

### Let children measure and build bridges directly

- Replaced the eight “桥怎么搭” thumbnail-choice screens with one large interactive scene. Children connect two endpoints in round 1, then select and place real-length boards in rounds 2–8; misplaced boards can be taken back or replaced without restarting the group.
- Water gaps, available boards and placed boards share one scale. Each physical board has its own identity, including equal-length pieces. Feedback points out the missing span; round 5 accepts both valid arrangements. Success moves the bear across the completed route, with replay and current-round reset controls.
- Simplified only these eight rounds' wording and retained IDs, model data, answer values, option order and saved progress. Exported 4210 aligned local voice entries with no failures or fallback.
- Passed 81 regressions, build and curriculum/illustration/voice audits. Browser checks covered all eight rounds and interaction boundaries at Mac-sized viewports; the rebuilt installed Mac app passed task/wrong/correct checks for all eight. Completion stayed 274/489 and the original question was restored. Evidence: `specs/048-hands-on-bridge/verification.md`.


### Make Logic House pictures readable for young children

- Replaced the eight labeled-basket choices with direct color/shape groups and enlarged the target card. Updated wording consistently while preserving stable answer values and progress.
- Restored a concrete river story for six everyday length/repair questions, using two matching, word-free image_gen scenes with a visible short-plank gap and a successful long plank. Material choices use large local plank pictures; measured bridge tasks retain exact geometry and gain shorter labels and larger numbers.
- Removed repeated animal pictures and text badges from eight evidence judgments. Choices now use one short, spoken label; factual animal/location choices keep the relevant scene crops. Reviewed text changes affect 29 rounds.
- Passed 74 regressions, build, curriculum/illustration/voice checks, and 229 browser states across 62 relevant rounds at 1280×788. The updated Mac app was installed and checked on 20 representative rounds; completion stayed 274/489 and the previous question was restored. All 4171 local voice entries align without failures or fallback.
- Added explicit child-understanding and single-layer option rules to AGENTS.md. Evidence: `specs/047-child-readable-logic/verification.md`; actual child play remains separate from engineering acceptance.


### Complete the Logic House visual review

- Reviewed every enlightenment Logic House group: 26 groups / 319 rounds. Updated 126 round surfaces and retained 193 with documented reasons. The original question IDs, wording, options, answers and all other curriculum data remain unchanged.
- Added current situations, equally illustrated options and distinct correct outcomes to 43 condition/repair/priority/evidence questions. Wrong-handwashing, red-light and mixed-storage sequences are shown as the current problem; successful explanations demonstrate the correction. Evidence choices use crops from the actual scene, and the weak-cat scene no longer places the missing cake slice on a nearby plate.
- Added task conditions to all 14 packing questions, exposed missing analogy targets, and paired each of the six changing color rules with matching action pictures. New story artwork was produced by gpt-6.1-sol agents through built-in image_gen; exact quantity, height and bridge candidates remain data-driven diagrams.
- Illustrated quantity, height, positional-card, basket and all bridge choices. Corrected three-icon wrapping, two-column matrix layout, cramped comparison cards and mirror-axis presentation. Explicit plate-serving tasks now show food going onto the plate before eating, including order-plan rounds 10/16. Larger bridge models remain available through a picture viewer.
- Browser checks cover all 319 task surfaces and wrong/correct states for all 126 changed rounds; final results have no broken images or viewport/label overflow. Passed 70 regressions, production build and curriculum/illustration/voice audits. All 4182 local voice entries align without failures or fallback.
- Rebuilt and installed the standard Applications app, with matching executable hashes and valid strict deep signature. Native acceptance covered 49 distinct representative rounds across 15 groups, including 28 correct and two wrong submissions. Fixed an additional sibling-card overlap found in native screenshots, then rebuilt/reinstalled and rechecked all 12 comparison rounds. Completion remained 273/489 and the original question position was restored. Evidence: `specs/046-logic-house-visual-completeness/verification.md`.


### Complete all 24 order-plan story surfaces

- Extended the scene-first flow and completed-sequence playback from the three drinking questions to every question in “先做什么”. All 24 questions now have matching context, illustrated steps and equally illustrated answer choices; correct answers fill the blank and support pause, single-step viewing and replay.
- Added 16 initial scenes and 84 action cards using gpt-6.1-sol agents calling the built-in image_gen tool. Retained the eight drinking assets. The complete group uses 18 scene images and 90 action pictures for 84 step slots and 72 choice slots. Sources, prompts and crop metadata are stored beside the assets.
- Kept dirty-hand mistakes distinct from clean-hand steps, already-sorted toys distinct from sorting actions, dry sprouts distinct from healthy sprouts, and road-crossing pictures distinct from toy-bridge pictures. Redrew ambiguous block sorting, traffic pointing and unreachable-carrot cards after review.
- Fixed long-caption and five-step layout. Completed stories now show the filled sequence without repeating the disabled option row, so the long door/traffic questions retain readable pictures and visible controls/feedback.
- Preserved every question ID, sequence, choice, answer and existing progress. Only the other 21 order-plan rounds gain instruction/scene/story metadata; the three drinking rounds and all other curriculum content stay unchanged. Synchronized 4068 voice entries and retired only 24 unreferenced old order-plan prompt files.
- Passed 52 related regressions, build and curriculum/illustration/voice audits. Browser and installed Mac acceptance each covered all 24 questions in scene/task/completed states (72 states each). The standard Applications app was rebuilt, installed and verified; enlightenment completion remained 273/489. Evidence: `specs/045-order-story-completion/verification.md`.


## 2026-10-18

### Restore drinking-story context and visible action sequences

- Traced the scene regression to `940271cb`: all 24 order-plan scene references were removed. The drinking questions previously borrowed a handwashing/snack picture, so the correction uses two matching initial scenes instead of restoring that mismatch.
- Restored context for `logic-order-plan-1/-9/-18`. Children first see the situation, then open the missing-step task; they can return to the scene without losing their answer. Added six local action pictures for thirst, taking a cup, pouring, drinking, taking another cup and carrying an empty cup.
- Correct answers now fill the blank and show a paced four/three-step demonstration with pause, previous/next, card selection and replay. Reduced-motion settings disable autoplay and visual transitions. Incorrect answers keep the gap. Navigation/reset cancels the previous playback.
- Stable IDs, choices, answers and existing progress remain unchanged. Other enlightenment questions and all exploration content are unchanged. The other 21 order-plan contexts remain a separate visual-content follow-up; this is not a full restoration of that group.
- Passed production build, curriculum audit, 46 targeted regressions and all 4055 voice-media checks. Standard Edge voice export/manifest align with no failures or macOS/mixed-local fallback. Rebuilt/installed the Applications app and completed targeted native context/playback/input checks. Evidence: `specs/044-drinking-sequence-story/verification.md`.


All meaningful project changes should be recorded here. Keep entries factual and
grouped by date.

## 2026-10-11

### Curriculum clarity and picture-card corrections

- Corrected 34 enlightenment rounds: equal two-picture matrix choices, coherent rotation evidence, explicit sorting/crossing goals, relevant distractors, and genuine two-condition classification. Stable question IDs and answer values remain unchanged.
- Corrected 50 exploration activities: upfront flip/capture rules, accurate square and oriented three-view diagrams, current-direction feedback, explicit calendar/blank-card/material instructions, natural story language, and visual support for antonyms. Eighteen substantive corrections use revision 2; earlier records remain available.
- Generated and installed three image-gen cards: a clear seed-entering-soil action plus the same box open and closed. The other three planting frames and original sheet/source remain unchanged. Antonym comparison cards reuse exact generated local diagrams.
- The current registry contains 18 illustration resources / 74 used cards. Exported and generated 4,055 local voice lines with no failures; Chinese uses Edge Xiaoxiao and existing English uses Jenny. No macOS say or mixed-local fallback remains.
- Validation and native installation evidence: [043 verification](../specs/043-curriculum-review-fixes/verification.md).

## 2026-10-06

### Context-specific pronunciation for 行

- Reviewed all 182 exported lines containing 行. Added speech-only hang2 preparation for 156 row/column lines (including numbered rows, A/B rows, whole rows and row/column rules), while preserving 26 lines containing xing meanings such as 行动、执行、自行车、平行 and 可行. Display text, lookup text, IDs, questions and progress are unchanged.
- Exported auditable spokenText metadata and regenerated the affected standard Edge clips under fingerprinted URLs so old pronunciation files cannot survive through generator/app cache reuse. Browser fallback and optional Chinese segmentation use the same preparation; audits reject stale metadata and filenames. The other 3887 clip URLs are retained, and the 26 protected xing clips are byte-identical.
- Passed 34 regressions, curriculum audit, all 4043 media checks and production build. Installed the updated Applications app and exercised row-question/parent listening controls while preserving 273 enlightenment and 74 exploration completions. Provider remains Edge Xiaoxiao with zero failures and no macOS/mixed-local fallback. Actual audition samples are retained; human listening confirmation is pending, and media/native-button checks are not represented as acoustic proof. Evidence: specs/042-row-pronunciation/verification/qa.md.

## 2026-10-05

### Resume each question group

- Each enlightenment and exploration group now remembers its last visited question by stable ID. Launch still restores the most recent section/group; returning to another group restores its own position. Re-clicking the current group or theme keeps the pending selection, while an explicit “从头来” resets only that group's remembered position.
- Migrated known section-level and legacy positions into navigation schema 2 without changing completion/attempt stores. Removed questions fall back to the beginning of their own group; unknown/future/corrupt navigation payloads remain protected from overwriting. The enlightenment renderer now initializes directly on the restored round and observation state.
- Reproduced the first-question reset in the old native app, then verified group/theme/section navigation, old-position migration, explicit reset and quit/reopen in the rebuilt Applications app. Completion totals remained 273 enlightenment and 74 exploration rounds. Passed 31 related regressions, production build and curriculum audit; content, pictures and all 4043 voice entries are unchanged. Evidence: specs/041-group-resume/verification/qa.md.

## 2026-09-28

### Enlightenment content and interaction corrections

- Reviewed all 40 enlightenment groups / 489 rounds. Clarified missing daily-life conditions and evidence limits; corrected numeric pattern, container, comparison and clock wording. Counting targets, odd-card positions and code-table matches no longer share predictable fixed locations.
- Made observation child-triggered, hid occupied-cell clues during a timed glance, stopped question speech when observation starts, and added memory re-observation that clears the pending answer. Skipped rounds no longer create group completion or practice tags.
- Rebuilt eight bridge models with explicit distances/supports and added six local state/action symbols. Corrected triangle-ruler identity, open-door state, star sizes, local-detail crops, aligned opaque layer cards and exact closure contours. Kept all 621 exploration activities and their existing illustration frames intact.
- Removed conflicting or duplicate scene backdrops while retaining the actual illustrated task evidence. Revised dense map, grouping, comparison and graphic layouts; long parent/history content now scrolls within the support rail.
- All 489 authored answers were exercised in a separate browser test origin; a final 489-page pass at 1280×788 also checks full completion-history layout. Validation is recorded in specs/040-enlightenment-quality/verification/qa.md.
- Completed representative acceptance in the installed Mac app after unlock. Found and corrected intrinsic-grid scene clipping, then rebuilt and reinstalled; complete bridge models, scene/clock layouts, observation/review, changed graphics, feedback, local playback completion and quit/reopen recovery pass. Existing completion totals remain 273 enlightenment and 21 exploration rounds; original entry locations were restored. Detailed evidence and acoustic/child-validation limits are in specs/040-enlightenment-quality/verification/native/qa.md.

## 2026-09-26

### Larger picture cards with captions outside the frame

- Moved illustrated candidate-card borders onto the pictures and placed captions below the frame. Three-card rows now show 178px images instead of 132px; four-card rows use about 149px images, with 14px captions. The picture and caption remain one selectable/keyboard/drag target, with an independent enlargement button.
- Combined the duplicated reference/candidate pictures in the three L06 order-repair tasks. Their original reversed sequence is now the explicit candidate order, also used by the picture viewer; all original conditions and answers remain.
- Passed 90 regressions and curriculum/illustration/voice-media audits. The 621 exploration activities' nonvisual fields, enlightenment bank and all 4003 voice lines are unchanged. Rebuilt and installed the standard Mac app; detailed current-Mac UI and native status are in specs/039-picture-card-captions/verification/qa.md.
- Follow-up native inspection reproduced a WebKit regression: the image frame inside a button shrank to its caption's width, despite the earlier Chromium-sized browser pass. Moved visual layout outside the button and retained one transparent semantic hit target for image/caption input. The installed corrective app's startup, AX state and native screenshot now confirm equal large three-card pictures, outside captions and visible page controls. Browser input regressions pass; further native selection/drag checks were blocked when the Mac relocked. Evidence: specs/039-picture-card-captions/verification/native-fix/qa.md.

### Readable math evidence within the current Mac window

- Replaced tiny composite previews in 移一移比多少 and 变了样没变多 with two full-width comparison columns: 20px HTML headings and 30px countable dots. 凑十 comparisons now show large tens/ones and a 15px legend. Enlarged viewing preserves the same inputs and does not affect answers.
- Split elapsed-time clocks into independently displayed local images with larger numerals. Allocated more area to simple math evidence such as number structures, place value, equations, rulers and perimeter diagrams; retained the three-column shell and dense interaction layouts.
- Verified all 99 pages in the 11 related groups at 1280×788, plus representative wrong/hint/completed and enlarged states. Corrected six initial water/clock overflows. Passed 90 regressions and curriculum/illustration/voice-media audits; comparison against ac4b509 confirms every nonvisual field of all 621 exploration activities, the entire enlightenment bank and all 4003 voice lines are unchanged.
- Rebuilt and installed the standard Mac app. Native access is still blocked by the locked Mac; final native acceptance and dev push remain pending. Evidence: specs/038-readable-math-evidence/verification/qa.md.

### Complete task pictures and preparation materials

- Reviewed the current representation of all 75 exploration groups / 621 activities. Added 28 illustrated frames: six listening-story events, nine daily-use actions and thirteen preparation materials. All 15 atlases / 72 frames have active references; the previous 44 frames are preserved.
- Replaced text-only actions in A05/P01 with matching pictures. Matching cards now have an independent large-picture viewer; viewing keeps pending selections and existing connections. Enlarged action cards retain the current Mac one-page layout through hints and completion.
- Supplied E04 story ingredients and the spilled-water evidence scene, L07's nine color/shape cards and P06's tracing template. Corrected preparation lists and material pictures, including cylinders, transparent cups, flashlights and craft tools. Parent tasks with reference pictures show one step at a time and hide the reference during observation recording. G17 now shows a recognizable person facing the arrow, with a larger diagram.
- Revised ten parent activities while keeping stable IDs and historical facts. Regenerated local diagrams and Edge speech; 4003 voice entries have no failures or macOS/mixed-local fallback. Passed 87 regressions and curriculum/illustration/voice-media audits. Rebuilt and installed the standard Mac app; the Mac locked again before final native acceptance, so dev push remains pending. Evidence: specs/037-task-visual-completeness/verification/qa.md.

## 2026-09-25

### Larger story pictures and independent picture viewing

- Increased illustrated ordering choices from 80px to 132px and parent-story pictures from 84px to 136px. Completed sequences use 140px pictures. Put parent mode and preparation in one row and merged long-task step controls into one row, preserving the current Mac three-column layout.
- Added single-frame picture viewing with previous/next, arrow keys and Escape/return. Parent pictures open directly; candidate and placed cards have separate enlargement buttons. Viewing preserves selection, placement and attempts. A placed sequence is shown in the child's current order; hidden memory phases cannot open the viewer.
- Checked all 27 initial pages in E03/P02/L06 at 1280×788, plus ordering/complete, parent-step/hint/record and A05 listening states: no page overflow or broken images in the final pass. Passed 84 regressions and curriculum, illustration and voice-media audits. All 44 illustration frames remain in use; the Edge manifest has 3996 entries and no failures or local-provider fallback.
- Rebuilt and installed the standard Mac app; build and installed binaries match and strict signature checks pass. Final native UI acceptance awaits manual Mac unlock; dev push remains pending. Evidence: specs/036-story-picture-presentation/verification/qa.md.

### Complete planting-illustration integration

- Corrected the distinction between preserving an image file and integrating all of its frames. The fruit-salad atlas remained fully represented in the procedure tasks; two planting-preparation frames had never been referenced, and the planting sequence mixed in the separate received-seeds story.
- Mapped L06 procedures explicitly by variant and stable event ID. Planting now uses one coherent four-frame atlas, with matching pot/soil/seed wording; L06 rounds 1/4/7 use revision 2 while old facts remain. A05's existing planting-memory story now uses matching pictures from the same atlas; E03's received-seeds story is unchanged.
- Added per-frame usage auditing to the curriculum gate and a generated illustration entry guide. All 11 atlases / 44 frames are now referenced by renderable surfaces, up from 42. The original illustration files were preserved.
- Regenerated affected diagrams and standard Edge speech; 3992 voice entries have no failures. Passed 84 regressions and curriculum/media audits. Rebuilt and installed the standard Mac app; final native display acceptance awaits unlock. Current evidence: specs/035-illustration-frame-integration/verification/qa.md.


### Current-Mac exploration quality fixes

- Preserved the three-column shell and all 11 illustration atlases. Fixed the story-frame clipping regression; arranged dense options, reference comparisons, matching cards and parent steps so all 621 initial pages fit the current Mac content area. The full initial-page pass followed a 150-page first/last pass and included corrective rechecks for sixteen-cell reconstruction and three assembly variants. Targeted wrong/hint/partial/complete states also passed; this does not claim every state of every task.
- Rebuilt six folding questions with actual folded regions, directional arrows and consistent red-hole symbols. Made money-stock, shortest-route and two-marker constraints effective while retaining legal alternative answers.
- Enabled all intermediate pyramid cells and partial checks. Partial correctness is recorded as support, not completion; revised 24 activities to revision 2 and preserved earlier facts. Replaced the 60-rectangle jump with 3/6/9 grids and a marking, deduplication, undo and review tool.
- Replaced mechanical difficulty defaults with 71 explicit family profiles and actual workload descriptors across 597 activities. Parent scenario variants retain their own profile; all estimates remain uncalibrated by child play. Added an unfilled observation template.
- Regenerated local diagrams and Edge speech. All 3991 voice entries pass media checks, with no failures, macOS say or mixed-local provider. Passed 82 relevant regressions, all 597 authored answers and structural curriculum/reference audits. Completed native acceptance on the installed Mac app: 15 representative tasks, required-listening and memory hiding, parent-form editing, quit/reopen recovery, and preserved 273 enlightenment completions. Evidence: specs/034-current-mac-quality-fixes/verification/qa.md.

## 2026-09-24

### Current-Mac quality follow-up

- Reviewed commit 3660c2b without changing application code. Confirmed installed/build binary identity and exercised pairing, route undo, rotated placement, memory hiding and required listening in the real Mac app.
- Found a new story-atlas scaling regression and remaining dense-task/feedback overflow. Reconfirmed ineffective inventory/shortest-route/two-marker conditions, ambiguous folded-paper drawings and uncalibrated difficulty defaults; recorded adjustment priorities in specs/032-exploration-quality-audit/followup-2026-09-24.md.
- Fresh build, curriculum/media audits and 58 relevant regressions passed; 10,221 independent math/logic cases had no grading mismatches. These checks do not close the visual/content/difficulty findings. Final parent-form click/reset verification was interrupted by the locked Mac.

### One-screen exploration layout

- Restored the three-column desktop layout for 探索 (matching 启蒙): question navigation moved back to the right rail above the collapsible parent-guidance and growth-record sections; removed the horizontal navigation bar and stacked support panels from the center column.
- Compacted all nine activity kinds (spacing, evidence images 340→176px cap, option/tray/slot artwork 144–170→80–118px, memory stages, matching cards, graph map, parent materials strip and single-row observation records) so every sampled activity fits one 1280×820 screen. Measured overflow dropped from +53–667px to 0 across all worlds and interaction kinds; parent-observation pages fit even with both rail sections expanded.
- Realigned the exploration section header with the stage card and restored its tinted strip style; increased world-button padding in the sidebar so icons no longer touch the button edge.
- Verified with headless-Chrome measurements and screenshots at 1280×820, 102 passing node tests, tsc, production build and a clean curriculum audit (0 problems). Enlightenment layout unchanged (0 overflow).

## 2026-09-23

### Exploration quality and source-task audit

- Reviewed all 71 newly authored families and the 24 pilot activities, verified all 121 source-file hashes, and recorded concrete source-task gaps. The current 75 groups / 621 activities are an authoring count, not full source coverage. Eight families have their core mechanism; 63 remain partial, and neither status implies all original tasks or child-age calibration.
- Fixed answer-revealing generic choice labels, invisible layer-order constraints rejecting equivalent pictures, inconsistent fraction wholes, numeric/parity answer boundaries, and a parent guessing task that disclosed its target. Stable activity IDs and legacy content remain unchanged.
- Corrected listening-phase wording, added parent-step audio controls, keyed local speech by text and locale, and synchronized construction previews with rotation. Regenerated affected images and Edge speech; the 3,741-entry manifest has no failures or macOS/mixed local fallback.
- Changed coverage reports to identify structural counts and source links explicitly; generated activities are not treated as a complete original-task catalogue. Appended T117–T130 to the original implementation plan for remaining content, interaction, source mapping, difficulty, acoustic review and short-screen work.
- Passed 52 regression tests, production build, curriculum and voice-media audits; independent checks covered 10,221 math/logic cases and all 100 G20 permutations. Browser checks verified the corrected behaviors and 375px operation. Installed the latest standard Applications app; fresh native reopen is blocked by the locked Mac. Full acoustic review, source-task equivalence and child play remain incomplete. See specs/032-exploration-quality-audit/report.md.

### Exploration presentation and illustrations

- Gave 探索 a wider working area, grouped its activity list by topic, placed question navigation above the task, and moved parent guidance and growth records into expandable sections. Removed authoring difficulty notes from the default answer feedback and corrected navigation overlap while scrolling.
- Added 11 locally registered illustration atlases, with 44 addressable frames (42 used across 37 activities). Story ordering, natural changes, painting, food preparation and household/science materials now use explicit images with source/prompt provenance.
- Recovered hidden household pictures, removed duplicate text-card rendering, and added picture-based known/unknown bird quantities, cookies, shared queue membership, shopping and a readable practice calendar. Memory quantity cues show the actual characters and disappear during response.
- Organized parent activities into materials, steps and observation records; material images match the named wood/plastic/metal materials rather than generic substitutes. Materials are shown once.
- Corrected colored markers, flip-card colors, pyramid hierarchy and contiguous square cube nets; regenerated 639 used diagrams at 2x resolution and added enlarged evidence viewing.
- Passed 52 regression tests and curriculum/voice audits. Verified desktop, 1024px and 375px browser flows; native Applications app completed illustrated dragging, matching, bridges and parallel routes. The final polish/assets bundle is installed; a last reopen check awaits manual Mac unlock. Full evidence: specs/031-exploration-presentation/verification/qa.md.

## 2026-09-22

### Visible connection interactions

- Replaced matching numbers/text summaries with real lines, direct drag or two-click pairing, either-side starts, reconnection and unlink controls. Removed duplicated text in word cards.
- Moved bridge/route controls onto the map, drew double bridges as two lines, separated parallel roads, and added current-location, step and direction feedback.
- Accepted interchangeable identical circles in three relationship-matching activities; other answers, IDs and progress remain intact.
- Passed 30 focused tests, production build and curriculum/voice audits, and checked desktop/375px flows. Installed the updated Mac app and verified its signature/binary match. Fresh native UI acceptance awaits manual Mac unlock; see specs/030-visible-connections/verification/qa.md.

### Complete exploration authoring increment

- Reduced the 启蒙/探索 switch from 66px to 36px and added compact six-domain navigation and group search.
- Authored 597 additional activities across all 71 adopted families. 探索 now has 75 groups / 621 activities including its original pilot; 启蒙 retains the exact 40 groups / 489 rounds.
- Added matching, graph routes with distinct parallel edges, connected bridge networks, rotation/voxel construction, parent observation, finite inventory and learn-then-transfer support. Parent observations do not become automatic correct answers.
- Added local visual diagrams with source SVGs, original non-language sound sequences, and explicit English listening voices. Required listening waits for successful audio completion; missing/cancelled cues cannot silently advance.
- Checked every authored answer, independent arithmetic and graph/cover alternatives, source links and duplicate surfaces; inspected the first and last activity of all 71 families. Fixed cross-engine floating-point image identity, enlarged voxel evidence, and added minute ticks to clocks.
- Rebuilt and installed the Mac app. Latest evidence, counts and validation boundaries are in specs/029-curriculum-benchmark/verification/full-qa.md. Real child calibration remains pending.

### 启蒙 / 探索 navigation

- Added explicit 启蒙 and 探索 entry buttons above the theme picker. 启蒙 contains
  the original 40 groups / 489 rounds; 探索 contains the new 4 groups / 24 rounds.
  Theme counts, group lists and growth records now follow the selected section.
- Persisted a separate stable-ID resume location for each section, seeded from
  the previous location records. Switching sections and restarting preserve both
  positions; clearing one section's completion record affects only that section.
  Existing question content and audio are unchanged.
- Passed 33 automated tests, build and curriculum audit, and checked 1280×720,
  1024×700 and 375×812 browser layouts. Rebuilt and installed the actual Mac app;
  verified section switching, native wrong/correct answers, card placement,
  pointer drag, memory interruption on minimization, and quit/reopen recovery.
  The existing native 273-round completion record remained intact. Evidence and
  audio-observation limits: specs/029-curriculum-benchmark/verification/section-navigation-qa.md.

### First playable increment

- Fixed the two-column layout so the lower question navigator no longer sits
  underneath the sticky world sidebar. Jumping to a question now reveals the
  question surface when it is offscreen. Verified 1024×700 and 375×812 layouts
  and completed a mobile-width placement task; automatic memory concealment,
  retention and replay evidence also pass. Reinstalled the updated Mac bundle.

- Implemented the first playable curriculum increment: 规则收纳盒、线索排排队、
  图形推理盘、记忆摆一摆, six original activities each. The same app now exposes
  44 groups / 513 rounds, retaining the exact original 40 groups / 489 rounds.
- Added a shared build-time catalog, typed multi-select/order/grid responses,
  pure evaluators and session transitions, visual memory phases, pointer-based
  drag/drop with click placement, undo/retry/hints/review, and independent
  progress evidence with stable-ID continuation. Valid alternative orderings
  and Latin grids are accepted; blank cards remain distinct from empty slots.
- Added ten registered PNG symbols with deterministic SVG sources and generated
  the complete 1,958-line Edge Xiaoxiao voice pack with zero failures. Shared
  loading now follows the module graph; audits include the interactive content,
  and the Douyin exporter rejects unsupported Math Island interactions.
- Passed 28 automated tests, production build, curriculum/voice audits and all
  24 activity flows in the browser. Updated /Applications/小小思考屋.app via
  mac:install, verified its signature and binary match. Real-app UI acceptance
  and additional viewport/memory lifecycle checks await manual Mac unlock.
  Details: specs/029-curriculum-benchmark/verification/pilot-qa.md.

### Reference design checkpoint

- Documented the confirmed single-app direction: preserve younger-child content
  and progress, expand toward ages 6–8 through theme/ability/difficulty paths,
  and avoid child-facing V1/V2 product separation.
- Created Spec Kit feature 029 with a local-reference inventory, auditable
  review records, skill-family coverage matrix, implementation plan, data and
  interaction contracts, and staged execution tasks. The source collection
  contains 121 files, including 56 PDFs / 1,301 physical pages; duplicate
  screenshots and answer editions are tracked separately from unique problems.
- Mapped 74 skill-family/disposition entries across six ability domains:
  71 are planned curriculum or parent-child activities and three are explicit
  reference boundaries. Generated 115 tasks, with only the four research/design
  tasks complete. The 24-activity pilot does not close the remaining scope.
- Expanded the project constitution to version 1.1.0 and aligned agent,
  content-boundary, asset, and follow-up documentation. This is a design
  milestone, not a claim that the new curriculum is implemented.
- Verified the existing dev application with `pnpm build` and
  `pnpm audit:curriculum`: 40 games, 489 rounds, zero curriculum problems.
  No runtime content/assets changed, so the installed Mac app was not replaced.
- Checked source IDs/paths/page bounds, 121 review records, all current-game
  mappings, family-to-task coverage, local document links, task formatting and
  whitespace with zero errors. See
  `specs/029-curriculum-benchmark/evidence/design-validation.json` and
  `docs/curriculum-benchmark.md` for the entry point.

## 2026-08-13

- Rebuilt the Douyin mini game around a 1280×720 forced-landscape workbench
  matching the installed Mac app's structure: brand and all eight Math Island
  games on the left, the playable question with horizontal answer cards in the
  center, and round navigation, parent prompt, and growth record on the right.
  Startup now restores directly into the most recent round instead of showing
  the unrelated portrait welcome page.
- Added in-place game switching and round jumping, local-app-style paper grid,
  outlined cards and state colors, landscape parent guidance, landscape source
  and output audits, and 667×375 / 844×390 / 932×430 viewport checks. Fixed
  portrait-coordinate safe-area data returned after iOS landscape rotation and
  prevented asynchronously loaded sprites from resizing their layout nodes.
- Rebuilt and compiled the result in Douyin DevTools 4.5.5 on an iPhone 15 Pro
  landscape simulator. The simulator now fills the safe screen with the full
  three-column workbench; the Cocos output declares `deviceOrientation:
  landscape` and remains 12.01 MB with 338 voices and 19 PNGs.
- Replaced progress-array Set spreading after Xiaomi 15 simulator validation
  exposed Cocos' ByteDance transpiler emitting a nested Set. Added source and
  built-bundle guards so `[object Set]` can no longer leak into growth tags or
  corrupt completed-game/round arrays.
- Imported the official Cocos build into Douyin DevTools 4.5.5 and completed
  simulator validation on iPhone SE 2, iPhone 15 Pro, Xiaomi 15, and iPad.
  Verified the wrong/retry/correct/next loop, progress restore and corrupt-data
  recovery, offline relaunch, safe-area scrolling, and the sidebar check,
  navigation, and return path with no runtime console errors.
- Regenerated the local Mac application after the simulator-layer fix and
  reran the Web build, all 489-round curriculum checks, all 1,801 voice-media
  checks, 14 Douyin runtime tests, and the 357-file Douyin asset audit with zero
  problems.

## 2026-08-12

- Fixed the first Douyin DevTools simulator launch where the scene loaded but
  all runtime-created UI was invisible because Cocos assigned new nodes to the
  default layer while the camera rendered UI_2D only. Generated UI nodes now
  inherit their parent layer, with a static regression check.
- Added the Cocos Creator 3.8 LTS `doyingame/` project for the approved Douyin
  Mini Game AppID `tta51dd3a03b67523202`, scoped exclusively to 数字岛.
- Added a deterministic curriculum exporter and auditable runtime snapshot for
  all 8 Math Island games, 122 official rounds, 19 referenced images, and 338
  referenced local voice clips; the initial unoptimized asset closure was
  15.48 MB and had
  zero logic-house, graphic-workshop, or source-image references.
- Implemented the initial portrait parent-child game shell, visual-group/scene/clock
  renderers, local voice playback, guarded answer flow, parent prompts,
  versioned local progress recovery, safe-area layout, lifecycle audio handling,
  and Douyin sidebar bridge.
- Added Cocos 3.8 type checking, source-parity/runtime/progress/parent-content
  tests, build-template compatibility tests, three-viewport static checks,
  package/AppID/module-cropping audits, and documented the Cocos/Douyin IDE
  release gates.
- Added stable Cocos asset metadata and a cold-import build extension so a fresh
  Creator 3.8.8 project cannot silently produce an empty package. The official
  ByteDance build now verifies the launch scene, AppID, early `tt.onShow`, 338
  voice clips, 19 PNGs, and a 12.00 MB / 761-file output before succeeding.
- Added deterministic Douyin-only media optimization: 1200×675 paletted PNGs
  preserve scene evidence, while copied voices use validated 32 kbps mono MP3.
  This reduced the exact runtime closure from 15.48 MB to 9.56 MB without
  changing the curriculum digest and brings the non-subpackage build below the
  current 16 MB developer-tool limit.

## 2026-07-19

- Prepared a public GitHub Pages Web Beta as the first market-release channel,
  including subpath-safe images and audio, a verified deployment workflow, a
  hosted privacy notice, and a public product README while preserving existing
  root-path NAS and Tauri builds.
- Withdrew the automatic free Web Beta before remote publication and replaced
  it with a revenue-first iPad launch plan: one starter game per world, a
  parent-gated ¥68-equivalent lifetime unlock, App Store payment and restore,
  paid-family success metrics, and explicit China storefront compliance gates.

## 2026-07-18

- Removed the redundant pattern-board scene from all six 图形补一补 rounds so
  the 3x3 matrix is the only evidence surface, reducing the 1280x720 document
  height from 989px to 720px; aligned the sticky world navigation height with
  the app shell inset and added curriculum audit coverage for the invariant.
- Replaced all 找规律火车 evidence and choice tokens with a coherent
  image-gen-derived local PNG set, including registered color, sky, snack, and
  size-family cards with retained source and derivation documentation.
- Rebuilt the large/medium/small circle family from one purple source token on
  identical 256x256 canvases at 196/124/64-pixel occupied sizes, and removed the
  small circle's compact-card exception so size remains the only visual change.
- Added MP3 frame and text-aware duration validation to the Edge cache,
  generation retry path, standalone voice audit, and curriculum audit.
  Regenerated six truncated or implausibly short Xiaoxiao files; all 1,801
  active manifest entries now pass media validation with zero failures and
  zero orphan files.
- Corrected live desktop pre-release uploads after GitHub filename
  normalization prevented reliable verification of Chinese asset names. Draft
  retries now refresh release evidence, clear existing assets by ID, upload
  stable ASCII download filenames with Chinese display labels, and publish only
  when exactly the Mac ARM64 and Windows x64 installers are present.

## 2026-07-17

- Limited the right-side 成长记录 panel to 12 visible ability tags and added a
  compact hidden-count marker so long progress histories no longer stretch the
  side panel while preserving all saved progress data.
- Added a test-covered Tauri desktop release workflow that validates one source
  version/tag, builds Apple Silicon DMG and Windows x64 NSIS packages on native
  GitHub runners, keeps partial failures as drafts, and publishes only after
  both clearly named assets exist.
- Added explicit Mac ARM64 and Windows x64 local build commands, release
  metadata validation across `package.json`, Tauri, and Cargo, test-signing
  warnings, safe draft retry behavior, and cross-platform release operating
  documentation.
- Corrected Tauri release asset patterns so extension placeholders do not add a
  duplicate dot, then separated native builds from release uploads so draft
  retries use GitHub CLI `--clobber`.

## 2026-07-12

- Added deterministic per-game, per-choice-count answer placement so correct
  positions are evenly distributed without runtime randomness; graphic choices
  and their drawn A/B/C/D options now move together.
- Expanded the curriculum audit to reject answer-position bias, repeated answer
  positions, graphic choice/drawing misalignment, known answer-leaking wording,
  proximity-as-proof evidence reasoning, minute-hand-first clock guidance,
  nonstandard release voices, and unreferenced runtime voice files.
- Reworked bridge and rotation instructions so they guide comparison without
  stating the answer, and changed spilled-water tasks to inspect direct traces
  around the event instead of treating the nearest character as responsible.
- Changed 时钟小管家 prompts, feedback, retry guidance, parent prompts,
  difficulty notes, visible hints, and accessible clock descriptions to inspect
  时针（短针） before 分针（长针）.
- Regenerated the curriculum voice pack as 1,801/1,801 Edge
  `zh-CN-XiaoxiaoNeural` entries with zero failures, and regenerated the
  dedicated launch sound from the same voice family.
- Added a tested dry-run/write-mode voice pruning workflow and removed 830
  manifest-unreferenced Edge/macOS files; the runtime voice directory now
  contains exactly the 1,801 files referenced by the active manifest.
- Added Spec Kit feature `022-curriculum-integrity` with the audit contract,
  voice policy, implementation tasks, and end-to-end verification guide.

## 2026-07-09

- Corrected 时钟小管家 wording so 分针 is identified as the long hand and
  时针 as the short hand, and changed clock labels, choices, feedback, parent
  prompts, and local voice lines to use numeric `HH:MM` forms instead of
  `点`/`点半` wording.
- Reworked 时钟小管家生活场景题 from choosing 上午/下午/晚上 labels into
  12-hour analog clock to 24-hour electronic clock conversion, removed
  pre-answer day-part label leakage, and changed the scene-clock layout so the
  generated scene appears above the deterministic clock instead of being
  squeezed beside it.
- Removed the redundant 图形工坊 stem helper `在下面选 A、B、C、D` and added
  curriculum audit coverage so option-selection guidance does not appear as
  extra problem text.
- Added image-gen 1200x675 local scene PNGs and source copies for the four
  时钟小管家 daily-routine rounds, registered them in `imageGallery.scenes`,
  and tightened audit/layout coverage so context rounds are visual while
  read-time rounds stay clock-only.
- Centered 时钟小管家 read-time clock boards and redrew clock ticks/hands with
  explicit endpoint geometry so the analog face renders as a complete,
  readable clock whose hands match the prompt.
- Reworked 图形工坊的透明叠叠板题面 so each round first shows a separate
  non-answer overlap example, then shows only the two figures the child must
  mentally overlap with `1 先放这张` and `2 盖上这张` action labels, preventing
  the stem from displaying the correct result while keeping the stacking order
  visible.
- Added the `021-clock-time` Spec Kit feature for a 数字岛 clock-reading game
  covering analog whole hours, half hours, and daily morning/afternoon/evening
  context.
- Added `时钟小管家` to 数字岛 with 12 rounds, a dedicated local analog clock
  surface, hand-position feedback, and parent prompts that ask children to
  explain long-hand, short-hand, and daily activity evidence.
- Expanded the curriculum audit to require the clock game, validate
  `clockChallenge` surfaces, enforce whole-hour/half-hour/time-conversion
  coverage, and reject weak clock or conversion evidence.
- Exported the updated 1800-line voice script and regenerated the standard Edge
  Xiaoxiao local voice manifest with the new clock lines.

## 2026-07-08

- Fixed round speech control so new speech requests invalidate stale pending
  voice loads, explicit question navigation stops the previous line immediately,
  and clicked question/game changes request the target round prompt directly.
- Changed 图形工坊 answer interactions so pre-answer option clicks and aria
  labels only expose A/B/C/D instead of answer-revealing figure names or layer
  relations, removed graphic option labels from the local voice manifest, and
  gave graphic answer choices a four-column desktop grid so all four options fit
  on one row.
- Re-audited 图形工坊 from the player view: shadow choices now render as real
  black silhouettes, multi-figure stems render in one shared SVG for overlap and
  code-machine relationships, code-machine questions use a visible `?` answer
  slot, layer-overlap choice labels describe the drawn option instead of the
  distractor rationale, with post-answer feedback carrying the explanatory
  evidence instead of pre-answer option speech.
- Slowed the launch brand-shout audio from about 1.0 seconds to about 1.4
  seconds and extended the splash timing so the line has room to finish before
  entering the app.
- Replaced the launch splash's ordinary `小小思考屋` TTS line with a dedicated
  local brand-shout audio asset, keeping the desired child-chorus direction as
  a future higher-quality source replacement instead of shipping a synthetic
  layered voice that sounds unnatural.
- Promoted voice generation, image-generation asset handling, NAS static
  packaging, and Mac `.app` preview rules into `AGENTS.md` as system-level
  project guidance for future agents.

## 2026-07-07

- Reworked 谁和谁一对 rounds so the prompt and visual evidence no longer
  repeat answer choices, decorative scene images are removed, and relation
  cards use normal-width frames instead of the narrow visual-group grid.
- Regenerated the local voice manifest with standard Edge Xiaoxiao audio for
  all 1748 exported voice lines, removing macOS voice sources from 逻辑屋
  playback.
- Expanded the curriculum audit to catch 谁和谁一对 prompt/visual answer leakage,
  missing relation-card layout, decorative scenes in relation rounds, and
  nonstandard 逻辑屋 voice sources.
- Added image-gen PNG item icons for 葡萄、公交车、自行车、飞机、尺子 and
  积木塔, registered them in `imageGallery`, and wired `VisualToken` so
  同类小侦探 and 找不同侦探 no longer fall back to SVG for those concrete
  objects.
- Fixed the left/right comparison layout used by 找不同侦探 so image cards keep
  normal-width bases on desktop and mobile instead of being squeezed into a
  five-column grid.
- Added a dedicated evidence-card layout for 拼图少哪块 and 天平换一换 so
  composite puzzle cards, balance rules, and left/right evidence cards keep
  normal-width bases on desktop and mobile.
- Reworked 拼图少哪块 round data so 完整图 is shown as separate comparable
  pieces, missing-piece choices use already-present pieces as plausible
  distractors, and answer labels are child-readable text with visual cues.
- Reworked 天平换一换 count choices from repeated combined emoji tokens into
  count labels such as `2 个草莓`, preventing mixed-size answer graphics.
- Expanded the curriculum audit to catch concrete same-kind/difference items
  that have a token mapping but no project raster icon, and to require a
  dedicated left/right comparison group layout.
- Expanded the curriculum audit to require the part-whole and balance evidence
  layout so those rounds cannot silently fall back to the narrow five-column
  visual-group grid.
- Expanded the curriculum audit to reject combined 完整图 tokens in 拼图少哪块
  and repeated visual-token answer choices in 天平换一换.
- Reworked the left sidebar world switcher so only the selected world expands
  with summary details while inactive worlds collapse into compact rows,
  leaving more vertical room for the level list.
- Added a focused Node test that guards the sidebar world switcher
  expanded/collapsed states and compact collapsed styling.
- Added the `020-graphic-workshop` Spec Kit feature for a new 图形工坊 content
  world and compact existing-world reinforcement policy.
- Added 图形工坊 as a third selectable world and expanded its first-pass content
  into six real drawn visual-reasoning games with 48 rounds: 影子配对,
  遮挡还原, 局部找整体, 透明叠叠板, 图形密码机, and 缺口补一补.
- Added dedicated `graphicChallenge` round data and SVG rendering so 图形工坊
  stems and A/B/C/D answer choices are actual drawn figures rather than abstract
  text or generic token labels.
- Replaced the crude 图形工坊 geometric placeholder art with local image-gen
  sticker assets registered in `imageGallery.items`, while keeping silhouettes,
  遮挡, 叠合, 密码表, and 缺口 masks dynamically composable.
- Added three differentiated number-pattern reinforcement rounds to 逻辑屋,
  covering skip-counting before/after, descending even-number patterns, and a
  missing middle step.
- Expanded the curriculum audit with checks for the `graphic` world, exactly
  six first-pass graphic games, eight rounds per game, dedicated graphic
  challenge surfaces, drawn answer options, visual-operation feedback, and
  compact reference-reinforcement markers.
- Tightened the 图形工坊 audit so first-pass graphic rounds reject duplicated
  logic-house families and avoid scene, visual-group, grid, matrix, sequence,
  and memory surfaces already owned by other worlds.
- Exported updated voice lines and generated missing local macOS voice entries
  for the new 图形工坊 and reinforcement content.
- Added `docs/graphic-workshop-reference-analysis.md` to record the source
  corpus taxonomy, distractor rules, and future migration question.
- Documented the Mac development preview rule: generate a real Tauri `.app`
  with `pnpm mac:build` and test through that bundle instead of relying only on
  browser/Vite preview.

## 2026-07-06

- Added the `019-app-launch-branding` Spec Kit feature for Mac app logo
  resources, a branded launch splash, and the local "小小思考屋" entry voice.
- Added audit coverage that fails if the app launch splash, launch voice line,
  or Tauri icon configuration is removed.
- Replaced the wide-logo app icon with a high-contrast square icon, refreshed
  Mac installation to clear stale app bundles, and made the launch animation
  auto-enter the game page after a richer opening sequence.
- Rebuilt the Mac app icon from a direct crop of the in-app brand house logo so
  Dock and Launchpad match the internal brand while reading clearly at small
  sizes.
- Added the `018-installable-packages` Spec Kit feature for NAS-first static
  packaging, Docker fallback, and Mac/Tauri installation.
- Added a tested `pnpm release:nas` workflow that turns the Vite production
  build into a copyable `release/nas-static/` package with a `content/`
  boundary, release manifest, and uploadable NAS zip archive.
- Added deployment documentation that treats ZSpace NAS native static hosting as
  the preferred path and Docker/Compose as fallback only.
- Added Tauri 2 configuration, generated app icons, and scripts for building
  the same frontend as a macOS `.app` bundle, with DMG packaging left as an
  optional command.
- Added the `017-memory-camera-visual-surface` Spec Kit feature for flattening
  `记忆小相机` memory slots.
- Expanded the curriculum audit with a source check that prevents `MemoryBoard`
  from nesting full visual-card tokens inside memory slots.
- Reworked memory-camera slots so visible and covered cards use flat
  icon-and-label tokens while preserving tap-to-hear behavior.
- Added the `016-visual-choice-session-memory` Spec Kit feature for visual-match
  choices, matrix-cell visual density, and last-opened-location restoration.
- Expanded the curriculum audit with source checks that prevent duplicated
  visual-card choice labels, nested matrix-cell visual cards, and missing
  last-location storage integration.
- Reworked exact visual-match answer buttons so visual-card choices render as
  compact cards without repeated raw symbol text, while position choices remain
  readable.
- Reworked matrix puzzle cells to use flat icon-and-label tokens instead of
  full cards nested inside matrix cells.
- Added separate local storage for the last opened world, game, and round so
  reopening the app restores the previous browsing position.
- Added the `015-map-visual-surface-quality` Spec Kit feature for spatial
  visual-surface clarity in address-map, position-map, and route-step rounds.
- Expanded the curriculum audit with checks that reject spatial rounds combining
  a grid or inside/outside group with a positional scene image.
- Added an audit check that prevents `AddressGrid` from nesting full visual-card
  tokens inside map cells.
- Removed conflicting scene images from affected address-map, position-map, and
  route-step rounds so each task has one authoritative spatial surface.
- Reworked map grid cells to use flat icon-and-label tokens with click-to-speak
  behavior instead of card frames inside card-like cells.

## 2026-07-05

- Added the `012-memory-camera-quality` Spec Kit feature for appeared-item,
  absent-item, and left-to-right order memory quality.
- Expanded the curriculum audit with memory-camera checks that normalize emoji
  cards to child-facing labels, validate appeared and absent answers, and derive
  order answers from the remembered sequence.
- Reworked `logic-memory-camera` success feedback, retry guidance, and parent
  prompts so each round names the remembered cards, answer, and recognition,
  exclusion, or sequence reasoning.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten memory-camera content.
- Added the `013-order-plan-quality` Spec Kit feature for missing-step sequence
  planning quality.
- Expanded the curriculum audit with order-plan checks that validate a single
  missing sequence slot, unique answer choice, and filled-sequence explanation
  text.
- Reworked `logic-order-plan` success feedback, retry guidance, and parent
  prompts so each round names the completed flow, the missing answer, and a
  left-to-right replay strategy.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten order-plan content.
- Added the `014-pattern-train-quality` Spec Kit feature for repeat-unit,
  missing-card, and choice-quality pattern reasoning.
- Expanded the curriculum audit with pattern-train checks that validate a single
  missing card, repeat-unit metadata, derived answers, at least three
  pattern-tied choices, and concrete feedback/retry/parent wording.
- Reworked `logic-pattern-train` choice generation, success feedback, retry
  guidance, and parent prompts so each round names the repeated unit, filled
  sequence, and answer.
- Exported updated voice lines and generated a mixed local voice manifest for
  the rewritten pattern-train content, preserving existing Edge entries and
  filling missing lines with the local macOS fallback when Edge DNS was blocked.

## 2026-07-04

- Added the `002-logic-house-quality` Spec Kit feature for stricter logic-house
  curriculum quality gates.
- Expanded the curriculum audit to check choice meaning, child-facing choice
  wording, sorter rule explainability, and logic difficulty-note quality.
- Reworked `logic-sorter-switch` prompts, feedback, retry guidance, and parent
  prompts so color/shape rules and two-condition mistakes are explicit.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten sorter content.
- Added the `003-same-kind-quality` Spec Kit feature for same-kind and
  odd-one-out logic quality.
- Expanded the curriculum audit with same-kind rule explanations, odd-one-out
  majority-group checks, and same-kind choice visual cue coverage.
- Reworked `logic-same-kind-detective` prompts, retries, success feedback, and
  parent prompts so category rules and odd-one-out reasons are explicit.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten same-kind content.
- Added the `004-visual-match-quality` Spec Kit feature for exact-match and
  odd-card visual comparison quality.
- Expanded the curriculum audit with visual-match checks for sample-card
  matching, close distractors, matching-pair structure, and feedback clarity.
- Reworked `logic-visual-match` instructions, success feedback, retry guidance,
  and parent prompts so every round explains left-to-right matches or the
  matching pair before the different card.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten visual-match content.
- Added the `005-difference-detective-quality` Spec Kit feature for changed,
  extra, and missing item comparison quality.
- Expanded the curriculum audit with difference-detective checks for left/right
  row structure, changed positions, shared-item matching, and feedback clarity.
- Reworked `logic-difference-detective` feedback, retry guidance, and parent
  prompts so changed-item, extra-item, and missing-item rounds explain the
  visible comparison evidence.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten difference-detective content.
- Added the `006-block-height-quality` Spec Kit feature for top-view block
  height map counting and comparison quality.
- Expanded the curriculum audit with block-height checks for visible sums, row
  totals, explicit compare labels, and left/right total explanations.
- Reworked `logic-block-height-map` success feedback, compare choices, retry
  guidance, and parent prompts so rows and left/right totals are explained
  before selecting a total or comparison.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten block-height content.
- Added the `007-three-view-quality` Spec Kit feature for top, front, and left
  view block reasoning quality.
- Expanded the curriculum audit with three-view checks for top-view non-zero
  counts, front-view column maximums, left-view row maximums, active-view
  guidance, and side-view choice sequence length.
- Reworked `logic-three-view-blocks` success feedback, retry guidance, parent
  prompts, and side-view distractors so each round explains the active viewpoint
  and uses one height per visible column or row.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten three-view content.
- Added the `008-route-steps-quality` Spec Kit feature for one-step and two-step
  route reasoning quality.
- Expanded the curriculum audit with route-step checks that compute destinations
  from visible grids, validate ordered moves, and require start/intermediate/final
  explanation text.
- Reworked `logic-route-steps` success feedback, retry guidance, and parent
  prompts so each round names the start item, direction moves, first landing
  spot, and final destination.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten route-step content.
- Added the `009-address-map-quality` Spec Kit feature for row-column address
  map reasoning quality.
- Expanded the curriculum audit with address-map checks that compute hidden
  objects from addresses, compute addresses from target objects, and require
  row-column explanation text.
- Reworked `logic-address-map` success feedback, retry guidance, and parent
  prompts so each round names the row, column, crossing cell, object, and final
  address where relevant.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten address-map content.
- Added the `010-matrix-puzzle-quality` Spec Kit feature for matrix row-rule
  reasoning quality.
- Expanded the curriculum audit with matrix-puzzle checks that derive missing
  cells from visible row rules and require example-row explanation text.
- Reworked `logic-matrix-puzzle` prompts, success feedback, retry guidance, and
  parent prompts so each round names a complete example row, the missing row,
  and the final answer.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten matrix-puzzle content.
- Added the `011-position-map-quality` Spec Kit feature for spatial position,
  inside/outside, and viewpoint-relative direction quality.
- Expanded the curriculum audit with position-map checks that compute neighbor
  items from visible grids, validate inside/outside group membership, and derive
  relative directions from the named source item.
- Reworked `logic-position-map` success feedback, retry guidance, and parent
  prompts so each round names the reference item, direction or group contrast,
  answer, and child-pointing explanation.
- Exported updated voice lines and regenerated the local Edge voice manifest for
  the rewritten position-map content.
- Initialized GitHub Spec Kit with Codex skills integration.
- Established the project constitution in `.specify/memory/constitution.md`.
- Expanded `AGENTS.md` with project overview, source-of-truth rules,
  Spec-Driven Development workflow, asset taxonomy, and documentation hygiene.
- Moved historical Obsidian notes under `docs/archive/`.
- Renamed image asset category `avatars` to `characters` to separate reusable
  roles from non-character items.
- Added `docs/assets.md` as the source of truth for image and audio asset rules.
- Added this changelog and `docs/TODO.md` for ongoing project maintenance.
