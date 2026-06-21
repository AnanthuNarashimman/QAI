#!/usr/bin/env bash
# Build the QAI Flask backend into a self-contained directory using PyInstaller.
# Run from the repo root:  bash backend/build_backend.sh
# Output:  backend/dist/qai-backend/
# Next:    cp -r backend/dist/qai-backend electron/resources/backend/
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# ── Activate venv ─────────────────────────────────────────────────────────────
if [ -f "venv/bin/activate" ]; then
  # shellcheck disable=SC1091
  source venv/bin/activate
  echo "[build] Using venv Python: $(which python)"
else
  echo "[build] No venv found — using system Python"
fi

# ── Ensure PyInstaller is installed ──────────────────────────────────────────
if ! python -c "import PyInstaller" 2>/dev/null; then
  echo "[build] Installing PyInstaller..."
  pip install pyinstaller --quiet
fi

echo "[build] PyInstaller $(python -c 'import PyInstaller; print(PyInstaller.__version__)')"

# ── Clean previous build ──────────────────────────────────────────────────────
rm -rf build/ dist/

# ── Run PyInstaller ───────────────────────────────────────────────────────────
echo "[build] Building qai-backend..."
pyinstaller app.spec --noconfirm

echo ""
echo "✓ Build complete: dist/qai-backend/"
echo ""
echo "Next steps:"
echo "  cp -r dist/qai-backend electron/resources/backend/"
echo "  # Then package the Electron app: cd electron && npm run build"
