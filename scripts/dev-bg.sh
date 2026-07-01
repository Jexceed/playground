#!/usr/bin/env zsh
set -euo pipefail

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
log_dir="$root_dir/.tmp"
pid_file="$log_dir/vite.pid"
log_file="$log_dir/vite.log"

mkdir -p "$log_dir"

if [[ -f "$pid_file" ]] && kill -0 "$(cat "$pid_file")" 2>/dev/null; then
  echo "Dev server is already running: pid $(cat "$pid_file")"
  echo "Log: $log_file"
  exit 0
fi

cd "$root_dir"
nohup "$root_dir/scripts/codex-pnpm.sh" dev > "$log_file" 2>&1 &
pid="$!"
echo "$pid" > "$pid_file"

echo "Started dev server in background: pid $pid"
echo "Log: $log_file"
