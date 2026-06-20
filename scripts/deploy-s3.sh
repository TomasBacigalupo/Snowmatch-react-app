#!/usr/bin/env bash
#
# Sync ./build to S3 (no build, no prerender).
#
# Usage:
#   ./scripts/deploy-s3.sh
#
# Environment:
#   BUILD_DIR                   Default: build
#   S3_BUCKET                   Default: snowmatch.pro
#   AWS_REGION                  Default: us-east-1
#   CLOUDFRONT_DISTRIBUTION_ID  If set, invalidates /* after sync
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

BUILD_DIR="${BUILD_DIR:-build}"
S3_BUCKET="${S3_BUCKET:-snowmatch.pro}"
AWS_REGION="${AWS_REGION:-us-east-1}"

die() {
  echo "Error: $*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "missing command: $1"
}

aws_s3_sync() {
  aws s3 sync "$BUILD_DIR" "s3://$S3_BUCKET" --region "$AWS_REGION" "$@"
}

require_cmd aws
[[ -d "$BUILD_DIR" ]] || die "no $BUILD_DIR — run 'npm run build' first"

echo "☁️  Syncing $BUILD_DIR → s3://$S3_BUCKET (region: $AWS_REGION) ..."

aws_s3_sync \
  --delete \
  --cache-control "public, max-age=31536000, immutable" \
  --exclude "*.html" \
  --exclude "service-worker.js" \
  --exclude "manifest.json"

aws_s3_sync \
  --exclude "*" \
  --include "*.html" \
  --cache-control "no-cache, no-store, must-revalidate"

aws_s3_sync \
  --exclude "*" \
  --include "service-worker.js" \
  --include "manifest.json" \
  --cache-control "no-cache, no-store, must-revalidate"

if [[ -n "${CLOUDFRONT_DISTRIBUTION_ID:-}" ]]; then
  echo "🔄 CloudFront invalidation: ${CLOUDFRONT_DISTRIBUTION_ID} /*"
  aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*" >/dev/null
fi

echo "✅ Deploy finished: https://$S3_BUCKET"
