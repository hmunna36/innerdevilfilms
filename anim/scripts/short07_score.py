#!/usr/bin/env python3
"""Sound for Short 07 of Inner Devil Films (TOMORROW, "tomorrow-reveal", vertical cut, 27.00 s). The film's reveal cue
(film04_score.py's instruments, re-timed to the Short's cuts), with one change: the swell into the flash is cut to a
beat of silence before the choir, so the turn lands as a drop:
hook, the Devil beside him, "The Devil saved him." 0.00 (a deep hit, the low drone of the room, the clock 0.40) |
"Then he saw who it really was." 1.10 | he turns and faces it 2.40 (the Angel's motif, minor, as in the film), it
reaches 3.20 | close 4.20 (a low braam) | red turns gold 5.40 (riser and reverse swell) | silence 6.80-7.30 | the flash,
the Angel 7.30 (choir, bells, the motif in major) | she reaches 8.60 | the halo shadow 10.20 (a bell) | his tear 11.40 |
"You never listened when I was kind." 12.80 (C#, E, A on the piano) | the papers, PAID 16.40 | "I heard you. I kept
choosing tomorrow." 17.60 (the film's four chords, 1.3 s apart) | "The voice was always the same." 20.80, "The choice
was finally his." 22.20 (A major, a bell) | card 24.00."""
import numpy as np, pathlib, wave

here = pathlib.Path(__file__).resolve().parent
src = (here / "film04_score.py").read_text().split("# ================= COLD OPEN")[0]   # the instruments only
ns: dict = {}
exec(src, ns)
SR = ns["SR"]
END = 27.0
N = int(SR * (END + 0.5))
ns["N"] = N; ns["L"] = np.zeros(N); ns["R"] = np.zeros(N)
g = ns
add, hit, timp, braam, cymbal, choir, breath, reverse_swell, riser, tick, whoosh = (g[k] for k in
    "add hit timp braam cymbal choir breath reverse_swell riser tick whoosh".split())
piano, bell, pad, note, strings, noise_band, paper, angel_motif = (g[k] for k in
    "piano bell pad note strings noise_band paper angel_motif".split())
A2, A3 = g["A2"], g["A3"]

def drone(dur, vel=0.08):                            # the room under the Devil (the film's reveal drone), hard stop
    t = np.arange(int(SR * dur)) / SR
    x = np.sin(2 * np.pi * 55 * t) + 0.3 * np.sin(2 * np.pi * 110 * t) + 0.08 * noise_band(len(t), 2000, 6000)
    return x * vel * np.minimum(1, t / 0.3) * np.minimum(1, (dur - t) / 0.05)

def thin(freqs, dur, vel=0.045, fade=0.3):           # a thin high pad that keeps the phone band (short fades)
    t = np.arange(int(SR * dur)) / SR
    x = sum(np.sin(2 * np.pi * f * t) + 0.3 * np.sin(4 * np.pi * f * t) for f in freqs) / len(freqs)
    return x * vel * np.minimum(1, t / fade) * np.minimum(1, (dur - t) / 0.05)

# ---------------- hook: the Devil beside him at 9:04 (a deep hit on the first frame, the drone, the clock)
add(hit(0.7, 2.0), 0.0); add(timp(55, 0.6), 0.0); add(braam(55, 1.8, 0.28), 0.0)
add(choir([110.0, 164.8, 220.0, 261.6], 1.8, 0.16, att=0.05, rel=1.0), 0.02)
add(drone(6.8, 0.09), 0.0)
add(thin([440.0, 523.3, 659.3], 6.8, 0.05, 0.05), 0.0)
add(tick(0.16), 0.4); add(tick(0.12), 1.4)
add(strings(220.0, 329.6, 1.6, 0.06, 0.8), 0.8)
# ---------------- he turns and faces it (the Angel's motif, minor: the clue); it reaches for him
add(whoosh(0.3, 0.07), 2.35)
angel_motif(2.4, A2, 0.5, 0.3)
add(whoosh(0.5, 0.08), 3.2); add(breath(1.0, 0.12), 3.3)
add(braam(55, 1.6, 0.25), 4.2)
# ---------------- red turns gold: the swell, cut to silence before the flash
add(riser(1.4, 220, 880, 0.12), 5.4); add(reverse_swell(1.2, 0.3), 5.6)
add(whoosh(0.6, 0.06), 5.6)
# (6.80 - 7.30: silence)
# ---------------- the flash: the Angel
add(hit(0.5, 1.8), 7.3); add(cymbal(2.2, 0.12), 7.3)
add(choir([110.0, 138.6, 164.8, 220.0, 277.2, 329.6], 4.5, 0.32, att=0.12, rel=2.5), 7.3)
for i, f in enumerate([880, 1108.7, 1318.5, 1760, 2217.5]): add(bell(f, 0.1), 7.3 + i * 0.08)
angel_motif(7.4, A3, 0.42, 0.32, major=True)
add(thin([440.0, 554.4, 659.3], 16.7, 0.04, 0.6), 7.3)                              # (the phone band, A major)
add(bell(1318.5, 0.08), 10.2)                                                       # the halo shadow
add(bell(2093, 0.06), 11.4); add(breath(1.2, 0.14), 11.6)                           # his tear
# ---------------- "You never listened when I was kind."
add(pad([220.0, 277.2, 329.6], 3.9, 0.09), 12.8)
for nm, tt in [("C#4", 13.2), ("E4", 14.2), ("A4", 15.4)]: add(piano(note(nm), 3, 0.15), tt)
add(pad([185.0, 220.0, 277.2], 1.6, 0.08), 16.2)
# ---------------- the papers, PAID
add(bell(1760, 0.06), 16.4); add(paper(0.5, 0.05), 16.45)
# ---------------- "I heard you. I kept choosing tomorrow." (the film's four chords) -> the last lines
for i, ch in enumerate([[146.8, 185.0, 220.0], [110.0, 138.6, 164.8], [164.8, 207.7, 246.9], [110.0, 138.6, 164.8, 220.0]]):
    add(pad(ch, 1.8, 0.1), 17.6 + i * 1.3)
    for kk, f in enumerate(ch): add(piano(f * 2, 2.5, 0.15), 17.6 + i * 1.3 + kk * 0.16)
add(bell(1318.5, 0.06), 20.8)                                                       # "The voice was always the same."
add(pad([110.0, 138.6, 164.8, 220.0, 277.2], 2.4, 0.09), 21.8)
add(bell(1760, 0.07), 22.2); add(piano(A3, 2.5, 0.16), 22.2); add(piano(277.2, 2.5, 0.12), 22.25)   # "The choice was finally his."
# ---------------- the card: one deep hit, the Angel's motif (in major, the way the film ends)
add(hit(0.75, 2.0), 24.0); add(timp(41.2, 0.6), 24.0); add(cymbal(1.4, 0.14), 24.0); add(braam(41.2, 1.6, 0.2), 24.0)
add(thin([440.0, 554.4, 659.3], 3.0, 0.045, 0.1), 24.02)
for nm, tt in [("A4", 24.15), ("C#5", 24.7), ("B4", 25.25), ("A4", 25.8)]: add(piano(note(nm), 2.2, 0.2), tt)

# master: soft clip, normalise, fade out the last 0.5 s, cut at the end
mix = np.stack([g["L"], g["R"]], axis=1)[: int(SR * END)]
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / (np.abs(mix).max() + 1e-9)
fl = int(SR * 0.5); mix[-fl:] *= np.linspace(1, 0, fl)[:, None]
dst = here.parents[0] / "public" / "audio" / "short07_mix.wav"
dst.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(dst), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("wrote", dst, f"{len(mix) / SR:.2f} s")
