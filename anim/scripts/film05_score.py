#!/usr/bin/env python3
"""Original synthesized score + sound effects for FILM 02, "JUST ONE MORE | The Phone Ate His Nights" (Film05.tsx),
44.1 kHz stereo WAV. The instruments are film 01's (film04_score.py); the sections are new: the phone's little sounds
over the Angel's soft minor piano, the nights slipping on ticks, the 3 AM low point thinning to one note, total
silence when the battery dies, the heartbeat and the choir as the Devil is born in the black screen, the drop into
the Devil-mode beat (128 BPM, the Angel's notes as the Devil's lead), the knock in silence, the note in silence,
and the Angel's notes in major for the last call and the sleep. Mid frequencies are kept everywhere for phones."""
import numpy as np, wave, pathlib

SR = 44100
DUR = 174.0
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


# ================= film 02's own sounds =================
def tap(vel=0.18):
    n = int(SR * 0.025)
    return noise_band(n, 2500, 7000) * env(n, 0.0005, 0.005) * vel

def swipe(vel=0.1, dur=0.22):
    n = int(SR * dur); t = np.arange(n) / SR
    return noise_band(n, 1500, 7000) * np.sin(np.pi * t / dur) ** 2 * vel

def ping(vel=0.12):
    return np.concatenate([bell(1568, 1, 0.5)[: int(SR * 0.12)], bell(2093, 1, 0.8)]) * vel

def sent(vel=0.1):
    n = int(SR * 0.3); t = np.arange(n) / SR
    f = 600 + 1400 * t / 0.3
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / 0.3) * vel

def low_batt(vel=0.12):
    a = bell(1318.5, 1, 0.4)[: int(SR * 0.18)]; b = bell(987.8, 1, 0.6)
    return np.concatenate([a, b]) * vel

def alarm_beeps(dur, vel=0.12):
    n = int(SR * dur); out = np.zeros(n); t0 = 0.0
    while t0 < dur - 0.1:
        for i, f in enumerate((1760, 2093, 1760)):
            s = bell(f, 1, 0.25)[: int(SR * 0.11)]
            i0 = int((t0 + i * 0.12) * SR); i1 = min(n, i0 + len(s))
            if i0 < n: out[i0:i1] += s[: i1 - i0]
        t0 += 0.9
    return out * vel

def knock(vel=0.5):
    n = int(SR * 0.18); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * np.cumsum(140 + 80 * np.exp(-t * 60)) / SR) * np.exp(-t * 30)
    x += 0.6 * noise_band(n, 600, 2500) * np.exp(-t * 90)
    return x * vel

def heartbeat(vel=0.6):
    out = np.zeros(int(SR * 0.6)); a = thump(vel); b = thump(vel * 0.7)
    out[: len(a)] += a; j = int(SR * 0.27); out[j:j + len(b)] += b[: len(out) - j]
    return out

def squeak(dur=0.5, vel=0.06):
    n = int(SR * dur); t = np.arange(n) / SR
    f = 2600 + 500 * np.sin(2 * np.pi * 5 * t)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * noise_band(n, 1500, 5000) * np.sin(np.pi * t / dur) * vel

def scratch(dur, vel=0.1):
    n = int(SR * dur); t = np.arange(n) / SR
    return noise_band(n, 2000, 8000) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 7 * t))) * vel

def splash(vel=0.3):
    n = int(SR * 0.8); t = np.arange(n) / SR
    return noise_band(n, 400, 6000) * np.exp(-t * 5) * (1 - np.exp(-t * 80)) * vel

def rain_bed(dur, vel=0.08):
    n = int(SR * dur); t = np.arange(n) / SR
    return noise_band(n, 900, 9000) * np.minimum(1, t / 0.3) * np.minimum(1, (dur - t) / 0.3) * vel

def ringback(dur, vel=0.06):
    n = int(SR * dur); t = np.arange(n) / SR
    gate = ((t % 3.0) < 1.2).astype(float)
    return (np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)) * gate * vel

def phone_audio(dur, vel=0.05, seed=3):
    """The tinny sound of a video from the phone's own speaker: little bouncy blips and chatter, all mid-band."""
    r = np.random.default_rng(seed)
    n = int(SR * dur); out = np.zeros(n); t0 = 0.0
    while t0 < dur:
        ln = r.uniform(0.05, 0.16); m = int(SR * ln); tt = np.arange(m) / SR
        f = r.choice([523.3, 659.3, 784.0, 880.0, 1046.5]) * (1 + 0.3 * tt / ln * r.choice([-1, 1]))
        s = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * np.sin(np.pi * tt / ln)
        i0 = int(t0 * SR); i1 = min(n, i0 + m); out[i0:i1] += s[: i1 - i0] * r.uniform(0.4, 1)
        t0 += ln + r.uniform(0.02, 0.12)
    return lowpass(out, 3500) * vel

def meow(vel=0.1):
    n = int(SR * 0.45); t = np.arange(n) / SR
    f0 = 520 + 260 * np.sin(np.pi * t / 0.45)
    x = sum(np.sin(2 * np.pi * np.cumsum(f0 * h) / SR) / h for h in range(1, 6))
    return lowpass(x, 3000) * np.sin(np.pi * t / 0.45) * vel

def crash_small(vel=0.25):
    n = int(SR * 0.6); t = np.arange(n) / SR
    x = noise_band(n, 1200, 9000) * np.exp(-t * 9) + 0.5 * sum(np.sin(2 * np.pi * f * t) * np.exp(-t * 14) for f in (2100, 3300, 4700))
    return x * vel

def drawer_slam(vel=0.6):
    n = int(SR * 0.5); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * np.cumsum(90 + 60 * np.exp(-t * 40)) / SR) * np.exp(-t * 14)
    x += 0.5 * noise_band(n, 300, 3000) * np.exp(-t * 30) + 0.25 * noise_band(n, 2000, 6000) * np.exp(-t * 50)
    return x * vel


def quiet_pad(t0, t1, vel=0.025):
    """A faint room tone in the phone band (300 Hz - 6 kHz), so phones never go fully silent for long."""
    d = t1 - t0; n = int(SR * d); tt = np.arange(n) / SR
    x = sum(np.sin(2 * np.pi * (f + det) * tt) for f in (440.0, 523.3, 659.3) for det in (-0.7, 0.7)) / 6
    x += 0.15 * noise_band(n, 700, 3000)
    add(x * np.minimum(1, tt / 0.3) * np.minimum(1, (d - tt) / 0.3) * vel * 2.2, t0)

def muffle(sig, fc=900):
    return lowpass(sig, fc)

# ================= COLD OPEN (0-4.6) =================
add(phone_audio(1.0, 0.07, seed=11), 0.0)                    # the video, tinny
add(low_batt(0.16), 0.08); add(low_batt(0.14), 0.62)
add(rumble(1.0, 0.25), 0.0)
add(hit(1.0, 3.0), 1.02); add(timp(55, 0.9), 1.02); add(braam(55, 2.6, 0.6), 1.02); add(cymbal(2.0, 0.18), 1.02)   # the screen dies, the eyes ignite
add(choir([82.4, 110.0, 164.8, 220.0], 2.2, 0.22, att=0.15, rel=0.6), 1.05)
add(breath(1.1, 0.3), 2.0)
add(reverse_swell(0.7, 0.35), 2.5)
add(hit(0.9, 1.4), 3.2); add(cymbal(1.2, 0.2), 3.2)
rw = np.arange(int(SR * 0.7)) / SR
add(noise_band(len(rw), 300, 5000)[::-1] * (rw / 0.7) ** 2 * 0.14, 3.25)    # the counter rewinding
for tt in (3.26, 3.33, 3.4, 3.47): add(tick(0.3), tt); add(bell(1760 + (tt - 3.26) * 2000, 0.05, 0.4), tt)
add(whoosh(0.4, 0.12), 4.2)

# ================= THE WANT (4.6-17.2) =================
add(pad([110.0, 130.8, 164.8], 3.0, 0.05), 4.6)
add(squeak(0.9, 0.06), 4.75); add(squeak(0.9, 0.05), 5.75)                  # the marker: the circle, the words
add(tick(0.2), 5.9)
add(phone_buzz(0.3), 6.9)
add(ping(0.12), 7.7); add(ping(0.12), 8.6)                                   # Dad's two bubbles
for tt in np.arange(8.0, 8.6, 0.2): add(tick(0.05), tt)
# Dad's theme: a warm, plain piano phrase (C major), the only warmth in the night
for i, (nm, d) in enumerate([("E4", 0), ("G4", 0.5), ("C5", 1.0), ("B4", 1.6), ("G4", 2.1), ("A4", 2.7), ("E4", 3.4)]):
    add(piano(note(nm), 2.6, 0.17), 8.0 + d)
add(pad([130.8, 196.0, 261.6, 329.6], 6.8, 0.06), 7.6)
add(pad([174.6, 220.0, 261.6], 2.0, 0.07), 11.2)                             # his photo
for tt in np.arange(12.3, 13.2, 0.09): add(tap(0.06 + 0.03 * rng.random()), tt)
add(tap(0.2), 13.35); add(sent(0.1), 13.5)
add(piano(note("C4"), 3.0, 0.15), 13.6)
add(noise_band(int(SR * 0.08), 200, 1200) * env(int(SR * 0.08), 0.002, 0.03) * 0.25, 15.3)   # the phone down on the desk
add(thump(0.45), 15.45); add(paper(0.5, 0.25), 15.5); add(paper(0.4, 0.2), 16.05)

# ================= THE ANGEL (17.2-41.6) =================
for tt in np.arange(17.2, 19.2, 0.62): add(tick(0.14), tt)
add(bell(1568, 0.07, 0.8), 18.9)                                             # the phone lights up on the desk
for i, f in enumerate([1046.5, 1318.5, 1760, 2093]): add(bell(f, 0.09), 19.6 + i * 0.07)
beat = 60 / 76
prog = [["A3", "C4", "E4", "A4"], ["F3", "A3", "C4", "F4"], ["C3", "E3", "G3", "C4"], ["G3", "B3", "D4", "G4"]]
t = 19.6; bar = 0
while t < 31.8:
    if not (22.55 < t < 23.6):
        chord = prog[bar % 4]
        add(pad([note(c) for c in chord[:3]], beat * 4 + 0.8, 0.07), t)
        for kk in range(4):
            tt = t + kk * beat
            if tt < 31.8 and not (22.55 < tt < 23.6): add(piano(note(chord[kk % 4]), 2.4, 0.18 * (1 if kk == 0 else 0.7)), tt, pan=0.2 * ((kk % 2) * 2 - 1))
    t += beat * 4; bar += 1
add(piano(A2, 1.2, 0.3), 22.62)                                              # still page 12
add(noise_band(int(SR * 1.0), 300, 2000) * np.sin(np.pi * np.arange(int(SR * 1.0)) / int(SR * 1.0)) * 0.08, 24.0)  # the phone slides
add(phone_audio(2.2, 0.06, seed=3), 26.2)
for tt in (27.3, 28.3, 29.3): add(tick(0.15), tt)
add(bell(1318.5, 0.08), 28.5)
add(phone_audio(1.1, 0.06, seed=5), 29.8)
cr = np.arange(int(SR * 0.4)) / SR
add(np.sin(2 * np.pi * np.cumsum(300 + 200 * cr) / SR) * noise_band(len(cr), 400, 2500) * 0.06, 30.95)   # the door on the video
for i in range(5): add(bell(1568 + 300 * (i % 2), 0.06, 0.25), 31.15 + i * 0.14)               # happy yips
add(laugh() * 0.35, 31.95); add(laugh() * 0.25, 32.3)
for tt in (32.6, 33.3, 34.0, 34.6, 35.3): add(whoosh(0.3, 0.16), tt - 0.1)
tt = 32.6
while tt < 36.0:
    add(tick(0.18), tt); tt += max(0.09, 0.32 - 0.06 * (tt - 32.6))
add(strings(440.0, 659.3, 3.4, 0.07), 32.6)
add(pad([220.0, 261.6, 329.6], 1.6, 0.05), 36.0); add(phone_audio(1.4, 0.035, seed=8), 36.0)
add(breath(1.2, 0.12), 36.3)
for tt in (37.4, 37.55): add(tick(0.22), tt)
add(bell(2093, 0.12, 0.6), 37.72); add(whoosh(0.3, 0.2), 37.65); add(hit(0.35, 0.8), 37.72)   # the next video flares
add(bonk(0.25), 37.95); add(thump(0.35), 38.0)                               # he wakes and catches it
add(phone_audio(1.0, 0.05, seed=9), 38.1)
add(alarm_beeps(1.6, 0.13), 39.0)
add(tap(0.25), 40.62); add(bell(1318.5, 0.07, 1.2), 40.0)                    # Snooze, "Shh. Rest."
add(pad([220.0, 277.2, 329.6], 2.0, 0.05), 39.8)
add(ping(0.12), 41.7); add(piano(note("A2"), 2.0, 0.22), 41.8)

# ================= THE DAYS SLIP (43.8-47.8) =================
for tt in (43.8, 44.8, 45.6): add(whoosh(0.3, 0.16), tt - 0.1)
for tt in (44.1, 44.4, 44.7): add(squeak(0.22, 0.06), tt); add(tick(0.22), tt)
add(ping(0.12), 45.7); add(piano(note("E2"), 2.0, 0.2), 45.8)
add(strings(440.0, 523.3, 4.0, 0.05), 43.8)

# ================= THE LOW POINT (47.8-69.5) =================
add(pad([110.0, 130.8, 164.8], 2.2, 0.06), 47.8); add(phone_audio(4.6, 0.04, seed=13), 47.8)
add(phone_buzz(0.3), 50.0); add(ping(0.11), 50.05)
add(pad([440.0, 523.3], 3.0, 0.035), 49.6)
add(tap(0.18), 52.15)
for tt in np.arange(53.5, 54.3, 0.1): add(tap(0.07), tt)
for tt in np.arange(54.8, 55.2, 0.06): add(tap(0.05), tt)                   # deleting "Sorry, Dad"
for tt in np.arange(55.35, 56.1, 0.09): add(tap(0.07), tt)
add(tap(0.2), 56.25); add(sent(0.1), 56.35)
for tt in np.arange(56.8, 57.4, 0.2): add(tick(0.04), tt)
add(ping(0.11), 57.4)
for nm, tt in [("A3", 57.6), ("E3", 58.6), ("C3", 59.8)]: add(piano(note(nm), 3.2, 0.17), tt)
quiet_pad(52.6, 57.4, 0.03)
add(pad([110.0, 130.8, 164.8], 4.6, 0.05), 59.8)
for nm, tt in [("A3", 62.3), ("C4", 63.1), ("B3", 63.9)]: add(piano(note(nm), 3.0, 0.15), tt)
add(bell(1568, 0.06), 62.4)
add(swipe(0.1), 64.9)
add(phone_audio(1.4, 0.05, seed=17), 65.3); add(low_batt(0.14), 65.5)
for tt in (65.4, 66.4, 67.4): add(tick(0.18), tt)
add(pad([123.5, 146.8, 174.6], 1.4, 0.06), 66.7)                             # "Just one more." (his own)
add(tap(0.2), 68.35); add(phone_audio(0.65, 0.06, seed=19), 68.45)
cut = int(69.1 * SR); L[cut:int(69.3 * SR)] *= 0; R[cut:int(69.3 * SR)] *= 0   # the screen dies: everything stops

# ================= THE TURN (69.5-84.1) =================
for i in range(40):                                                          # the ember crackles
    tt = 70.0 + rng.uniform(0, 2.2)
    add(noise_band(int(SR * 0.02), 2000, 7000) * env(int(SR * 0.02), 0.0005, 0.006) * rng.uniform(0.03, 0.08), tt)
quiet_pad(69.3, 73.7, 0.022)
add(noise_band(int(SR * 1.4), 400, 2500) * np.sin(np.pi * np.arange(int(SR * 1.4)) / int(SR * 1.4)) * 0.05, 70.6)  # the plug dragged on the sheet
t = 72.3
while t < 77.0:
    bpm = 50 + 55 * min(1, (t - 72.3) / 4.7)
    add(heartbeat(0.5 + 0.3 * min(1, (t - 72.3) / 4.7)), t)
    t += 60 / bpm
add(rumble(3.4, 0.35), 73.7)
add(strings(440.0, 659.3, 3.2, 0.07, 1.0), 73.7)
add(hit(1.0, 3.0), 75.75); add(timp(55, 0.9), 75.75); add(braam(55, 2.6, 0.5), 75.75); add(cymbal(2.4, 0.18), 75.75)
add(choir([110.0, 164.8, 220.0, 261.6, 329.6], 2.6, 0.3, att=1.8, rel=0.4), 76.9)
add(noise_band(int(SR * 2.4), 300, 3000) * np.linspace(0, 1, int(SR * 2.4)) ** 2 * 0.12, 76.9)        # smoke hiss
t = 77.0
while t < 79.3:
    add(heartbeat(0.75), t); t += 60 / 112
add(riser(2.2, 110, 660, 0.18), 77.1)
add(braam(55, 2.4, 0.35), 79.3); add(breath(1.6, 0.3), 79.45)
dn = np.arange(int(SR * 2.4)) / SR
add((np.sin(2 * np.pi * 55 * dn) + 0.5 * np.sin(2 * np.pi * 110 * dn) + 0.3 * np.sin(2 * np.pi * 220 * dn)) * 0.1 * np.minimum(1, (2.4 - dn) / 0.2), 79.3)
add(pad([440.0, 466.2], 2.4, 0.03), 79.3)
sc_ = np.arange(int(SR * 0.65)) / SR                                          # the plug's tip scrapes the port's edge
add(noise_band(len(sc_), 2500, 7000) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 24 * sc_))) * 0.06, 82.05)
add(pad([440.0, 466.2, 493.9], 1.2, 0.03), 81.8)
add(tap(0.25), 83.15); add(tap(0.15), 83.35)                                  # the plug drops and bounces
add(noise_band(int(SR * 0.3), 3000, 8000) * np.linspace(1, 0, int(SR * 0.3)) * 0.03, 83.12)   # the ember goes out
cut0, cut1 = int(83.5 * SR), int(84.1 * SR); L[cut0:cut1] *= 0; R[cut0:cut1] *= 0              # total silence
add(hit(1.2, 4.5), 84.1); add(timp(55, 1.0), 84.1); add(cymbal(4.0, 0.35), 84.1); add(power(110, 1.8, 0.4), 84.1); add(braam(55, 3.0, 0.7), 84.1)
add(choir([220.0, 261.6, 329.6, 440.0, 523.3], 3.5, 0.3, att=0.1, rel=1.5), 84.12)

# ================= DEVIL MODE (84.1-120.6) =================
B = 60 / 128; BAR = 4 * B
roots = [55.0, 43.65, 65.41, 49.0]
chords = [[220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [261.6, 329.6, 392.0], [196.0, 246.9, 293.7]]
motif = [440.0, 523.3, 659.3, 880.0]   # the Angel's notes as the Devil's lead
FULL = 84.1 + 2 * BAR
def devil_beat(t0, t1, full_from):
    t = t0; bar = 0
    while t < t1 - 0.01:
        full = t >= full_from - 0.01
        r = roots[bar % 4]
        add(choir(chords[bar % 4], BAR + 0.3, 0.11 if full else 0.15, att=0.2, rel=0.3), t)
        if full:
            for kk in range(8): add(chug(r * 2, 0.21), t + kk * B / 2)
            for kk in range(4):
                if kk in (0, 2): add(thump(0.8), t + kk * B)
                else:
                    add(noise_band(int(SR * 0.16), 1500, 8000) * env(int(SR * 0.16), 0.001, 0.06) * 0.4, t + kk * B); add(timp(196, 0.12), t + kk * B)
            for kk in range(8): add(tick(0.11), t + kk * B / 2 + B / 4)
            mel = motif if bar % 2 == 0 else [784.0, 659.3, 523.3, 587.3]
            for i, f in enumerate(mel): add(lead(f, B * 0.9, 0.12 if bar % 2 == 0 else 0.1), t + i * B)
        else:
            add(power(r * 2, BAR, 0.18), t); add(thump(0.6), t); add(thump(0.45), t + 2 * B)
        t += BAR; bar += 1
devil_beat(84.1, 99.9, FULL)
add(riser(1.6, 110, 880, 0.16), FULL - 1.6); add(hit(0.6, 1.4), FULL)
add(drawer_slam(0.6), 88.55); add(hit(0.4, 0.8), 88.55)
for tt in (88.9, 90.3, 91.2, 92.1, 94.0, 94.9, 96.3, 97.2, 98.1, 99.0): add(whoosh(0.25, 0.12), tt - 0.08)
add(thump(0.4), 89.4); add(paper(0.3, 0.2), 89.4)                             # the book thuds open
add(squeak(0.8, 0.05), 90.35)                                                 # the highlighter
add(tick(0.3), 91.3); add(tick(0.3), 97.3); add(tick(0.3), 99.1)
add(hit(0.5, 1.0), 92.97); add(braam(55, 1.2, 0.3), 92.25)                    # the wrist; "One more page."
for i in range(8): add(bell(880 + 110 * i, 0.03, 0.2), 94.05 + i * 0.06)      # the score counting up
add(whoosh(0.3, 0.2), 95.45)                                                  # his head lifted
for tt in np.arange(96.3, 97.2, 0.1): add(paper(0.12, 0.18), tt)              # pages flipping
for i in range(8): add(bell(880 + 110 * i, 0.03, 0.2), 98.15 + i * 0.06)
cut0 = int(99.9 * SR); L[cut0:int(100.2 * SR)] *= 0.0; R[cut0:int(100.2 * SR)] *= 0.0   # the beat cuts

# the knock (99.9-108.6)
for kt in (100.25, 100.7, 101.15): add(knock(0.65), kt); add(thump(0.3), kt)
quiet_pad(100.0, 108.6, 0.022)
add(bell(1046.5, 0.05, 1.2), 101.6)                                           # "Dad?"
cs = np.arange(int(SR * 0.35)) / SR                                           # the chair scrapes back
add(noise_band(len(cs), 300, 2500) * np.sin(np.pi * cs / 0.35) * 0.12, 102.7)
t = 103.6
while t < 105.5:
    add(heartbeat(0.55), t); t += 0.75
add(braam(55, 1.6, 0.35), 103.8)
add(paper(0.7, 0.3), 106.4)                                                   # the note slides under the door
for i, tt in enumerate((107.9, 108.15, 108.4)): add(lowpass(step(0.35 - 0.08 * i), 600), tt)
add(riser(0.5, 220, 1760, 0.18), 108.1)
devil_beat(108.6, 120.6, 108.6)
add(hit(0.8, 1.4), 108.6)
for tt in (109.5, 110.4, 111.6, 112.5, 113.4, 114.3, 116.1, 118.7): add(whoosh(0.25, 0.12), tt - 0.08)
for i in range(8): add(bell(880 + 110 * i, 0.03, 0.2), 109.55 + i * 0.06)
add(squeak(0.35, 0.06), 110.6); add(squeak(0.35, 0.06), 110.95)               # his marker crosses out Thursday
add(braam(55, 1.0, 0.3), 111.6)
add(thump(0.5), 112.95); add(paper(0.3, 0.25), 112.8)                         # the book shuts
add(tick(0.3), 113.5)
for tt in (114.5, 114.75, 115.0, 115.25, 115.5, 115.75): add(step(0.3), tt)
add(scratch(1.8, 0.07), 118.8)
cut0 = int(120.6 * SR); L[cut0:int(120.9 * SR)] *= np.linspace(1, 0, int(120.9 * SR) - cut0); R[cut0:int(120.9 * SR)] *= np.linspace(1, 0, int(120.9 * SR) - cut0)

# ================= THE RESULT AND THE COST (120.9-138.7) =================
add(bell(1318.5, 0.1), 121.4); add(bell(1760, 0.08), 121.55)
add(pad([130.8, 196.0, 261.6, 329.6], 2.6, 0.06), 121.4); add(breath(1.4, 0.2), 122.3)
add(pad([110.0, 164.8], 1.6, 0.04), 123.3)
add(paper(0.4, 0.25), 125.85)
quiet_pad(124.9, 131.7, 0.022)
for nm, tt in [("E4", 127.2), ("C4", 128.2), ("D4", 129.0), ("A3", 130.0)]: add(piano(note(nm), 3.0, 0.16), tt)   # Dad's theme, broken
add(piano(note("A2"), 3.0, 0.2), 131.1)
add(thump(0.3), 131.75)
add(pad([110.0, 130.8], 2.2, 0.04), 131.7)
dr_ = np.arange(int(SR * 0.6)) / SR
add(np.sin(2 * np.pi * np.cumsum(180 + 120 * dr_) / SR) * noise_band(len(dr_), 300, 2000) * 0.07, 134.0)  # the door opens
add(choir([220.0, 277.2, 329.6, 440.0], 3.0, 0.16, att=1.2, rel=1.0), 134.1)
add(reverse_swell(0.9, 0.2), 134.9); add(bell(2637, 0.05, 1.5), 135.6)        # the light erases the Devil
add(pad([110.0, 164.8, 220.0], 2.2, 0.06), 136.7)

# ================= THE MEMORIES (138.7-145.1) =================
for tt in (138.7, 140.2, 141.7): add(bell(1318.5, 0.08, 1.0)[::-1] * 1.0, tt - 0.9)   # a reversed bell into each
add(muffle(alarm_beeps(0.8, 0.12)), 138.7); add(muffle(tap(0.4)), 139.6)
add(muffle(drawer_slam(0.5)), 141.0)
add(bell(1046.5, 0.04, 1.0), 142.15)
add(muffle(braam(55, 1.0, 0.25), 600), 143.55)
for i, tt in enumerate((144.6, 144.8, 145.0)): add(muffle(step(0.3 - 0.07 * i), 500), tt)
add(choir([110.0, 164.8, 220.0, 277.2], 6.4, 0.12, att=1.0, rel=1.5), 138.7)
quiet_pad(138.7, 145.1, 0.02)

# ================= THE END (145.1-174) =================
add(noise_band(int(SR * 0.4), 250, 1400) * env(int(SR * 0.4), 0.03, 0.2, 0.4) * 0.25, 145.15)   # the drawer
add(pad([110.0, 130.8, 164.8], 2.0, 0.05), 145.9)
add(tap(0.25), 148.25); add(bell(1568, 0.08, 0.8), 149.1)                     # plugged in; charging
for tt in (149.3, 150.3, 151.3): add(tick(0.12), tt)
add(swipe(0.14), 151.6); add(tap(0.2), 152.45)
add(ringback(0.9, 0.05), 153.2); add(tap(0.15), 154.0)
add(pad([130.8, 196.0, 261.6, 329.6], 7.2, 0.07), 154.3)                      # warm strings under the call
add(strings(261.6, 392.0, 7.0, 0.05, 0.8), 154.5)
for nm, tt in [("E4", 156.9), ("G4", 157.4), ("C5", 157.9), ("B4", 158.5)]: add(piano(note(nm), 2.6, 0.14), tt)   # Dad's theme, whole
add(pad([174.6, 220.0, 261.6, 349.2], 2.4, 0.07), 159.7)
angel_motif(159.8, A3, 0.45, 0.2, major=True)                                 # "Happy birthday, Dad."
add(pad([110.0, 138.6, 164.8, 220.0], 5.2, 0.07), 161.5)
angel_motif(162.0, A3, 0.6, 0.18, major=True)
add(piano(A2, 4.0, 0.2), 164.3)
add(pad([440.0, 554.4, 659.3], 4.6, 0.035), 161.6)
add(hit(0.9, 2.2), 167.5); add(timp(55, 0.7), 167.5); add(choir([110.0, 164.8, 220.0, 277.2], 2.4, 0.22, att=0.05, rel=1.4), 167.5)
add(pad([440.0, 554.4, 659.3], 5.0, 0.04), 168.0)
add(piano(A2, 5, 0.22), 168.2)

# ================= phone-speaker audibility (300 Hz - 6 kHz) =================
for a, b in [(4.6, 6.0), (14.1, 15.4), (16.2, 19.2), (23.1, 26.0), (42.5, 43.8), (52.2, 54.2), (60.0, 62.4), (66.6, 68.5), (69.3, 71.0),
             (80.9, 83.3), (105.3, 106.6), (123.3, 127.3), (131.4, 134.1), (136.8, 138.1), (145.4, 148.3), (149.8, 153.3), (154.0, 156.0),
             (164.9, 167.6), (171.4, 173.9)]:
    quiet_pad(a, b, 0.03)

# ================= master =================
mix_ = np.stack([L, R], axis=1)
mix_ = np.tanh(mix_ * 1.4) / np.tanh(1.4)
mix_ *= 0.89 / (np.abs(mix_).max() + 1e-9)
out = pathlib.Path(__file__).resolve().parents[1] / "public" / "audio" / "film05_mix.wav"
out.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(out), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix_ * 32767).astype("<i2").tobytes())
print("wrote", out)
