#!/usr/bin/env python3
"""Sound for Short 04 of Inner Devil Films (TOMORROW, "tomorrow-entry", vertical cut, 27.80 s). The Short plays the
film's entry in the film's own time (film 47.3-53.4 = Short 1.5-7.6, film 54.4-71.6 = Short 7.6-24.8), so its sound IS
the film's own mix of those spans (film04_score.py, run up to its master, unmastered), with new sound only for the hook,
the one jump and the card:
his tears, "Mom ran out of her medicine." 0.00 (film 39.9-41.4) | the Angel burns down to an ember 1.50 ("Kindness
stopped working.") | 3:59 3.00 | the room goes cold 4.40 (rumble; the heartbeat starts 4.80) and the halo's shadow
swells into horns ("Then something else woke up." 5.40) | red light under the door 7.60 | the smoke crawls to him 9.40
| his face, the lights flicker 11.00 | a column of smoke 12.40 | the eyes ignite 13.60 (flash, hit 13.65) | the Devil
rises 15.00 | he reaches 17.60 | "Then move." 19.00 | silence 21.60 | THE DROP 22.20 | card 24.80 (the Devil Mode beat
goes on under it, without the film's drawer sounds)."""
import numpy as np, pathlib, wave

here = pathlib.Path(__file__).resolve().parent
src = (here / "film04_score.py").read_text().split("# ================= master")[0]
# the film's sounds after the drop that belong to the next scene (the drawer, "Again.", the riser into the montage)
for line in ("add(noise_band(int(SR * 0.3), 300, 1500) * 0.15, 73.25); add(timp(180, 0.3), 73.65); add(hit(0.45, 0.8), 73.95); add(thump(0.7), 73.95)\n",
             "add(braam(55, 1.2, 0.35), 74.5); add(tick(0.2), 75.9)\n",
             "add(riser(2.5, 110, 880, 0.18), FULL - 2.5); add(hit(0.7, 1.6), FULL)\n"):
    assert line in src, line
    src = src.replace(line, "")
ns: dict = {}
exec(src, ns)
SR = ns["SR"]
FL = np.stack([ns["L"], ns["R"]], axis=1)          # the film, unmastered
END = 27.8
out = np.zeros((int(SR * (END + 0.5)), 2))

def paste(f0, f1, s0, fade=0.02):
    """the film's sound from film time f0..f1 at Short time s0, with short fades at both ends"""
    seg = FL[int(SR * f0): int(SR * f1)].copy()
    n = int(SR * fade)
    seg[:n] *= np.linspace(0, 1, n)[:, None]; seg[-n:] *= np.linspace(1, 0, n)[:, None]
    i = int(SR * s0); out[i: i + len(seg)] += seg

paste(39.9, 41.4 + 0.02, 0.0)                # his tears
paste(47.3 - 0.02, 53.4 + 0.03, 1.48)        # the ember, 3:59, the horns
paste(54.4 - 0.03, 71.6 + 0.02, 7.57, 0.06)  # the door to the drop, as in the film
paste(71.6 - 0.02, 74.6, 24.78)              # the Devil Mode beat under the card

g = ns
add, hit, timp, piano, pad, bell, whoosh, tick, cymbal, braam, note, strings = (g[k] for k in
    "add hit timp piano pad bell whoosh tick cymbal braam note strings".split())
# new sound goes into the film's (now empty) buffers, then onto the Short
N = out.shape[0]
g["N"] = N; g["L"] = np.zeros(N); g["R"] = np.zeros(N)
# the hook: the news lands (the film's chord when "I ran out today." arrives), on the first frame
add(hit(0.55, 2.0), 0.0); add(timp(49, 0.55), 0.0)
for f in (110.0, 130.8, 164.8): add(piano(f, 3.0, 0.2), 0.02)
add(pad([440.0, 523.3, 659.3], 1.6, 0.045), 0.0)                    # (the phone band)
# into the ember; into the door (the film's jump)
add(whoosh(0.3, 0.15), 1.38); add(tick(0.3), 1.5)
add(whoosh(0.35, 0.18), 7.45); add(timp(82, 0.3), 7.6)
# (the phone band: the film's room tone at 3:59 is mostly low rumble, so a thin chord and a high string under it)
add(pad([440.0, 523.3, 659.3], 5.4, 0.05), 1.6); add(strings(880.0, 1318.5, 4.0, 0.035, 0.6), 2.9)
# the card: one deep hit, the Angel's motif over the Devil's beat (same chords: A minor, F, C, G)
add(hit(0.75, 2.0), 24.8); add(timp(41.2, 0.6), 24.8); add(cymbal(1.4, 0.14), 24.8); add(braam(41.2, 1.6, 0.2), 24.8)
for nm, tt in [("A4", 24.95), ("C5", 25.5), ("B4", 26.05), ("A4", 26.6)]: add(piano(note(nm), 2.2, 0.2), tt)
out += np.stack([g["L"], g["R"]], axis=1)

# master: soft clip, normalise, fade out the last 0.5 s, cut at the end
mix = out[: int(SR * END)]
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / (np.abs(mix).max() + 1e-9)
fl = int(SR * 0.5); mix[-fl:] *= np.linspace(1, 0, fl)[:, None]
dst = here.parents[0] / "public" / "audio" / "short04_mix.wav"
dst.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(dst), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("wrote", dst, f"{len(mix) / SR:.2f} s")
