#!/usr/bin/env python3
"""Original synthesized score + sound effects for FILM 01 v3 (DEVIL MODE: the stakes + the twist), 166 s, 44.1 kHz stereo WAV.
Shape (from the script): a warm piano climb (Angel) -> near-silence and one laugh (humiliation) -> a dark
heartbeat pulse that grows (Devil) -> a swell, silence, one hit on the title. Mid frequencies are kept in every
section so it is audible on phone speakers. Counter ticks follow the same keyframes as Film01.tsx."""
import numpy as np, wave, pathlib

SR = 44100
DUR = 166.0
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

# ================= HOOK (0-6) =================
add(pad([110.0, 130.8, 164.8], 6.2, 0.05), 0.0)
add(paper(1.2, 0.35), 0.3)
for tt in (1.5, 1.85, 2.2, 2.5): add(step(0.35), tt)
add(paper(0.4, 0.25), 2.9)
add(piano(A2, 4, 0.3), 3.3); add(piano(130.8, 4, 0.22), 3.32)
add(hit(0.35, 1.5), 5.0); add(bell(1760, 0.08), 5.0)
add(phone_buzz(0.3), 6.25)

# ================= ACT 1: the Angel (6-56) =================
beat = 60 / 72
prog = [["A3", "C4", "E4", "A4"], ["F3", "A3", "C4", "F4"], ["C3", "E3", "G3", "C4"], ["G3", "B3", "D4", "G4"]]
t = 6.4; bar = 0
while t < 33.2:
    chord = prog[bar % 4]
    add(pad([note(c) for c in chord[:3]], beat * 4 + 1.2, 0.055), t)
    dens = 1 if t < 14 else 2
    for kk in range(4 * dens):
        add(piano(note(chord[kk % 4]), 2.4, 0.2 * (1 if kk == 0 else 0.7)), t + kk * beat * 4 / (4 * dens), pan=0.2 * ((kk % 2) * 2 - 1))
    t += beat * 4; bar += 1
for i, f in enumerate([1046.5, 1318.5, 1760, 2093]): add(bell(f, 0.09), 15.9 + i * 0.07)   # the Angel blooms
add(whoosh(0.5, 0.15), 25.5); add(bell(1318.5, 0.08), 25.7)                               # sent
add(bonk(0.35), 28.5)                                                                       # not selected
add(bell(1568, 0.07), 31.3)                                                                 # "Again?"
add(pad([220.0, 261.6, 329.6], 10, 0.05), 33.0)
for tt in np.arange(35.1, 37, 0.25): add(tick(0.08), tt)                                    # scrolling
add(paper(1.0, 0.3), 37.15); add(piano(A2 * 0.5, 4, 0.25), 37.6)
add(pad([174.6, 220.0, 261.6], 4, 0.05), 39.0)
for tt in (41.2, 41.45, 41.7): add(bonk(0.28), tt)
for tt in (36.5, 40.2, 42.5): add(tick(0.3), tt)
add(phone_buzz(0.3), 43.4)
add(pad([220.0, 261.6, 329.6], 13, 0.06), 43.2)
for nm, tt in [("A3", 44.5), ("E4", 47.5), ("C4", 50.2), ("B3", 53.0)]: add(piano(note(nm), 4, 0.16), tt)
add(bell(1568, 0.06), 49.3)

# ================= THE DEVIL'S ENTRY (56-76) =================
for i, tt in enumerate(np.arange(56.5, 75.0, 1.0)): add(tick(0.18 + 0.02 * i), tt)          # the clock, louder each second
add(rumble(9.8, 0.42), 59.4)
t = 59.5
while t < 72.8:
    bpm = 52 + 44 * min(1, (t - 59.5) / 9.3)
    add(thump(0.55 + 0.3 * min(1, (t - 59.5) / 9)), t); add(thump(0.32), t + 0.27)
    t += 60 / bpm
add(breath(2.8, 0.18), 62.5); add(noise_band(int(SR * 3), 300, 3000) * np.linspace(0, 1, int(SR * 3)) ** 2 * 0.16, 62.6)  # smoke hiss
cr = np.arange(int(SR * 0.9)) / SR
add(np.sin(2 * np.pi * np.cumsum(220 - 90 * cr / 0.9) / SR) * noise_band(len(cr), 300, 2000) * 0.15, 63.2)                # a creak
for tt in (66.0, 66.5, 67.2, 67.7, 68.3): add(buzz(0.09, 0.3), tt)                                                         # the lights
add(choir([110.0, 164.8, 220.0, 261.6, 329.6], 7.0, 0.32, att=4.5, rel=0.4), 63.6)
tr = np.arange(int(SR * 5.2)) / SR
add((np.sin(2 * np.pi * 880 * tr) + 0.6 * np.sin(2 * np.pi * 1318.5 * tr)) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 14 * tr))) * (tr / 5.2) ** 2 * 0.07, 63.6)  # string tremolo
add(reverse_swell(1.4, 0.35), 67.6)
add(hit(1.0, 4.0), 69.0); add(timp(55, 0.9), 69.0); add(power(55, 2.0, 0.35), 69.0); add(cymbal(3.0, 0.18), 69.0)      # BOOM: the eyes
add(choir([82.4, 110.0, 164.8, 220.0], 4.0, 0.22, att=0.3, rel=1.0), 69.1)
for i, tt in enumerate(np.arange(70.2, 72.9, 0.09)): add(timp(73.4, 0.18 + 0.4 * i / 30), tt)                              # timpani roll
add(riser(2.7, 110, 660, 0.22), 70.2)
add(choir([110.0, 164.8, 220.0, 261.6, 329.6, 440.0], 2.8, 0.34, att=2.0, rel=0.25), 70.2)
dn = np.arange(int(SR * 2.4)) / SR
add((np.sin(2 * np.pi * 55 * dn) + 0.5 * np.sin(2 * np.pi * 110 * dn) + 0.3 * np.sin(2 * np.pi * 220 * dn)) * 0.12 * np.minimum(1, (2.4 - dn) / 0.2), 73.0)  # drone under "Then move."
add(breath(1.6, 0.3), 73.25)                                                                                               # the whisper
# 75.4 - 76.0: total silence
# THE DROP (76)
add(hit(1.2, 4.5), 76.0); add(timp(55, 1.0), 76.0); add(cymbal(4.0, 0.35), 76.0); add(power(110, 1.8, 0.4), 76.0)
add(choir([220.0, 261.6, 329.6, 440.0, 523.3], 3.5, 0.3, att=0.1, rel=1.5), 76.02)

# ================= DEVIL MODE: the epic beat (76-111.6) =================
B = 60 / 128; BAR = 4 * B
roots = [55.0, 43.65, 65.41, 49.0]                 # A1, F1, C2, G1 (power-chord roots)
chords = [[220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [261.6, 329.6, 392.0], [196.0, 246.9, 293.7]]
motif = [440.0, 523.3, 659.3, 880.0]               # the Angel's notes (A C E A) as the Devil's lead: the audio clue
t = 76.0 + BAR * 0; bar = 0
while t < 111.6 - 0.01:
    full = t >= 86.0 - 0.01
    r = roots[bar % 4]
    add(choir(chords[bar % 4], BAR + 0.3, 0.12 if full else 0.16, att=0.2, rel=0.3), t)
    if full:
        for kk in range(8): add(chug(r * 2, 0.22), t + kk * B / 2)
        for kk in range(4):
            add(thump(0.8), t + kk * B) if kk in (0, 2) else None
            if kk in (1, 3): add(noise_band(int(SR * 0.16), 1500, 8000) * env(int(SR * 0.16), 0.001, 0.06) * 0.42, t + kk * B); add(timp(196, 0.12), t + kk * B)
        for kk in range(8): add(tick(0.12), t + kk * B / 2 + B / 4)
        if bar % 2 == 0:
            for i, f in enumerate(motif): add(lead(f, B * 0.9, 0.13), t + i * B)
        else:
            for i, f in enumerate([784.0, 659.3, 523.3, 587.3]): add(lead(f, B * 0.9, 0.11), t + i * B)
    else:
        add(power(r * 2, BAR, 0.18), t); add(thump(0.6), t); add(thump(0.45), t + 2 * B)
    t += BAR; bar += 1
add(riser(4.0, 110, 880, 0.2), 82.0); add(reverse_swell(1.2, 0.3), 84.8); add(hit(0.7, 2.0), 86.0)
for pt in (88.6, 92.6, 98.6, 100.6, 106.6): add(chaching(0.32), pt)
add(bonk(0.4), 94.6)
add(riser(2.0, 220, 1760, 0.2), 109.0); add(hit(0.8, 1.2), 110.6)
# 111.6: everything cuts dead
cut = int(111.6 * SR)
L[cut:] *= 0; R[cut:] *= 0     # hard stop: nothing before this point rings past it

# ================= THE COST (112-120) =================
hn = np.arange(int(SR * 3.6)) / SR
add((np.sin(2 * np.pi * 110 * hn) + 0.4 * np.sin(2 * np.pi * 220 * hn)) * 0.05, 112.0)
add(phone_buzz(0.22), 112.5); add(phone_buzz(0.18), 113.6)
for i, f in enumerate([220.0, 261.6, 329.6, 440.0]): add(piano(f, 3.5, 0.2), 115.8 + i * 0.6)           # the Angel's motif, alone
add(pad([110.0, 130.8, 164.8], 3.0, 0.06), 115.6)
add(choir([55.0, 82.4, 110.0], 1.8, 0.2, att=0.6, rel=0.5), 118.3); add(thump(0.5), 118.5); add(thump(0.5), 119.3)

# ================= DAY ZERO (120-129) =================
add(bell(880, 0.12), 120.3); add(bell(1318.5, 0.12), 120.45); add(bell(880, 0.12), 121.4); add(bell(1318.5, 0.12), 121.55)
add(pad([130.8, 196.0, 293.7, 329.6], 5.0, 0.08), 120.2)
add(phone_buzz(0.25), 124.0)
add(pad([130.8, 196.0, 293.7, 329.6, 392.0], 5.0, 0.11), 124.4)
for i, f in enumerate([261.6, 329.6, 392.0, 523.3]): add(piano(f, 3, 0.18), 124.6 + i * 0.5)
add(breath(1.6, 0.22), 125.4)

# ================= THE REVEAL (129-150) =================
dr = np.arange(int(SR * 6.5)) / SR
add((np.sin(2 * np.pi * 55 * dr) + 0.3 * np.sin(2 * np.pi * 110 * dr) + 0.08 * noise_band(len(dr), 2000, 6000)) * 0.08 * np.minimum(1, dr / 1.5), 129.0)
for tt in (129.6, 130.6, 131.6): add(tick(0.12), tt)
angel_motif(132.0, A2, 0.7, 0.3)                      # the motif, low and minor: we have heard it before
add(reverse_swell(2.0, 0.28), 134.6); add(riser(2.0, 220, 880, 0.12), 134.6)
add(choir([110.0, 138.6, 164.8, 220.0, 277.2, 329.6], 4.5, 0.3, att=0.15, rel=2.5), 136.6)   # A MAJOR: the turn
for i, f in enumerate([880, 1108.7, 1318.5, 1760, 2217.5]): add(bell(f, 0.1), 136.6 + i * 0.08)
angel_motif(136.7, A3, 0.42, 0.32, major=True)
add(piano(1318.5, 3, 0.12), 140.0)
add(pad([220.0, 277.2, 329.6], 5.2, 0.09), 141.4); add(pad([185.0, 220.0, 277.2], 3.6, 0.08), 145.0)
for nm, tt in [("C#4", 146.6), ("E4", 147.4), ("A4", 148.4)]: add(piano(note(nm), 3, 0.16), tt)

# ================= "I heard you." (150-156) =================
for i, ch in enumerate([[146.8, 185.0, 220.0], [110.0, 138.6, 164.8], [164.8, 207.7, 246.9], [110.0, 138.6, 164.8, 220.0]]):
    add(pad(ch, 2.2, 0.1), 150.0 + i * 1.5)
    for kk, f in enumerate(ch): add(piano(f * 2, 2.5, 0.15), 150.0 + i * 1.5 + kk * 0.18)

# ================= END CARD (156-166) =================
add(pad([110.0, 138.6, 164.8], 8.0, 0.08), 156.4)
angel_motif(156.8, A3, 0.6, 0.24, major=True)
add(piano(A2, 5, 0.26), 159.4)
add(hit(0.9, 2.2), 164.0); add(timp(55, 0.7), 164.0); add(choir([110.0, 164.8, 220.0, 277.2], 2.0, 0.22, att=0.05, rel=1.4), 164.0)


# ================= phone-speaker audibility (300 Hz - 6 kHz) =================
add(pad([440.0, 523.3, 659.3], 2.6, 0.05), 3.4)                     # under the notice close-up
add(pad([329.6, 392.0, 493.9], 3.2, 0.045), 37.1)                    # FINAL WARNING
add(pad([440.0, 523.3], 2.2, 0.04), 41.0)
add(pad([440.0, 523.3, 659.3], 3.2, 0.04), 53.2)                     # under "I keep taking one..."
sn = int(SR * 4.3); st = np.arange(sn) / SR                           # the entry: strings tighten as the shadow grows
strings = lowpass(saw(440.0, sn, 5000, -0.003) + saw(440.0, sn, 5000, 0.003) + 0.7 * saw(659.3, sn, 5000), 3000)
strings = strings / (np.abs(strings).max() + 1e-9) * (st / 4.3) ** 1.4 * (1 + 0.15 * np.sin(2 * np.pi * 6 * st)) * 0.1
add(strings, 59.4)
add(pad([329.6, 440.0], 3.6, 0.035), 128.2)                          # the reveal opens
add(pad([440.0, 554.4, 659.3], 4.0, 0.05), 159.6)                    # end card

# ================= master =================
mix = np.stack([L, R], axis=1)
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / (np.abs(mix).max() + 1e-9)
out = pathlib.Path(__file__).resolve().parents[1] / "public" / "audio" / "film03_mix.wav"
with wave.open(str(out), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("wrote", out)
