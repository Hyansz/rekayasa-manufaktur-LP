#!/bin/bash
set -euo pipefail

echo "== grep: 500+ =="
if rg -n "500\+" --glob "!web/scripts/verify-grep.sh" web/; then
  echo "FAIL: masih ada 500+"
  exit 1
else
  echo "OK: tidak ada 500+"
fi

echo "== grep: 15+ =="
if rg -n "15\+" --glob "!web/scripts/verify-grep.sh" web/; then
  echo "FAIL: masih ada 15+"
  exit 1
else
  echo "OK: tidak ada 15+"
fi

echo "== grep: 8 Koleksi =="
if rg -n "8 Koleksi|8 koleksi" -i --glob "!web/scripts/verify-grep.sh" web/; then
  echo "FAIL: masih ada 8 Koleksi"
  exit 1
else
  echo "OK: tidak ada 8 Koleksi"
fi

echo "== grep: garansi lama (5 tahun / 1 tahun) =="
if rg -n "5 Tahun|5 tahun|1 Tahun|1 tahun" --glob "!web/scripts/verify-grep.sh" web/; then
  echo "FAIL: masih ada garansi lama"
  exit 1
else
  echo "OK: tidak ada garansi lama"
fi

echo "== grep: href="#" =="
if rg -n 'href="#"' --glob "!web/scripts/verify-grep.sh" web/; then
  echo "FAIL: masih ada href#"
  exit 1
else
  echo "OK: tidak ada href#"
fi

echo "== grep: 100% Kepuasan =="
if rg -n "100% Kepuasan" --glob "!web/scripts/verify-grep.sh" web/; then
  echo "FAIL: masih ada 100% Kepuasan"
  exit 1
else
  echo "OK: tidak ada 100% Kepuasan"
fi

echo "Semua grep lolos."
