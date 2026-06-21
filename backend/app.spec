# -*- mode: python ; coding: utf-8 -*-
#
# PyInstaller spec for qai-backend (onedir mode — faster startup,
# easier to place into Electron's extraResources).
#
# Build with:   pyinstaller app.spec
# Output:       dist/qai-backend/   ← copy this directory to
#               electron/resources/backend/qai-backend/

from PyInstaller.utils.hooks import collect_all, collect_submodules

# ── Collect packages that carry data files or runtime assets ──────────────────
bu_datas, bu_bins, bu_hidden = collect_all('browser_use')
pw_datas, pw_bins, pw_hidden = collect_all('playwright')  # includes Node.js driver

a = Analysis(
    ['app.py'],
    pathex=['.'],
    binaries=[*bu_bins, *pw_bins],
    datas=[
        # Our own utils subpackage
        ('utils', 'utils'),
        # All browser_use assets (prompt templates, config files, etc.)
        *bu_datas,
        # Playwright Python package + Node.js driver binary + cli.js
        *pw_datas,
    ],
    hiddenimports=[
        # Flask ecosystem — dynamic imports not detected by PyInstaller
        'flask_cors',
        'flask_socketio',
        'engineio',
        'engineio.async_drivers',
        'engineio.async_drivers.threading',
        'socketio',
        'socketio.server',
        'socketio.namespace',
        'socketio.packet',
        'socketio.exceptions',
        # Google Generative AI
        'google.generativeai',
        'google.ai.generativelanguage_v1beta',
        'google.ai.generativelanguage_v1beta.types',
        'google.api_core',
        'google.auth',
        # Pydantic (browser-use uses v2 internals)
        'pydantic',
        'pydantic.v1',
        'pydantic_core',
        # Standard utils
        'dotenv',
        'requests',
        'urllib3',
        'networkx',
        # Playwright runtime
        'playwright',
        'playwright.async_api',
        'playwright.sync_api',
        'playwright._impl._driver',
        # Collected
        *bu_hidden,
        *pw_hidden,
        *collect_submodules('browser_use'),
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    # Strip heavy optional deps that aren't used
    excludes=[
        'oci',          # browser_use optional Oracle Cloud dep
        'boto3',        # AWS
        'anthropic',    # other LLM providers
        'openai',
        'cohere',
        'mistralai',
        'tkinter',
        'matplotlib',
        'scipy',
        'numpy',
        'pandas',
        'PIL',
    ],
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='qai-backend',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=False,      # UPX can break native extensions; disable for safety
    console=True,   # Keep console so backend logs appear in Electron console
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=False,
    name='qai-backend',
)
