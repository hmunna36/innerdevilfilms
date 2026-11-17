#!/bin/sh
# the shared engine does it: stage/make.sh (./make.sh  |  ./make.sh encode). On a Mac the film is drawn in the Mac font
# it was delivered in (17 Nov 2026); it writes film07.mp4 over the delivered master, so only run it to change the film.
[ "$(uname -s)" = "Darwin" ] && FONT="--font=mac" || FONT=""
exec "$(dirname "$0")/../../stage/make.sh" "$(cd "$(dirname "$0")" && pwd)" $FONT "$@"
