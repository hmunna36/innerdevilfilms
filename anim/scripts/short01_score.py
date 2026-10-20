#!/usr/bin/env python3
"""Sound for Short 01 of Inner Devil Films (TOMORROW, vertical cut, 33.41 s). The instruments and sound effects
are the film's own (film04_score.py, run up to its first section), re-timed to the Short's cuts:
hook 0.00 | 30 DAYS EARLIER 2.38 | notice 3.18 | read 3.98 | Mom 5.28 | "Again?" 8.28 | "Tomorrow." 9.68 |
days slip 10.98 | "I ran out today." 13.48 | tear 15.48 | entry 16.68 (clock), 17.73 (horns), 19.63 (smoke),
21.23 (flicker), 22.43 (eyes), 23.76 (rises), 26.26 ("Then move."), 28.81 (silence) | drop 29.41 | card 31.31."""
import numpy as np, pathlib, wave

here = pathlib.Path(__file__).resolve().parent
ns: dict = {}
exec((here / "film04_score.py").read_text().split("# ================= COLD OPEN")[0], ns)
SR = ns["SR"]
END = 33.41
N = int(SR * (END + 0.5))
ns["N"] = N; ns["L"] = np.zeros(N); ns["R"] = np.zeros(N)
g = ns
add, hit, timp, braam, cymbal, choir, rumble, breath, reverse_swell, tick = (g[k] for k in
    "add hit timp braam cymbal choir rumble breath reverse_swell tick".split())
paper, thump, whoosh, piano, bell, phone_buzz, pad, note, bonk, strings = (g[k] for k in
    "paper thump whoosh piano bell phone_buzz pad note bonk strings".split())
riser, power, chug, lead, buzz, noise_band, env, lowpass, saw = (g[k] for k in
    "riser power chug lead buzz noise_band env lowpass saw".split())
A2 = 110.0
rng = np.random.default_rng(11)

# hook: the climax (the film's cold open)
add(rumble(2.4, 0.32), 0.0)
add(hit(1.0, 3.0), 0.0); add(timp(55, 0.9), 0.0); add(braam(55, 2.6, 0.6), 0.0); add(cymbal(2.4, 0.2), 0.0)
add(choir([82.4, 110.0, 164.8, 220.0], 2.4, 0.22, att=0.2, rel=0.6), 0.03)
add(breath(1.1, 0.3), 1.18); add(reverse_swell(0.6, 0.35), 1.78)
# 30 DAYS EARLIER
add(hit(0.9, 1.4), 2.38); add(cymbal(1.2, 0.2), 2.38); add(tick(0.25), 2.95)
# the notice slides in, stops; he reads it
add(paper(0.72, 0.42), 3.16); add(noise_band(int(SR * 0.08), 900, 4000) * env(int(SR * 0.08), 0.002, 0.03) * 0.25, 3.83)
add(timp(65, 0.5), 3.87); add(thump(0.5), 3.87)
add(whoosh(0.3, 0.25), 3.84); add(hit(0.55, 1.4), 3.98); add(piano(A2, 4, 0.3), 4.0)
add(bell(1760, 0.08), 5.0); add(tick(0.3), 5.0)
# Mom's texts, over the Angel's piano (A minor, as in the film)
add(phone_buzz(0.3), 5.3); add(bell(1318.5, 0.07, 0.6), 6.53)
beat = 60 / 76
prog = [["A3", "C4", "E4", "A4"], ["F3", "A3", "C4", "F4"], ["C3", "E3", "G3", "C4"], ["G3", "B3", "D4", "G4"]]
t = 5.28; bar = 0
while t < 10.9:
    chord = prog[bar % 4]
    add(pad([note(c) for c in chord[:3]], beat * 4 + 1.0, 0.07), t)
    for kk in range(8):
        tt = t + kk * beat / 2
        if tt < 10.9: add(piano(note(chord[kk % 4]), 2.4, 0.2 * (1 if kk == 0 else 0.65)), tt, pan=0.2 * ((kk % 2) * 2 - 1))
    t += beat * 4; bar += 1
# "Again?" ... "Tomorrow."
add(bell(1568, 0.08), 8.33); add(pad([440.0, 523.3, 659.3], 2.6, 0.05), 8.3)
add(timp(98, 0.35), 10.78); add(thump(0.4), 10.78)
# the days slip: cuts, ticking faster, the second notice, three rejections
for tt in (10.98, 11.88, 12.68): add(whoosh(0.35, 0.2), tt - 0.12)
tt = 10.98
while tt < 13.4:
    add(tick(0.2), tt); tt += max(0.07, 0.3 - 0.09 * (tt - 10.98))
add(strings(440.0, 659.3, 2.6, 0.09), 10.98)
add(paper(0.7, 0.35), 10.98)
for tt in (11.98, 12.18, 12.38): add(bonk(0.3), tt)
add(reverse_swell(0.5, 0.3), 12.95)
# "I ran out today." and the tear
add(pad([55.0, 110.0, 164.8], 3.4, 0.07), 13.48); add(pad([440.0, 523.3], 3.4, 0.04), 13.48)
add(bell(1318.5, 0.06, 0.6), 13.5)
add(hit(0.6, 2.5), 14.18); add(timp(49, 0.6), 14.18)
for f in (110.0, 130.8, 164.8): add(piano(f, 3.5, 0.22), 14.2)
add(bell(2093, 0.06), 15.48); add(bell(2637, 0.04), 15.88)
# THE DEVIL'S ENTRY
add(tick(0.45), 16.83); add(tick(0.45), 17.45)
add(rumble(11.1, 0.45), 17.73)
add(strings(440.0, 659.3, 4.8, 0.11, 1.0), 17.73)
add(braam(55, 2.2, 0.2), 17.73)
t = 17.9
while t < 22.35:                                    # the heartbeat, speeding up
    u = min(1, (t - 17.9) / 4.45)
    add(thump(0.55 + 0.3 * u), t); add(thump(0.32), t + 0.25)
    t += 60 / (60 + 60 * u)
add(noise_band(int(SR * 1.6), 300, 3000) * np.linspace(0, 1, int(SR * 1.6)) ** 2 * 0.18, 19.63)   # smoke hiss
for tt in (20.13, 20.38, 20.63): add(timp(82, 0.3), tt)
add(choir([110.0, 164.8, 220.0, 261.6, 329.6], 3.0, 0.32, att=2.6, rel=0.3), 19.63)
add(lowpass(saw(1760, int(SR * 0.4), 6000) + saw(1864.7, int(SR * 0.4), 6000), 5000) * np.exp(-np.arange(int(SR * 0.4)) / SR * 6) * 0.05, 21.23)
for tt in (21.33, 21.73, 22.08): add(buzz(0.09, 0.3), tt)  # the lights flicker
add(reverse_swell(0.5, 0.4), 21.95)
add(hit(1.0, 4.0), 22.46); add(timp(55, 0.9), 22.46); add(braam(55, 3.0, 0.55), 22.46); add(cymbal(3.0, 0.2), 22.46)  # the eyes open
add(choir([82.4, 110.0, 164.8, 220.0], 1.4, 0.22, att=0.1, rel=0.8), 22.5)
for i, tt in enumerate(np.arange(23.76, 26.1, 0.09)): add(timp(73.4, 0.18 + 0.4 * i / 26), tt)   # it rises
add(riser(2.5, 110, 660, 0.22), 23.76)
add(choir([110.0, 164.8, 220.0, 261.6, 329.6, 440.0], 2.5, 0.34, att=1.7, rel=0.3), 23.76)
add(braam(55, 2.4, 0.4), 25.3)
add(pad([55.0, 82.4, 110.0], 2.6, 0.08), 26.26); add(strings(220.0, 329.6, 2.4, 0.08, 0.6), 26.26)  # "Then move."
add(braam(41.2, 2.2, 0.32), 26.46)
cut = int(28.81 * SR); ns["L"][cut:int(29.41 * SR)] *= 0; ns["R"][cut:int(29.41 * SR)] *= 0          # total silence
# THE DROP: the film's Devil-mode beat at full power straight away
add(hit(1.0, 2.0), 29.41); add(timp(55, 0.9), 29.41); add(cymbal(2.0, 0.3), 29.41)
B = 60 / 128; BAR = 4 * B
roots = [55.0, 43.65, 65.41]; chords = [[220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [261.6, 329.6, 392.0]]
motif = [440.0, 523.3, 659.3, 880.0]
t = 29.41; bar = 0
while t < END - 0.05:
    r = roots[bar % 3]
    add(choir(chords[bar % 3], BAR + 0.3, 0.12, att=0.2, rel=0.3), t)
    add(power(r * 2, BAR, 0.16), t)
    for kk in range(8):
        if t + kk * B / 2 < END: add(chug(r * 2, 0.22), t + kk * B / 2)
    for kk in range(4):
        tt = t + kk * B
        if tt >= END: break
        if kk in (0, 2): add(thump(0.8), tt)
        else: add(noise_band(int(SR * 0.16), 1500, 8000) * env(int(SR * 0.16), 0.001, 0.06) * 0.42, tt); add(timp(196, 0.12), tt)
    for i, f in enumerate(motif if bar % 2 == 0 else [784.0, 659.3, 523.3, 587.3]):
        if t + i * B < END: add(lead(f, B * 0.9, 0.13), t + i * B)
    t += BAR; bar += 1
add(hit(0.8, 1.6), 31.31)                           # the end card lands
# phone-speaker presence (300 Hz - 6 kHz) under the quiet stretches
add(pad([440.0, 523.3, 659.3], 2.4, 0.04), 2.38)
add(strings(880.0, 1318.5, 1.6, 0.035, 0.6), 16.68); add(pad([440.0, 523.3, 659.3], 3.0, 0.05), 16.68)

# master: soft clip, normalise, fade out the last 0.4 s, cut at the end
mix = np.stack([ns["L"], ns["R"]], axis=1)[: int(SR * END)]
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / (np.abs(mix).max() + 1e-9)
fl = int(SR * 0.4); mix[-fl:] *= np.linspace(1, 0, fl)[:, None]
out = here.parents[0] / "public" / "audio" / "short01_mix.wav"
with wave.open(str(out), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("wrote", out, f"{len(mix) / SR:.2f} s")
