#!/usr/bin/env bash
# Render one composition:  render.sh <Composition> <out.mp4> [extra remotion flags]   (stills: render.sh still <Comp> <out.png> <frame>)
# Long renders: run it in the background with a log (reference/cloud.md).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; . "$HERE/env.sh"
abs() { case "$1" in /*) echo "$1";; *) echo "$PWD/$1";; esac; }   # an output path is relative to where you call from
BROWSER=(); [ -n "${IDF_CHROME:-}" ] && BROWSER=(--browser-executable="$IDF_CHROME")
if [ "$1" = "still" ]; then OUT="$(abs "$3")"; cd "$IDF_ANIM"; exec npx remotion still src/index.ts "$2" "$OUT" --frame="$4" "${BROWSER[@]}" --log=error; fi
COMP="$1"; OUT="$(abs "$2")"; shift 2
cd "$IDF_ANIM"
exec npx remotion render src/index.ts "$COMP" "$OUT" --codec h264 --crf 18 --concurrency="$RENDER_JOBS" "${BROWSER[@]}" "$@"
