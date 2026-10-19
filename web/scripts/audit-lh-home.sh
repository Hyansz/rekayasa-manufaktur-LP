#!/bin/bash
set -euo pipefail
LH_DIR="$(pwd)/web/lh-results"
mkdir -p "$LH_DIR"
HOME_URL="${BASE_URL:-http://localhost:3000/}"
PROD_URL="${BASE_URL:-http://localhost:3000}/produk/meja-guru"
echo "Running Lighthouse for home: $HOME_URL"
npx lighthouse "$HOME_URL" \
  --output-path="$LH_DIR/home.html" \
  --output-html \
  --quiet \
  --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage --disable-gpu --window-size=390,844" \
  --only-categories=performance,accessibility,seo \
  --form-factor=mobile \
  --throttling-method=simulate \
  --throttling-rpm=4000 \
  --throttling-rtt=150 \
  --disable-storage-reset \
  --disable-device-emulation \
  --skip-all-default-suggestions \
  --quiet \
  --output=json \
  --output-path="$LH_DIR/home.json"
echo "Done home. Running product..."
npx lighthouse "$PROD_URL" \
  --output-path="$LH_DIR/product.html" \
  --output-html \
  --quiet \
  --chrome-flags="--headless --no-sandbox --disable-dev-shm-usage --disable-gpu --window-size=390,844" \
  --only-categories=performance,accessibility,seo \
  --form-factor=mobile \
  --throttling-method=simulate \
  --throttling-rpm=4000 \
  --throttling-rtt=150 \
  --disable-storage-reset \
  --disable-device-emulation \
  --skip-all-default-suggestions \
  --quiet \
  --output=json \
  --output-path="$LH_DIR/product.json"
echo "Done product."
