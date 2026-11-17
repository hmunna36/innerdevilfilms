"""THE BOTTLE | It Was So Small: the sound of the re-cut (86 s, a hook first, 68 cuts). Music and effects, no voices.
Every time comes from cues_edit.json (`node render.mjs cues` writes it): END, cues (name -> seconds in the edit) and
cuts (every picture cut and its kind). Nothing here is a hard-coded time: after a re-cut, just run this again.

The hook: fizz and a riser from the first frame, a HUGE hit on hk2 (the brass blast, a boom, a growl, the tiny fists on
the glass), a sudden drop to the quiet glass and a chime as its eyes open, and the waltz kicks in on a21.
The devil's music grows up with it, all recorded, in G and in waltz time: THEME (AGE 21, and with strings at 26),
LULLABY's lone music box (31), HEAVY's low brass and half-time drums (34), HEAVY at half speed under DREAD's hits (38),
the HORROR blast on THEY CAN'T SEE ME, a drop (never to silence) on the truth; SAD's piano notes; RISE, the anthem, its
impact on `run`, a dead stop at the bar's door, back at `walkOn`, its last hit on `setDown` and again on "Every day.";
ENDING for the drawing and the hug; the first tune once more on the music box at night.
Sound on everything, the way the reference channel cuts: a whoosh on every cut, a snap on every punch-in and jump back,
a thud and air on every beat of black; a marker scratching for every written line; the pop (the film's motif: the same
sound, lower and heavier each time it grows, backwards when it shrinks); and every action.
run: python films/07-it-was-so-small/mix.py   (any folder; writes audio/mix.wav beside it and prints a report: loudness,
the ten key hits against their cues, sound events per 10 s, and any second a phone would hear as silence)
Sources: audio/music/*.mp3 and audio/sfx/*.mp3 (music.json with engine/audio/music.mjs); the rest is made here."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'engine', 'audio'))
import numpy as np
from mixlib import *

ED = json.load(open(os.path.join(HERE, 'cues_edit.json'), encoding='utf8'))
CUE, CUTS, DUR = ED['cues'], ED['cuts'], ED['END']
c = type('Cues', (), {'__getattr__': lambda self, k: CUE[k]})()
rngc = np.random.default_rng(11)             # its own dice for the cut sounds and the captions, so they stay the same from run to run

# ---------- measured in the mp3s (17 Nov 2026) ----------
# THEME (49.5 s): one plain waltz in G major, 3/4 at exactly 120 bpm (a bar every 1.5 s). 0-12 s pizzicato only; the
#   tune enters on a glockenspiel at 12.034 s and runs twice (12-24, 24-36, the second time with a high sparkle). Every
#   second bar ends in a rest of about 0.75 s (before 15, 18, 21, 24, 27 ...): that is where waltz() cuts it.
#   The tune (beats of 0.5 s): G6 . D6 B5 G5 | E6 E5 - | G6 . D6 B5 G5 | D6 A5 - | G6 . D6 B5 G5 | E6 E5 - |
#   A6 . E6 C#6 A5 | D6 E6 F#6. Chords G C G D G C A D.
# LULLABY (9 s): a lone music box in G major, one note a second: 1.052 (G5), 2.054 (D6), 3.054, 4.052, 5.056, 6.052,
#   7.052 s. The first two notes are clean single tines: tine() re-pitches them wherever the first tune is played.
# HEAVY (12 s): G minor, 3/4 at exactly 120 bpm, low brass and drums, chords Gm D Gm D Gm D, downbeats 0.03 + 1.5 k,
#   last chord (Gm) 9.022 s, ringing out by 10.5.
# DREAD (10 s): two colossal low hits, 0.03 and 4.035 s, each with a rumble of low drums; nothing above 300 Hz after.
# HORROR: one colossal brass blast on a low G, onset 0.026 s, ringing about 3 s.
# RISE: impact 0.026 s, a beat every 0.4687 s, last hit on beat 47 (22.054 s), ringing out by 23.5 s.
# ENDING: first chord 0.03 s, the strings' swell starts on the note at 6.036 s. SAD: notes at 2.056, 6.054, 10.056 s.
# Effects (what a phone hears of them, 300 Hz to 6 kHz, decides how they are used):
#   bloop (a cartoon pop): onset 0.04 s, 40 ms long, 97 % in the phone band: the top of every pop.
#   marker: scratchy strokes for 3 s, 79 % above 6 kHz: played slower (0.5 to 0.72) so a phone gets it.
#   steps: ten running footfalls, 0.14 s then every 0.3 s; 87 % in the phone band.
#   knock (film 07-the-bottle's): knuckles on glass at 0.08, 0.56, 0.82, 1.10 s.
#   clink: one bright glass clink at 0. deflate: 1.2 s of squeaky balloon. growl: 1.5 s of distorted rumble, then dying.
#   impact: a pure sub boom (100 % under 150 Hz): the weight under hits, and, 5 to 9 times faster, a hard mid knock.
#   fizz: a soft hiss swelling to 2.1 s, 93 % above 6 kHz: a layer only. zoom: a 0.15 s bright swish, peak 0.075 s.
#   whoosh: came out as a short low "whup" (peak 0.037 s): a layer under the made whooshes.
#   swell (98 % under 150 Hz), pour (4 % in the phone band), cork, smash (78 % above 6 kHz): each gets a made mid layer.
#   hiss (the cap) 0.068 s; gulp 0.448-0.67 s; cork 0.118 s; pour 0.176 s; smash 0.04 s.
DOWNB = {12.0: 12.034, 13.5: 13.538, 15.0: 15.04, 16.5: 16.534, 18.0: 18.032, 19.5: 19.554, 21.0: 21.054, 22.5: 22.544,
         24.0: 24.036, 25.5: 25.558, 27.0: 27.02, 28.5: 28.584, 30.0: 30.03, 31.5: 31.534, 33.0: 33.012}      # THEME's downbeats
H0, R0, RB, R_LAST, E0, E_SWELL = .026, .026, .4687, 47, .03, 6.036
SAD_ON, HISS0, GULP = (2.056, 6.054, 10.056), .068, (.44, .70)
CORK0, POUR0, SMASH0, BLOOP0, ZOOM_PK = .118, .176, .04, .04, .075
L_ON = (1.052, 2.054, 3.054, 4.052, 5.056, 6.052, 7.052)      # LULLABY's notes
HV0, HV_BAR, HV_LAST, D0, D1 = .03, 1.5, 9.022, .03, 4.035       # HEAVY's first downbeat, bar, last chord; DREAD's two hits
STEP_ON = (.14, .42, .70, 1.0, 1.3, 1.6, 1.9, 2.2, 2.5, 2.8); KNOCK_ON = (.08, .56, .82, 1.10)

W = lambda name: src(HERE, name)
music, fx = (np.zeros((int(DUR * SR) + 2 * SR, 2)) for _ in range(2))
EV = []                                      # when each sound effect is heard (for the count in the report)


# ---------- plumbing ----------
def put(bus, t, x, gain_db=0.0, pan=0.0, at=None):
    x = stereo(x, pan) if x.ndim == 1 else x
    if bus is fx or at is not None: EV.append(t if at is None else at)
    i = int(round(t * SR))
    if i < 0: x, i = x[-i:], 0
    x = x[:max(0, len(bus) - i)]
    bus[i:i + len(x)] += x * db(gain_db)


def cut(x, a, b): return x[max(0, int(a * SR)):max(0, int(b * SR))]


def lay(*xs):                                # mono sounds on top of each other
    y = np.zeros(max(len(x) for x in xs))
    for x in xs: y[:len(x)] += x
    return y


def after(delay, x): return np.concatenate([np.zeros(int(delay * SR)), x])
def nrm(y, pk=.5): return y / (np.abs(y).max() + 1e-9) * pk


def ride_db(x, t0, pts):                     # a clip placed at t0, its gain drawn as straight lines through (film time, dB)
    t = t0 + np.arange(len(x)) / SR; g = db(np.interp(t, [p[0] for p in pts], [p[1] for p in pts]))
    return x * (g[:, None] if x.ndim == 2 else g)


def dip(t, to_db=-6, pre=.12):                # the music holds its breath just before a pop, so the pop pops
    i, n = int(t * SR), int(pre * SR); music[i - n:i] *= db(np.linspace(0, to_db, n))[:, None]


def dead(t, *buses, ms=8):                   # a dead cut: everything placed so far stops here
    i, n = int(t * SR), int(ms / 1000 * SR)
    for b in buses: b[i - n:i] *= np.linspace(1, 0, n)[:, None]; b[i:] = 0


# ---------- the tune ----------
SEMI = {'C': 0, 'C#': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11}
hz = lambda n: 440 * 2 ** ((SEMI[n[:-1]] + 12 * (int(n[-1]) + 1) - 69) / 12)
TUNE = [(0, 1, 'G6'), (1, .5, 'D6'), (1.5, .5, 'B5'), (2, 1, 'G5'), (3, 1, 'E6'), (4, 2, 'E5'), (6, 1, 'G6'), (7, .5, 'D6'), (7.5, .5, 'B5'), (8, 1, 'G5'), (9, 1, 'D6'), (10, 2, 'A5'),
        (12, 1, 'G6'), (13, .5, 'D6'), (13.5, .5, 'B5'), (14, 1, 'G5'), (15, 1, 'E6'), (16, 2, 'E5'), (18, 1, 'A6'), (19, .5, 'E6'), (19.5, .5, 'C#6'), (20, 1, 'A5'), (21, 1, 'D6'), (22, 1, 'E6'), (23, 1, 'F#6')]
ROOTS = ['G', 'C', 'G', 'D', 'G', 'C', 'A', 'D']                          # one chord a bar
MAJOR = {'G': ['G3', 'B3', 'D4'], 'C': ['G3', 'C4', 'E4'], 'D': ['F#3', 'A3', 'D4'], 'A': ['A3', 'C#4', 'E4']}


# ---------- two synthesized tones (mono): a chime for effects, a soft string pad ----------
def mbox(f, d=1.8, decay=3.0):               # a small bright chime (its eyes blinking, Lily's smile)
    t = tsec(d); n = int(.004 * SR)
    y = np.sin(2 * np.pi * f * t) * np.exp(-t * decay) + .22 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 5) + .12 * np.sin(2 * np.pi * min(5.4 * f, 20000) * t) * np.exp(-t * 16)
    y[:n] += filt(rng.standard_normal(n), 'high', 3000) * .25
    return y * np.minimum(1, t / .002) * np.minimum(1, (d - t) / .05) * .3


def pad(freqs, d, att=.35, rel=.5, lp=1800):     # warm strings
    t = tsec(d); y = np.zeros(len(t))
    for f in freqs:
        for det in (-.004, .003, .007):
            ph = 2 * np.pi * f * (1 + det) * t + rng.uniform(0, 6.28)
            y += sum(np.sin(k * ph) / k for k in range(1, int(min(14, 5000 / f)) + 1))
    return nrm(filt(y, 'low', lp), .25) * np.minimum(1, t / att) * np.minimum(1, (d - t) / rel)


def kick(): return lay(thump(52, .45, 1.4), click(.015, 1600) * .6)


# ---------- THE POP: the film's motif ----------
def pop(size):
    """it grows: a quick upward "bloop" with a snap, and under it a thump. size 0 is the thumb-sized pop on the rim; 1, 2,
    3, 4 are AGE 21, 26, 31, 34: each a fifth or so lower, longer, with a heavier thump (and from 3 a boom's tail)"""
    f0 = 1500 * .62 ** size; d = .05 + .02 * size; t = tsec(d * 4)
    ph = 2 * np.pi * np.cumsum(f0 * (.55 + 1.2 * np.minimum(1, t / d))) / SR
    body = (np.sin(ph) + .45 * np.sin(2 * ph) + .2 * np.sin(3 * ph)) * np.exp(-t / (d * .9)) * np.minimum(1, t / .001)
    snap = filt(rng.standard_normal(int(.012 * SR)), 'band', [1800, 6000]) * np.exp(-tsec(.012) * 300)
    rec = vs(bloop, (1.5, 1.0, .75, .56, .42)[size])                         # the recorded cartoon pop, lower each time
    parts = [nrm(lay(rec, body * .5, snap * .4), .55)]   # the part every speaker plays, a phone too: as loud each time, only lower
    if size: parts.append(thump(120 * .78 ** size, .22 + .16 * size, .7) * (.25 + .15 * size))      # the weight under it
    if size >= 3: parts.append(boom(1.2 + .5 * (size - 3)) * .2 * (size - 2))
    return lay(*parts)


def deflate(t, size, g, pan=0.0):
    """it shrinks: the same pop backwards (sucked in, ending on the cue), then the recorded balloon, sliding down, from the cue"""
    back = pop(size)[:int((.22 + .08 * size) * SR)][::-1]
    put(fx, t - len(back) / SR, stereo(back * np.linspace(0, 1, len(back)) ** 1.5, pan), g - 3, at=t)
    r0 = 1.7 - .22 * size; y = varispeed(rdefl[:int(.7 * SR)], r0, r0 * .45)[:int(.9 * SR)]
    put(fx, t, stereo(fade(nrm(y, .5), .003, .15), pan), g)


def flare(d, size=1):                            # the fire in its belly: a warm whoosh rising into the pop
    t = tsec(d); u = t / d; n = rng.standard_normal(len(t))
    lo = filt(n, 'band', [250 / (1 + .25 * size), 900]); hi = filt(n, 'band', [900, 3800])
    tone = np.sin(2 * np.pi * np.cumsum(180 * (1 + 1.6 * u ** 2) / (1 + .2 * size)) / SR)
    return nrm((lo * (1 - u) + hi * u + tone * .35) * u ** 1.5 * np.minimum(1, np.maximum(0, d - .04 - t) / .02), .4)   # a breath of nothing before the pop


# ---------- small synthesized effects (mono) ----------
def clink(f=2350, d=.5):                         # glass
    t = tsec(d); return sum(np.sin(2 * np.pi * min(f * k, 20000) * t) * np.exp(-t * (9 + 6 * i)) / (1 + i) for i, k in enumerate((1, 2.3, 3.9))) * .3


def blink(): return lay(mbox(hz('E7'), .35) * .8, after(.07, mbox(hz('B7'), .45)))       # its eyes: two tiny bright notes


def fizz(d):                                     # foam
    t = tsec(d); g = np.repeat(rng.random(int(d * 140) + 2) ** 3, SR // 140 + 1)[:len(t)]
    return nrm(filt(rng.standard_normal(len(t)), 'high', 3500) * (.25 + g) * np.minimum(1, t / .15) * np.exp(-t / 1.5), .25)


def flutter(d):                                  # it shakes itself dry
    t = tsec(d); return nrm(filt(rng.standard_normal(len(t)), 'band', [1200, 6000]) * np.abs(np.sin(2 * np.pi * 13 * t)) ** 2 * np.sin(np.pi * t / d), .3)


def crackle(d=.28, n=10, lo=2500):
    y = np.zeros(int((d + .02) * SR))
    for _ in range(n):
        g = click(.004, rng.uniform(lo, lo * 2.5)) * rng.uniform(.3, 1); s = int(rng.uniform(0, d) * SR); y[s:s + len(g)] += g
    return y


def sneeze():                                    # "pft" and a spark
    t = tsec(.06); pft = filt(rng.standard_normal(len(t)), 'high', 1800) * np.exp(-t * 70) * .5 + np.sin(2 * np.pi * np.cumsum(900 + 2000 * t / .06) / SR) * np.exp(-t * 60) * .2
    return lay(pft, after(.05, crackle()))


def lick():
    t = tsec(.09); return np.sin(2 * np.pi * np.cumsum(500 + 1100 * t / .09) / SR) * np.sin(np.pi * t / .09) * .25 + filt(rng.standard_normal(len(t)), 'high', 2500) * np.exp(-t * 60) * .12


def burp():                                      # a tiny burp and a puff of flame
    t = tsec(.2); saw = 2 * ((np.cumsum(95 - 25 * t / .2) / SR) % 1) - 1
    b = filt(saw, 'band', [250, 1100]) * (.7 + .3 * np.sin(2 * np.pi * 27 * t)) * np.sin(np.pi * t / .2) ** .5
    tp = tsec(.4); puff = filt(rng.standard_normal(len(tp)), 'band', [200, 2200]) * np.exp(-tp * 9) * np.minimum(1, tp / .03)
    return lay(nrm(b, .4), nrm(puff, .3))


def rustle(d=.35):                               # paper
    t = tsec(d); g = np.repeat(rng.random(int(d * 90) + 2), SR // 90 + 1)[:len(t)]
    return nrm(filt(rng.standard_normal(len(t)), 'band', [1800, 9000]) * g ** 2 * np.sin(np.pi * t / d), .3)


def cold(d=1.7):                                 # two thin notes a semitone apart
    t = tsec(d); y = sum(np.sin(2 * np.pi * f * t * (1 + .0015 * np.sin(2 * np.pi * 5.5 * t))) for f in (hz('D6'), hz('Eb6')))
    return y * np.minimum(1, t / .25) * np.exp(-np.maximum(0, t - d * .5) * 3) * .1


def creak(d=.5):                                 # the chair: wood under a weight, then a crack
    t = tsec(d); imp = (np.diff((np.cumsum(50 + 70 * (t / d) ** 2 + 6 * np.sin(2 * np.pi * 9 * t)) / SR) % 1, prepend=0) < 0).astype(float)
    y = (filt(imp, 'band', [600, 900]) + .6 * filt(imp, 'band', [1400, 2100])) * np.sin(np.pi * t / d) ** .5
    tc = tsec(.05); return lay(nrm(y, .35), after(d - .03, nrm(filt(rng.standard_normal(len(tc)), 'band', [900, 7000]) * np.exp(-tc * 90), .5)))


def partyhorn(d=1.1):                            # a sad one, sagging
    t = tsec(d); sq = np.sign(np.sin(2 * np.pi * np.cumsum(392 * (1 - .22 * (t / d) ** 1.5) * (1 + .01 * np.sin(2 * np.pi * 6 * t))) / SR))
    return nrm(filt(sq, 'band', [700, 2600]) * (1 - .5 * np.abs(np.sin(2 * np.pi * 22 * t)) * (t < .25)) * np.minimum(1, t / .03) * np.minimum(1, (d - t) / .3), .3)


def scrape(d=.45):                               # a chair pushed back
    t = tsec(d); am = .5 + .5 * np.sign(np.sin(2 * np.pi * (38 + 10 * np.sin(2 * np.pi * 3 * t)) * t))
    return nrm(filt(rng.standard_normal(len(t)), 'band', [350, 2600]) * am * np.sin(np.pi * t / d), .3)


def step(heavy=1.0):
    t = tsec(.09); return lay(thump(100, .14, .5) * .6 * heavy, filt(rng.standard_normal(len(t)), 'band', [400, 3000]) * np.exp(-t * 55) * .5)


def bump(): return lay(thump(150, .2, 1.0), thump(75, .3, .4) * .6, click(.02, 900) * .5)
def tap(): return lay(clink(2900, .22) * .7, thump(420, .05, .2) * .5)      # a claw on glass, politely


def crack():                                     # the glass gives
    y = np.zeros(int(.3 * SR)); tn = tsec(.04)
    for _ in range(5):
        g = click(.006, rng.uniform(3000, 7000)) * rng.uniform(.5, 1); s = int(rng.uniform(0, .06) * SR); y[s:s + len(g)] += g
    return lay(y, filt(rng.standard_normal(len(tn)), 'high', 2500) * np.exp(-tn * 120) * .5, clink(4200, .3) * .5)


def shatter(d=.6, n=16):
    y = np.zeros(int((d + .5) * SR))
    for _ in range(n):
        g = clink(rng.uniform(2200, 6000), rng.uniform(.15, .45)) * rng.uniform(.3, 1); s = int(rng.uniform(0, d) * rng.random() * SR); y[s:s + len(g)] += g
    return nrm(y, .5)


def glugs(d, n=9):                               # the bottle emptying
    y = np.zeros(int((d + .2) * SR)); tt = tsec(.1)
    for k in range(n):
        g = np.sin(2 * np.pi * np.cumsum(rng.uniform(150, 240) * (1 + 1.1 * tt / .1)) / SR) * np.sin(np.pi * tt / .1) ** 1.5
        s = int((k + .25 * rng.random()) / n * d * SR); y[s:s + len(g)] += g
    return y * .4


def gurgle(d=.7):                                # ...and the drain
    t = tsec(d); y = filt(rng.standard_normal(len(t)), 'band', [220, 1400]) * (.5 + .5 * np.sin(2 * np.pi * np.cumsum(14 - 6 * t / d) / SR)) + np.sin(2 * np.pi * np.cumsum(420 - 200 * t / d) / SR) * .3
    return nrm(y * np.sin(np.pi * t / d) ** .7, .3)


def inhale(d=.6): t = tsec(d); return nrm(filt(rng.standard_normal(len(t)), 'band', [700, 3800]) * (t / d) ** 2 * np.minimum(1, (d - t) / .04), .2)
def breath(d=.6): t = tsec(d); return nrm(filt(rng.standard_normal(len(t)), 'band', [500, 2600]) * np.sin(np.pi * t / d) ** 1.5, .15)
def chirp(): t = tsec(.05); return np.sin(2 * np.pi * np.cumsum(2300 + 1400 * t / .05) / SR) * np.sin(np.pi * t / .05) * .2


def squeak(d=.8):                                # a finger on fogged glass
    t = tsec(d); y = np.sin(2 * np.pi * np.cumsum(1900 + 500 * np.sin(2 * np.pi * 2.2 * t) + 250 * np.sin(2 * np.pi * 31 * t)) / SR)
    return y * (.55 + .45 * np.sin(2 * np.pi * 17 * t)) * np.sin(np.pi * t / d) ** .4 * .12


def crickets(d):
    t = tsec(d); return (np.sin(2 * np.pi * 4300 * t) + .5 * np.sin(2 * np.pi * 4750 * t)) * (np.sin(2 * np.pi * 38 * t) > 0) * ((t % .62) < .2) * .03


def vs(x, r): return varispeed(x, r, r)        # a mono recording at r times its speed (and pitch)


def swish(d=.35, lo=500, hi=4000, up=True):      # a whoosh: air sweeping up (or down) through the band a phone plays
    t = tsec(d); u = t / d; n = rngc.standard_normal(len(t)); pos = u if up else 1 - u; mid = (lo * hi) ** .5
    y = sum(filt(n, 'band', list(b)) * np.exp(-((pos - k / 2) / .38) ** 2) for k, b in enumerate(((lo, lo * 2), (lo * 1.6, mid * 1.5), (mid, hi))))
    return nrm(y * np.sin(np.pi * u) ** 1.5, .4)


def riser(d, f0=250, f1=1400, p=2.0):            # air and a tone climbing, cut off at the top (p: how late it swells)
    t = tsec(d); u = t / d; n = rngc.standard_normal(len(t))
    air = filt(n, 'band', [500, 1500]) * (1 - u) + filt(n, 'band', [1500, 6000]) * u
    tone = np.sin(2 * np.pi * np.cumsum(f0 * (f1 / f0) ** u) / SR) + .5 * np.sin(2 * np.pi * np.cumsum(f0 * 1.5 * (f1 / f0) ** u) / SR)
    trem = .7 + .3 * np.sin(2 * np.pi * np.cumsum(6 + 18 * u) / SR)
    return nrm((air + tone * .5) * trem * u ** p * np.minimum(1, (d - t) / .015) * np.minimum(1, t / .02), .5)


def slamhit():                                   # letters slammed down: the recorded impact 5 and 9 times faster (a hard knock), a crack
    tn = tsec(.05); crk = filt(rngc.standard_normal(len(tn)), 'band', [1200, 7000]) * np.exp(-tn * 80)
    return lay(nrm(vs(impact[:int(1.2 * SR)], 5), .6), nrm(vs(impact[:int(1.2 * SR)], 9), .35), nrm(crk, .5), thump(150, .2, .8) * .5)


def tock(hi=True):                               # the kitchen clock: a small woody tick with a body a phone plays
    t = tsec(.07); f = 2100 if hi else 1500
    return (np.sin(2 * np.pi * f * t) * np.exp(-t * 90) + .6 * np.sin(2 * np.pi * f * .46 * t) * np.exp(-t * 60) + filt(rngc.standard_normal(len(t)), 'band', [1500, 5000]) * np.exp(-t * 200) * .5) * .4


def hum(d):                                      # a fridge: mains hum with the harmonics a phone plays
    t = tsec(d); return sum(np.sin(2 * np.pi * f * t + k) * a for k, (f, a) in enumerate(((100, 1), (200, .5), (300, .5), (400, .35), (500, .25), (600, .12)))) * (.9 + .1 * np.sin(2 * np.pi * .7 * t)) * .2


def liquid(d):                                   # pouring: the part of it a phone plays
    t = tsec(d); g = np.repeat(rngc.random(int(d * 60) + 2), SR // 60 + 1)[:len(t)]
    return nrm(filt(rngc.standard_normal(len(t)), 'band', [900, 4500]) * (.4 + g) * np.sin(np.pi * t / d) ** .6, .3)


def beat3(t, g=-5):                              # a heartbeat with a click in it, so a phone plays it too
    put(fx, t, stereo(heartbeat()), g); put(fx, t, stereo(lay(thump(150, .16, .3), thump(330, .09, .25) * .8, click(.02, 1400) * .5)), g - 3)
    put(fx, t + .24, stereo(lay(thump(140, .14, .3), thump(300, .08, .25) * .7, click(.02, 1100) * .4)), g - 6)


# ---------- the recordings ----------
theme, horror, rise, ending, sad = W('music_THEME'), W('music_HORROR'), W('music_RISE'), W('music_ENDING'), W('music_SAD')
lulla, heavy, dread = W('music_LULLABY'), W('music_HEAVY'), W('music_DREAD')
gulp = fade(cut(W('sfx_gulp'), *GULP), .003, .03); cork = fade(cut(W('sfx_cork'), CORK0 - .015, .62), .003, .05)
blast = fade(cut(horror, 0, 3.4), .001, .6); growl = W('sfx_growl'); swell = W('sfx_swell'); pour = W('sfx_pour')
bloop = nrm(mono(cut(W('sfx_bloop'), BLOOP0 - .004, .2)), .7); marker = mono(W('sfx_marker')); impact = mono(W('sfx_impact'))
rclink = nrm(mono(cut(W('sfx_clink'), 0, .6)), .5); rdefl = mono(cut(W('sfx_deflate'), .08, 1.2)); rfizz = mono(cut(W('sfx_fizz'), .7, 3.0))
zoom = nrm(mono(cut(W('sfx_zoom'), .02, .3)), .5); whup = nrm(mono(cut(W('sfx_whoosh'), 0, .16)), .5)
FEET = [nrm(fade(mono(cut(W('sfx_steps'), a - .02, a + .24)), .002, .03), .5) for a in STEP_ON]
KNOCKS = [nrm(fade(mono(cut(W('sfx_knock'), a - .01, a + .22)), .002, .04), .5) for a in KNOCK_ON]
TINES = {'G5': nrm(mono(cut(lulla, L_ON[0] - .006, L_ON[1] - .012)), .5), 'D6': nrm(mono(cut(lulla, L_ON[1] - .006, L_ON[2] - .012)), .5)}   # LULLABY's two clean tines
THEME_G, HEAVY_G, RISE_G = -1, 4, 2


def tine(note, cents=0.0, d=None):           # the recorded music box, re-pitched to any note (from the nearer of its two tines)
    f = hz(note); base = min(TINES, key=lambda b: abs(np.log2(f / hz(b)))); r = f / hz(base) * 2 ** (cents / 1200)
    y = varispeed(TINES[base], r, r)
    return fade(y[:int(d * SR)] if d else y, .002, .08)


def slow(x, r): return np.stack([varispeed(x[:, ch], r, r) for ch in (0, 1)], axis=1)     # a recording at r times its speed (.5: an octave down, twice as long)


def room(x, secs=1.3, wet=.22, tail=.3):         # a recording in a room, so its rests are never empty; the ring is cut `tail` s after its end
    y = np.stack([reverb(x[:, ch], secs, wet, 5000) for ch in (0, 1)], axis=1)[:len(x) + int(tail * SR)] / (1 - wet)
    return fade(y, .001, tail * .8)


def foam(d, g_rec=.25):                      # fizz a phone can hear (made) with the recorded fizz, slowed, over it
    y = fizz(d); r = vs(rfizz, .5)[:len(y)]; return lay(y + filt(rng.standard_normal(len(y)), 'band', [1500, 6000]) * .05 * np.exp(-tsec(d) / 2.5), nrm(r, g_rec))


def scratch(t, d, red=False, pan=0.0, g=0.0):    # a line writing itself: the recorded marker, slowed (slower and doubled for the red lines)
    r = .5 if red else .72; a = int(rngc.uniform(.1, 2.85 - d * r) * SR)
    y = vs(marker[a:a + int(d * r * SR) + 300], r)[:int(d * SR)]
    if red:
        b = int(rngc.uniform(.1, 2.85 - d * .62) * SR); y2 = vs(marker[b:b + int(d * .62 * SR) + 300], .62)[:len(y)]; y = lay(y, y2 * .8)
    y = lay(y, filt(y, 'band', [700, 4000]) * (1.6 if red else 1.0))
    put(fx, t, stereo(fade(nrm(y, .5 if red else .38), .008, .03), pan), g + (-7 if red else -9))


def waltz(t0, t1, hit, first, g):
    """THEME from its downbeat `first` (12.0: the tune; 24.0: its second pass) at t0, cut once, in one of its own rests, so
    that a downbeat lands on `hit`; it runs on to t1. Returns its bars as (film time, chord, seconds) for the strings."""
    k = max(2, 2 * int(round((hit - t0) / 3.0))); a, b = DOWNB[first], DOWNB[first + 1.5 * k]; n1 = min(1.5 * k - .1, hit - t0 - .08)
    put(music, t0 - .02, room(fade(cut(theme, a - .02, a + n1), .002, .1), tail=hit - t0 - n1), g)
    put(music, hit - .08, room(fade(cut(theme, b - .08, b + t1 - hit), .04, .03)), g)
    i0 = int(round((first - 12) / 1.5))
    return [(t0 + 1.5 * j, ROOTS[(i0 + j) % 8], 1.5 if j < k - 1 else hit - t0 - 1.5 * (k - 1)) for j in range(k)] + [(hit + 1.5 * j, ROOTS[(i0 + k + j) % 8], 1.5) for j in range(int((t1 - hit) / 1.5) + 1)]


# ---------- 0. THE HOOK. hk1: the glass fills (the cap, fizz, a riser). hk2: the giant, 17 YEARS LATER: the biggest
# moment of the first ten seconds. hk3: the quiet glass, its eyes open; a little run up into the waltz ----------
put(fx, 0, fade(cut(W('sfx_hiss'), HISS0 - .008, 1.0), .001, .3), 1)                      # heard on the first frame
put(fx, 0, stereo(fade(foam(c.hk2), .004, .02)), 7)
put(fx, .06, stereo(riser(c.hk2 - .08)), 0)
put(music, 0, stereo(pad([hz('G3'), hz('D4'), hz('G4'), hz('B4')], c.hk2, .5, .02, 3000) * np.linspace(.4, 1, int(c.hk2 * SR)) ** 2), -2)   # a warm tone swelling under it
sw_ = cut(swell, len(swell) / SR - .02 - (c.hk2 - .1), len(swell) / SR - .02); put(fx, c.hk2 - len(sw_) / SR, fade(sw_, .3, .004), -8)
put(music, c.hk2 - H0, blast, 2, at=c.hk2); put(fx, c.hk2, stereo(boom()), -5); put(fx, c.hk2, stereo(impact[:int(2 * SR)]), -6); put(fx, c.hk2, W('sfx_stinger'), -12)
put(fx, c.hk2 + .02, fade(cut(growl, 0, c.hk3 - c.hk2), .02, .05), -9)                      # it roars (an engine and metal, not a voice)
put(fx, c.hkLater, stereo(slamhit()), 0)
k = 0
while c.hkLater + .36 + k * .15 < c.hk3 - .12:                                              # the tiny fists on the glass
    put(fx, c.hkLater + .36 + k * .15, stereo(vs(KNOCKS[k % 4], 1.25 + .06 * (k % 3)), -.3), -2); k += 1
dead(c.hk3, music, fx, ms=12)
put(fx, c.hk3, stereo(fade(foam(c.a21 - c.hk3 + .3, .2), .01, .35)), -7)
put(fx, c.hkEyes, stereo(blink()), -3)
put(fx, c.hkEyes + .42, stereo(tine('G5', 0, .5), -.2), -8); put(fx, c.hkEyes + .6, stereo(tine('B5', 0, .5), .2), -8)   # curious
for k, n in enumerate(('D6', 'E6', 'F#6')): put(music, c.a21 - .45 + k * .15, stereo(tine(n, 0, .4)), -8 + 1.5 * k, at=c.a21 - .45 + k * .15)

# ---------- 1. AGE 21: the waltz kicks in on the cut, the tune at once; the tune's highest note lands on the pop ----------
waltz(c.a21, c.a26, c.pop21, 12.0, THEME_G)
for k, (r, dt, pan) in enumerate(((1.0, 0, -.3), (1.12, .03, .1), (.9, .07, .4))): put(fx, c.clink21 + dt, stereo(lay(vs(rclink, r), clink(2350 * r, .5) * .5), pan), -3)
put(fx, c.eyes21, stereo(blink()), -12)
put(fx, c.rim, stereo(fade(foam(c.popUp - c.rim + .2, .2), .03, .15)), -10)
put(fx, c.rimEyes, stereo(blink()), -6)
put(fx, c.popUp, stereo(pop(0)), 0)
put(fx, c.shake, stereo(flutter(c.shakeEnd - c.shake)), -8)
put(fx, c.sneeze, stereo(sneeze()), -4)
for k, n in enumerate(('B6', 'D7', 'B6', 'D7')): put(fx, c.samLaugh + k * .09, stereo(mbox(hz(n), .2), .3), -12)       # he laughs: a bright little shake, no voice
put(fx, c.drop + .3, stereo(drip(), .2), -4)
put(fx, c.lick, stereo(lick()), -5)
put(fx, c.flare21, stereo(flare(c.pop21 - c.flare21, 1)), -8)
put(fx, c.burp21, stereo(burp()), -7)
put(fx, c.pop21, stereo(pop(1)), 2); dip(c.pop21)

# ---------- 2. AGE 26: the waltz's second pass with warm strings; one wrong low note ----------
for ft, root, d in waltz(c.a26, c.a31, c.pop26, 24.0, THEME_G + 1):
    if ft < c.a31 - .3: put(music, ft, stereo(pad([hz(n) for n in MAJOR[root]], min(d + .12, c.a31 - ft), .25, .3)), -5)
for k, n in enumerate(('ting1', 'ting2', 'ting3')): put(fx, CUE[n], stereo(lay(vs(rclink, 1.35), clink(3136, .9) * .6), -.3), -4 + k)
put(fx, c.gulp26a - .008, gulp, -2, .2); put(fx, c.gulp26b - .008, gulp, -3, .2)
put(fx, c.flare26, stereo(flare(c.pop26 - c.flare26, 2)), -10)
put(fx, c.pop26, stereo(pop(2)), 5); dip(c.pop26)
wd = min(2.4, c.a31 - c.shadow26 - .05)                                                    # its shadow on the wall: E flat under D major...
wrong = slow(cut(horror, .9, 3.3), 2 ** (-4 / 12))[:int(wd * SR)]                          # ...the brass blast's ring, slowed from G down to E flat
put(music, c.shadow26, fade(filt(wrong, 'low', 900), .25, .3), -6, at=c.shadow26)

# ---------- 3. AGE 31: the lone music box (LULLABY) in a little room, a drone creeping in; the brass far off with the pop ----------
L = c.a34 - c.a31; first = .05; q = (c.pop31 - c.a31 - first) / 6                          # its seven notes re-spaced: the first on the cut, the seventh on the pop
lb = np.zeros((int(L * SR) + 3 * SR, 2))
for k in range(7):                                                                         # (its notes vary by 16 dB: each is set to the same level)
    y = cut(lulla, L_ON[k] - .012, L_ON[k + 1] - .012 if k < 6 else 9.0); y = y * min(.14 / np.sqrt((y[:int(.4 * SR)] ** 2).mean()), .9 / np.abs(y).max())
    put(lb, first - .012 + k * q, fade(y, .003, .04), 0)
lb = np.stack([reverb(lb[:, ch], 2.4, .4, 6000)[:len(lb)] for ch in (0, 1)], axis=1) * 1.3       # the room keeps each note ringing into the next
t = tsec(L); dr = (drone(L, hz('G1')) + np.sin(2 * np.pi * hz('Ab2') * t) * .1 + np.sin(2 * np.pi * hz('G3') * t) * .05 + np.sin(2 * np.pi * hz('G4') * t) * .03) * (.25 + .75 * (t / L) ** 1.5)   # G against A flat: it beats
put(lb, 0, stereo(dr), -7)
put(lb, c.pop31 - c.a31 - H0, blast, -17)
put(music, c.a31, fade(lb[:int(L * SR)], .005, .03), 0)
put(fx, c.flask + .15, stereo(glugs(.3, 3), .3), -8)
put(fx, c.take31, stereo(lay(vs(rclink, .8), clink(1500, .2) * .5), .3), -6)
put(fx, c.drink31 + .2 - .008, gulp, -3)
put(fx, c.flare31, stereo(flare(c.pop31 - c.flare31, 3)), -8)
put(fx, c.pop31, stereo(pop(3)), 1); dip(c.pop31)

# ---------- 4. AGE 34: the waltz turned heavy and swaggering (HEAVY), the first tune ghosting over it on the music box.
# HEAVY is cut once, on one of its own bar lines, under a picture cut, so that its last chord lands on the biggest pop;
# it hushes a little for the line ----------
L = c.a38 - c.a34; back_ = lambda k: c.pop34 - (HV_LAST - HV0 - k * HV_BAR)                 # where HEAVY's bar k falls when its last chord is on the pop
inner = [x['t'] for x in CUTS if c.a34 + 1.0 < x['t'] < c.pop34 - 1.0]
cands = [k for k in range(1, 6) if c.a34 + 1.0 < back_(k) < c.pop34 - 1.4]
kB = min(cands, key=lambda k: min([abs(back_(k) - x) for x in inner] or [0])) if cands else 5
tS = max(0, back_(kB) - c.a34)                                                             # the join, seconds into the scene
sw = np.zeros((int(L * SR) + 4 * SR, 2))
if tS > .1: put(sw, -HV0, fade(cut(heavy, 0, HV0 + tS), .001, .03), 0)
put(sw, tS - .01, fade(cut(heavy, HV0 + kB * HV_BAR - .01 + max(0, c.a34 - back_(kB)), 12.0), .01, .3), 0)
for j in range(int(tS / HV_BAR)):                                                          # HEAVY goes Gm, D, Gm, D: the tune's bars 3 and 4 fit it, in the minor
    for b, n, note in (((0, 1, 'G6'), (1, .5, 'D6'), (1.5, .5, 'Bb5'), (2, 1, 'G5')) if j % 2 == 0 else ((0, 1, 'D6'), (1, 2, 'A5'))):
        put(sw, (j + b / 3) * HV_BAR, stereo(tine(note, 0, n * .5 + .25), .2), -15)
put(sw, c.pop34 - c.a34 - H0, blast, -10)                                                  # the blast, far off, under the pop
sw = ride_db(sw[:int(L * SR)], c.a34, [(c.chin, 0), (c.illTalk, -5), (c.swell34, -5), (c.pop34 - .05, -1), (c.pop34, 0)])
put(music, c.a34, fade(sw, .001, .02), HEAVY_G)
for k in range(7):                                                                         # two pairs of feet, exactly together: the picture takes seven steps in this shot
    tk = c.a34 + (c.bar34 - c.a34) * (k + .5) / 7
    put(fx, tk, stereo(vs(FEET[k % 10], .85), -.25), -9); put(fx, tk + .012, stereo(vs(FEET[(k + 4) % 10], .7), .25), -9)
put(fx, c.pour34 - POUR0, pour, 6); put(fx, c.pour34, stereo(lay(liquid(1.0), glugs(.9, 6) * .6), .2), -6)
put(fx, c.drawUp, stereo(rustle(), -.3), -8); put(fx, c.drawDown, stereo(rustle(.3), -.3), -10)
put(fx, c.chin, stereo(cold(1.2)), -3)
put(fx, c.flare34, stereo(flare(c.pop34 - c.flare34, 4)), -6)
put(fx, c.pop34, stereo(pop(4)), 3)
put(fx, c.creak, stereo(creak()), -1)

# ---------- 5. AGE 38: horror. HEAVY at half speed (the same waltz an octave down) under DREAD's first hit; a riser as it
# leans in; the biggest hit of the film on its line (the HORROR blast, DREAD's second hit, HEAVY's last chord at half
# speed, the growl); the blast and the brass backwards, swelling; a cut on the truth ----------
L = c.truth - c.a38; hit = c.cantSee - c.a38; lean = c.lean38 - c.a38
hr = np.zeros((int(L * SR) + 4 * SR, 2))
slowh = slow(heavy, .5)
put(hr, -2 * HV0, fade(slowh[:int((lean + 2 * HV0 + .15) * SR)], .001, .3), 6)
put(hr, -D0, fade(cut(dread, 0, D1 - .06), .001, .3), 1)
put(hr, hit - H0, blast, 3); put(hr, hit, stereo(boom()), -4); put(hr, hit, W('sfx_stinger'), -11)                          # THEY CAN'T SEE ME.
put(hr, hit - .015, fade(cut(dread, D1 - .015, 8.0), .003, .3), -3)
put(hr, hit - .02, fade(slow(cut(heavy, HV_LAST - .01, 11.2), .5), .003, .3), 4)
put(hr, hit, stereo(impact[:int(2 * SR)]), -7); put(hr, hit + .02, fade(cut(growl, 0, L - hit), .02, .01), -10)
bl = L - hit                                                                               # the build
rev = cut(horror, .1, .1 + min(2.2, bl))[::-1]; put(hr, L - len(rev) / SR, rev * (np.linspace(0, 1, len(rev)) ** 1.5)[:, None], 0)
rb = cut(heavy, HV_LAST + .04, HV_LAST + .04 + min(1.4, bl - .25))[::-1]; put(hr, L - len(rb) / SR, fade(rb, .3, .001), 7)
put(music, c.a38, hr[:int(L * SR)], -1, at=c.a38)
EV.append(c.cantSee)
if c.a38 + .65 < c.claws - .5: put(fx, c.a38 + .65, stereo(partyhorn(.8), .45), -9)
put(fx, c.pinch - .1, stereo(swish(.45, 400, 3500, True)), -6, at=c.pinch)
put(fx, c.inBottle, stereo(lay(thump(160, .15, .4), vs(rclink, .7), clink(1500, .4) * .5)), -3)
put(fx, c.cork38 - .015, cork, 5); put(fx, c.cork38, stereo(lay(thump(330, .07, .3), click(.02, 1200) * .5)), -6)
k = 0
while c.cork38 + .22 + k * .13 < c.lean38 - .03 and k < 5:                                  # his fists on the glass, small
    put(fx, c.cork38 + .22 + k * .13, stereo(vs(KNOCKS[k % 4], 1.3), -.2), -6); k += 1
if c.cantSee - c.lean38 > .25: put(fx, c.lean38 + .04, stereo(riser(c.cantSee - c.lean38 - .1, 300, 1800)), 0)
put(fx, c.cantSee, stereo(slamhit()), 1)
dead(c.truth, music, fx)

# ---------- 6. the truth: a drop, not silence. A room: a fridge, a clock, a tap; one low hit; they leave; two lone piano
# notes; inside the bottle (the clock muffled, a heartbeat); three thuds, the crack, the smash; the floor; the sink ----------
put(fx, c.truth, fade(stereo(bed(c.day1 - c.truth, 300, 3000)), .01, .3), -28)
put(fx, c.truth, fade(stereo(hum(c.day1 - c.truth)), .03, .3), -14)
k = 0
while c.truth + .2 + k * .5 < c.pound - .1:                                                 # the kitchen clock, twice a second (muffled once we are inside the bottle)
    tk = c.truth + .2 + k * .5; y = tock(k % 2 == 0)
    put(fx, tk, stereo(filt(np.pad(y, (0, 2000)), 'low', 1500) * 1.8 if tk >= c.inside else y, .3), -7); k += 1
k = 0
while c.truth + .85 + k * .9 < c.fridge - .2: put(fx, c.truth + .85 + k * .9 + .1 * (k % 2), stereo(drip(), -.45), -8); k += 1   # the tap
put(fx, c.onlyYou, stereo(boom(1.5)), -12); put(fx, c.onlyYou, stereo(lay(thump(110, .3, .3), thump(280, .12, .3) * .6)), -8)
put(fx, c.leave, stereo(scrape(), .2), -6)
for k in range(5): put(fx, c.leave + .32 + k * .21, stereo(vs(FEET[(k + 2) % 10], 1.35), .15 + .12 * k), -8 - 1.5 * k)      # small feet, going
SAD_G = -1
put(music, c.fridge + .12 - (SAD_ON[0] - 2.0), fade(cut(sad, 2.0, 5.9), .002, 1.5), SAD_G, at=c.fridge + .12)
n2 = max(.5, min(2.6, c.inside + .4 - (c.fridge + .95)))
put(music, c.fridge + .95 - (SAD_ON[1] - 6.0), fade(cut(sad, 6.0, 6.0 + n2), .002, min(.8, n2 * .6)), SAD_G, at=c.fridge + .95)
Li = c.pound - c.inside + .2; ti = tsec(Li)
put(fx, c.inside, fade(stereo(drone(Li, 55)), .2, .2), -17)                                                                  # the pressure in there
put(fx, c.inside, fade(stereo((np.sin(2 * np.pi * 620 * ti) + .5 * np.sin(2 * np.pi * 933 * ti)) * (.7 + .3 * np.sin(2 * np.pi * 5 * ti)) * .1), .15, .15), -13)   # the bottle rings round him
k = 0
while c.inside + .25 + k * .5 < c.pound - .1: beat3(c.inside + .25 + k * .5, -12 + k); k += 1
for k, n in enumerate(('pound1', 'pound2', 'pound3')):
    put(fx, CUE[n], stereo(lay(thump(95, .3, .6), thump(240, .1, .3) * .6, vs(KNOCKS[2 + k % 2], .7))), -8 + 3 * k)
put(fx, c.pound3 + .02, stereo(crack()), -3)
if c.smash - c.tip > .15: put(fx, c.tip, stereo(riser(c.smash - c.tip - .03, 400, 2400)), -6)
rsw = cut(swell, len(swell) / SR - .02 - (c.smash - c.tip) - .25, len(swell) / SR - .02); put(fx, c.smash - len(rsw) / SR, fade(rsw, .2, .005), -9, at=c.tip)
for dt, g in ((0, 14), (.07, 10), (.14, 10)): put(fx, c.smash - SMASH0 + dt, W('sfx_smash'), g, at=c.smash)
put(fx, c.smash, stereo(boom()), -5); put(fx, c.smash, stereo(shatter()), 3); put(fx, c.smash, stereo(impact[:int(1.5 * SR)]), -8)
for k in range(7): put(fx, c.smash + .35 + (c.sink - c.smash - .5) * (k + rng.random()) / 7, stereo(clink(rng.uniform(3000, 6000), .3), rng.uniform(-.6, .6)), -12 - 1.2 * k)
tr = tsec(c.sink - c.smash); put(fx, c.smash + .1, stereo(np.sin(2 * np.pi * 3100 * tr) * np.exp(-tr / .9) * .05), -7)
put(music, c.floor, fade(stereo(drone(c.day1 - c.floor, hz('G1'))), .3, .5), -13)
put(fx, c.stand - .2, stereo(swish(.4, 300, 2000, True)), -10, at=c.stand); put(fx, c.stand, stereo(lay(thump(80, .2, .3), FEET[0])), -9)
gd = c.glugEnd - c.glug
put(fx, c.sink + .1, stereo(lay(vs(rclink, .85), clink(1700, .3) * .5), -.2), -6)
put(fx, c.glug - POUR0, pour, 4); put(fx, c.glug + gd / 2 - POUR0, pour, 3)
put(fx, c.glug, stereo(lay(liquid(gd), glugs(gd, max(4, int(gd * 7))))), -8); put(fx, c.glugEnd - .1, stereo(gurgle(.5)), -8)
deflate(c.flinch, 4, -4)
inh = min(.45, max(.2, c.day1 - c.afraid - .45)); put(fx, c.afraid, stereo(inhale(inh)), -1)                                 # a breath, held...
put(fx, c.afraid + inh, stereo(riser(max(.2, c.day1 - c.afraid - inh - .05), 300, 1500)), -2)                                # ...into DAY 1

# ---------- 7. DAY 1 to DAY 40: the anthem. Muffled and climbing while he ties his shoe, the impact as he runs ----------
B = lambda k: R0 + k * RB                                                                   # RISE's beats
L = c.run - c.day1; e = B(32); intro = cut(rise, e - L, e - .03)                            # ends on a bar line
u = (np.linspace(0, 1, len(intro)) ** 2)[:, None]
intro = (filt(intro, 'low', 900) * (1 - u) + filt(intro, 'low', 4000) * u) * db(np.linspace(-6, -3, len(intro)))[:, None]
put(music, c.day1, fade(intro, .1, .03), 0, at=c.day1)
put(music, c.run - R0, fade(cut(rise, 0, c.day60 - c.run + R0), .001, .01), RISE_G, at=c.run)
put(fx, c.run, stereo(boom()), -5); put(fx, c.run, stereo(impact[:int(1.5 * SR)]), -8)
if c.run - c.up1 > .2: put(fx, c.up1, stereo(riser(c.run - c.up1 - .03, 300, 2000)), -6)
rs = mono(cut(W('sfx_steps'), .1, .1 + min(2.85, c.day14 - c.run - .15)))                                                    # he runs
put(fx, c.run + .1, stereo(fade(rs / np.abs(rs).max() * .6, .01, .1), -.2), 5)
for n in ('rep1', 'rep2', 'rep3', 'pull1', 'pull2'): put(fx, CUE[n] - .15, stereo(swish(.3, 300, 2200, True), .2), -8, at=CUE[n])
deflate(c.slide, 3, -3, .2); put(fx, c.bump, stereo(lay(bump(), FEET[5]), .3), -3)
put(fx, c.smile40, stereo(lay(mbox(hz('G6'), .9), after(.09, mbox(hz('B6'), 1.0))), -.4), -2)                                # her first small smile
deflate(c.dropOff, 2, -3, -.2); put(fx, c.dropOff + .25, stereo(lay(bump(), FEET[7]), -.3), -5)
dead(c.day60, music)

# ---------- 8. DAY 60: the bar's door. A drop, not silence: crickets, the bar's music far off (its tune), a heartbeat
# with a click in it; her hand: one warm chord; the anthem back, softly ----------
L = c.walkOn - c.day60 + .5
far = reverb(filt(mono(cut(theme, DOWNB[12.0], DOWNB[12.0] + L)), 'band', [300, 2500]), .8, .4, 2500)[:int(L * SR)]
put(fx, c.day60, fade(stereo(far, .5), .02, .8), -8)
put(fx, c.day60, fade(stereo(crickets(L) + filt(rng.standard_normal(int(L * SR)), 'band', [2500, 5500]) * .004, -.4), .02, .8), -1)
put(fx, c.day60, fade(stereo(bed(L, 400, 4000)), .02, .8), -27)
put(fx, c.stop60, stereo(lay(vs(FEET[1], .9), thump(100, .14, .4) * .5)), -5)
for k in range(3): beat3(c.tempt + k * (c.handShot - c.tempt) / 3, -10 + k)
put(music, c.hand - E0, fade(cut(ending, 0, 1.9), .003, 1.0), 1, at=c.hand)                                                   # one warm chord
off = c.setDown - B(R_LAST)                                                                 # the anthem's last hit lands as he sets it on the shelf
bk = ride_db(cut(rise, max(0, c.walkOn - off), 24.0), c.walkOn, [(c.walkOn, -8), (c.day90 - .1, -5), (c.day90 + .25, -1.5)])
put(music, c.walkOn, fade(bk, .25, .4), RISE_G, at=c.walkOn)

# ---------- 9. DAY 90: the anthem at its peak; it stamps, tiny; the bottle, the cork, the highest shelf ----------
put(fx, c.day90, stereo(boom(1.5)), -9)
k = 0
while c.day90 + .3 + k * .19 < c.bottleDown - .05: put(fx, c.day90 + .3 + k * .19, stereo(chirp(), .2), -8 - (k % 2)); k += 1
put(fx, c.lower, stereo(swish(.4, 400, 3000, False)), -9)
put(fx, c.bottleDown, stereo(lay(vs(rclink, .8), clink(1700, .5) * .5, thump(170, .12, .4))), -3)
put(fx, c.cork90 - .015, cork, 3); put(fx, c.cork90, stereo(lay(thump(330, .07, .3), click(.02, 1200) * .5)), -6)
put(fx, c.shelf - .2, stereo(swish(.45, 500, 4500, True)), -8, at=c.shelf)
put(fx, c.setDown, stereo(lay(vs(rclink, .7), clink(1500, .4) * .5, thump(120, .2, .4))), -3)

# ---------- 10. the new drawing, the hug: ENDING, its strings' swell on the hug, then down for the night ----------
e0 = c.hug - E_SWELL; ts = max(e0, c.newDraw)
seg_ = ride_db(cut(ending, ts - e0, c.night + .6 - e0), ts, [(ts, 0), (c.kneel, 1), (c.hug - .1, 1), (c.hug, 3), (c.hug + 1.3, 2), (c.night - .2, -6), (c.night + .6, -40)])
put(music, ts, fade(seg_, .15, .3), 1)
put(fx, c.newDraw + .1, stereo(rustle(), .2), -8)
for k in range(4): put(fx, c.runIn + k * (c.hug - c.runIn - .08) / 4, stereo(vs(FEET[(k + 3) % 10], 1.5), -.3 + .1 * k), -9)   # she runs to him
put(fx, c.hug, stereo(lay(thump(90, .25, .3), thump(260, .1, .3) * .5)), -9); EV.append(c.hug)

# ---------- 11. night, the shelf: the first tune once more, tiny, on the music box, a little out of tune and running
# down; the kitchen clock again; its eyes, its breath on the glass, a finger, two polite taps ----------
L = c.black - c.night
OFF = {'G6': -9, 'D6': 11, 'B5': -16, 'G5': 5, 'E6': 14, 'E5': -7}                           # cents: each tine bent its own way, and all of it 15 flat
nb = np.zeros(int((L + 3) * SR)); bq = .46
for b, n, note in TUNE[:9]:
    tn = .15 + sum(bq * 1.035 ** j for j in range(int(b * 2))) / 2                            # each beat a little slower than the last
    if tn > L - .3: break
    i = int(tn * SR); y = tine(note, OFF[note] - 15); nb[i:i + len(y)] += y
put(music, c.night, fade(stereo(filt(nb, 'high', 500)[:int((L + .7) * SR)]), .001, .5), -1)
put(music, c.night, fade(stereo(drone(c.everyDay - c.night, hz('G1'))), 1.0, .2), -16)
put(fx, c.night, fade(stereo(bed(c.everyDay - c.night + .1, 300, 3000)), .3, .05), -26)
k = 0
while c.night + .3 + k * .5 < c.everyDay - .15: put(fx, c.night + .3 + k * .5, stereo(tock(k % 2 == 0), -.5), -12); k += 1
put(fx, c.eyesOpen, stereo(blink()), -5)
put(fx, c.fog, stereo(breath(.5)), -6)
put(fx, c.drawSmile, stereo(squeak(max(.3, min(.75, c.tap1 - c.drawSmile - .15))), .1), -5)
put(fx, c.tap1, stereo(lay(tap(), vs(rclink, 1.6) * .6), .1), -7); put(fx, c.tap2, stereo(lay(tap(), vs(rclink, 1.6) * .6), .1), -8)

# ---------- 12. black: "So starve it." A riser, and the anthem's own last chord as the firm hit on "Every day." ----------
rz = c.everyDay - c.black - .08
if rz > .2: put(fx, c.everyDay - rz - .03, stereo(riser(rz, 300, 1600, 1.0) + filt(rngc.standard_normal(int(rz * SR)), 'band', [600, 3000]) * .04), 0)   # air and a climbing tone through the black
put(music, c.everyDay - .004, fade(cut(rise, B(R_LAST) - .004, 24.0), .003, .3), 3, at=c.everyDay)
put(music, c.everyDay, stereo(lay(boom(2.2), nrm(kick(), .8))), -4); put(fx, c.everyDay, stereo(slamhit()), -5)
put(fx, c.title, stereo(lay(tine('G6', 0, 1.0), after(.12, tine('D6', 0, 1.0)) * .7)), -9)

# ---------- every written line: the marker (white lines about 0.45 s, red ones about 0.8 s in this edit) ----------
scratch(c.hkLine, .5, False, 0, 5); scratch(c.starve, .45, False, 0, 4)
for n, d in (('hkSmall', .45), ('small', .45), ('capGrow', .45), ('capNever', .45), ('capTie', .45), ('capChair', .45), ('capStop', .5),
             ('capChase', .45), ('capLight', .45), ('capSmall', .4), ('everyDay', .4)):
    scratch(CUE[n], d, False, rngc.uniform(-.3, .3))
for n, d in (('funnier', .8), ('toUs', .5), ('earned', .7), ('illTalk', .8), ('onlyYou', .8), ('justOne', .8), ('noFun', .5), ('sip60', .8), ('wait', .6)):
    scratch(CUE[n], d, True, rngc.uniform(-.3, .3))
scratch(c.pour34 + .3, .4, True, .3)                                                       # "one more." (the picture writes it just after the pour; it has no cue)

# ---------- every cut: a whoosh on a cut, a snap on a punch-in or a jump back, a thud and air on a beat of black. Not on
# the cuts that are a hit or a stop themselves (hk2, the truth, run, the bar's door), nor on the cut that ends a black ----------
# Each is set against what is playing round it (the phone band, 0.4 s either side), so it is heard but stays under the music.
band_ = lambda x: filt(filt(mono(x), 'high', 300, 4), 'low', 6000, 4)
refm, reff = band_(music), band_(fx)


def placed(t, parts, pan, over, at):             # parts: (seconds before t, mono sound); its loudest 60 ms goes `over` dB above the scene
    pre = max(p for p, _ in parts); x = lay(*[after(pre - p, y) for p, y in parts]); yb = band_(x); n = int(.06 * SR)
    loud = 10 * np.log10(max((yb[i:i + n] ** 2).mean() for i in range(0, max(1, len(yb) - n), n // 2)) + 1e-12)
    i0, i1 = max(0, int((at - .4) * SR)), int((at + .4) * SR); ref = 10 * np.log10((refm[i0:i1] ** 2).mean() + .25 * (reff[i0:i1] ** 2).mean() + 1e-12)
    put(fx, t - pre, stereo(x, pan), float(np.clip(ref, -34, -17)) + over - loud, at=at)


SKIP = [0.0, c.hk2, c.truth, c.run, c.day60]; last_black = -9
for i, x in enumerate(CUTS):
    t, kind = x['t'], x['kind']; pan = (.35 if i % 2 else -.35) * rngc.uniform(.5, 1)
    if kind == 'black':
        last_black = t; d = rngc.uniform(.26, .34)
        thud = lay(fade(impact[:int(.5 * SR)], .002, .3) * .5, nrm(vs(impact[:int(1.0 * SR)], rngc.uniform(4.5, 6.5)), .5), thump(rngc.uniform(240, 300), .1, .4) * .4)
        placed(t, [(0, thud), (d * .3, swish(d, 300, 1800, False) * .6)], pan * .3, 2, t)
    elif any(abs(t - q_) < .03 for q_ in SKIP) or t - last_black < .2: continue
    elif kind == 'cut':
        d = rngc.uniform(.26, .42)
        placed(t, [(d * .55, swish(d, rngc.uniform(400, 700), rngc.uniform(3000, 5200), rngc.random() < .6)), (.03, vs(whup, rngc.uniform(1.6, 2.6)) * .7)], pan, -2.5 + rngc.uniform(-1, 1), t)
    else:
        up = kind == 'punch'; d = rngc.uniform(.15, .22) if up else rngc.uniform(.2, .27); r = rngc.uniform(.5, .62) if up else rngc.uniform(.36, .46)
        placed(t, [(d * (.85 if up else .5), swish(d, 900 if up else 600, rngc.uniform(5000, 7000) if up else 4000, up) * .8), ((ZOOM_PK - .02) / r, vs(zoom, r))], pan, -1 + rngc.uniform(-1, 1), t)

# ---------- master ----------
if os.environ.get('IDF_STEMS'):                 # for checking the balance: the two buses as they go into the master
    write(os.path.join(os.environ['IDF_STEMS'], 'music.wav'), music[:int(round(DUR * SR))] * .25); write(os.path.join(os.environ['IDF_STEMS'], 'fx.wav'), fx[:int(round(DUR * SR))] * .25)
mix = master((music + fx)[:int(round(DUR * SR))])
end = int((DUR - 1.0) * SR); mix[end:] *= (np.linspace(1, 0, len(mix) - end) ** 1.5)[:, None]
write(os.path.join(HERE, 'audio', 'mix.wav'), mix)

# ---------- the report ----------
lv = lambda a, b, x=mix: round(float(20 * np.log10(np.sqrt((x[int(a * SR):int(b * SR)] ** 2).mean()) + 1e-9)), 1)
phone = filt(filt(mix, 'high', 300, 4), 'low', 6000, 4)                                     # what a phone speaker keeps


def onset(t, w=.15):
    """where the level (above 150 Hz, 2 ms frames) jumps near t: ms after the cue, and by how many dB"""
    m = filt(mono(mix), 'high', 150); n = int(.002 * SR); a = max(0, int((t - w) * SR)); s = m[a:int((t + w) * SR)]; k = len(s) // n
    e = 20 * np.log10(np.sqrt((s[:k * n].reshape(k, n) ** 2).mean(axis=1)) + 1e-5); es = np.convolve(e, np.ones(3) / 3, 'same')
    d = es[4:] - es[:-4]; i = int(d[2:-2].argmax()) + 2; pk = es[i:i + 20].max(); j = i
    while j < len(es) - 1 and es[j] < pk - 9: j += 1
    return {'ms_after_cue': int(round((a / SR + j * .002 - t) * 1000)), 'jump_db': round(float(d[i]), 1)}


def heard():                                     # onsets a listener hears in the finished mix (spectral flux, at least 70 ms apart)
    from scipy.ndimage import maximum_filter1d, uniform_filter1d
    fr = np.lib.stride_tricks.sliding_window_view(mono(mix), 1024)[::480] * np.hanning(1024)
    S = np.log1p(40 * np.abs(np.fft.rfft(fr, axis=1))); fl = np.maximum(0, np.diff(S, axis=0)).sum(axis=1)
    pk = (fl == maximum_filter1d(fl, 9)) & (fl > uniform_filter1d(fl, 40) * 1.5 + fl.mean() * .3)
    return (np.where(pk)[0] + 1) * 480 / SR


# the same measure as wojak-story/scripts/silence-check.py: the phone band in half-second steps, a full-scale sine reading 0 dB
n5 = int(.5 * SR); pw = 10 * np.log10(2 * (mono(phone)[:len(mix) // n5 * n5].reshape(-1, n5) ** 2).mean(axis=1) + 1e-12)
runs, i = [], 0
while i < len(pw):
    j = i
    while j < len(pw) and pw[j] < -38: j += 1
    if j - i >= 2: runs.append([i * .5, j * .5, round(float(pw[i:j].mean()), 1)])
    i = max(j, i + 1)
sec = np.array([max(pw[i], pw[min(i + 1, len(pw) - 1)]) for i in range(0, len(pw), 2)])[:int(c.everyDay) + 1]
placed = sorted(t for t in EV if 0 <= t < DUR); made = [placed[0]] + [t for a, t in zip(placed, placed[1:]) if t - a > .1] if placed else []
on = heard(); tens = range(0, int(DUR) + 1, 10)
per10 = lambda ts: {'%d-%d s' % (a, min(a + 10, int(DUR))): int(sum(a <= t < a + 10 for t in ts)) for a in tens}
rate = lambda ts, a, b: round(sum(a <= t < b for t in ts) / (b - a), 2)
KEY = ('hk2', 'pop21', 'pop26', 'pop31', 'pop34', 'cantSee', 'smash', 'run', 'hug', 'everyDay')
print(json.dumps({
    'loudness': report(mix), 'seconds': round(len(mix) / SR, 3),
    'key hits: ms after the cue, and the jump': {n: onset(CUE[n]) for n in KEY},
    'hits_dbfs (0.4 s after the cue, the 0.4 s before it)': {n: [lv(CUE[n], CUE[n] + .4), lv(max(0, CUE[n] - .45), CUE[n] - .05)] for n in KEY},
    'sound events placed (effects, merged within 0.1 s)': {'per 10 s': per10(made), 'a second, first 40 s': rate(made, 0, 40), 'a second, whole film': rate(made, 0, c.everyDay)},
    'onsets heard in the mix': {'per 10 s': per10(on), 'a second, first 40 s': rate(on, 0, 40), 'a second, whole film': rate(on, 0, c.everyDay)},
    'phone band (300 Hz-6 kHz), dB per second': ' '.join('%d' % round(v) for v in sec),
    'phone band spread, 10th to 90th percentile of the seconds (dB)': round(float(np.percentile(sec, 90) - np.percentile(sec, 10)), 1),
    'phone band, quietest half second before the last hit (dB)': [round(float(pw[:int(c.everyDay * 2)].min()), 1), round(float(pw[:int(c.everyDay * 2)].argmin() * .5), 1)],
    'stretches of 1 s or more under -38 dB in the phone band [from, to, dB]': runs,
    'the drops (phone band dB, full band dBFS)': {'the truth': [round(float(pw[int(c.truth * 2) + 1:int(c.fridge * 2)].mean()), 1), lv(c.truth + .05, c.fridge)], 'inside the bottle': [round(float(pw[int(c.inside * 2) + 1:int(c.pound * 2)].mean()), 1), lv(c.inside, c.pound)],
                                                    'the bar door': [round(float(pw[int(c.day60 * 2) + 1:int(c.hand * 2)].mean()), 1), lv(c.day60 + .05, c.hand - .05)]},
    'sections_dbfs': {'hook': lv(0, c.a21), 'AGE 21': lv(c.a21, c.a26), 'AGE 26': lv(c.a26, c.a31), 'AGE 31': lv(c.a31, c.a34), 'AGE 34': lv(c.a34, c.a38), 'AGE 38': lv(c.a38, c.truth),
                      'the truth to the smash': lv(c.truth, c.smash), 'floor and sink': lv(c.floor, c.day1), 'anthem intro': lv(c.day1, c.run), 'anthem': lv(c.run, c.day60), 'bar door': lv(c.day60, c.hand),
                      'walk on': lv(c.walkOn, c.day90), 'DAY 90': lv(c.day90, c.newDraw), 'drawing and hug': lv(c.newDraw, c.night), 'night': lv(c.night, c.black), 'the last hit': lv(c.everyDay, c.everyDay + 1.0)}}, indent=1))
