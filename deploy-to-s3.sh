#!/bin/bash

# Script para hacer build y deploy a S3
# Uso: ./deploy-to-s3.sh

set -e  # Salir si hay algún error

BUCKET_NAME="app.snowmatch.pro"
BUILD_DIR="build"

echo "🚀 Iniciando proceso de deploy..."

# 1. Hacer build de producción
echo "📦 Compilando proyecto..."
npm run build

# 2. Verificar que existe el directorio build
if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Error: No se encontró el directorio $BUILD_DIR"
    exit 1
fi

echo "✅ Build completado exitosamente"

# 3. Subir a S3
echo "☁️  Subiendo archivos a S3 bucket: $BUCKET_NAME..."

# Sync del build a S3
aws s3 sync $BUILD_DIR s3://$BUCKET_NAME \
    --delete \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "*.html" \
    --exclude "service-worker.js" \
    --exclude "manifest.json"

# Archivos HTML sin cache (para siempre servir la última versión)
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

# 4. Invalidar CloudFront cache (si usas CloudFront)
# Descomenta y agrega tu DISTRIBUTION_ID si usas CloudFront
# DISTRIBUTION_ID="YOUR_DISTRIBUTION_ID"
# echo "🔄 Invalidando cache de CloudFront..."
# aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "✅ Deploy completado exitosamente!"
echo "🌐 Tu aplicación está disponible en: https://$BUCKET_NAME"




