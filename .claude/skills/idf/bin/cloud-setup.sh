#!/usr/bin/env bash
# The toolchain on a fresh Ubuntu cloud machine (a cloud routine starts from nothing every run). Safe to run again;
# nothing here needs a key. On the Mac it only checks what is there (~/.cache/cp has it all).
#   ffmpeg (apt, if missing) · a Python venv in ~/.cache/idf with numpy, scipy, soundfile, pillow (the mixes, QA)
#   engine/: npm ci (playwright-core) · a Chromium that playwright-core can drive: the image's own in /opt/pw-browsers,
#   else Remotion's headless shell (anim/: npm ci + `remotion browser ensure`), else Chrome for Testing's headless shell
#   (@puppeteer/browsers). The one that renders a test page is written to ~/.cache/idf/chrome-path.
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; . "$HERE/env.sh"
mkdir -p "$IDF_HOME"; LOG="$IDF_HOME/setup.log"; : >"$LOG"
say() { echo "cloud-setup: $*"; }
if [ "$(uname -s)" = "Linux" ]; then
  SUDO=""; [ "$(id -u)" != "0" ] && SUDO="sudo -n"
  if ! command -v ffmpeg >/dev/null; then say "installing ffmpeg"; DEBIAN_FRONTEND=noninteractive $SUDO apt-get update -y >>"$LOG" 2>&1; DEBIAN_FRONTEND=noninteractive $SUDO apt-get install -y --no-install-recommends ffmpeg >>"$LOG" 2>&1 || say "apt failed (see $LOG)"; fi
  if [ ! -x "$IDF_HOME/venv/bin/python3" ]; then python3 -m venv "$IDF_HOME/venv" >>"$LOG" 2>&1 || { $SUDO apt-get install -y python3-venv >>"$LOG" 2>&1; python3 -m venv "$IDF_HOME/venv" >>"$LOG" 2>&1; }; fi
  "$IDF_HOME/venv/bin/python3" -c "import numpy, scipy, soundfile, PIL" 2>/dev/null || "$IDF_HOME/venv/bin/python3" -m pip install -q numpy scipy soundfile pillow >>"$LOG" 2>&1 || say "pip failed (see $LOG)"
  [ -d "$IDF_ENGINE/node_modules/playwright-core" ] || (cd "$IDF_ENGINE" && npm ci --no-audit --no-fund >>"$LOG" 2>&1) || say "npm ci in engine/ failed (see $LOG)"
fi
. "$HERE/env.sh"
# a browser: the first candidate that really renders the engine's page
works() { IDF_CHROME="$1" timeout 90 node "$IDF_ENGINE/render.mjs" stills film films/03-lust --at 1.2 --out "$IDF_HOME/probe" >>"$LOG" 2>&1; }
if [ "$(uname -s)" = "Linux" ] && { [ ! -s "$IDF_HOME/chrome-path" ] || ! works "$(cat "$IDF_HOME/chrome-path")"; }; then
  : >"$IDF_HOME/chrome-path"; found=""
  for c in /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell /opt/pw-browsers/chromium-*/chrome-linux/chrome /opt/pw-browsers/chromium/chrome-linux/chrome "$(command -v chromium || true)" "$(command -v google-chrome || true)"; do
    [ -n "$c" ] && [ -x "$c" ] && works "$c" && { found="$c"; break; }
  done
  if [ -z "$found" ]; then
    say "no usable Chromium in the image; trying Remotion's headless shell"
    (cd "$IDF_REPO/anim" && { [ -d node_modules/remotion ] || npm ci --no-audit --no-fund >>"$LOG" 2>&1; } && npx remotion browser ensure >>"$LOG" 2>&1)
    for c in $(find "$IDF_REPO/anim/node_modules/.remotion" -type f -name 'chrome-headless-shell' 2>/dev/null); do works "$c" && { found="$c"; break; }; done
  fi
  if [ -z "$found" ]; then
    say "trying Chrome for Testing's headless shell"
    (cd "$IDF_HOME" && npx -y @puppeteer/browsers install chrome-headless-shell@stable --path "$IDF_HOME/browsers" >>"$LOG" 2>&1)
    for c in $(find "$IDF_HOME/browsers" -type f -name 'chrome-headless-shell' 2>/dev/null); do works "$c" && { found="$c"; break; }; done
  fi
  [ -n "$found" ] && echo "$found" >"$IDF_HOME/chrome-path"
fi
. "$HERE/env.sh"
ok=1; line() { printf '  %-11s %s\n' "$1" "$2"; }
[ -n "${FFMPEG:-}" ] && line ffmpeg "$("$FFMPEG" -hide_banner -version 2>/dev/null | head -1 | cut -c1-50)" || { line ffmpeg MISSING; ok=0; }
"$PYTHON" -c "import numpy, scipy, soundfile" 2>/dev/null && line python "$("$PYTHON" -V 2>&1) + numpy, scipy, soundfile" || { line python "MISSING numpy/scipy/soundfile"; ok=0; }
[ -n "${PLAYWRIGHT_MODULE:-}" ] && line playwright "$(node -p "require('$PLAYWRIGHT_MODULE/package.json').version")" || { line playwright MISSING; ok=0; }
if [ "$(uname -s)" = "Linux" ]; then [ -s "$IDF_HOME/chrome-path" ] && line browser "$(cat "$IDF_HOME/chrome-path")" || { line browser "NONE renders (see $LOG)"; ok=0; }
else line browser "${IDF_CHROME:-Google Chrome}"; fi
line jobs "$RENDER_JOBS browsers at once"
[ $ok = 1 ] && say "toolchain ready" || { say "toolchain INCOMPLETE; last lines of $LOG:"; tail -20 "$LOG"; exit 1; }
