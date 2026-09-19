#!/usr/bin/env bash
# Starts the example server, checks HTTP 200 + schema_version, then stops it.
set -euo pipefail
cd "$(dirname "$0")"

PORT="${PORT:-8787}"
HOST="${HOST:-127.0.0.1}"
URL="http://${HOST}:${PORT}/dashboards/api/graficos/dados-relatorio/"

npx --yes tsx server.ts &
pid=$!
cleanup() { kill "$pid" 2>/dev/null || true; }
trap cleanup EXIT

body=""
for _ in $(seq 1 40); do
  if body="$(curl -sfS "$URL")"; then
    break
  fi
  sleep 0.15
done

if [[ -z "$body" ]]; then
  echo "smoke: server did not answer ${URL}" >&2
  exit 1
fi

node --input-type=module -e '
const report = JSON.parse(process.argv[1]);
if (typeof report.schema_version !== "string" || report.schema_version.length === 0) {
  throw new Error("missing schema_version");
}
console.log(`ok ${report.schema_version}`);
' "$body"
