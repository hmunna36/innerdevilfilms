# Source before any manual command:  . .claude/skills/idf/bin/env.sh
# Finds the toolchain on either machine and never prints a key:
#   the cloud: ~/.cache/idf from bin/cloud-setup.sh (Python venv, the browser's path), engine/node_modules, apt's ffmpeg
#   the Mac:   ~/.cache/cp (Python venv with numpy/scipy/soundfile, a small ffmpeg, playwright-core) and Google Chrome
_idf_here="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
export IDF_SKILL="$(cd "$_idf_here/.." && pwd)"
export IDF_REPO="${IDF_REPO:-$(cd "$IDF_SKILL/../../.." && pwd)}"
export IDF_ENGINE="$IDF_REPO/engine"
export IDF_HOME="${IDF_HOME:-$HOME/.cache/idf}"
if [ -x "$IDF_HOME/venv/bin/python3" ]; then export PYTHON="$IDF_HOME/venv/bin/python3"
elif [ -x "$HOME/.cache/cp/venv/bin/python" ]; then export PYTHON="$HOME/.cache/cp/venv/bin/python"
else export PYTHON="${PYTHON:-python3}"; fi
if [ -z "${FFMPEG:-}" ]; then
  if [ -x "$HOME/.cache/cp/bin/ffmpeg" ] && [ "$(uname -s)" = "Darwin" ]; then export FFMPEG="$HOME/.cache/cp/bin/ffmpeg" FFPROBE="$HOME/.cache/cp/bin/ffprobe"
  elif command -v ffmpeg >/dev/null 2>&1; then export FFMPEG="$(command -v ffmpeg)" FFPROBE="$(command -v ffprobe)"; fi
fi
if [ -z "${PLAYWRIGHT_MODULE:-}" ]; then
  if [ -d "$IDF_ENGINE/node_modules/playwright-core" ]; then export PLAYWRIGHT_MODULE="$IDF_ENGINE/node_modules/playwright-core"
  elif [ -d "$HOME/.cache/cp/node/node_modules/playwright-core" ]; then export PLAYWRIGHT_MODULE="$HOME/.cache/cp/node/node_modules/playwright-core"; fi
fi
[ -z "${IDF_CHROME:-}" ] && [ -s "$IDF_HOME/chrome-path" ] && export IDF_CHROME="$(cat "$IDF_HOME/chrome-path")"
# browsers that render at once: one per CPU, at most one per 1.6 GB of memory, at most 6
_idf_cpu="$( (nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 2) )"
_idf_mem="$( (awk '/MemTotal/ {print int($2/1024/1024)}' /proc/meminfo 2>/dev/null || echo $(( $(sysctl -n hw.memsize 2>/dev/null || echo 4294967296) / 1073741824 ))) | head -1)"
export RENDER_JOBS="${RENDER_JOBS:-$(awk -v c="$_idf_cpu" -v m="$_idf_mem" 'BEGIN { n = int(m / 1.6); if (c < n) n = c; if (n > 6) n = 6; if (n < 1) n = 1; print n }')}"
unset _idf_here _idf_cpu _idf_mem
