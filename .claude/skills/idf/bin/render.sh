#!/usr/bin/env bash
# The engine's renderer with the toolchain found (bin/env.sh): the same arguments as engine/render.mjs, e.g.
#   render.sh short shorts/15-lust-hook          render.sh film films/04-gambling
#   render.sh sheet short shorts/15-lust-hook --every 1 --cols 8 --width 240 --safe --out /tmp/sheet.jpg
#   render.sh stills film films/04-gambling --at 3,12.5 --out /tmp/st      render.sh thumb films/04-gambling
# Long renders: in the background with a log (reference/cloud.md).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; . "$HERE/env.sh"
exec node "$IDF_ENGINE/render.mjs" "$@"
