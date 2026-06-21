#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# QAI Desktop — full production build
#
# Usage:
#   bash build.sh [linux|mac|win]   (default: linux)
#
# Prerequisites:
#   • Node.js ≥ 18 + npm
#   • Python 3.11+ with venv at backend/venv/
#   • backend/venv activated and requirements installed
#   • playwright install chromium  (auto-runs on first backend launch)
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

PLATFORM="${1:-linux}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

case "$PLATFORM" in
  linux|mac|win) ;;
  *) echo "Usage: bash build.sh [linux|mac|win]" >&2; exit 1 ;;
esac

sep() { echo ""; echo "──────────────────────────────────────────────────"; }

echo "╔══════════════════════════════════════════════════╗"
echo "  QAI Desktop Build  •  target: $PLATFORM"
echo "╚══════════════════════════════════════════════════╝"

# ── Step 1: React frontend ────────────────────────────────────────────────────
sep
echo "▸ 1/4  Building React frontend (Vite)..."
cd "$ROOT/qai-client"
npm install --silent
npm run build
echo "  ✓  qai-client/dist/ ready"

# ── Step 2: Python backend ────────────────────────────────────────────────────
sep
echo "▸ 2/4  Building Python backend (PyInstaller)..."
cd "$ROOT/backend"
bash build_backend.sh

BACKEND_DIST="$ROOT/backend/dist/qai-backend"
if [ ! -f "$BACKEND_DIST/qai-backend" ] && [ ! -f "$BACKEND_DIST/qai-backend.exe" ]; then
  echo "  ✗  PyInstaller output not found at $BACKEND_DIST" >&2
  exit 1
fi
echo "  ✓  backend/dist/qai-backend/ ready"

# ── Step 3: Stage backend into Electron resources ─────────────────────────────
sep
echo "▸ 3/4  Staging backend binary..."
STAGE="$ROOT/electron/resources/backend"
rm -rf "$STAGE/qai-backend"
mkdir -p "$STAGE"
cp -r "$BACKEND_DIST" "$STAGE/qai-backend"

# Ensure the binary is executable (cp may drop the bit on some systems)
if [ -f "$STAGE/qai-backend/qai-backend" ]; then
  chmod +x "$STAGE/qai-backend/qai-backend"
fi
echo "  ✓  electron/resources/backend/qai-backend/ staged"

# ── Step 4: Electron-builder packaging ────────────────────────────────────────
sep
echo "▸ 4/4  Packaging with electron-builder (target: $PLATFORM)..."
cd "$ROOT/electron"
npm install --silent
npm run "build:$PLATFORM"

sep
echo "╔══════════════════════════════════════════════════╗"
echo "  ✓  Build complete"
echo "  Output → dist-electron/"
echo "╚══════════════════════════════════════════════════╝"
