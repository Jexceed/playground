#!/usr/bin/env zsh
set -euo pipefail

runtime_dir="${CODEX_RUNTIME_DIR:-$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies}"
node_bin="$runtime_dir/node/bin"
pnpm_bin="$runtime_dir/bin/pnpm"

if [[ ! -x "$node_bin/node" || ! -x "$pnpm_bin" ]]; then
  cat >&2 <<MSG
Codex bundled Node/pnpm was not found.

Expected:
  $node_bin/node
  $pnpm_bin

Install Node.js from https://nodejs.org/ or set CODEX_RUNTIME_DIR to a runtime that contains node/bin/node and bin/pnpm.
MSG
  exit 1
fi

export PATH="$node_bin:$runtime_dir/bin:$PATH"
exec "$pnpm_bin" "$@"
