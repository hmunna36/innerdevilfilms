#!/usr/bin/env bash
# film.js = the parts, in order (development only)
cd "$(dirname "$0")/.." && { echo "'use strict';"; cat parts/a_cast.js parts/b_sets.js parts/c_shots.js parts/d_*.js parts/e_*.js parts/z_film.js 2>/dev/null; } > film.js
