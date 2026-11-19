"""Measure the film's recordings before placing them (reference/film.md: "never trust a prompt's timing").
For every mp3 in audio/music and audio/sfx: length, loudness, how much of it a phone plays (300 Hz-6 kHz), the first
onset, the strongest onsets, a tempo estimate and the beat grid's phase, and a rough key (chroma).
run: $PYTHON films/08-envy/audio/measure.py [name ...]"""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.abspath(os.path.join(HERE, '..', '..', '..'))
sys.path.insert(0, os.path.join(REPO, 'engine', 'audio'))
import numpy as np
from mixlib import *

NOTES = ['C', 'C#', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B']
MAJ = np.array([6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88]); MIN = np.array([6.33, 2.68, 3.52, 5.38, 2.60, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17])


def env(x, hop=.01):
    n = int(hop * SR); k = len(x) // n; return np.sqrt((x[:k * n].reshape(k, n) ** 2).mean(axis=1) + 1e-12)


def onsets(x, hop=.01, thr=6.0):
    e = 20 * np.log10(env(filt(x, 'high', 120), hop)); d = np.diff(e, prepend=e[0]); out = []
    for i in range(1, len(d) - 1):
        if d[i] > thr and d[i] >= d[i - 1] and d[i] >= d[i + 1] and (not out or i * hop - out[-1][0] > .08): out.append((round(i * hop, 3), round(float(d[i]), 1)))
    return out


def tempo(x, lo=60, hi=180):
    hop = .005; e = env(filt(x, 'high', 120), hop); f = np.maximum(0, np.diff(np.log(e + 1e-6))); f -= f.mean()
    ac = np.correlate(f, f, 'full')[len(f) - 1:]; lags = np.arange(len(ac)) * hop
    best, bl = 0, 0
    for bpm in np.arange(lo, hi, .25):
        L = 60 / bpm; idx = [int(round(k * L / hop)) for k in (1, 2, 4) if k * L / hop < len(ac)]; s = sum(ac[i] for i in idx)
        if s > best: best, bl = s, bpm
    L = 60 / bl; ph = np.arange(0, L, hop); sc = [sum(f[int((p + k * L) / hop)] for k in range(int((len(f) * hop - p) / L)) if int((p + k * L) / hop) < len(f)) for p in ph]
    return round(float(bl), 2), round(float(ph[int(np.argmax(sc))]), 3)


def key(x):
    n = 1 << 15; ch = np.zeros(12)
    for a in range(0, len(x) - n, n // 2):
        sp = np.abs(np.fft.rfft(x[a:a + n] * np.hanning(n))); fr = np.fft.rfftfreq(n, 1 / SR); m = (fr > 60) & (fr < 2000)
        for f, v in zip(fr[m], sp[m]): ch[int(round(12 * np.log2(f / 261.63))) % 12] += v
    best = max(((np.corrcoef(np.roll(P, k), ch)[0, 1], NOTES[k] + (' major' if P is MAJ else ' minor')) for P in (MAJ, MIN) for k in range(12)))
    return best[1], round(float(best[0]), 2)


def decode(path):
    import subprocess, tempfile
    w = os.path.join(tempfile.gettempdir(), 'idf_measure.wav'); subprocess.run([ffmpeg(), '-v', 'error', '-y', '-i', path, '-ar', str(SR), '-ac', '2', '-c:a', 'pcm_s16le', w], check=True); return load(w)


def measure(path):
    x = mono(decode(path)); dur = len(x) / SR; ph = filt(filt(x, 'high', 300, 4), 'low', 6000, 4)
    share = float((ph ** 2).sum() / ((x ** 2).sum() + 1e-12)); sub = float((filt(x, 'low', 150, 4) ** 2).sum() / ((x ** 2).sum() + 1e-12))
    on = onsets(x); strong = sorted(on, key=lambda o: -o[1])[:8]
    r = {'seconds': round(dur, 3), 'phone_share_pct': round(100 * share), 'under150_pct': round(100 * sub), 'first_onset': on[0][0] if on else None, 'strongest_onsets': sorted(strong)}
    if dur > 6: r['tempo_bpm, beat_phase_s'] = tempo(x); r['key'] = key(x)
    last = np.nonzero(env(x) > env(x).max() * .03)[0]; r['sound_ends_s'] = round(float(last[-1] * .01), 2) if len(last) else 0
    return r


if __name__ == '__main__':
    want = sys.argv[1:]; out = {}
    for sub in ('music', 'sfx'):
        d = os.path.join(HERE, sub)
        for f in sorted(os.listdir(d)) if os.path.isdir(d) else []:
            if f.endswith('.mp3') and (not want or f[:-4] in want): out[sub + '/' + f[:-4]] = measure(os.path.join(d, f))
    for k, v in out.items(): print(k, json.dumps(v))
