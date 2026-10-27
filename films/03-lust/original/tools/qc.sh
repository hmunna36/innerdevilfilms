#!/bin/zsh
# Checks the finished MP4: streams and length, a contact sheet of six key frames, and the delivered loudness.
set -e
MP4="${1:-$HOME/Desktop/lust-film/LUST - It Watches Back.mp4}"; OUT="${2:-/tmp}"
FF=~/.cache/cp/bin/ffmpeg; FP=~/.cache/cp/bin/ffprobe
$FP -v error -show_entries stream=codec_name,width,height,r_frame_rate,sample_rate,channels,duration -show_entries format=duration,size -of compact=p=0 "$MP4"
$FF -v error -y -i "$MP4" -ss 3.6 -frames:v 1 "$OUT/qc_first.png"
$FF -v error -y -i "$MP4" -vn -ar 48000 -ac 2 -c:a pcm_s16le "$OUT/qc_audio.wav"
cd ~/Desktop/lust-film/tools && ~/.cache/cp/venv/bin/python -I -c "
import sys; sys.path.insert(0, '.')
from mixlib import load, lufs, true_peak
x = load('$OUT/qc_audio.wav'); print('delivered audio: %.2f LUFS, true peak %.2f dBTP, %.2f s' % (lufs(x), true_peak(x), len(x) / 48000))"
echo "sheet: $OUT/qc_sheet.png"
