#!/usr/bin/env zsh
set -euo pipefail

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
cd "$root_dir"

"$root_dir/scripts/codex-pnpm.sh" build
"$root_dir/scripts/codex-pnpm.sh" audit:curriculum
