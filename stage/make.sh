#!/bin/sh
# stage/make.sh <folder> [encode] [--font=mac]
# A film (films/NN-slug): build film.js, write cues_edit.json, render every frame (a few browsers at once), join the picture with
# audio/mix.wav into filmNN.mp4. A Short (shorts/NN-slug): the same from its short.js, with its mix.wav, into shortNN.mp4.
#   encode: only join (the frames are already in <folder>/out/frames).  Build the sound first (the film's mix.py, or
#   stage/audio/short_mix.py for a Short): without it the MP4 is silent and is named *_silent.mp4.
STAGE="$(cd "$(dirname "$0")" && pwd)"; REPO="$(cd "$STAGE/.." && pwd)"
F="${1:?usage: stage/make.sh <folder> [encode]}"; shift; cd "$F" || exit 1; F="$(pwd)"
ENC=""; FONT=""; for a in "$@"; do case "$a" in encode) ENC=1;; --font=*) FONT="$a";; esac; done
FF="${FFMPEG:-$HOME/.cache/cp/bin/ffmpeg}"; [ -x "$FF" ] || FF="$(command -v ffmpeg)"
PY="${PYTHON:-python3}"; NN="$(basename "$F" | cut -c1-2)"
if [ -f short.js ]; then KIND=short; MIX=mix.wav; FILM="$REPO/$(sed -n 's|^// *film: *||p' short.js | head -1)"; else KIND=film; MIX=audio/mix.wav; FILM="$F"; fi
if [ -z "$ENC" ]; then "$STAGE/build.sh" "$FILM" && rm -rf out/frames && mkdir -p out
  node "$STAGE/render.mjs" "$F" cues $FONT > /dev/null || exit 1
  END=$("$PY" -c "import json;print(json.load(open('cues_edit.json'))['END'])")
  # the frames in chunks, one browser each: STAGE_JOBS, else RENDER_JOBS on Linux (bin/env.sh), else 2 (the Mac has 8 GB)
  J="${STAGE_JOBS:-}"; [ -z "$J" ] && { [ "$(uname -s)" = "Linux" ] && J="${RENDER_JOBS:-4}" || J=2; }
  PIDS=""; i=0; while [ $i -lt $J ]; do
    A=$("$PY" -c "print(round($END*$i/$J*30)/30)"); B=$("$PY" -c "print($END if $i+1==$J else round($END*($i+1)/$J*30)/30)")
    node "$STAGE/render.mjs" "$F" frames $A $B $FONT > out/render_$i.log 2>&1 & PIDS="$PIDS $!"; i=$((i+1)); done
  BAD=0; for p in $PIDS; do wait $p || BAD=1; done
  [ $BAD -eq 0 ] || { echo "render failed"; tail -3 out/render_*.log; exit 1; }
fi
N=$(ls out/frames | wc -l | tr -d ' '); echo "frames: $N"
if [ -f "$MIX" ]; then OUT="$KIND$NN.mp4"; "$FF" -y -loglevel error -framerate 30 -i out/frames/%05d.jpg -i "$MIX" -vf "scale=out_range=tv,format=yuv420p" -color_range tv -c:v libx264 -crf 17 -preset medium -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT"
else OUT="$KIND${NN}_silent.mp4"; "$FF" -y -loglevel error -framerate 30 -i out/frames/%05d.jpg -vf "scale=out_range=tv,format=yuv420p" -color_range tv -c:v libx264 -crf 17 -preset medium -movflags +faststart "$OUT"; fi
ls -la "$OUT"
