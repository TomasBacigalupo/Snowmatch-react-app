#!/usr/bin/env bash
# Build (production) and sync ./build to S3.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || { echo "Error: missing command: $1" >&2; exit 1; }
}

require_cmd npm
npm run build
exec "$ROOT/scripts/deploy-s3.sh"
