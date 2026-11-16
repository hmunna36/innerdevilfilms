#!/bin/sh
# A private test film for one part: dev.sh <name> builds dev-<name>/film.js from the kit, src/<NN>-<name>.js and
# dev-<name>/cut.js (a defineFilm with a few test shots). Render it: node engine/render.mjs stills film films/07-the-bottle/dev-<name> --at 1,2 --out <dir>
cd "$(dirname "$0")" && n="$1" && mkdir -p "dev-$n" && cat src/00-kit.js src/[0-9]*-"$n".js "dev-$n/cut.js" > "dev-$n/film.js" && echo "dev-$n/film.js: $(wc -l < "dev-$n/film.js") lines"
