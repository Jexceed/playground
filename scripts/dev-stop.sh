#!/usr/bin/env zsh
set -euo pipefail

root_dir="$(cd "$(dirname "$0")/.." && pwd)"
pid_file="$root_dir/.tmp/vite.pid"

if [[ ! -f "$pid_file" ]]; then
  echo "No pid file found."
  exit 0
fi

pid="$(cat "$pid_file")"
if kill -0 "$pid" 2>/dev/null; then
  kill "$pid"
  echo "Stopped dev server: pid $pid"
else
  echo "Process is not running: pid $pid"
fi

rm -f "$pid_file"
