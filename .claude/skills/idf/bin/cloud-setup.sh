#!/usr/bin/env bash
# Install the toolchain on a fresh Ubuntu cloud machine (a cloud routine starts from nothing every run). Safe to
# run again. Nothing here needs a key. On a Mac it only checks that anim/node_modules exists.
#   ffmpeg (apt, for QA frames) · Python venv with numpy + pillow (scores, QA) · anim/ npm ci (Remotion)
#   a browser for Remotion: its own headless shell (`remotion browser ensure`), else the image's Chromium
set -uo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; . "$HERE/env.sh"
mkdir -p "$IDF_HOME"; LOG="$IDF_HOME/setup.log"; : >"$LOG"
say() { echo "cloud-setup: $*"; }
if [ "$(uname -s)" = "Linux" ]; then
  SUDO=""; [ "$(id -u)" != "0" ] && SUDO="sudo -n"
  if ! command -v ffmpeg >/dev/null; then say "installing ffmpeg"; DEBIAN_FRONTEND=noninteractive $SUDO apt-get update -y >>"$LOG" 2>&1; DEBIAN_FRONTEND=noninteractive $SUDO apt-get install -y --no-install-recommends ffmpeg fonts-dejavu-core >>"$LOG" 2>&1 || say "apt failed (see $LOG)"; fi
  if [ ! -x "$IDF_HOME/venv/bin/python3" ]; then python3 -m venv "$IDF_HOME/venv" >>"$LOG" 2>&1 || { $SUDO apt-get install -y python3-venv >>"$LOG" 2>&1; python3 -m venv "$IDF_HOME/venv" >>"$LOG" 2>&1; }; fi
  "$IDF_HOME/venv/bin/python3" -c "import numpy, PIL" 2>/dev/null || "$IDF_HOME/venv/bin/python3" -m pip install -q numpy pillow >>"$LOG" 2>&1 || say "pip failed (see $LOG)"
fi
. "$HERE/env.sh"
if [ ! -d "$IDF_ANIM/node_modules/remotion" ]; then say "npm ci in anim/"; (cd "$IDF_ANIM" && npm ci --no-audit --no-fund >>"$LOG" 2>&1) || say "npm ci failed (see $LOG)"; fi
if [ "$(uname -s)" = "Linux" ] && [ ! -s "$IDF_HOME/chrome-path" ]; then
  if (cd "$IDF_ANIM" && npx remotion browser ensure >>"$LOG" 2>&1); then echo "remotion" >"$IDF_HOME/chrome-path.kind"; : >"$IDF_HOME/chrome-path"
  else
    for c in /opt/pw-browsers/chromium-*/chrome-linux/chrome /opt/pw-browsers/chromium "$(command -v chromium || true)" "$(command -v google-chrome || true)"; do
      [ -n "$c" ] && [ -x "$c" ] && "$c" --version >/dev/null 2>&1 && { echo "$c" >"$IDF_HOME/chrome-path"; break; }
    done
  fi
fi
ok=1; line() { printf '  %-10s %s\n' "$1" "$2"; }
command -v ffmpeg >/dev/null && line ffmpeg "$(ffmpeg -hide_banner -version 2>/dev/null | head -1 | cut -c1-50)" || { [ "$(uname -s)" = "Linux" ] && { line ffmpeg MISSING; ok=0; }; }
"$PYTHON" -c "import numpy, PIL" 2>/dev/null && line python "$("$PYTHON" -V 2>&1) + numpy, pillow" || { line python "MISSING numpy/pillow"; ok=0; }
[ -d "$IDF_ANIM/node_modules/remotion" ] && line remotion "$(node -p "require('$IDF_ANIM/node_modules/remotion/package.json').version")" || { line remotion MISSING; ok=0; }
line browser "${IDF_CHROME:-the Remotion headless shell}"
[ $ok = 1 ] && say "toolchain ready" || { say "toolchain INCOMPLETE; last lines of $LOG:"; tail -20 "$LOG"; exit 1; }
