#!/usr/bin/env bash
# The stage (the look of film 07) with the toolchain found (bin/env.sh):
#   stage.sh build films/NN-slug                      film.js from the film's src/
#   stage.sh render <folder> still|sheet|frames|cues|info …     = node stage/render.mjs (see its header)
#   stage.sh make <folder> [encode]                   every frame + the MP4 (films: after mix.py; Shorts: after short_mix.py)
#   stage.sh mix films/NN-slug | shorts/NN-slug       the sound: the film's mix.py, or stage/audio/short_mix.py for a Short
# Long renders: in the background with a log (reference/cloud.md).
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; . "$HERE/env.sh"; S="$IDF_REPO/stage"
cmd="${1:?usage: stage.sh build|render|make|mix …}"; shift
case "$cmd" in
  build) exec "$S/build.sh" "$@";;
  render) exec node "$S/render.mjs" "$@";;
  make) exec "$S/make.sh" "$@";;
  mix) if [ -f "$1/short.js" ]; then exec "$PYTHON" "$S/audio/short_mix.py" "$1"; else exec "$PYTHON" "$1/mix.py"; fi;;
  *) echo "usage: stage.sh build|render|make|mix …"; exit 1;;
esac
