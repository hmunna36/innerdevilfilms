#!/usr/bin/env python3
"""Sound for Short 03 of Inner Devil Films (TOMORROW, "tomorrow-angel", vertical cut, 32.30 s). The instruments and
sound effects are the film's own (film04_score.py, run up to its first section), re-timed to the Short's cuts:
the Angel, "Rest." 0.00 | his face, her comfort 1.20 | "One step at a time." 3.60 | he applies 5.40 (typing
5.75-6.35) | NOT SELECTED 6.40 | his face falls 7.60 | "Again?" 8.40 | "Tomorrow." 9.80 (lid shut 10.90) | the
nights slip 11.10 ("Tomorrow."), 12.30 (3:47), 13.30 ("Rest."), 14.50 (FINAL WARNING), 15.80 (three NOT SELECTED
15.88, 16.19, 16.50), 17.10 (his face) | the floor 18.10 ("You can still take one step.") | 20.50 ("I keep taking
one... then stopping.") | the Angel burns down to an ember 23.40 | 3:59 24.90 | the halo's shadow grows horns 25.90
("When kindness fails..." 26.25, "...the devil gets to work." 27.85) | silence 29.00 | card 29.30."""
import numpy as np, pathlib, wave

here = pathlib.Path(__file__).resolve().parent
ns: dict = {}
exec((here / "film04_score.py").read_text().split("# ================= COLD OPEN")[0], ns)
SR = ns["SR"]
END = 32.3
N = int(SR * (END + 0.5))
ns["N"] = N; ns["L"] = np.zeros(N); ns["R"] = np.zeros(N)
g = ns
add, hit, timp, braam, cymbal, choir, rumble, breath, reverse_swell, tick = (g[k] for k in
    "add hit timp braam cymbal choir rumble breath reverse_swell tick".split())
paper, thump, whoosh, piano, bell, phone_buzz, pad, note, bonk, strings = (g[k] for k in
    "paper thump whoosh piano bell phone_buzz pad note bonk strings".split())
noise_band = g["noise_band"]
rng = np.random.default_rng(13)

# ---------------- the Angel: her bells on the first frame, her piano (A minor, as in the film) under her comfort
for i, f in enumerate([1046.5, 1318.5, 1760, 2093]): add(bell(f, 0.11), 0.0 + i * 0.07)
add(pad([note("A4"), note("C5"), note("E5")], 2.2, 0.05), 0.0)
beat = 60 / 76
prog = [["A3", "C4", "E4", "A4"], ["F3", "A3", "C4", "F4"], ["C3", "E3", "G3", "C4"], ["G3", "B3", "D4", "G4"]]
t = 0.0; bar = 0
while t < 6.4:
    chord = prog[bar % 4]
    add(pad([note(c) for c in chord[:3]], beat * 4 + 1.0, 0.07), t)
    for kk in range(8):
        tt = t + kk * beat / 2
        if tt < 6.35: add(piano(note(chord[kk % 4]), 2.4, 0.2 * (1 if kk == 0 else 0.7)), tt, pan=0.2 * ((kk % 2) * 2 - 1))
    t += beat * 4; bar += 1
add(bell(1568, 0.07), 1.25)                                          # her line
add(bell(1568, 0.07), 3.7)                                           # "One step at a time."
# he applies: keys, Submit
add(tick(0.2), 5.42); add(whoosh(0.25, 0.1), 5.4)
for tt in np.arange(5.75, 6.3, 0.085): add(tick(0.07 + 0.04 * rng.random()), tt)
add(tick(0.3), 6.3)
# NOT SELECTED: the piano stops dead
add(whoosh(0.25, 0.25), 6.25); add(hit(0.7, 1.6), 6.4); add(bonk(0.4), 6.4); add(braam(55, 1.8, 0.25), 6.4)
add(pad([110.0, 130.8, 164.8], 4.0, 0.06), 6.45); add(pad([440.0, 523.3, 659.3], 3.6, 0.04), 6.45)
# "Again?" ... "Tomorrow." (the lid shuts)
add(bell(1568, 0.08), 8.45)
add(piano(note("A3"), 3.0, 0.14), 9.85); add(piano(note("E3"), 3.0, 0.1), 9.85)
add(timp(98, 0.35), 10.9); add(thump(0.4), 10.9)
# the nights slip: a cut a night, the counter ticking down, the clock ticking faster
for tt in (11.1, 12.3, 13.3, 14.5, 15.8, 17.1): add(whoosh(0.35, 0.2), tt - 0.12); add(tick(0.4), tt); add(timp(110, 0.22), tt)
tt = 11.1
while tt < 18.0:
    add(tick(0.18), tt); tt += max(0.08, 0.34 - 0.04 * (tt - 11.1))
add(strings(440.0, 659.3, 7.0, 0.09), 11.1)
add(piano(note("A3"), 2.0, 0.12), 11.15)                              # "Tomorrow." again
add(pad([440.0, 659.3], 2.2, 0.035), 11.6)                           # (the phone band, under the clock)
for i, f in enumerate([1318.5, 1046.5]): add(bell(f, 0.07), 13.35 + i * 0.12)   # "Rest."
add(paper(0.7, 0.35), 14.55)                                         # the warning skids in under the door
for tt in (15.88, 16.19, 16.5): add(bonk(0.3), tt)                   # three rejections
add(reverse_swell(0.6, 0.3), 17.5)
# the floor: her last kindness (her motif, slower), his answer
add(pad([55.0, 110.0, 164.8], 5.6, 0.07), 18.1); add(pad([440.0, 523.3], 5.6, 0.045), 18.1)
add(bell(1568, 0.06), 18.2)
for nm, tt in [("A3", 18.25), ("C4", 19.2), ("B3", 20.15), ("A3", 21.1), ("E3", 22.05)]: add(piano(note(nm), 3.5, 0.17), tt)
# the Angel burns down to an ember: her bells, falling and fading
add(pad([55.0, 110.0], 3.0, 0.06), 23.4); add(pad([329.6, 440.0], 2.6, 0.04), 23.4)
for i, (f, v) in enumerate([(1760, 0.07), (1318.5, 0.06), (1046.5, 0.045), (880, 0.03)]): add(bell(f, v), 23.45 + i * 0.3)
# 3:59
add(tick(0.45), 25.05); add(tick(0.45), 25.95)
add(strings(880.0, 1318.5, 4.0, 0.035, 0.6), 24.9)                   # a thin high tension under the clock
add(pad([440.0, 523.3, 659.3], 2.2, 0.04), 24.7)
# the halo's shadow grows horns: rumble, a heartbeat that quickens, the braam on "the devil"
add(rumble(3.2, 0.45), 25.9)
add(strings(440.0, 659.3, 3.1, 0.11, 1.0), 25.9)
t = 26.0
while t < 28.9:
    u = (t - 26.0) / 2.9
    add(thump(0.55 + 0.3 * u), t); add(thump(0.32), t + 0.27)
    t += 60 / (62 + 50 * u)
add(breath(1.2, 0.2), 26.3)
add(braam(55, 2.4, 0.45), 27.85); add(hit(0.6, 2.0), 27.85); add(timp(55, 0.6), 27.85)
add(choir([110.0, 164.8, 220.0, 261.6, 329.6], 1.2, 0.26, att=0.9, rel=0.25), 27.85)
add(reverse_swell(0.7, 0.35), 28.3)
# 29.00 - 29.30: silence (everything before the card is faded out by 29.00 and cut)
i0, i1 = int(SR * 28.85), int(SR * 29.0)
for ch in (ns["L"], ns["R"]):
    ch[i0:i1] *= np.linspace(1, 0, i1 - i0) ** 2; ch[i1:] = 0
# the card: one deep hit, the Angel's motif, quietly
add(hit(0.7, 2.0), 29.3); add(timp(41.2, 0.6), 29.3); add(cymbal(1.4, 0.12), 29.3)
add(braam(41.2, 1.6, 0.18), 29.3)
for nm, tt in [("A3", 29.4), ("C4", 30.0), ("B3", 30.6), ("A3", 31.2)]: add(piano(note(nm), 2.5, 0.18), tt)
add(pad([note("A3"), note("C4"), note("E4")], 3.0, 0.06), 29.3)

# master: soft clip, normalise, fade out the last 0.5 s, cut at the end
mix = np.stack([ns["L"], ns["R"]], axis=1)[: int(SR * END)]
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / (np.abs(mix).max() + 1e-9)
fl = int(SR * 0.5); mix[-fl:] *= np.linspace(1, 0, fl)[:, None]
out = here.parents[0] / "public" / "audio" / "short03_mix.wav"
out.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(out), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("wrote", out, f"{len(mix) / SR:.2f} s")
