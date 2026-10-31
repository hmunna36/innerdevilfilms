"""A Short's sound, cut from its film's finished mix by the Short's plan (short.js `audio`, or by default the picture's own
stretches): each piece is the film's mix from `from` to `to` placed at `at` (Short time), with short fades; `hits` are
booms that cover a jump in the music; the end fades out; then -14 LUFS, -2.5 dBTP (the AAC upload must stay under -1).
run: python engine/audio/short_mix.py shorts/15-lust-hook   (from anywhere; builds the film's mix first if it is missing)
writes shorts/NN-slug/mix.wav and prints a report: loudness, true peak, and every stretch where the phone band
(300 Hz-6 kHz) stays under -38 dBFS for more than 2 s (only a planned silence may)."""
import json, os, subprocess, sys
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, HERE)
import numpy as np
from mixlib import *

folder = sys.argv[1].rstrip('/')
info = json.loads(subprocess.run(['node', os.path.join(REPO, 'engine', 'render.mjs'), 'info', 'short', folder],
                                 capture_output=True, text=True, check=True, cwd=REPO).stdout)
plan = info['audio']
film_dir = os.path.join(REPO, plan['film'])
film_mix = os.path.join(film_dir, 'audio', 'mix.wav')
if not os.path.exists(film_mix):
    print('building the film mix first:', os.path.relpath(film_mix, REPO))
    subprocess.run([sys.executable, '-I', os.path.join(film_dir, 'mix.py')], check=True)
film = load(film_mix)

N = int(round(plan['dur'] * SR))
out = np.zeros((N + 3 * SR, 2))
for p in plan['pieces']:
    a, b = int(round(p['from'] * SR)), int(round(min(p['to'], len(film) / SR) * SR))
    x = fade(film[a:b], p.get('fi', .006), p.get('fo', .012)) * db(p.get('gain', 0))
    i = int(round(p['at'] * SR)); x = x[:max(0, len(out) - i)]
    out[i:i + len(x)] += x
for h in plan['hits']:
    y = stereo(boom()) * db(h.get('gain', -8)); i = int(round(h['at'] * SR)); y = y[:max(0, len(out) - i)]
    out[i:i + len(y)] += y
out = out[:N]
fo = int(plan.get('fadeOut', .8) * SR)
out[N - fo:] *= np.linspace(1, 0, fo)[:, None]
out = master(filt(out, 'high', 25), ceiling=-2.5)   # AAC can add a full dB on a hard transient (Short 19: +1.07)
dest = os.path.join(REPO, folder, 'mix.wav')
write(dest, out)

band = filt(filt(mono(out), 'high', 300), 'low', 6000)
w = int(.1 * SR); rms = np.array([np.sqrt((band[i:i + w] ** 2).mean()) for i in range(0, len(band) - w, w)])
quiet, run = [], None
for k, r in enumerate(20 * np.log10(rms + 1e-9) < -38):
    if r and run is None: run = k
    if not r and run is not None:
        if k - run > 20: quiet.append((round(run / 10, 1), round(k / 10, 1)))
        run = None
if run is not None and len(rms) - run > 20: quiet.append((round(run / 10, 1), round(len(rms) / 10, 1)))
print(json.dumps({'wrote': os.path.relpath(dest, REPO), 'seconds': round(len(out) / SR, 2), 'lufs': round(lufs(out), 2),
                  'true_peak_dbtp': round(true_peak(out), 2), 'phone_band_quiet_over_2s': quiet}))
