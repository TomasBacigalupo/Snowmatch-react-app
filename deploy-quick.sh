#!/bin/bash

# Upload existing ./build to S3 only. For SEO, run `npm run deploy` first so build is prerendered.
# Uso: ./deploy-quick.sh

set -e

BUCKET_NAME="snowmatch.pro"
BUILD_DIR="build"

if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Error: No existe el directorio build. Ejecuta 'npm run build' primero"
    exit 1
fi

echo "☁️  Subiendo archivos a S3..."

# Subir todos los archivos con cache largo excepto HTML
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME \
    --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "*.html" \
    --exclude "service-worker.js" \
    --exclude "manifest.json"

# HTML sin cache
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME \
    --exclude "*" \
    --include "*.html" \
    --cache-control "no-cache, no-store, must-revalidate"

# Service worker y manifest sin cache
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME \
    --exclude "*" \
    --include "service-worker.js" \
    --include "manifest.json" \
    --cache-control "no-cache, no-store, must-revalidate"

echo "✅ Deploy completado!"




