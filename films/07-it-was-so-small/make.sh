#!/bin/sh
# Render every frame (two browsers), then join the picture and audio/mix.wav into film07.mp4.
#   ./make.sh          render + encode        ./make.sh encode    only encode (frames already in out/frames)
cd "$(dirname "$0")" || exit 1
FF="${FFMPEG:-$HOME/.cache/cp/bin/ffmpeg}"
if [ "$1" != "encode" ]; then ./build.sh && rm -rf out/frames
  node render.mjs frames 0 55.3 > out/render_a.log 2>&1 & A=$!
  node render.mjs frames 55.3 110.5 > out/render_b.log 2>&1 & B=$!
  wait $A; RA=$?; wait $B; RB=$?; [ $RA -eq 0 ] && [ $RB -eq 0 ] || { echo "render failed ($RA, $RB)"; tail -3 out/render_a.log out/render_b.log; exit 1; }
fi
N=$(ls out/frames | wc -l | tr -d ' '); echo "frames: $N (want 3315)"
if [ -f audio/mix.wav ]; then "$FF" -y -loglevel error -framerate 30 -i out/frames/%05d.jpg -i audio/mix.wav -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -c:a aac -b:a 256k -shortest -movflags +faststart film07.mp4
else "$FF" -y -loglevel error -framerate 30 -i out/frames/%05d.jpg -c:v libx264 -pix_fmt yuv420p -crf 17 -preset medium -movflags +faststart film07_silent.mp4; fi
ls -la film07*.mp4
