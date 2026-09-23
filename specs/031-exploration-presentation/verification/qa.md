# Exploration presentation verification — 2026-09-23

## Delivered scope

All 75 exploration groups use the revised working area, topic groups, spacing, readable cards and expandable parent information. The original 40 enlightenment groups / 489 rounds remain present; exploration remains 75 / 621, overall 115 / 1110. Every original authored answer still passes.

The 71 authored families / 597 activities were reviewed in research-audit.md and family-presentation-review.json. This is a presentation/content audit, not a claim that every activity was observed with children.

### Illustration assets

Generation used the **built-in imagegen tool**. Final assets are in `public/images/items/exploration-art/`, generated originals in its `source/` subfolder. Eleven atlas PNGs provide 44 named frames, 42 currently used across 37 activities; two extra planting-preparation frames remain in their shared source atlas. Final paths, hashes and use counts: [asset manifest](../asset-manifest.json). Full prompts and the germination layout correction: [prompt set](../image-prompts.json).

Story ordering, plant/insect/frog changes, painting, fruit preparation and household/science materials now have actual event/object pictures. Household images no longer disappear behind a stale text-only flag. Preparations bind each image to its material; the floating experiment uses visible wood, transparent plastic and metal rather than misleading generic substitutes.

Quantitative evidence explicitly preserves the unknown value. Bird stories, cookies, the shared rabbit in a queue, shopping and calendars have distinct readable displays. Memory associations show a character and its quantity during observation, then hide during response. Complex geometric diagrams retain exact source data; corrected cube-net square adjacency, pyramid levels, color markers and card-face colors. Of 860 generated diagrams, 639 used visual diagrams are rendered at 2x resolution, preserving original layout dimensions and SVG sources.

## Passed checks

- 52 focused regression tests: new presentation contracts, all authored answers, progress/navigation, matching/bridges/routes, memory visibility, exact material references and all atlas/source paths. See tests.txt.
- TypeScript and production Vite build pass. The final build is recorded inside mac-install.txt; build.txt also retains a successful earlier production build.
- Curriculum audit: zero problems; voice media: 3729/3729 checked, zero problems. The standard Edge pack uses Chinese Xiaoxiao and English Jenny; failures are empty, with no macOS say or mixed local fallback. Source wording changes were exported, generated and pruned.
- Browser: 1280×820, 1024×700, 375×812. Four-event story placement and submission, household pictures, quantity/inverse-quantity evidence, image enlargement/close, character-quantity observation and concealment, parent observation save in localhost QA, natural-change cards, section preservation and dense attention layout.
- At 375px, image frames remain square and no horizontal overflow or broken images were detected. A 21-card attention grid occupies 528px in four columns. At 1024px, the stage is 750px wide, parent support begins 16px below it, and question navigation is static rather than overlapping the heading.
- Native **/Applications/小小思考屋.app** was opened and raised, then completed word matching, picture-card pointer dragging and story submission, a double-bridge network and an A→B→A→C→B route with separate straight/curved edges. Screenshots: native-matching.png, native-story-complete.png, native-bridges-complete.png, native-route-complete.png. No development-bundle copy was launched this turn.
- The final package is installed in /Applications, signed, and its binary matches the latest build; see installation.json. No remote push was made.

## Remaining boundary

After the native flows, additional spacing, exact material and high-resolution refinements were incorporated and verified in browser/build/audits. The Mac then locked. A manual-unlock question is pending for the **last reopen check of that final bundle**. Do not equate the earlier native screenshots with inspection of every last pixel in the final bundle.

Actual child play calibration and physical iPhone/iPad testing remain outside these technical checks. Parent-observation selections made for QA were confined to the separate localhost browser; no fictitious parent observation was submitted in the native app.

## Representative screenshots

- screenshots/final-story-desktop.png — current shared story layout
- screenshots/desktop-quantity-story.png — known quantities and one unknown
- screenshots/desktop-cube-net.png — corrected connected square net
- screenshots/desktop-memory-cue.png — picture/quantity observation
- screenshots/mobile-story-complete.png — narrow-screen story result
- screenshots/mobile-nature-cards.png — nature sequence cards
- screenshots/mobile-parent-materials.png — material-specific illustration check (captured before removing duplicate text chips)
- screenshots/mobile-attention.png — compact symbol array

The browser-flows.json file records observed UI results and dimensions. Images/labels are visual-review evidence, not proof of age suitability.
