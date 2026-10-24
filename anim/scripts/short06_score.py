#!/usr/bin/env python3
"""Sound for Short 06 of Inner Devil Films (TOMORROW, "tomorrow-cost", vertical cut, 29.80 s). The cost is held in near
silence: no beat, only the room (a thin high pad that keeps the phone band), the clock, the keys, the phone buzzing in
the drawer and the film's own cost and day-zero cues (film04_score.py's instruments, re-timed to the Short's cuts):
hook, his red eyes, "$2,400 in 18 days." 0.00 (a deep hit) | "What did it cost him?" 0.55 | day 1, the phone into the
drawer 2.00 (slide 2.25, slam 2.95) | 9:31 3.40 (the clock) | 12:40 4.40 (keys) | 2:40 5.80 | he rubs his eyes 6.80,
the Devil's hand 7.30 | 6:02, still up 8.20 | Friday, Ava in the drawer 10.40 (buzzes 10.45, 11.35) | his eyes flick
12.60 | the empty table 13.40 (the film's A-minor piano) | the huge Devil 16.40 (choir, thumps) | day zero 18.00: PAID
Rent 18.20, Mom's medicine 19.00 (bells), MISSED 19.80 (the rejection bonk), the drawer buzzes 20.60 | Mom 21.30 (the
drawer opens 21.35, C major) | the lid 24.30 | relief, "Worth it?" 25.00 | card 26.80."""
import numpy as np, pathlib, wave

here = pathlib.Path(__file__).resolve().parent
src = (here / "film04_score.py").read_text().split("# ================= COLD OPEN")[0]   # the instruments only
ns: dict = {}
exec(src, ns)
SR = ns["SR"]
END = 29.8
N = int(SR * (END + 0.5))
ns["N"] = N; ns["L"] = np.zeros(N); ns["R"] = np.zeros(N)
g = ns
add, hit, timp, braam, cymbal, choir, breath, reverse_swell, tick, whoosh = (g[k] for k in
    "add hit timp braam cymbal choir breath reverse_swell tick whoosh".split())
thump, piano, bell, phone_buzz, pad, note, bonk, strings, lowpass, noise_band, env = (g[k] for k in
    "thump piano bell phone_buzz pad note bonk strings lowpass noise_band env".split())
rng = np.random.default_rng(6)

def key(vel=0.06):                                   # one key on the laptop
    n = int(SR * 0.03)
    return noise_band(n, 1500, 6500) * env(n, 0.0008, 0.01) * vel * 4

def hum(dur, f=110.0, vel=0.05):                     # the room at night (the film's cost hum)
    t = np.arange(int(SR * dur)) / SR
    return (np.sin(2 * np.pi * f * t) + 0.4 * np.sin(4 * np.pi * f * t)) * vel * np.minimum(1, t / 0.3) * np.minimum(1, (dur - t) / 0.4)

# ---------------- hook: his red eyes, $2,400 (a deep hit, the Devil's low choir), then the question in the quiet
add(hit(0.8, 2.4), 0.0); add(timp(55, 0.7), 0.0); add(braam(55, 1.8, 0.3), 0.0)
add(choir([110.0, 164.8, 220.0, 261.6], 1.8, 0.16, att=0.05, rel=1.0), 0.02)
add(pad([440.0, 523.3, 659.3], 2.0, 0.05), 0.3)
for tt in np.arange(0.9, 1.9, 0.11): add(key(0.04 + 0.02 * rng.random()), tt)       # he keeps typing
# ---------------- day 1, 4:00: the phone into the drawer (the film's drawer sounds)
add(whoosh(0.25, 0.12), 1.9)
add(noise_band(int(SR * 0.3), 300, 1500) * 0.15, 2.25); add(timp(180, 0.3), 2.65); add(hit(0.45, 0.8), 2.95); add(thump(0.7), 2.95)
# ---------------- the nights: the clock, the keys, nothing else
add(hum(7.0, 110.0, 0.035), 3.4)
add(pad([440.0, 523.3, 659.3], 7.2, 0.045), 3.3)                                    # (the phone band)
for tt in (3.4, 3.9, 4.4, 5.8, 6.3, 6.8): add(tick(0.3), tt)                          # the clock on each cut
for tt in np.arange(4.45, 5.8, 0.085): add(key(0.05 + 0.03 * rng.random()), tt)       # 12:40, typing
add(breath(1.3, 0.2), 6.85); add(thump(0.45), 7.3); add(braam(41.2, 0.9, 0.18), 7.3)   # he rubs his eyes; the Devil's hand
add(tick(0.25), 8.2); add(breath(1.8, 0.16), 8.6)                                     # 6:02, still up, swaying
add(reverse_swell(0.9, 0.12), 9.5)
# ---------------- Friday: Ava, in the drawer (as in the film: muffled buzzes rattling on the wood)
add(hum(3.0, 110.0, 0.05), 10.4)
add(lowpass(phone_buzz(0.3), 2200), 10.45); add(lowpass(phone_buzz(0.26), 2200), 11.35)
for tt in (10.45, 10.77, 11.35, 11.67): add(noise_band(int(SR * 0.2), 180, 900) * env(int(SR * 0.2), 0.004, 0.08) * 0.22, tt)
add(pad([523.3, 659.3, 784.0], 3.0, 0.035), 10.4)
add(tick(0.2), 12.6)
for tt in np.arange(12.95, 13.4, 0.09): add(key(0.05), tt)                            # his eyes flick back; he types on
# ---------------- the empty table (the film's piano, A minor), rain on the glass
for i, f in enumerate([220.0, 261.6, 329.6, 440.0]): add(piano(f, 3.5, 0.2), 13.5 + i * 0.55)
add(pad([110.0, 130.8, 164.8], 3.2, 0.06), 13.4)
rn = int(SR * 3.0); add(noise_band(rn, 1500, 6000) * np.minimum(1, np.arange(rn) / (SR * 0.4)) * np.minimum(1, (rn - np.arange(rn)) / (SR * 0.4)) * 0.05, 13.4)
add(strings(659.3, 880.0, 3.0, 0.03, 0.6), 13.6)
# ---------------- the huge Devil (the film's cue)
add(choir([55.0, 82.4, 110.0], 1.7, 0.2, att=0.4, rel=0.5), 16.4); add(thump(0.5), 16.6); add(thump(0.5), 17.35)
add(pad([440.0, 466.2], 1.6, 0.03), 16.4)                                             # (a thin, uneasy phone band)
# ---------------- day zero: paid, paid, missed; the drawer buzzes
add(bell(880, 0.12), 18.2); add(bell(1318.5, 0.12), 18.35); add(bell(880, 0.12), 19.0); add(bell(1318.5, 0.12), 19.15)
add(pad([130.8, 196.0, 293.7, 329.6], 2.0, 0.08), 18.0)
add(bonk(0.4), 19.8); add(timp(61.7, 0.35), 19.8); add(pad([233.1, 277.2, 349.2], 1.2, 0.05), 19.85)
add(lowpass(phone_buzz(0.27), 1200), 20.6)
# ---------------- Mom, in the drawer (the film's day-zero cue)
add(noise_band(int(SR * 0.42), 250, 1400) * env(int(SR * 0.42), 0.03, 0.25, 0.4) * 0.3, 21.35); add(thump(0.35), 21.78)
add(pad([130.8, 196.0, 293.7, 329.6, 392.0], 4.0, 0.11), 21.0)
for i, f in enumerate([261.6, 329.6, 392.0, 523.3]): add(piano(f, 3, 0.18), 21.4 + i * 0.45)
add(breath(1.6, 0.22), 22.4)
# ---------------- the lid; relief, and the Devil still beside him
add(noise_band(int(SR * 0.12), 300, 2000) * env(int(SR * 0.12), 0.002, 0.05) * 0.25, 24.35); add(thump(0.3), 24.45)
add(pad([174.6, 220.0, 261.6, 392.0], 2.6, 0.08), 24.3)
add(breath(1.6, 0.2), 25.0)
add(piano(110.0, 3.0, 0.22), 25.35); add(piano(220.0, 3.0, 0.12), 25.36)
add(strings(523.3, 554.4, 1.6, 0.03, 0.8), 25.2)
# ---------------- the card: one deep hit, the Angel's motif (A minor), as on the other Shorts of this film
add(hit(0.75, 2.0), 26.8); add(timp(41.2, 0.6), 26.8); add(cymbal(1.4, 0.14), 26.8); add(braam(41.2, 1.6, 0.2), 26.8)
add(pad([440.0, 523.3, 659.3], 3.0, 0.045), 26.82)
for nm, tt in [("A4", 26.95), ("C5", 27.5), ("B4", 28.05), ("A4", 28.6)]: add(piano(note(nm), 2.2, 0.2), tt)

# master: soft clip, normalise, fade out the last 0.5 s, cut at the end
mix = np.stack([g["L"], g["R"]], axis=1)[: int(SR * END)]
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / (np.abs(mix).max() + 1e-9)
fl = int(SR * 0.5); mix[-fl:] *= np.linspace(1, 0, fl)[:, None]
dst = here.parents[0] / "public" / "audio" / "short06_mix.wav"
dst.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(dst), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("wrote", dst, f"{len(mix) / SR:.2f} s")
