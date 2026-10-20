#!/usr/bin/env bash
# Render one composition:  render.sh <Composition> <out.mp4> [extra remotion flags]   (stills: render.sh still <Comp> <out.png> <frame>)
# Long renders: run it in the background with a log (reference/cloud.md).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; . "$HERE/env.sh"
cd "$IDF_ANIM"
BROWSER=(); [ -n "${IDF_CHROME:-}" ] && BROWSER=(--browser-executable="$IDF_CHROME")
if [ "$1" = "still" ]; then shift; exec npx remotion still src/index.ts "$1" "$2" --frame="$3" "${BROWSER[@]}" --log=error; fi
COMP="$1"; OUT="$2"; shift 2
exec npx remotion render src/index.ts "$COMP" "$OUT" --codec h264 --crf 18 --concurrency="$RENDER_JOBS" "${BROWSER[@]}" "$@"
