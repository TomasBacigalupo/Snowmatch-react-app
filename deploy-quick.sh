#!/usr/bin/env bash
# Upload existing ./build to S3 only. Run 'npm run build' first.
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec "$ROOT/scripts/deploy-s3.sh"
