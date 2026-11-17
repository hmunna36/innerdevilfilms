#!/bin/sh
# the shared engine does it: stage/build.sh
exec "$(dirname "$0")/../../stage/build.sh" "$(cd "$(dirname "$0")" && pwd)"
