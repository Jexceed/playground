# Quickstart: Graphic Workshop Validation

1. Run the curriculum audit:

```bash
pnpm audit:curriculum
```

Expected: no curriculum problems. The audit should include checks for the `graphic` world, exactly six first-pass graphic games, exactly eight rounds per graphic game, at least 48 graphic rounds, dedicated `graphicChallenge` surfaces, four drawn A/B/C/D answer options, near-miss distractor rationales, and duplicate signatures.

2. Build the app:

```bash
pnpm build
```

Expected: TypeScript and Vite build complete without errors.

3. Check whitespace and patch hygiene:

```bash
git diff --check
```

Expected: no whitespace errors.

4. Manual app smoke check:

- Open the app.
- Select 图形工坊.
- Confirm six graphic-workshop games appear: 影子配对, 遮挡还原, 局部找整体, 透明叠叠板, 图形密码机, 缺口补一补.
- Open one round from each game and confirm the stem drawing, A/B/C/D option drawings, feedback, and parent prompt all refer to the same visual operation.
- For Mac development signoff, build and preview the generated `.app` bundle rather than relying only on Vite browser preview.
