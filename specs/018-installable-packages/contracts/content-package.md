# Contract: Content Package Boundary

## Path

`content/`

## Generated Files

- `content/manifest.json`
- `content/README.md`

## Manifest Shape

```json
{
  "schemaVersion": 1,
  "phase": "boundary-placeholder",
  "appContentMode": "built-in-default",
  "notes": [
    "Current question data is compiled into the app.",
    "Future JSON catalogs should be placed under this directory."
  ]
}
```

## Rules

- Deployment tooling may replace or mount `content/`.
- The current app must keep working if `content/` only contains the placeholder manifest.
- Full question-bank JSON migration requires a separate spec, schema, and audit update.
