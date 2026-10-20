# Source before any manual command:  . .claude/skills/idf/bin/env.sh
# Finds the toolchain on either machine (cloud: ~/.cache/idf from cloud-setup.sh; the Mac: the project's own
# node_modules) and never prints a key.
_idf_here="$(cd "$(dirname "${BASH_SOURCE[0]:-$0}")" && pwd)"
export IDF_SKILL="$(cd "$_idf_here/.." && pwd)"
export IDF_REPO="${IDF_REPO:-$(cd "$IDF_SKILL/../../.." && pwd)}"
export IDF_ANIM="$IDF_REPO/anim"
export IDF_HOME="${IDF_HOME:-$HOME/.cache/idf}"
if [ -x "$IDF_HOME/venv/bin/python3" ]; then export PYTHON="$IDF_HOME/venv/bin/python3"; else export PYTHON="${PYTHON:-python3}"; fi
[ -z "${IDF_CHROME:-}" ] && [ -s "$IDF_HOME/chrome-path" ] && export IDF_CHROME="$(cat "$IDF_HOME/chrome-path")"
export RENDER_JOBS="${RENDER_JOBS:-$( (nproc 2>/dev/null || sysctl -n hw.ncpu 2>/dev/null || echo 2) | awk '{n=$1; if(n>8)n=8; print n}')}"
unset _idf_here
