#!/usr/bin/env python3
"""Sound for Short 05 of Inner Devil Films (TOMORROW, "tomorrow-montage", vertical cut, 33.23 s). The Short plays the
film's Devil Mode montage in the film's own time and tempo (128 BPM, a bar = 1.875 s), so its sound IS the film's own
mix of the same spans (film04_score.py, run up to its master, unmastered), with the drop's hit moved to the Short's
first frame and new sound only for the jump to day zero and the card:
THE DROP, DEVIL MODE 0.00 (film 69.4-71.125; the film's hit at 69.0 is moved to 69.4) | one bar later in the film:
the phone into the drawer 1.725 (film 73.0, the drawer 1.98-2.68) | "Again." 3.125 | the lid, the riser 3.70 | the
full beat 5.225 (film 76.5) | the money montage, a payment every chaching: 7.325 (+$1,200), 11.325 (+$150), 17.525
(+$375), 18.925 (+$300), 25.125 (+$375) | rejected 13.625 | "Again." 14.725 | EARNED $2,400 26.325 (hit) | the beat
stops on the bar line at 27.725 (film 99.0) | day zero 27.725 (film 107.6-110.15): PAID Rent 27.925, Mom's medicine
28.725 (the film's bells) | card 30.225."""
import numpy as np, pathlib, wave

here = pathlib.Path(__file__).resolve().parent
src = (here / "film04_score.py").read_text().split("# ================= master")[0]
# the drop lands on the Short's first frame (film 69.4, when he is up), not at 69.0
for a, b in (("add(hit(1.2, 4.5), 69.0); add(timp(55, 1.0), 69.0); add(cymbal(4.0, 0.35), 69.0); add(power(110, 1.8, 0.4), 69.0); add(braam(55, 3.0, 0.7), 69.0)\n",
              "add(hit(1.2, 4.5), 69.4); add(timp(55, 1.0), 69.4); add(cymbal(4.0, 0.35), 69.4); add(power(110, 1.8, 0.4), 69.4); add(braam(55, 3.0, 0.7), 69.4)\n"),
             ("add(choir([220.0, 261.6, 329.6, 440.0, 523.3], 3.5, 0.3, att=0.1, rel=1.5), 69.02)\n",
              "add(choir([220.0, 261.6, 329.6, 440.0, 523.3], 3.5, 0.3, att=0.1, rel=1.5), 69.42)\n")):
    assert a in src, a
    src = src.replace(a, b)
ns: dict = {}
exec(src, ns)
SR = ns["SR"]
FL = np.stack([ns["L"], ns["R"]], axis=1)          # the film, unmastered
END = 33.225
out = np.zeros((int(SR * (END + 0.5)), 2))

def paste(f0, f1, s0, fin=0.02, fout=0.02):
    """the film's sound from film time f0..f1 at Short time s0, with short fades at both ends"""
    seg = FL[int(SR * f0): int(SR * f1)].copy()
    a, b = max(1, int(SR * fin)), max(1, int(SR * fout))
    seg[:a] *= np.linspace(0, 1, a)[:, None]; seg[-b:] *= np.linspace(1, 0, b)[:, None]
    i = int(SR * s0); out[i: i + len(seg)] += seg

paste(69.4, 71.125 + 0.01, 0.0, fin=0.004)          # the drop
paste(73.0 - 0.01, 99.0 + 0.01, 1.715, fout=0.04)   # one bar later: the drawer, "Again.", the whole montage, EARNED
paste(107.6, 110.15, 27.725, fin=0.01, fout=0.25)   # day zero: the rent and Mom's medicine, paid

g = ns
add, hit, timp, piano, pad, bell, whoosh, tick, cymbal, braam, note, choir, reverse_swell = (g[k] for k in
    "add hit timp piano pad bell whoosh tick cymbal braam note choir reverse_swell".split())
# new sound goes into the film's (now empty) buffers, then onto the Short
N = out.shape[0]
g["N"] = N; g["L"] = np.zeros(N); g["R"] = np.zeros(N)
# the jump into the drawer (one bar later in the film, same place in the beat)
add(whoosh(0.3, 0.16), 1.62)
# the beat stops dead on the bar line; day zero opens on a soft hit and a warm chord (and keeps the phone band)
add(reverse_swell(0.5, 0.2), 27.225); add(timp(65.4, 0.4), 27.725); add(hit(0.35, 1.6), 27.725)
add(pad([261.6, 329.6, 392.0, 523.3], 2.6, 0.06), 27.725)
add(choir([130.8, 196.0, 261.6, 329.6], 2.4, 0.12, att=0.3, rel=0.8), 27.75)
# the card: one deep hit, the Angel's motif (A minor), as on the other Shorts of this film
add(hit(0.75, 2.0), 30.225); add(timp(41.2, 0.6), 30.225); add(cymbal(1.4, 0.14), 30.225); add(braam(41.2, 1.6, 0.2), 30.225)
add(pad([440.0, 523.3, 659.3], 3.0, 0.045), 30.25)
for nm, tt in [("A4", 30.375), ("C5", 30.925), ("B4", 31.475), ("A4", 32.025)]: add(piano(note(nm), 2.2, 0.2), tt)
out += np.stack([g["L"], g["R"]], axis=1)

# master: soft clip, normalise, fade out the last 0.5 s, cut at the end
mix = out[: int(SR * END)]
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / (np.abs(mix).max() + 1e-9)
fl = int(SR * 0.5); mix[-fl:] *= np.linspace(1, 0, fl)[:, None]
dst = here.parents[0] / "public" / "audio" / "short05_mix.wav"
dst.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(dst), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("wrote", dst, f"{len(mix) / SR:.2f} s")
