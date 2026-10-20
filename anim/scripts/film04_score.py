#!/usr/bin/env python3
"""Original synthesized score + sound effects for FILM 01 v7 (DEVIL MODE: v6 re-cut, plus the v7 door, desk and text fixes), 152 s, 44.1 kHz stereo WAV.
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


# ================= extra instruments =================
def lowpass(x, fc):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR)
    X[f > fc] *= np.exp(-((f[f > fc] - fc) / (fc * 0.25)) ** 2)
    return np.fft.irfft(X, len(x))

def saw(freq, n, harm_max=5000, det=0.0):
    t = np.arange(n) / SR
    ph = 2 * np.pi * freq * (1 + det) * t
    x = np.zeros(n)
    for h in range(1, max(2, int(harm_max / freq)) + 1):
        x += np.sin(h * ph) / h
    return x

def choir(freqs, dur, vel=0.2, att=1.5, rel=1.5):
    n = int(SR * dur); t = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        vib = 1 + 0.004 * np.sin(2 * np.pi * 5.1 * t + rng.uniform(0, 6))
        for det in (-0.005, 0.0, 0.005):
            ph = 2 * np.pi * np.cumsum(f * (1 + det) * vib) / SR
            for h in range(1, int(3800 / f) + 1):
                x += np.sin(h * ph) / h
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(n, 1 / SR)
    S = (np.exp(-((fr - 700) / 120) ** 2) + 0.8 * np.exp(-((fr - 1150) / 140) ** 2) + 0.35 * np.exp(-((fr - 2600) / 260) ** 2)
         + 0.12 * np.exp(-((fr - 350) / 120) ** 2))
    y = np.fft.irfft(X * S, n); y /= (np.abs(y).max() + 1e-9)
    e = np.minimum(1, t / att) * np.minimum(1, (dur - t) / rel)
    return y * e * vel

def power(freq, dur, vel=0.3, drive=3.0):
    n = int(SR * dur); t = np.arange(n) / SR
    x = saw(freq, n, 4000, -0.003) + saw(freq * 1.4983, n, 4000, 0.003) + 0.6 * saw(freq * 2, n, 4000)
    x = np.tanh(x * drive / 3) ; x = lowpass(x, 3200)
    x /= (np.abs(x).max() + 1e-9)
    return x * np.minimum(1, t / 0.01) * np.exp(-t * 2.2) * vel

def chug(freq, vel=0.22):
    n = int(SR * 0.2); t = np.arange(n) / SR
    x = saw(freq, n, 3000) + saw(freq * 1.4983, n, 3000)
    x = lowpass(np.tanh(x * 1.2), 2600); x /= (np.abs(x).max() + 1e-9)
    return x * np.minimum(1, t / 0.004) * np.exp(-t * 14) * vel

def lead(freq, dur, vel=0.18):
    n = int(SR * dur); t = np.arange(n) / SR
    x = saw(freq, n, 7000, -0.004) + saw(freq, n, 7000, 0.004) + 0.4 * np.sin(2 * np.pi * freq * 0.5 * t)
    x = lowpass(x, 4500); x /= (np.abs(x).max() + 1e-9)
    return x * np.minimum(1, t / 0.02) * np.minimum(1, (dur - t) / 0.08) * (0.75 + 0.25 * np.exp(-t * 3)) * vel

def timp(freq=73.4, vel=0.6):
    n = int(SR * 1.6); t = np.arange(n) / SR
    f = freq * (1 + 0.12 * np.exp(-t * 25))
    x = np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.35 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR) * np.exp(-t * 6)
    x += 0.4 * noise_band(n, 200, 1200) * np.exp(-t * 40)
    return x * np.exp(-t * 2.6) * vel

def cymbal(dur=3.0, vel=0.3):
    n = int(SR * dur); t = np.arange(n) / SR
    return noise_band(n, 3000, 14000) * np.minimum(1, t / 0.003) * np.exp(-t * 1.3) * vel

def reverse_swell(dur=1.6, vel=0.3):
    return cymbal(dur, vel)[::-1] * np.linspace(0.3, 1, int(SR * dur))

def riser(dur, f0=110, f1=880, vel=0.15):
    n = int(SR * dur); t = np.arange(n) / SR
    f = f0 * (f1 / f0) ** (t / dur)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = sum(np.sin(h * ph) / h for h in range(1, 12))
    x += 0.6 * noise_band(n, 400, 6000) * (t / dur)
    x = lowpass(x, 5000)
    return x / (np.abs(x).max() + 1e-9) * (t / dur) ** 1.6 * vel

def bell(freq, vel=0.2, dur=2.5):
    n = int(SR * dur); t = np.arange(n) / SR
    x = sum(a * np.sin(2 * np.pi * freq * r * t) * np.exp(-t * d) for r, a, d in [(1, 1, 2.2), (2.76, 0.45, 3.5), (5.4, 0.25, 6), (8.9, 0.1, 9)])
    return x * np.minimum(1, t / 0.002) * vel

def buzz(dur=0.09, vel=0.2):
    n = int(SR * dur); t = np.arange(n) / SR
    x = np.sign(np.sin(2 * np.pi * 120 * t)) * 0.6 + noise_band(n, 1000, 5000) * 0.5
    return lowpass(x, 4000) * vel

def phone_buzz(vel=0.25):
    out = np.zeros(int(SR * 0.62)); n = int(SR * 0.2); t = np.arange(n) / SR
    p = lowpass(np.sign(np.sin(2 * np.pi * 168 * t)) + 0.4 * np.sign(np.sin(2 * np.pi * 336 * t)), 1800) * np.sin(np.pi * t / 0.2)
    out[:n] += p; out[int(SR * 0.32):int(SR * 0.32) + n] += p
    return out * vel

def paper(dur=0.9, vel=0.2):
    n = int(SR * dur); t = np.arange(n) / SR
    return noise_band(n, 1500, 7500) * np.sin(np.pi * t / dur) ** 1.5 * (0.6 + 0.4 * np.sin(2 * np.pi * 9 * t)) * vel

def step(vel=0.25):
    n = int(SR * 0.12); t = np.arange(n) / SR
    return (noise_band(n, 80, 600) * 0.8 + np.sin(2 * np.pi * 70 * t)) * np.exp(-t * 35) * vel

def breath(dur=1.2, vel=0.15):
    n = int(SR * dur); t = np.arange(n) / SR
    return noise_band(n, 500, 4500) * np.sin(np.pi * t / dur) ** 2 * vel

def bonk(vel=0.3):
    n = int(SR * 0.5); t = np.arange(n) / SR
    f = 200 * np.exp(-t * 1.5)
    return (np.sin(2 * np.pi * np.cumsum(f) / SR) + 0.3 * np.sin(4 * np.pi * np.cumsum(f) / SR)) * np.exp(-t * 7) * vel

def chaching(vel=0.3):
    return np.concatenate([bell(1568, 1, 0.9)[: int(SR * 0.9)] + 0.6 * bell(2093, 1, 0.9)[: int(SR * 0.9)]]) * vel

def rumble(dur, vel=0.3):
    n = int(SR * dur); t = np.arange(n) / SR
    x = noise_band(n, 25, 140) + 0.6 * np.sin(2 * np.pi * 41 * t) + 0.25 * noise_band(n, 140, 420)
    return x * (t / dur) ** 1.3 * vel

def angel_motif(t0, root, step_s=0.45, vel=0.25, major=False, octave=1):
    third = 4 if major else 3
    for i, semis in enumerate([0, third, 7, 12]):
        add(piano(root * octave * 2 ** (semis / 12), 3.0, vel), t0 + i * step_s)

A2, A3 = 110.0, 220.0


def braam(root=55.0, dur=2.6, vel=0.5):
    """A low brass 'braam': a stacked saw chord whose brightness opens on the attack, then closes."""
    n = int(SR * dur); t = np.arange(n) / SR
    x = sum(saw(root * r, n, 3200, d) for r, d in [(1, -0.003), (1.5, 0.002), (2, 0.004), (2.378, -0.002)])
    bright, darkx = lowpass(x, 2600), lowpass(x, 380)
    b = np.minimum(1, t / 0.12) * np.exp(-t * 1.6)
    y = darkx * (1 - b) + bright * b
    y /= (np.abs(y).max() + 1e-9)
    return y * np.minimum(1, t / 0.03) * np.exp(-t * 0.85) * vel

def strings(f1, f2, dur, vel=0.1, shape=1.4):
    n = int(SR * dur); t = np.arange(n) / SR
    x = lowpass(saw(f1, n, 5000, -0.003) + saw(f1, n, 5000, 0.003) + 0.7 * saw(f2, n, 5000), 3000)
    return x / (np.abs(x).max() + 1e-9) * (t / dur) ** shape * (1 + 0.15 * np.sin(2 * np.pi * 6 * t)) * vel

A2, A3 = 110.0, 220.0

# ================= COLD OPEN (0-4.4) =================
add(rumble(0.7, 0.45), 0.0); add(thump(0.55), 0.05); add(thump(0.35), 0.33)
add(hit(1.0, 3.0), 0.62); add(timp(55, 0.9), 0.62); add(braam(55, 2.8, 0.6), 0.62); add(cymbal(2.5, 0.2), 0.62)
add(choir([82.4, 110.0, 164.8, 220.0], 2.6, 0.22, att=0.2, rel=0.6), 0.65)
add(breath(1.1, 0.3), 1.8)
add(reverse_swell(0.6, 0.35), 2.4)
add(hit(0.9, 1.4), 3.0); add(cymbal(1.2, 0.2), 3.0)
add(tick(0.25), 3.5); add(tick(0.25), 4.1)

# ================= THE NOTICE (4.4-10.5) =================
# v7: steps outside stop at the door, the sheet slides out along the floor and skids to a stop, the steps walk away;
# Bean's own steps come in and he picks it up
for tt, v in ((4.45, 0.42), (4.72, 0.36)): add(lowpass(step(v), 420), tt)
add(paper(0.72, 0.42), 4.93)
add(noise_band(int(SR * 0.08), 900, 4000) * env(int(SR * 0.08), 0.002, 0.03) * 0.25, 5.6)
add(timp(65, 0.5), 5.64); add(thump(0.5), 5.64)
for tt, v in ((5.74, 0.34), (5.98, 0.26), (6.22, 0.18)): add(lowpass(step(v), 420), tt)
for tt in (6.0, 6.2, 6.42, 6.62):
    add(step(0.36), tt); add(noise_band(int(SR * 0.05), 700, 2500) * env(int(SR * 0.05), 0.001, 0.015) * 0.2, tt)   # heel click, for phone speakers
add(paper(0.3, 0.3), 6.86); add(paper(0.45, 0.28), 7.0)
add(whoosh(0.3, 0.25), 7.15); add(hit(0.55, 1.4), 7.3); add(piano(A2, 4, 0.3), 7.32)
add(hit(0.5, 1.0), 8.5); add(bell(1760, 0.08), 8.5); add(tick(0.3), 8.5)
add(pad([110.0, 130.8, 164.8], 1.6, 0.07), 9.25); add(piano(164.8, 3, 0.2), 9.4)

# ================= THE ANGEL (10.5-30.2) =================
add(phone_buzz(0.32), 10.65); add(bell(1318.5, 0.07, 0.6), 12.55)   # Mom's two texts (the phone in his hand, then her second bubble)
beat = 60 / 76
prog = [["A3", "C4", "E4", "A4"], ["F3", "A3", "C4", "F4"], ["C3", "E3", "G3", "C4"], ["G3", "B3", "D4", "G4"], ["A3", "C4", "E4", "A4"]]
t = 11.0; bar = 0
while t < 25.85:
    chord = prog[bar % 5]
    add(pad([note(c) for c in chord[:3]], beat * 4 + 1.0, 0.06 + 0.02 * (t > 16.7)), t)
    dens = 1 if t < 16.7 else 2
    for kk in range(4 * dens):
        tt = t + kk * beat * 4 / (4 * dens)
        if tt < 25.85: add(piano(note(chord[kk % 4]), 2.4, 0.2 * (1 if kk == 0 else 0.7)), tt, pan=0.2 * ((kk % 2) * 2 - 1))
    t += beat * 4; bar += 1
for i, f in enumerate([1046.5, 1318.5, 1760, 2093]): add(bell(f, 0.1), 16.7 + i * 0.07)
add(bell(1568, 0.07), 21.3)
add(tick(0.2), 23.25); add(whoosh(0.25, 0.1), 23.2)       # the lid opens
for tt in np.arange(24.0, 24.8, 0.085): add(tick(0.07 + 0.04 * rng.random()), tt)
add(tick(0.3), 24.84)                                      # Submit
add(whoosh(0.3, 0.12), 24.8); add(bell(1318.5, 0.09), 24.95); add(bell(1760, 0.06), 25.05)
add(whoosh(0.25, 0.25), 25.8); add(hit(0.7, 1.6), 25.95); add(bonk(0.4), 25.95); add(braam(55, 1.8, 0.25), 25.95)
add(pad([110.0, 130.8, 164.8], 4.4, 0.06), 26.0)
add(bell(1568, 0.07), 27.4)
add(timp(98, 0.35), 29.9); add(thump(0.4), 29.9)

# ================= THE DAYS SLIP (30.2-35.7) =================
for tt in (30.2, 31.1, 32.0, 32.9, 33.9, 34.8): add(whoosh(0.35, 0.2), tt - 0.12)
tt = 30.2
while tt < 35.6:
    add(tick(0.2), tt); tt += max(0.08, 0.35 - 0.05 * (tt - 30.2))
add(strings(440.0, 659.3, 5.5, 0.09), 30.2)
add(paper(0.7, 0.35), 32.95)
for tt in (34.0, 34.2, 34.4): add(bonk(0.3), tt)
add(reverse_swell(0.6, 0.3), 35.1)

# ================= THE FLOOR (35.7-48.8) =================
add(pad([55.0, 110.0, 164.8], 13.1, 0.07), 35.7); add(pad([440.0, 523.3], 13.1, 0.04), 35.7)
add(phone_buzz(0.3), 36.3)
add(hit(0.6, 2.5), 38.6); add(timp(49, 0.6), 38.6)
for f in (110.0, 130.8, 164.8): add(piano(f, 4, 0.22), 38.62)
add(bell(2093, 0.06), 39.9); add(bell(2637, 0.04), 40.3)
add(bell(1568, 0.06), 41.5)
for nm, tt in [("A3", 41.6), ("C4", 42.6), ("B3", 43.6), ("A3", 44.6), ("E3", 45.6)]: add(piano(note(nm), 3.5, 0.17), tt)
for i, (f, v) in enumerate([(1760, 0.07), (1318.5, 0.06), (1046.5, 0.045), (880, 0.03)]): add(bell(f, v), 47.3 + i * 0.3)

# ================= THE DEVIL'S ENTRY (48.8-69.0) =================
add(tick(0.45), 49.0); add(tick(0.45), 49.9)
add(rumble(10.4, 0.45), 50.2)
t = 50.6
while t < 60.3:
    bpm = 52 + 58 * min(1, (t - 50.6) / 9.7)
    add(thump(0.55 + 0.3 * min(1, (t - 50.6) / 9.7)), t); add(thump(0.32), t + 0.27)
    t += 60 / bpm
add(strings(440.0, 659.3, 10.2, 0.11, 1.0), 50.2)
add(braam(55, 2.4, 0.2), 52.4)
add(noise_band(int(SR * 1.8), 300, 3000) * np.linspace(0, 1, int(SR * 1.8)) ** 2 * 0.18, 54.4)
cr = np.arange(int(SR * 0.9)) / SR
add(np.sin(2 * np.pi * np.cumsum(220 - 90 * cr / 0.9) / SR) * noise_band(len(cr), 300, 2000) * 0.15, 54.6)
for tt in (55.0, 55.25, 55.5): add(timp(82, 0.3), tt)
add(noise_band(int(SR * 1.6), 200, 2400) * np.sin(np.pi * np.arange(int(SR * 1.6)) / int(SR * 1.6)) * 0.14, 56.2)
add(lowpass(saw(1760, int(SR * 0.4), 6000) + saw(1864.7, int(SR * 0.4), 6000), 5000) * np.exp(-np.arange(int(SR * 0.4)) / SR * 6) * 0.05, 57.8)
for tt in (57.9, 58.3, 58.8, 59.4): add(buzz(0.09, 0.3), tt)
add(choir([110.0, 164.8, 220.0, 261.6, 329.6], 4.3, 0.32, att=3.8, rel=0.3), 56.2)
add(reverse_swell(0.8, 0.4), 59.6)
add(hit(1.0, 4.0), 60.45); add(timp(55, 0.9), 60.45); add(braam(55, 3.0, 0.55), 60.45); add(cymbal(3.0, 0.2), 60.45)
add(choir([82.4, 110.0, 164.8, 220.0], 1.6, 0.22, att=0.1, rel=0.8), 60.5)
for i, tt in enumerate(np.arange(61.8, 64.2, 0.09)): add(timp(73.4, 0.18 + 0.4 * i / 27), tt)
add(riser(2.6, 110, 660, 0.22), 61.8)
add(choir([110.0, 164.8, 220.0, 261.6, 329.6, 440.0], 2.6, 0.34, att=1.8, rel=0.3), 61.8)
add(braam(55, 2.6, 0.4), 63.4)
add(strings(220.0, 329.6, 1.4, 0.08, 0.6), 64.4)
dn = np.arange(int(SR * 2.6)) / SR
add((np.sin(2 * np.pi * 55 * dn) + 0.5 * np.sin(2 * np.pi * 110 * dn) + 0.3 * np.sin(2 * np.pi * 220 * dn)) * 0.12 * np.minimum(1, (2.6 - dn) / 0.2), 65.8)
add(breath(1.8, 0.32), 66.0)
# 68.4 - 69.0: total silence
add(hit(1.2, 4.5), 69.0); add(timp(55, 1.0), 69.0); add(cymbal(4.0, 0.35), 69.0); add(power(110, 1.8, 0.4), 69.0); add(braam(55, 3.0, 0.7), 69.0)
add(choir([220.0, 261.6, 329.6, 440.0, 523.3], 3.5, 0.3, att=0.1, rel=1.5), 69.02)

# ================= DEVIL MODE (69.0-100.8) =================
B = 60 / 128; BAR = 4 * B
roots = [55.0, 43.65, 65.41, 49.0]
chords = [[220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [261.6, 329.6, 392.0], [196.0, 246.9, 293.7]]
motif = [440.0, 523.3, 659.3, 880.0]   # the Angel's notes as the Devil's lead: the audio clue
FULL = 69.0 + 4 * BAR
t = 69.0; bar = 0
while t < 100.8 - 0.01:
    full = t >= FULL - 0.01
    r = roots[bar % 4]
    add(choir(chords[bar % 4], BAR + 0.3, 0.12 if full else 0.16, att=0.2, rel=0.3), t)
    if full:
        for kk in range(8): add(chug(r * 2, 0.22), t + kk * B / 2)
        for kk in range(4):
            if kk in (0, 2): add(thump(0.8), t + kk * B)
            else:
                add(noise_band(int(SR * 0.16), 1500, 8000) * env(int(SR * 0.16), 0.001, 0.06) * 0.42, t + kk * B); add(timp(196, 0.12), t + kk * B)
        for kk in range(8): add(tick(0.12), t + kk * B / 2 + B / 4)
        mel = motif if bar % 2 == 0 else [784.0, 659.3, 523.3, 587.3]
        for i, f in enumerate(mel): add(lead(f, B * 0.9, 0.13 if bar % 2 == 0 else 0.11), t + i * B)
    else:
        add(power(r * 2, BAR, 0.18), t); add(thump(0.6), t); add(thump(0.45), t + 2 * B)
    t += BAR; bar += 1
add(noise_band(int(SR * 0.3), 300, 1500) * 0.15, 73.25); add(timp(180, 0.3), 73.65); add(hit(0.45, 0.8), 73.95); add(thump(0.7), 73.95)
add(braam(55, 1.2, 0.35), 74.5); add(tick(0.2), 75.9)
add(riser(2.5, 110, 880, 0.18), FULL - 2.5); add(hit(0.7, 1.6), FULL)
for pt in (78.6, 82.6, 88.8, 90.2, 96.4): add(chaching(0.32), pt)
add(bonk(0.4), 84.9); add(braam(55, 1.0, 0.35), 86.1)
add(riser(2.1, 220, 1760, 0.2), 95.5); add(hit(0.9, 1.4), 97.6); add(chaching(0.4), 97.62)
cut = int(100.8 * SR); L[cut:] *= 0; R[cut:] *= 0     # hard stop

# ================= THE COST (101.0-107.6) =================
hn = np.arange(int(SR * 2.6)) / SR
add((np.sin(2 * np.pi * 110 * hn) + 0.4 * np.sin(2 * np.pi * 220 * hn)) * 0.05, 101.0)
add(lowpass(phone_buzz(0.3), 2200), 101.05); add(lowpass(phone_buzz(0.26), 2200), 101.95)   # Ava: we are in the drawer with the phone
for tt in (101.05, 101.37, 101.95, 102.27): add(noise_band(int(SR * 0.2), 180, 900) * env(int(SR * 0.2), 0.004, 0.08) * 0.22, tt)   # rattling on the wood
for i, f in enumerate([220.0, 261.6, 329.6, 440.0]): add(piano(f, 3.5, 0.2), 103.7 + i * 0.55)
add(pad([110.0, 130.8, 164.8], 2.6, 0.06), 103.6)
add(choir([55.0, 82.4, 110.0], 1.7, 0.2, att=0.4, rel=0.5), 106.0); add(thump(0.5), 106.2); add(thump(0.5), 106.95)

# ================= DAY ZERO (107.6-116.4) =================
add(bell(880, 0.12), 107.8); add(bell(1318.5, 0.12), 107.95); add(bell(880, 0.12), 108.6); add(bell(1318.5, 0.12), 108.75)
add(pad([130.8, 196.0, 293.7, 329.6], 3.0, 0.08), 107.6)
add(lowpass(phone_buzz(0.27), 1200), 110.2)                     # Mom's thank-you, in the drawer
add(noise_band(int(SR * 0.42), 250, 1400) * env(int(SR * 0.42), 0.03, 0.25, 0.4) * 0.3, 110.95); add(thump(0.35), 111.38)   # he pulls the drawer open
add(pad([130.8, 196.0, 293.7, 329.6, 392.0], 4.6, 0.11), 110.6)
for i, f in enumerate([261.6, 329.6, 392.0, 523.3]): add(piano(f, 3, 0.18), 111.0 + i * 0.45)
add(breath(1.6, 0.22), 112.0)
add(pad([174.6, 220.0, 261.6, 392.0], 2.2, 0.08), 114.4)

# ================= THE REVEAL (116.4-142.0) =================
dr = np.arange(int(SR * 6.4)) / SR
add((np.sin(2 * np.pi * 55 * dr) + 0.3 * np.sin(2 * np.pi * 110 * dr) + 0.08 * noise_band(len(dr), 2000, 6000)) * 0.08 * np.minimum(1, dr / 1.5), 116.4)
add(tick(0.14), 116.8); add(tick(0.14), 117.8)
add(strings(220.0, 329.6, 1.6, 0.06, 0.8), 118.2)
angel_motif(119.8, A2, 0.5, 0.3)
add(braam(55, 1.6, 0.25), 121.6)
add(reverse_swell(1.7, 0.3), 123.0); add(riser(1.9, 220, 880, 0.12), 122.8)
add(choir([110.0, 138.6, 164.8, 220.0, 277.2, 329.6], 4.5, 0.32, att=0.15, rel=2.5), 124.7)
for i, f in enumerate([880, 1108.7, 1318.5, 1760, 2217.5]): add(bell(f, 0.1), 124.7 + i * 0.08)
add(hit(0.4, 1.5), 124.7)
angel_motif(124.8, A3, 0.42, 0.32, major=True)
add(bell(1318.5, 0.08), 127.6); add(bell(2093, 0.06), 128.8)
add(pad([220.0, 277.2, 329.6], 5.2, 0.09), 130.2); add(pad([185.0, 220.0, 277.2], 2.0, 0.08), 133.6)
for nm, tt in [("C#4", 130.6), ("E4", 131.6), ("A4", 132.8)]: add(piano(note(nm), 3, 0.15), tt)
add(bell(1760, 0.06), 135.4)
for i, ch in enumerate([[146.8, 185.0, 220.0], [110.0, 138.6, 164.8], [164.8, 207.7, 246.9], [110.0, 138.6, 164.8, 220.0]]):
    add(pad(ch, 1.8, 0.1), 136.8 + i * 1.3)
    for kk, f in enumerate(ch): add(piano(f * 2, 2.5, 0.15), 136.8 + i * 1.3 + kk * 0.16)

# ================= END CARD (142-152) =================
add(pad([110.0, 138.6, 164.8], 6.0, 0.08), 142.2)
angel_motif(142.6, A3, 0.6, 0.24, major=True)
add(piano(A2, 5, 0.26), 145.0)
add(hit(0.9, 2.2), 148.0); add(timp(55, 0.7), 148.0); add(choir([110.0, 164.8, 220.0, 277.2], 2.0, 0.22, att=0.05, rel=1.4), 148.0)
add(pad([440.0, 554.4, 659.3], 3.8, 0.05), 144.0)


# ================= phone-speaker audibility (300 Hz - 6 kHz) =================
add(pad([440.0, 523.3, 659.3], 3.6, 0.05), 26.6)        # "Again?" / "Tomorrow."
add(piano(329.6, 3, 0.16), 35.75); add(pad([329.6, 440.0], 2.0, 0.04), 35.7)
add(strings(880.0, 1318.5, 3.0, 0.035, 0.6), 49.2)      # a thin high tension under the clock
add(pad([440.0, 554.4, 659.3], 4.4, 0.05), 114.0)       # relief into the reveal
add(pad([554.4, 659.3, 880.0], 4.6, 0.045), 146.6)      # end card

# ================= master =================
mix = np.stack([L, R], axis=1)
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / (np.abs(mix).max() + 1e-9)
out = pathlib.Path(__file__).resolve().parents[1] / "public" / "audio" / "film04_mix.wav"
with wave.open(str(out), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("wrote", out)
