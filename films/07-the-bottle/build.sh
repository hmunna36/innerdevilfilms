#!/bin/sh
# film.js is built from the parts in src/ (in name order). Edit the parts, never film.js.
cd "$(dirname "$0")" && { echo "// BUILT by build.sh from src/*.js - edit the parts, not this file"; cat src/[0-9]*.js; } > film.js && echo "film.js: $(wc -l < film.js) lines"
