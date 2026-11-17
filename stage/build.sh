#!/bin/sh
# stage/build.sh <film folder>: film.js is built from the parts in the film's src/ (in name order). Edit the parts, never film.js.
F="${1:?usage: stage/build.sh films/NN-slug}"; cd "$F" && { echo "// BUILT by stage/build.sh from src/*.js - edit the parts, not this file"; cat src/[0-9]*.js; } > film.js && echo "film.js: $(wc -l < film.js) lines"
