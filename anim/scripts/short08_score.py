#!/usr/bin/env python3
"""Sound for Short 08 of Inner Devil Films (JUST ONE MORE, "justonemore-hook", vertical cut, 34.40 s). The film's
cues (film05_score.py's instruments) re-timed to the Short's cuts:
hook, the phone at 1% 0.00 (the video, tinny; the low-battery beeps) | the screen dies, his reflection's eyes ignite
1.20 (a deep hit, braam, choir) | the Devil over him, "Put it down." 2.10 (a breath, a reverse swell) | the red flash,
4 DAYS EARLIER 3.40 (a hit, the counter rewinding) | Dad's texts 4.80 (pings, Dad's warm piano phrase in C major,
the typing, "sent") | the Angel's "Just one more." 10.40 (bells, the Angel's soft minor piano) | the nights slip 11.80,
12.50, 13.20 (whooshes, ticks that speed up, strings) | 3 days left, his own "Just one more." 13.90 (the video, a
low-battery beep) | the Devil, "Put it down." 15.30 (a braam, the heartbeat, a low drone) | the plug at the port 16.90
(the scrape), it drops 18.35 | silence 18.70-19.30 | DEVIL MODE 19.30 (hit, braam, choir, the Devil-mode beat at 128
BPM, full from 23.05) | the drawer slam 23.75 | the beat cuts, three knocks 24.45, 24.90, 25.35 | the note under the
door 25.80 | Dad's note 27.20 (Dad's theme, broken) | card 31.40 (a deep hit, the Angel's notes in minor)."""
import numpy as np, pathlib, wave

here = pathlib.Path(__file__).resolve().parent
src = (here / "film05_score.py").read_text().split("# ================= COLD OPEN")[0]   # the instruments only
ns: dict = {}
exec(src, ns)
SR = ns["SR"]
END = 34.4
N = int(SR * (END + 0.5))
ns["N"] = N; ns["L"] = np.zeros(N); ns["R"] = np.zeros(N)
g = ns
add, hit, timp, braam, cymbal, choir, breath, reverse_swell, riser, tick, whoosh = (g[k] for k in
    "add hit timp braam cymbal choir breath reverse_swell riser tick whoosh".split())
piano, bell, pad, note, strings, noise_band, paper, angel_motif, env = (g[k] for k in
    "piano bell pad note strings noise_band paper angel_motif env".split())
phone_audio, low_batt, ping, sent, tap, thump, heartbeat, rumble, power, chug, lead, knock, step, drawer_slam, quiet_pad, lowpass = (g[k] for k in
    "phone_audio low_batt ping sent tap thump heartbeat rumble power chug lead knock step drawer_slam quiet_pad lowpass".split())
rng = g["rng"]
A2, A3 = g["A2"], g["A3"]

def silence(t0, t1):
    a, b = int(t0 * SR), int(t1 * SR)
    g["L"][a:b] = 0; g["R"][a:b] = 0

# ---------------- hook: the phone at 1% (0.0-1.2), the screen dies and the eyes ignite (1.2)
add(phone_audio(1.2, 0.08, seed=11), 0.0)
add(low_batt(0.17), 0.05); add(low_batt(0.15), 0.62)
add(rumble(1.2, 0.22), 0.0)
add(hit(1.0, 3.0), 1.2); add(timp(55, 0.9), 1.2); add(braam(55, 2.6, 0.6), 1.2); add(cymbal(2.0, 0.18), 1.2)
add(choir([82.4, 110.0, 164.8, 220.0], 2.2, 0.22, att=0.15, rel=0.6), 1.23)
# ---------------- the Devil over him: "Put it down." (2.1-3.4)
add(whoosh(0.3, 0.1), 2.05); add(breath(1.1, 0.3), 2.2)
add(reverse_swell(0.7, 0.35), 2.7)
# ---------------- the red flash; 4 DAYS EARLIER (3.4-4.8)
add(hit(0.9, 1.4), 3.4); add(cymbal(1.2, 0.2), 3.4)
rw = np.arange(int(SR * 0.7)) / SR
add(noise_band(len(rw), 300, 5000)[::-1] * (rw / 0.7) ** 2 * 0.14, 3.45)          # the counter rewinding
for tt in (3.46, 3.53, 3.6, 3.67): add(tick(0.3), tt); add(bell(1760 + (tt - 3.46) * 2000, 0.05, 0.4), tt)
add(pad([220.0, 261.6, 329.6], 1.4, 0.05), 3.5)
add(whoosh(0.4, 0.12), 4.45)
# ---------------- Dad's texts (4.8-10.4)
add(whoosh(0.35, 0.1), 4.8)
add(pad([130.8, 196.0, 261.6, 329.6], 5.8, 0.06), 4.8)
add(ping(0.12), 5.1); add(ping(0.12), 6.2)                                         # Dad's two bubbles
for tt in np.arange(5.55, 6.2, 0.2): add(tick(0.05), tt)                          # Dad typing
for i, (nm, d) in enumerate([("E4", 0), ("G4", 0.5), ("C5", 1.0), ("B4", 1.6), ("G4", 2.1), ("A4", 2.7), ("E4", 3.4)]):
    add(piano(note(nm), 2.6, 0.17), 5.2 + d)                                       # Dad's theme
for tt in np.arange(8.1, 9.25, 0.09): add(tap(0.06 + 0.03 * rng.random()), tt)      # "I'll pass it. I promise."
add(tap(0.2), 9.25); add(sent(0.1), 9.35)
add(piano(note("C4"), 3.0, 0.15), 9.45); add(piano(note("G4"), 2.4, 0.1), 9.5)
# ---------------- the Angel: "Just one more." (10.4-11.8)
add(whoosh(0.3, 0.1), 10.35)
for i, f in enumerate([1046.5, 1318.5, 1760, 2093]): add(bell(f, 0.08), 10.4 + i * 0.07)
add(pad([220.0, 261.6, 329.6], 1.6, 0.07), 10.4)
angel_motif(10.5, A3, 0.3, 0.17)
add(phone_audio(1.4, 0.035, seed=5), 10.4)
add(bell(1318.5, 0.08), 10.55)
# ---------------- the nights slip (11.8-13.9)
for tt in (11.8, 12.5, 13.2): add(whoosh(0.3, 0.16), tt - 0.1)
tt = 11.8
while tt < 13.9:
    add(tick(0.18), tt); tt += max(0.09, 0.32 - 0.07 * (tt - 11.8))
add(strings(440.0, 659.3, 2.1, 0.07), 11.8)
add(phone_audio(0.7, 0.04, seed=8), 12.5)
# ---------------- 3 days left: his own "Just one more." (13.9-15.3)
add(hit(0.4, 1.0), 13.9); add(whoosh(0.3, 0.12), 13.85)
add(pad([123.5, 146.8, 174.6], 1.4, 0.06), 13.9)
add(phone_audio(1.4, 0.05, seed=17), 13.9); add(low_batt(0.14), 14.15)
for tt in (14.0, 14.5, 15.0): add(tick(0.16), tt)
# ---------------- the Devil: "Put it down." (15.3-16.9); the plug (16.9-18.7)
add(braam(55, 2.4, 0.4), 15.3); add(breath(1.4, 0.3), 15.4); add(timp(55, 0.5), 15.3)
dn = np.arange(int(SR * 3.4)) / SR
add((np.sin(2 * np.pi * 55 * dn) + 0.5 * np.sin(2 * np.pi * 110 * dn) + 0.3 * np.sin(2 * np.pi * 220 * dn)) * 0.1 * np.minimum(1, dn / 0.05) * np.minimum(1, (3.4 - dn) / 0.2), 15.3)
add(pad([440.0, 466.2], 1.7, 0.035), 15.3)
for tt in (15.35, 15.9, 16.45, 17.1, 17.8): add(heartbeat(0.6), tt)
sc_ = np.arange(int(SR * 0.65)) / SR                                               # the plug's tip scrapes the port's edge
add(noise_band(len(sc_), 2500, 7000) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 24 * sc_))) * 0.06, 17.25)
add(pad([440.0, 466.2, 493.9], 1.8, 0.035), 16.9)
add(tap(0.25), 18.35); add(tap(0.15), 18.55)                                       # the plug drops and bounces
add(noise_band(int(SR * 0.3), 3000, 8000) * np.linspace(1, 0, int(SR * 0.3)) * 0.03, 18.32)   # the ember goes out
# ---------------- DEVIL MODE (19.3-24.1)
B = 60 / 128; BAR = 4 * B
roots = [55.0, 43.65, 65.41, 49.0]
chords = [[220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [261.6, 329.6, 392.0], [196.0, 246.9, 293.7]]
motif = [440.0, 523.3, 659.3, 880.0]   # the Angel's notes as the Devil's lead
FULL = 19.3 + 2 * BAR
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
            for i, f in enumerate(motif): add(lead(f, B * 0.9, 0.12), t + i * B)
        else:
            add(power(r * 2, BAR, 0.18), t); add(thump(0.6), t); add(thump(0.45), t + 2 * B)
        t += BAR; bar += 1
add(hit(1.2, 4.5), 19.3); add(timp(55, 1.0), 19.3); add(cymbal(4.0, 0.35), 19.3); add(power(110, 1.8, 0.4), 19.3); add(braam(55, 3.0, 0.7), 19.3)
add(choir([220.0, 261.6, 329.6, 440.0, 523.3], 3.5, 0.3, att=0.1, rel=1.5), 19.32)
devil_beat(19.3, 24.1, FULL)
add(riser(1.6, 110, 880, 0.16), FULL - 1.6); add(hit(0.6, 1.4), FULL)
add(whoosh(0.25, 0.12), 22.62)
add(drawer_slam(0.6), 23.75); add(hit(0.4, 0.8), 23.75)                            # the phone into the drawer
silence(24.1, 24.4)                                                                 # the beat cuts
# ---------------- the knocks (24.1-25.6); the note under the door (25.6-27.2)
for kt in (24.45, 24.9, 25.35): add(knock(0.65), kt); add(thump(0.3), kt)
quiet_pad(24.3, 27.3, 0.024)
add(pad([110.0, 130.8, 164.8], 3.0, 0.04), 24.4)
add(paper(0.7, 0.3), 25.8)                                                          # the note slides under the door
for i, tt in enumerate((26.6, 26.85, 27.1)): add(lowpass(step(0.32 - 0.08 * i), 600), tt)   # his father walks away
# ---------------- Dad's note (27.2-31.4)
add(paper(0.4, 0.22), 27.2)
quiet_pad(27.2, 31.5, 0.026)
for nm, tt in [("E4", 27.5), ("C4", 28.5), ("D4", 29.3), ("A3", 30.3)]: add(piano(note(nm), 3.0, 0.17), tt)   # Dad's theme, broken
add(pad([110.0, 130.8, 164.8], 4.2, 0.05), 27.2)
add(braam(55, 1.8, 0.12), 28.0)                                                    # the Devil, grinning in the dark
# ---------------- the card: one deep hit, the Angel's notes (the Devil's lead) in minor
add(hit(0.75, 2.0), 31.4); add(timp(41.2, 0.6), 31.4); add(cymbal(1.4, 0.14), 31.4); add(braam(41.2, 1.6, 0.2), 31.4)
add(pad([220.0, 261.6, 329.6], 3.0, 0.06), 31.42)
for nm, tt in [("A4", 31.55), ("C5", 32.1), ("E5", 32.65), ("A5", 33.2)]: add(piano(note(nm), 2.2, 0.2), tt)

# ---------------- the phone band (300 Hz - 6 kHz) under the quiet stretches
for a, b in [(3.5, 4.9), (10.3, 11.9), (15.3, 18.7)]:
    quiet_pad(a, b, 0.024)

silence(18.7, 19.3)                                                                 # the beat of silence before the drop

# master: soft clip, normalise, fade out the last 0.5 s, cut at the end
mix = np.stack([g["L"], g["R"]], axis=1)[: int(SR * END)]
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / (np.abs(mix).max() + 1e-9)
fl = int(SR * 0.5); mix[-fl:] *= np.linspace(1, 0, fl)[:, None]
dst = here.parents[0] / "public" / "audio" / "short08_mix.wav"
dst.parent.mkdir(parents=True, exist_ok=True)
with wave.open(str(dst), "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("wrote", dst, f"{len(mix) / SR:.2f} s")
