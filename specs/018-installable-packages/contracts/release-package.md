# Contract: Release Package

## Command

`pnpm release:nas`

## Inputs

- `dist/`: Existing production build output from `pnpm build`
- `package.json`: Package name and version

## Output

`release/nas-static/`

Required contents:

- `index.html`
- `assets/`
- `images/`
- `audio/`
- `content/`
- `release-manifest.json`

## Error Behavior

- If `dist/` is missing, fail with a message that includes `pnpm build`.
- If `dist/index.html` is missing, fail with a message that identifies the invalid build output.

## Coupling Constraint

The release command must operate on files under `dist/` and must not import from `src/data/games.ts` or other runtime game modules.
