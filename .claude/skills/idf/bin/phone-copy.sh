#!/usr/bin/env bash
# A small archive copy for git (1280 wide for a film, 720x1280 for a Short):  phone-copy.sh <in.mp4> <out.mp4>
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"; . "$HERE/env.sh"
WH=$("$FFPROBE" -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$1")
case "$WH" in 1080,1920) S="720:-2";; *) S="1280:-2";; esac
"$FFMPEG" -v error -y -i "$1" -vf "scale=$S" -c:v libx264 -crf 27 -preset medium -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart "$2"
ls -la "$2"
