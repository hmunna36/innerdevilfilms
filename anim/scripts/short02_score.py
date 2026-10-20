#!/usr/bin/env python3
"""Sound for Short 02 of Inner Devil Films (TOMORROW, "tomorrow-mom", vertical cut, 30.90 s). The instruments and
sound effects are the film's own (film04_score.py, run up to its first section), re-timed to the Short's cuts:
Mom's text 0.00 (her second text 1.50, his reply typed 2.55-3.75, sent 3.75) | his face, 7 DAYS LEFT 4.80 |
the Angel 5.70 | her line 6.80 | his face 8.20 | he applies 9.55 (typing 9.90-10.70) | sent 10.70 |
NOT SELECTED 11.70 | "Again?" 12.90 | "Tomorrow." 14.30 (lid shut 15.40) | the days slip 15.60, 16.60, 17.60,
18.60 (the warning), 19.60 | the floor 20.60 (buzz 21.15) | Mom again 21.60 (typing 22.90-24.00) |
"I ran out today." 24.00 | the tear, 0 DAYS LEFT 26.20 | card 27.90."""
import numpy as np, pathlib, wave

here = pathlib.Path(__file__).resolve().parent
ns: dict = {}
exec((here / "film04_score.py").read_text().split("# ================= COLD OPEN")[0], ns)
SR = ns["SR"]
END = 30.9
N = int(SR * (END + 0.5))
ns["N"] = N; ns["L"] = np.zeros(N); ns["R"] = np.zeros(N)
g = ns
add, hit, timp, braam, cymbal, choir, rumble, breath, reverse_swell, tick = (g[k] for k in
    "add hit timp braam cymbal choir rumble breath reverse_swell tick".split())
paper, thump, whoosh, piano, bell, phone_buzz, pad, note, bonk, strings = (g[k] for k in
    "paper thump whoosh piano bell phone_buzz pad note bonk strings".split())
noise_band, env = g["noise_band"], g["env"]
rng = np.random.default_rng(12)

def key(vel=0.06):                                   # one soft key tap on the phone's keyboard
    n = int(SR * 0.03)
    return noise_band(n, 1800, 7000) * env(n, 0.0008, 0.008) * vel * 4

# ---------------- Mom's text: the phone in his hands, the Angel's piano (A minor, as in the film) underneath
add(phone_buzz(0.32), 0.0); add(bell(1318.5, 0.07, 0.6), 0.02)
add(bell(1318.5, 0.07, 0.6), 1.5)                                    # her second text
for tt in np.arange(2.55, 3.65, 0.075): add(key(0.05 + 0.03 * rng.random()), tt)   # he types back
add(whoosh(0.25, 0.14), 3.66); add(bell(1760, 0.05, 0.8), 3.75)       # sent
beat = 60 / 76
prog = [["A3", "C4", "E4", "A4"], ["F3", "A3", "C4", "F4"], ["C3", "E3", "G3", "C4"], ["G3", "B3", "D4", "G4"]]
t = 0.0; bar = 0
while t < 11.7:
    chord = prog[bar % 4]
    add(pad([note(c) for c in chord[:3]], beat * 4 + 1.0, 0.06 + 0.02 * (t >= 5.7)), t)
    dens = 1 if t < 5.7 else 2
    for kk in range(4 * dens):
        tt = t + kk * beat * 4 / (4 * dens)
        if tt < 11.7: add(piano(note(chord[kk % 4]), 2.4, 0.2 * (1 if kk == 0 else 0.7)), tt, pan=0.2 * ((kk % 2) * 2 - 1))
    t += beat * 4; bar += 1
# 7 DAYS LEFT
add(tick(0.35), 4.8); add(timp(98, 0.4), 4.8); add(thump(0.45), 4.8)
# the Angel
for i, f in enumerate([1046.5, 1318.5, 1760, 2093]): add(bell(f, 0.1), 5.7 + i * 0.07)
add(bell(1568, 0.07), 6.85)
# he applies: keys, Submit, "Application sent"
for tt in np.arange(9.9, 10.65, 0.085): add(tick(0.07 + 0.04 * rng.random()), tt)
add(tick(0.3), 10.68); add(whoosh(0.3, 0.12), 10.64); add(bell(1318.5, 0.09), 10.8); add(bell(1760, 0.06), 10.9)
# NOT SELECTED
add(whoosh(0.25, 0.25), 11.55); add(hit(0.7, 1.6), 11.7); add(bonk(0.4), 11.7); add(braam(55, 1.8, 0.25), 11.7)
add(pad([110.0, 130.8, 164.8], 4.2, 0.06), 11.75); add(pad([440.0, 523.3, 659.3], 3.9, 0.035), 11.75)
# "Again?" ... "Tomorrow." (the lid shuts)
add(bell(1568, 0.08), 12.95)
add(timp(98, 0.35), 15.4); add(thump(0.4), 15.4)
# the days slip: a cut a day, the counter ticking down, the clock ticking faster
for tt in (15.6, 16.6, 17.6, 18.6, 19.6): add(whoosh(0.35, 0.2), tt - 0.12); add(tick(0.4), tt); add(timp(110, 0.22), tt)
tt = 15.6
while tt < 20.5:
    add(tick(0.18), tt); tt += max(0.08, 0.32 - 0.05 * (tt - 15.6))
add(strings(440.0, 659.3, 5.2, 0.09), 15.6)
add(paper(0.7, 0.35), 18.6)
add(bonk(0.3), 19.7); add(bonk(0.25), 19.9)
add(reverse_swell(0.6, 0.3), 20.0)
# the floor, 1 DAY LEFT; the phone buzzes
add(pad([55.0, 110.0, 164.8], 5.6, 0.07), 20.6); add(pad([440.0, 523.3], 5.6, 0.045), 20.6)
add(phone_buzz(0.3), 21.15)
# Mom again; "I ran out today."
add(bell(1318.5, 0.06, 0.6), 21.65)
add(hit(0.6, 2.5), 24.0); add(timp(49, 0.6), 24.0); add(bell(1318.5, 0.06, 0.6), 24.02)
for f in (110.0, 130.8, 164.8): add(piano(f, 4, 0.22), 24.02)
add(pad([220.0, 261.6, 329.6], 2.4, 0.045), 24.0)
# the tear, 0 DAYS LEFT: one deep beat, then almost nothing
add(thump(0.8), 26.2); add(timp(41.2, 0.7), 26.2); add(braam(41.2, 1.6, 0.22), 26.2)
add(bell(2093, 0.06), 26.3); add(bell(2637, 0.04), 26.75)
add(pad([440.0, 523.3, 659.3], 2.0, 0.04), 26.2)
# the card: one hit, the Angel's motif, quietly
add(hit(0.6, 1.6), 27.9); add(cymbal(1.4, 0.12), 27.9)
for nm, tt in [("A3", 27.95), ("C4", 28.55), ("B3", 29.15), ("A3", 29.75)]: add(piano(note(nm), 2.5, 0.18), tt)
add(pad([note("A3"), note("C4"), note("E4")], 3.2, 0.06), 27.9)

# master: soft clip, normalise, fade out the last 0.5 s, cut at the end
mix = np.stack([ns["L"], ns["R"]], axis=1)[: int(SR * END)]
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / (np.abs(mix).max() + 1e-9)
fl = int(SR * 0.5); mix[-fl:] *= np.linspace(1, 0, fl)[:, None]
out = here.parents[0] / "public" / "audio" / "short02_mix.wav"
with wave.open(str(out), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("wrote", out, f"{len(mix) / SR:.2f} s")
