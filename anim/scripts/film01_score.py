#!/usr/bin/env python3
"""Original synthesized score + sound effects for FILM 01 (ANGER), 188 s, 44.1 kHz stereo WAV.
Shape (from the script): a warm piano climb (Angel) -> near-silence and one laugh (humiliation) -> a dark
heartbeat pulse that grows (Devil) -> a swell, silence, one hit on the title. Mid frequencies are kept in every
section so it is audible on phone speakers. Counter ticks follow the same keyframes as Film01.tsx."""
import numpy as np, wave, pathlib

SR = 44100
DUR = 188.0
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

# ---------------- ACT 1: a warm climb (0-65 s), A minor -> F -> C -> G at 72 bpm, building
beat = 60 / 72
prog = [["A3", "C4", "E4", "A4"], ["F3", "A3", "C4", "F4"], ["C3", "E3", "G3", "C4"], ["G3", "B3", "D4", "G4"]]
t = 1.0
bar = 0
while t < 64:
    chord = prog[bar % 4]
    density = 1 if t < 20 else (2 if t < 44 else 4)
    vel = 0.18 + 0.22 * min(1, t / 60)
    add(pad([note(c) for c in chord[:3]], beat * 4 + 1.5, 0.05 + 0.05 * min(1, t / 50)), t, 1.0)
    for k in range(4 * density // (1 if density < 4 else 1)):
        step = beat * 4 / (4 * density)
        nn = chord[k % 4]
        add(piano(note(nn) * (2 if density == 4 and k % 2 else 1), 2.6, vel * (1.0 if k == 0 else 0.7)), t + k * step, 1.0, pan=0.2 * ((k % 2) * 2 - 1))
    add(piano(note(chord[0]) / 2, 3.5, vel * 0.8), t, 1.0)
    t += beat * 4; bar += 1
# a little lift on "You did it" (44 s)
add(piano(note("E5"), 3, 0.25), 44.0); add(piano(note("A5"), 3, 0.2), 44.4)

# ---------------- ACT 2: the room goes quiet (65-95 s)
n_hiss = int(SR * 10)
add(np.sin(2 * np.pi * 2093 * np.arange(n_hiss) / SR) * 0.012 * np.sin(np.pi * np.arange(n_hiss) / n_hiss), 65.2)  # thin high tone
add(laugh(), 68.0, 0.55, pan=0.3)
lg = laugh()
slow = np.interp(np.arange(0, len(lg), 0.6), np.arange(len(lg)), lg)    # the laugh again, slowed, in his head
add(slow * np.linspace(1, 0, len(slow)), 69.2, 0.18)
for k, (nm, tt) in enumerate([("A3", 76), ("E4", 79), ("C4", 82.5), ("B3", 86), ("A3", 90)]):
    add(piano(note(nm), 4, 0.16), tt)
for ft in (87, 89.5, 92):                       # the three replays: the laugh, small and dry
    add(laugh(), ft, 0.25)
    add(whoosh(0.4, 0.1), ft - 0.15)

# ---------------- ACT 3: the Devil (95-160 s): heartbeat + drone that grows
drone_t = np.arange(int(SR * 66)) / SR
drone = np.zeros_like(drone_t)
for f, a in [(55, 0.5), (110, 0.35), (164.8, 0.2), (207.7, 0.12), (329.6, 0.06)]:  # A, A, E, G# (tension)
    drone += a * np.sign(np.sin(2 * np.pi * f * drone_t)) * 0.3 + a * np.sin(2 * np.pi * f * drone_t)
drone *= np.minimum(1, drone_t / 6) * (0.05 + 0.12 * drone_t / 66)
add(drone, 95.0)
t = 95.5; bpm = 58
while t < 160:
    add(thump(0.55 + 0.35 * (t - 95) / 65), t)
    add(thump(0.3 + 0.2 * (t - 95) / 65), t + 0.28)
    bpm = 58 + 30 * (t - 95) / 65
    t += 60 / bpm
for tt, v in [(108, 0.7), (137.2, 0.9), (150, 0.6)]:
    add(hit(v, 3.5), tt)
for tt in (99, 103.3, 109, 114, 125):           # a breath under each Devil line
    add(whoosh(1.2, 0.08), tt - 0.3, pan=0.4)

# ---------------- ENDING: swell (160-181), silence, the title hit
sw_t = np.arange(int(SR * 21)) / SR
swell = (np.sin(2 * np.pi * 55 * sw_t) * 0.5 + np.sin(2 * np.pi * 110 * sw_t) * 0.3 + np.sin(2 * np.pi * 233.1 * sw_t) * 0.15
         + 0.12 * noise_band(len(sw_t), 200, 2500))
swell *= np.minimum(1, sw_t / 8) * np.minimum(1, (21 - sw_t) / 1.5) * 0.35
add(swell, 160.0)
add(piano(note("A2"), 6, 0.3), 173.5); add(piano(note("E3"), 6, 0.2), 175)
add(hit(1.0, 4.5), 182.8)


# ---------------- phone-audibility layers (mid frequencies, 300 Hz - 6 kHz), so no stretch goes dead on a phone
add(pad([220.0, 261.6, 329.6], 34.0, 0.075), 65.4)                      # Act 2: a thin, cold pad under the silence
mt = np.arange(int(SR * 65)) / SR
trem = 0.5 + 0.5 * np.sin(2 * np.pi * (58 + 30 * mt / 65) / 60 * mt)   # pulses with the heartbeat
mid = (np.sin(2 * np.pi * 220 * mt) + 0.6 * np.sin(2 * np.pi * 311.1 * mt) + 0.35 * np.sin(2 * np.pi * 440 * mt + np.sin(2 * np.pi * 3 * mt)))
add(mid * trem * (0.035 + 0.075 * mt / 65) * np.minimum(1, mt / 4), 95.0)  # Act 3: a mid-register throb (A + tritone)
st = np.arange(int(SR * 21)) / SR
shimmer = (np.sin(2 * np.pi * 440 * st) + 0.8 * np.sin(2 * np.pi * 466.2 * st) + 0.5 * np.sin(2 * np.pi * 880 * st)) * np.minimum(1, st / 6) * np.minimum(1, (21 - st) / 1.5)
add(shimmer * 0.06, 160.0)                                               # ending: a dissonant shimmer over the swell

# ---------------- counter ticks (same keyframes as Film01.tsx)
COUNT = [(0, 0), (10, 0), (12, 1), (21, 5), (22, 5), (38, 23), (44, 40), (85, 40), (87, 41), (89.5, 42), (92, 43),
         (95, 43), (108, 47), (120, 87), (147, 87), (160, 120), (171, 300), (188, 300)]
ts = np.arange(0, DUR, 1 / 200)
vals = np.round(np.interp(ts, [c[0] for c in COUNT], [c[1] for c in COUNT]))
for k in np.nonzero(np.diff(vals) > 0)[0]:
    tt = ts[k + 1]
    add(tick(0.12 if tt > 160 else 0.22), tt)

# ---------------- master: soft limiter, normalise to -1 dBFS
mix = np.stack([L, R], axis=1)
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / (np.abs(mix).max() + 1e-9)
out = pathlib.Path(__file__).resolve().parents[1] / "public" / "audio" / "film01_mix_v2.wav"
out.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(out), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("wrote", out, f"{DUR:.0f}s")
