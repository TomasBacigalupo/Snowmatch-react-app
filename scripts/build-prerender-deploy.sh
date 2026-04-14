#!/usr/bin/env bash
#
# Build (production), prerender with react-snap (always — for SEO), sync to S3.
#
# Requirements: Node/npm, AWS CLI configured (aws sts get-caller-identity),
#   Chrome/Chromium for react-snap (see puppeteerExecutablePath in package.json "reactSnap").
#
# Usage:
#   ./scripts/build-prerender-deploy.sh
#   ./scripts/build-prerender-deploy.sh --deploy-only   # S3 only; use only if ./build is already prerendered
#
# Environment:
#   S3_BUCKET                   Default: snowmatch.pro
#   AWS_REGION                  Default: us-east-1 (override: export AWS_REGION=...)
#   CLOUDFRONT_DISTRIBUTION_ID  If set, invalidates /* after sync
#

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

BUILD_DIR="${BUILD_DIR:-build}"
S3_BUCKET="${S3_BUCKET:-snowmatch.pro}"
# Default region avoids empty-array + set -u failures on macOS Bash; matches typical snowmatch.pro bucket.
AWS_REGION="${AWS_REGION:-us-east-1}"
DEPLOY_ONLY=0

for arg in "$@"; do
  case "$arg" in
    --deploy-only) DEPLOY_ONLY=1 ;;
    -h|--help)
      sed -n '2,16p' "$0" | sed -E 's/^# ?//'
      exit 0
      ;;
  esac
done

# Do not use "${arr[@]}" when arr may be empty: with `set -u`, macOS Bash errors on unbound [@].
aws_s3_sync() {
  aws s3 sync "$BUILD_DIR" "s3://$S3_BUCKET" --region "$AWS_REGION" "$@"
}

die() {
  echo "Error: $*" >&2
  exit 1
}

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || die "missing command: $1"
}

sync_to_s3() {
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
}

if [[ "$DEPLOY_ONLY" -eq 1 ]]; then
  [[ -d "$BUILD_DIR" ]] || die "no $BUILD_DIR — run a full deploy first (build + prerender)"
  require_cmd aws
  echo "⚠️  --deploy-only: uploading existing $BUILD_DIR (must already be prerendered for SEO)"
  sync_to_s3
  exit 0
fi

require_cmd npm
require_cmd aws

echo "📦 Production build + react-snap prerender (required for SEO)..."
npm run build
# Matches package.json "snap" — avoids react-snap tripping on CRA fallback HTML copies
rm -f "$BUILD_DIR/200.html" "$BUILD_DIR/404.html" "$BUILD_DIR/500.html"
echo "🖼️  Prerendering (react-snap)..."
npx react-snap

[[ -d "$BUILD_DIR" ]] || die "build output missing: $BUILD_DIR"

sync_to_s3
