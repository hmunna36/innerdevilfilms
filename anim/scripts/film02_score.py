#!/usr/bin/env python3
"""Original synthesized score + sound effects for FILM 01 v2 (DEVIL MODE), 152 s, 44.1 kHz stereo WAV.
Shape (from the script): a warm piano climb (Angel) -> near-silence and one laugh (humiliation) -> a dark
heartbeat pulse that grows (Devil) -> a swell, silence, one hit on the title. Mid frequencies are kept in every
section so it is audible on phone speakers. Counter ticks follow the same keyframes as Film01.tsx."""
import numpy as np, wave, pathlib

SR = 44100
DUR = 152.0
N = int(SR * DUR)
L = np.zeros(N); R = np.zeros(N)
rng = np.random.default_rng(7)

def at(t): return int(t * SR)

def add(sig, t, gain=1.0, pan=0.0):
    i = at(t); j = min(N, i + len(sig))
    if j <= i: return
    s = sig[: j - i] * gain
    L[i:j] += s * (1 - max(0, pan)); R[i:j] += s * (1 + min(0, pan))

def env(n, a=0.005, d=1.0, sustain=0.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4)) * (sustain + (1 - sustain) * np.exp(-t / d))
    return e

def piano(freq, dur=2.5, vel=0.5):
    n = int(SR * dur); t = np.arange(n) / SR
    s = np.zeros(n)
    for k, amp in enumerate([1, 0.5, 0.28, 0.16, 0.09, 0.05], start=1):
        s += amp * np.sin(2 * np.pi * freq * k * t * (1 + 0.0004 * k)) * np.exp(-t * (0.9 + 0.6 * k))
    s += 0.15 * np.sin(2 * np.pi * freq * t) * np.exp(-t * 6)  # attack body
    return s * env(n, 0.003, 1.6) * vel

def pad(freqs, dur, vel=0.12):
    n = int(SR * dur); t = np.arange(n) / SR
    s = np.zeros(n)
    for f in freqs:
        for det in (-0.6, 0.6):
            s += np.sin(2 * np.pi * (f + det) * t) + 0.3 * np.sin(2 * np.pi * 2 * (f + det) * t)
    fade = np.minimum(1, t / 1.5) * np.minimum(1, (dur - t) / 1.5)
    return s / (len(freqs) * 2) * fade * vel

def noise_band(n, lo, hi):
    x = rng.standard_normal(n)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR)
    X[(f < lo) | (f > hi)] = 0
    y = np.fft.irfft(X, n)
    return y / (np.abs(y).max() + 1e-9)

def tick(vel=0.25):
    n = int(SR * 0.03)
    return noise_band(n, 1800, 6000) * env(n, 0.0005, 0.006) * vel

def thump(vel=0.8):
    n = int(SR * 0.35); t = np.arange(n) / SR
    f = 55 + 60 * np.exp(-t * 30)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 9)
    s += 0.35 * noise_band(n, 400, 1600) * np.exp(-t * 60)   # a click so phones hear the beat
    return s * vel

def hit(vel=1.0, dur=3.0):
    n = int(SR * dur); t = np.arange(n) / SR
    s = np.sin(2 * np.pi * np.cumsum(40 + 50 * np.exp(-t * 8)) / SR) * np.exp(-t * 1.6)
    s += 0.4 * np.sin(2 * np.pi * 440 * t) * np.exp(-t * 2.2) + 0.25 * np.sin(2 * np.pi * 660.5 * t) * np.exp(-t * 2.6)
    s += 0.3 * noise_band(n, 300, 3000) * np.exp(-t * 14)
    return s * vel

def laugh():
    """One short, involuntary 'ha' — a glottal pulse train through two vowel formants."""
    dur = 0.42; n = int(SR * dur); t = np.arange(n) / SR
    pulses = np.zeros(n)
    for c in (0.0, 0.16):  # two syllables, "ha-ha", the second one smaller
        seg = (t >= c) & (t < c + 0.13)
        f0 = 210 - 40 * (t - c)
        pulses += seg * (np.sin(2 * np.pi * np.cumsum(f0) / SR) > 0.92) * (1.0 if c == 0 else 0.6)
    breath = noise_band(n, 600, 3500) * 0.25
    x = pulses + breath * (pulses > 0)
    X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR)
    shape = np.exp(-((f - 750) / 180) ** 2) + 0.7 * np.exp(-((f - 1200) / 220) ** 2) + 0.3 * np.exp(-((f - 2600) / 400) ** 2)
    y = np.fft.irfft(X * shape, n)
    y = y / (np.abs(y).max() + 1e-9)
    return y * env(n, 0.004, 0.25, 0.2)

def whoosh(dur=0.8, vel=0.12):
    n = int(SR * dur); t = np.arange(n) / SR
    return noise_band(n, 300, 4000) * np.sin(np.pi * t / dur) ** 2 * vel

def note(name):
    names = {"C": -9, "C#": -8, "D": -7, "D#": -6, "E": -5, "F": -4, "F#": -3, "G": -2, "G#": -1, "A": 0, "A#": 1, "B": 2}
    n, o = name[:-1], int(name[-1])
    return 440 * 2 ** ((names[n] + (o - 4) * 12) / 12)


def drums(t0, t1, bpm, vel=0.5):
    t = t0; b = 0
    while t < t1:
        add(thump(vel), t)
        if b % 2 == 1: add(noise_band(int(SR * 0.12), 1500, 7000) * env(int(SR * 0.12), 0.001, 0.05) * vel * 0.6, t)  # snare-ish
        add(tick(0.15 * vel), t + 30 / bpm)                                                                          # off-beat hat
        t += 60 / bpm; b += 1

def claps(t0, dur, vel=0.35):
    for k in range(int(dur * 14)):
        tt = t0 + k / 14 + rng.uniform(0, 0.05)
        n = int(SR * 0.05)
        add(noise_band(n, 900, 5000) * env(n, 0.001, 0.015) * vel * (0.4 + 0.6 * min(1, k / 20)) * min(1, (dur * 14 - k) / 25), tt, pan=rng.uniform(-0.6, 0.6))

# hook (0-3): a tense single note, the catch, ONE laugh, a hit into black
add(pad([220.0, 233.1, 440.0], 3.0, 0.16), 0.0)
add(laugh(), 2.0, 0.6, pan=0.3)
add(hit(0.6, 1.5), 3.0)
# Act 1: warm climb (4-46), A minor -> F -> C -> G, the Angel
beat = 60 / 76
prog = [["A3", "C4", "E4", "A4"], ["F3", "A3", "C4", "F4"], ["C3", "E3", "G3", "C4"], ["G3", "B3", "D4", "G4"]]
t = 4.2; bar = 0
while t < 45.5:
    chord = prog[bar % 4]
    dens = 1 if t < 18 else 2
    vel = 0.2 + 0.12 * min(1, (t - 4) / 40)
    add(pad([note(c) for c in chord[:3]], beat * 4 + 1.2, 0.06), t)
    for kk in range(4 * dens):
        add(piano(note(chord[kk % 4]), 2.4, vel * (1 if kk == 0 else 0.7)), t + kk * beat * 4 / (4 * dens), pan=0.2 * ((kk % 2) * 2 - 1))
    t += beat * 4; bar += 1
add(piano(note("E5"), 3, 0.28), 43.0); add(piano(note("A5"), 3, 0.24), 43.4)
# the presentation (46-56): music thins out; the catch; ONE laugh at 52; ringing silence
add(pad([220.0, 261.6, 329.6], 6.0, 0.06), 46.0)
add(laugh(), 52.0, 0.65, pan=0.3)
n = int(SR * 6); add(np.sin(2 * np.pi * 2093 * np.arange(n) / SR) * 0.03 * np.linspace(1, 0, n), 52.1)
# aftermath (56-73): a thin cold pad and sparse piano
add(pad([220.0, 261.6, 329.6], 18.0, 0.07), 55.5)
for nm, tt in [("A3", 57), ("E4", 60.5), ("C4", 64), ("B3", 68), ("A3", 71.5)]:
    add(piano(note(nm), 4, 0.17), tt)
# the Devil arrives (73-86): drone + heartbeat, a hit on "Let's do it my way"
dt_ = np.arange(int(SR * 13.5)) / SR
dr = sum(a * np.sin(2 * np.pi * f * dt_) for f, a in [(55, 0.5), (110, 0.35), (164.8, 0.2), (233.1, 0.12), (440, 0.04)])
add(dr * np.minimum(1, dt_ / 3) * 0.16, 73.0)
for tt in np.arange(74, 86, 60 / 64): add(thump(0.6), tt)
add(hit(0.8, 3), 79.0); add(hit(0.6, 2), 83.0)
mt = np.arange(int(SR * 13)) / SR                                       # mid-register throb so phones hear the Devil arrive
add((np.sin(2 * np.pi * 220 * mt) + 0.6 * np.sin(2 * np.pi * 311.1 * mt)) * (0.5 + 0.5 * np.sin(2 * np.pi * 1.07 * mt)) * 0.07 * np.minimum(1, mt / 2), 73.0)
# Devil mode montage (86-104): a driving 120 bpm beat with a mid-register riff
drums(86, 104, 120, 0.55)
riff = ["A3", "A3", "C4", "A3", "D4", "A3", "C4", "E4"]
for kk, tt in enumerate(np.arange(86, 104, 0.5)):
    add(piano(note(riff[kk % 8]) * 0.5, 0.6, 0.32), tt)
    add(np.sign(np.sin(2 * np.pi * note(riff[kk % 8]) * np.arange(int(SR * 0.4)) / SR)) * env(int(SR * 0.4), 0.002, 0.18) * 0.05, tt)
for tt in (87.5, 90.5, 93.5, 96.5, 99.5, 102.5): add(laugh(), tt, 0.3)
# the turn (104-112): the beat drops to a heartbeat, a rising tone
for tt in np.arange(104, 112, 60 / 70): add(thump(0.5), tt)
rt = np.arange(int(SR * 8)) / SR
add(np.sin(2 * np.pi * (220 + 220 * rt / 8) * rt) * 0.05 * np.minimum(1, rt / 2), 104.0)
# same room (112-123): tension pad; the catch at 117: near silence + heartbeat
add(pad([220.0, 233.1, 329.6], 5.5, 0.08), 112.0)
for tt in np.arange(117.2, 123, 60 / 58): add(thump(0.45), tt)
add(pad([440.0, 466.2], 6.0, 0.04), 117.0)
# he says it (123-133): a warm triumphant swell, the piano theme returns, applause at 129
t = 123.2; bar = 0
while t < 133:
    chord = prog[bar % 4]
    add(pad([note(c) for c in chord[:3]], beat * 4 + 1.5, 0.1), t)
    for kk in range(8):
        add(piano(note(chord[kk % 4]) * (2 if kk % 2 else 1), 2.4, 0.3), t + kk * beat / 2)
    t += beat * 4; bar += 1
claps(129.0, 5.5, 0.4)
# offstage (133-140): calm, a low devil note under the Angel's ember
add(pad([220.0, 277.2, 329.6], 7.5, 0.07), 133.0)
add(piano(note("A2"), 5, 0.22), 138.0)
# cards + title (140-152)
add(piano(note("A3"), 4, 0.25), 140.5); add(hit(0.7, 3), 143.0); add(hit(1.0, 4.5), 147.0)

COUNT = [(0, 0), (18, 0), (21, 1), (24, 1), (42, 40), (86, 40), (104, 300), (152, 300)]
ts = np.arange(0, DUR, 1 / 200)
vals = np.round(np.interp(ts, [c[0] for c in COUNT], [c[1] for c in COUNT]))
for kk in np.nonzero(np.diff(vals) > 0)[0]:
    tt = ts[kk + 1]
    add(tick(0.1 if tt > 86 else 0.22), tt)

mix = np.stack([L, R], axis=1)
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / (np.abs(mix).max() + 1e-9)
out = pathlib.Path(__file__).resolve().parents[1] / "public" / "audio" / "film02_mix.wav"
with wave.open(str(out), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("wrote", out)
