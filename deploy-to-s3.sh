#!/usr/bin/env bash
# Backward-compatible entry: build → prerender → S3 (see scripts/build-prerender-deploy.sh).
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$ROOT/scripts/build-prerender-deploy.sh" "$@"
