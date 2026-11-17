"""THE BOTTLE | It Was So Small: the sound. Music and effects only, no narration, no voices.
The devil's music grows up with it, all of it recorded (ElevenLabs), in one key (G) and one waltz time:
AGE 21 the light waltz (THEME), the tune entering as it pops up; AGE 26 the same waltz with strings and one wrong low
note; AGE 31 a lone music box (LULLABY), a drone creeping in; AGE 34 the waltz turned heavy, low brass and half-time
drums (HEAVY), with the first waltz's tune ghosting over it on the music box; AGE 38 HEAVY at half speed, an octave
down, under the DREAD hits, a breath of nothing, then the biggest hit of the film (the HORROR blast) on THEY CAN'T SEE
ME, a build, and a dead cut on the truth.
Then lone piano notes, a heartbeat, the smash, the pour; the anthem (RISE) from DAY 1, cut dead at the bar's door, back
when her hand takes his; warm piano and strings for the drawing and the hug; the first tune once more on the music
box, a little out of tune and running down, on the shelf; the anthem's own last chord as the firm hit on "Every day."
The POP is the film's motif: pop(size), the same sound lower and heavier each time it grows, backwards (deflate) each
time it shrinks.
Every time comes from cues.js (the picture's own table): after a cue moves, just run this again.
run: python films/07-it-was-so-small/mix.py   (any folder; writes audio/mix.wav beside it and prints a report)
Sources: audio/music/*.mp3 and audio/sfx/*.mp3 (music.json with engine/audio/music.mjs); the effects are made here."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'engine', 'audio'))
import numpy as np
from mixlib import *

CUE = json.loads(re.sub(r'^\s*const\s+CUE\s*=\s*', '', open(os.path.join(HERE, 'cues.js'), encoding='utf8').read().strip()).rstrip().rstrip(';'))
c = type('Cues', (), {'__getattr__': lambda self, k: CUE[k]})()
DUR = CUE['END']

# ---------- measured in the mp3s (17 Nov 2026) ----------
# THEME (49.5 s): one plain waltz in G major, 3/4 at exactly 120 bpm (a bar every 1.5 s, downbeats about 35 ms after
#   each multiple of 1.5 s). The five "ages" asked for did NOT come out as five styles: it is the same light waltz all
#   through. 0-12 s: pizzicato oom-pah-pah only (bars G C G D G C A7 D, the D bar is one note then a full second of rest
#   11.0-12.0); 12.03 s: the tune enters on a glockenspiel and runs twice (12-24, 24-36, the second time with a high
#   sparkle); 36-46.5: a variation lower down; last chord 46.5, ringing to 49. Downbeats used: A7 bar 9.034, tune 12.034,
#   the A bar of the tune (its highest note) 21.05, the D bar of the second pass 28.57.
#   The tune, read off the recording (beats of 0.5 s): G6 . D6 B5 G5 | E6 E5 - | G6 . D6 B5 G5 | D6 A5 - |
#   G6 . D6 B5 G5 | E6 E5 - | A6 . E6 C#6 A5 | D6 E6 F#6. Chords G C G D G C A D. It is written out in TUNE below.
# LULLABY (9 s): a lone music box in G major (+3 cents), one note a second, nothing under it (no drone came): G5 1.052,
#   D6 2.054, D6+G6 3.054, B5+G5 4.052, G6+B5 5.056, G5 6.052, G5+G6 7.052, ringing out by 8.5 s. The first two notes are
#   clean single tines: they are the "music box" this script re-pitches (tine()) wherever the first tune is played.
# HEAVY (12 s): G minor, 0 cents, 3/4 at exactly 120 bpm like THEME (a bar every 1.5 s): low brass and drums, one chord
#   a bar: Gm D Gm D Gm D, downbeats 0.03, 1.53, 3.026, 4.526, 6.03, 7.526; last chord (Gm) 9.022 s, ringing out by 10.5.
# DREAD (10 s): NOT a continuous bed: two colossal low hits, 0.03 and 4.035 s (a breath of silence before the second),
#   each with a rumble of low drums dying over 3 to 4 s; almost nothing above 300 Hz after each hit; no clear key.
# HORROR (12 s asked): one colossal brass blast on a low G (49 Hz and up), onset 0.026 s, a second hit at 0.74 s, ringing
#   to about 3 s, then nothing. Used as the blast: far off under pop31 and pop34, full on THEY CAN'T SEE ME; its ring,
#   slowed from G to E flat, is the wrong low note at the wedding.
# RISE (07-the-bottle's): impact 0.026 s, a beat every 0.4687 s (128 bpm), fuller from beat 16 (7.53 s), last hit on
#   beat 47 (22.054 s), ringing out by 23.5 s.
# ENDING: first chord 0.03 s, piano notes every 0.86 s, the strings' swell starts on the note at 6.036 s, loudest 6-10 s.
# SAD: three lone notes, onsets 2.056, 6.054, 10.056 s. Effects: hiss (cap) 0.068 s, its own fizz is almost silent (made
#   here instead); gulp: a click at 0, the gulp itself 0.448-0.67 s; cork 0.118 s; pour 0.176 s; smash 0.04 s.
T_A7, T_TUNE, T_POP21, T_POP26 = 9.034, 12.034, 21.05, 28.57
H0, R0, RB, R_LAST, E0, E_SWELL = .026, .026, .4687, 47, .03, 6.036
SAD_ON, HISS0, GULP = (2.056, 6.054, 10.056), .068, (.44, .70)
CORK0, POUR0, SMASH0 = .118, .176, .04
L_ON = (1.052, 2.054, 3.054, 4.052, 5.056, 6.052, 7.052)      # LULLABY's notes
HV0, HV_BAR, HV_LAST, D0, D1 = .03, 1.5, 9.022, .03, 4.035       # HEAVY's first downbeat, bar, last chord; DREAD's two hits
WALK = 3.5                                                       # footfalls a second at AGE 34 (src/40-age34.js: ph = L * TAU * 1.75)

W = lambda name: src(HERE, name)
music, fx = (np.zeros((int(DUR * SR) + 2 * SR, 2)) for _ in range(2))


# ---------- plumbing ----------
def put(bus, t, x, gain_db=0.0, pan=0.0):
    x = stereo(x, pan) if x.ndim == 1 else x
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
    parts = [nrm(lay(body, snap * .6), .5)]          # the part every speaker plays, a phone too: as loud each time, only lower
    if size: parts.append(thump(120 * .78 ** size, .22 + .16 * size, .7) * (.25 + .15 * size))      # the weight under it
    if size >= 3: parts.append(boom(1.2 + .5 * (size - 3)) * .2 * (size - 2))
    return lay(*parts)


def deflate(t, size, g, pan=0.0):
    """it shrinks: the same pop backwards (sucked in, ending on the cue), then a sagging, fluttering wheeze from the cue"""
    back = pop(size)[:int((.22 + .08 * size) * SR)][::-1]
    put(fx, t - len(back) / SR, stereo(back * np.linspace(0, 1, len(back)) ** 1.5, pan), g - 3)
    d = .36 + .09 * size; tt = tsec(d); f0 = 1500 * .62 ** size
    wheeze = (np.sin(2 * np.pi * np.cumsum(f0 * (1.5 - .95 * (tt / d) ** .7)) / SR) * .6 + filt(rng.standard_normal(len(tt)), 'band', [max(200, f0 * .8), min(9000, f0 * 4)]) * .35)
    wheeze *= (.6 + .4 * np.sign(np.sin(2 * np.pi * (34 - 4 * size) * tt))) * np.minimum(1, tt / .004) * (1 - tt / d) ** .6
    put(fx, t, stereo(nrm(wheeze, .45 + .08 * size), pan), g)


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


def writing(t, text, d, g, red=False, pan=0.0):  # a line writing itself: one soft tick a letter (red lines 1.1 s, cream .9 s)
    n = len(text.replace(' ', ''))
    for k in range(n): put(fx, t + d * (k + .3 * rng.random()) / n, stereo(tick() if red else click(.02, 3800) * .6, pan), g + rng.uniform(-2, 0))


def beat3(t, g=-5):                              # a heartbeat a phone can play too
    put(fx, t, stereo(heartbeat()), g); put(fx, t, stereo(thump(150, .16, .3)), g - 7); put(fx, t + .24, stereo(thump(140, .14, .3)), g - 10)
    put(fx, t, stereo(thump(300, .08, .2)), g - 14)


theme, horror, rise, ending, sad = W('music_THEME'), W('music_HORROR'), W('music_RISE'), W('music_ENDING'), W('music_SAD')
gulp = fade(cut(W('sfx_gulp'), *GULP), .003, .03); cork = fade(cut(W('sfx_cork'), CORK0 - .015, .62), .003, .05)
lulla, heavy, dread = W('music_LULLABY'), W('music_HEAVY'), W('music_DREAD')
blast = fade(cut(horror, 0, 3.4), .001, .6)
THEME_G, HEAVY_G = -1, 4
TINES = {'G5': nrm(mono(cut(lulla, L_ON[0] - .006, L_ON[1] - .012)), .5), 'D6': nrm(mono(cut(lulla, L_ON[1] - .006, L_ON[2] - .012)), .5)}   # LULLABY's two clean tines


def tine(note, cents=0.0, d=None):           # the recorded music box, re-pitched to any note (from the nearer of its two tines)
    f = hz(note); base = min(TINES, key=lambda b: abs(np.log2(f / hz(b)))); r = f / hz(base) * 2 ** (cents / 1200)
    y = varispeed(TINES[base], r, r)
    return fade(y[:int(d * SR)] if d else y, .002, .08)


def slow(x, r): return np.stack([varispeed(x[:, ch], r, r) for ch in (0, 1)], axis=1)     # a recording at r times its speed (.5: an octave down, twice as long)


def theme_at(t0, t1, anchor_film, anchor_theme, g):      # the recording from t0 to t1, with anchor_theme landing on anchor_film
    a = anchor_theme + (t0 - anchor_film); assert a >= 0, 'THEME would start before its own beginning'
    put(music, t0, fade(cut(theme, a, a + t1 - t0), .03, .03), g)


# ---------- 0. the cold open: a low soft tone, the cap, the foam, its eyes ----------
put(music, 0, fade(stereo(drone(c.a21 + .1, hz('G1'))), .4, .25), -14)
put(music, 0, stereo(pad([hz('G3'), hz('D4')], c.a21 + .1, 1.2, .4)), -12)                # the part of the tone a phone plays
put(fx, c.hiss - HISS0, fade(cut(W('sfx_hiss'), 0, 1.2), .001, .3), -5)
put(fx, c.hiss + .08, stereo(fizz(c.a21 - c.hiss)), -9)
writing(c.line1, 'Nobody feeds a monster.', .9, -24); writing(c.line2, 'You feed something small.', .9, -24)
put(fx, c.eyes0, stereo(blink()), -10)

# ---------- 1. AGE 21: the tune, playful. The waltz vamps under the party, rests for a second while the eyes show in
# the foam, and the tune itself enters as it pops up; the tune's highest note lands on the pop that grows it ----------
theme_at(c.a21, c.a26, c.pop21, T_POP21, THEME_G)
down1 = c.pop21 - (T_POP21 - T_A7)                                                        # the first downbeat after the cut
if down1 - c.a21 > .3:                                                                     # a little run up to it
    for k, n in enumerate(('D6', 'E6', 'F#6', 'G6')): put(music, c.a21 + .04 + k * (down1 - c.a21 - .1) / 4, stereo(tine(n, 0, .5)), -12 + k)
for k, (f, dt, pan) in enumerate(((2350, 0, -.3), (2640, .03, .1), (2100, .07, .4))): put(fx, c.clink21 + dt, stereo(clink(f), pan), -11)
put(fx, c.eyes21, stereo(blink()), -16); put(fx, c.rimEyes, stereo(blink()), -11)
put(fx, c.popUp, stereo(pop(0)), -3)
put(fx, c.shake, stereo(flutter(c.shakeEnd - c.shake)), -12)
put(fx, c.sneeze, stereo(sneeze()), -7)
writing(c.funnier, "you're funnier with me.", 1.1, -20, True)
put(fx, c.lick, stereo(lick()), -8)
put(fx, c.flare21, stereo(flare(c.pop21 - c.flare21, 1)), -10)
put(fx, c.burp21, stereo(burp()), -9)
put(fx, c.pop21, stereo(pop(1)), 0)
writing(c.small, 'it was so small.', .9, -24)

# ---------- 2. AGE 26: the same tune as a wedding waltz (its second pass, with warm strings); one wrong low note ----------
theme_at(c.a26, c.a31, c.pop26, T_POP26, THEME_G + 1)
for k in range(16):                                                                        # strings on the recording's own chords
    ft = c.pop26 + (T_TUNE + 1.5 * k - T_POP26)
    if c.a26 - .2 <= ft < c.a31 - .3: put(music, max(ft, c.a26), stereo(pad([hz(n) for n in MAJOR[ROOTS[k % 8]]], min(1.62, c.a31 - ft), .25, .3)), -5)
for k, n in enumerate(('ting1', 'ting2', 'ting3')): put(fx, CUE[n], stereo(clink(3136, .9), -.3), -9 + k)
writing(c.toUs, 'to us.', 1.1, -20, True)
put(fx, c.gulp26a - .008, gulp, -4, .2); put(fx, c.gulp26b - .008, gulp, -5, .2)
put(fx, c.flare26, stereo(flare(c.pop26 - c.flare26, 2)), -12)
put(fx, c.pop26, stereo(pop(2)), 5); dip(c.pop26)
wd = min(2.4, c.a31 - c.shadow26 - .05)                                                    # its shadow on the wall: E flat under D major...
wrong = slow(cut(horror, .9, 3.3), 2 ** (-4 / 12))[:int(wd * SR)]                          # ...the brass blast's ring, slowed from G down to E flat
put(music, c.shadow26, fade(filt(wrong, 'low', 900), .3, .3), -7)

# ---------- 3. AGE 31: the lone music box (LULLABY), a drone creeping in under it; the brass far off with the pop ----------
L = c.a34 - c.a31; first = .05; q = (c.pop31 - c.a31 - first) / 6                          # its seven notes re-spaced: the first on the cut, the seventh on the pop
lb = np.zeros((int(L * SR) + 3 * SR, 2))
for k in range(7):                                                                         # (its notes vary by 16 dB: each is set to the same level)
    y = cut(lulla, L_ON[k] - .012, L_ON[k + 1] - .012 if k < 6 else 9.0); y = y * min(.08 / np.sqrt((y[:int(.4 * SR)] ** 2).mean()), .8 / np.abs(y).max())
    put(lb, first - .012 + k * q, fade(y, .003, .04), 0)
t = tsec(L); dr = (drone(L, hz('G1')) + np.sin(2 * np.pi * hz('Ab2') * t) * .1 + np.sin(2 * np.pi * hz('G3') * t) * .05) * (t / L) ** 1.5     # G against A flat: it beats
put(lb, 0, stereo(dr), -7)
put(lb, c.pop31 - c.a31 - H0, blast, -17)
put(music, c.a31, fade(lb[:int(L * SR)], .01, .03), 0)
writing(c.earned, 'you earned it.', 1.1, -22, True)
put(fx, c.take31, stereo(clink(1500, .2), .3), -18)
put(fx, c.drink31 + .3 - .008, gulp, -5)
put(fx, c.flare31, stereo(flare(c.pop31 - c.flare31, 3)), -9)
put(fx, c.pop31, stereo(pop(3)), 0); dip(c.pop31)

# ---------- 4. AGE 34: the waltz turned heavy and swaggering (HEAVY: low brass, half-time drums, G minor, THEME's own
# tempo), the first tune ghosting over it on the music box. It breaks off as its hand turns his chin, comes back hushed
# under its line, and its last chord lands on the biggest pop ----------
L = c.a38 - c.a34; nA = max(1, int((c.chin - c.a34) / HV_BAR))                              # whole bars before the chin
sw = np.zeros((int(L * SR) + 4 * SR, 2))
put(sw, -HV0, fade(cut(heavy, 0, HV0 + nA * HV_BAR), .001, .25), 0)
for j in range(nA):                                                                        # HEAVY goes Gm, D, Gm, D: the tune's bars 3 and 4 fit it, in the minor
    for b, n, note in (((0, 1, 'G6'), (1, .5, 'D6'), (1.5, .5, 'Bb5'), (2, 1, 'G5')) if j % 2 == 0 else ((0, 1, 'D6'), (1, 2, 'A5'))):
        put(sw, (j + b / 3) * HV_BAR, stereo(tine(note, 0, n * .5 + .25), .2), -15)
kB = next((k for k in range(7) if c.pop34 - (HV_LAST - HV0 - k * HV_BAR) >= c.a34 + nA * HV_BAR - .05), 6)   # the bar HEAVY comes back on
put(sw, c.pop34 - (HV_LAST - HV0 - kB * HV_BAR) - c.a34 - .01, fade(cut(heavy, HV0 + kB * HV_BAR - .01, 12.0), .005, .3), 0)   # ...so that its last chord is on the pop
put(sw, c.pop34 - c.a34 - H0, blast, -10)                                                  # the blast, far off, under the pop
sw = ride_db(sw[:int(L * SR)], c.a34, [(c.chin, 0), (c.illTalk, -9), (c.swell34, -9), (c.pop34 - .05, -1), (c.pop34, 0)])
put(music, c.a34, fade(sw, .001, .02), HEAVY_G)
k = 0
while c.a34 + (k + .5) / WALK < c.bar34 - .05:                                              # two pairs of footsteps, exactly together, as the picture walks
    put(fx, c.a34 + (k + .5) / WALK, stereo(step(1.0), -.25), -15); put(fx, c.a34 + (k + .5) / WALK + .012, stereo(step(1.3), .25), -15); k += 1
put(fx, c.pour34 - POUR0, W('sfx_pour'), 4)
writing(c.pour34 + .5, 'one more.', .6, -20, True)                                         # the picture writes this half a second after the pour
put(fx, c.drawUp, stereo(rustle(), -.3), -14); put(fx, c.drawDown, stereo(rustle(.3), -.3), -17)
put(fx, c.chin, stereo(cold()), -6)
writing(c.illTalk, "i'll talk. you rest.", 1.1, -20, True)
put(fx, c.flare34, stereo(flare(c.pop34 - c.flare34, 4)), -7)
put(fx, c.pop34, stereo(pop(4)), 2)
put(fx, c.creak, stereo(creak()), -5)

# ---------- 5. AGE 38: horror. HEAVY at half speed (the same waltz an octave down, a bar every 3 s) under DREAD's first
# hit and its rumble; a breath of nothing as it leans in; the biggest hit on its line (the HORROR blast, DREAD's second
# hit, HEAVY's last chord at half speed); the blast and the brass backwards, swelling; a dead cut on the truth ----------
L = c.truth - c.a38; hit = c.cantSee - c.a38; lean = c.lean38 - c.a38
hr = np.zeros((int(L * SR) + 4 * SR, 2))
slowh = slow(heavy, .5)
put(hr, -2 * HV0, fade(slowh[:int((lean + 2 * HV0 + .15) * SR)], .001, .3), 6)
put(hr, -D0, fade(cut(dread, 0, D1 - .06), .001, .3), 1)
put(hr, hit - H0, blast, 3); put(hr, hit, stereo(boom()), -4); put(hr, hit, W('sfx_stinger'), -11)                          # THEY CAN'T SEE ME.
put(hr, hit - .015, fade(cut(dread, D1 - .015, 8.0), .003, .3), -3)
put(hr, hit - .02, fade(slow(cut(heavy, HV_LAST - .01, 11.2), .5), .003, .3), 4)
bl = L - hit                                                                               # the build
rev = cut(horror, .1, .1 + min(2.2, bl))[::-1]; put(hr, L - len(rev) / SR, rev * (np.linspace(0, 1, len(rev)) ** 1.5)[:, None], 0)
rb = cut(heavy, HV_LAST + .04, HV_LAST + .04 + min(1.4, bl - .25))[::-1]; put(hr, L - len(rb) / SR, fade(rb, .3, .001), 7)
put(music, c.a38, hr[:int(L * SR)], -1)
put(fx, c.a38 + 1.1, stereo(partyhorn(), .45), -15)
put(fx, c.pinch, stereo(whoosh(.5, 300, 3000)), -9)
put(fx, c.inBottle, stereo(lay(thump(160, .15, .4), clink(1500, .4))), -6)
put(fx, c.cork38 - .015, cork, 3)
k = 0
while c.cork38 + .35 + k * .24 < c.lean38 - .05 and k < 4:                                  # his fists on the glass, small
    put(fx, c.cork38 + .35 + k * .24, stereo(lay(thump(300, .06, .2), filt(clink(1900, .15), 'low', 2500) * .7), -.2), -10); k += 1
put(fx, c.lean38, stereo(whoosh(.6, 150, 1200)), -10)
dead(c.truth, music, fx)

# ---------- 6. the truth: near silence. A room, a clock; one low hit; they leave; two lone piano notes; inside the
# bottle; three thuds, the crack, the smash ----------
room = bed(c.day1 - c.truth, 250, 2500)
put(fx, c.truth, fade(stereo(room), .01, .3), -30)
k = 0
while c.truth + .45 + k < c.pound - .2:                                                    # the kitchen clock (muffled once we are inside the bottle)
    tk = c.truth + .45 + k; y = tick() if k % 2 == 0 else click(.04, 1500) * .6
    put(fx, tk, stereo(filt(np.pad(y, (0, 2000)), 'low', 900) * 2 if tk >= c.inside else y, .3), -10); k += 1
put(fx, c.onlyYou, stereo(boom(1.5)), -15); put(fx, c.onlyYou, stereo(thump(110, .3, .3)), -13)
writing(c.onlyYou, 'THEY ONLY SEE YOU.', 1.1, -24, True)
put(fx, c.leave, stereo(scrape(), .2), -13)
for k in range(6): put(fx, c.leave + .5 + k * .22, stereo(step(.5), .15 + .1 * k), -17 - 1.6 * k)                           # small feet, going
SAD_G = -4
put(music, c.fridge + .2 - (SAD_ON[0] - 2.0), fade(cut(sad, 2.0, 5.9), .002, 1.5), SAD_G)
n2 = max(.6, min(2.6, c.inside + .4 - (c.fridge + 1.4)))
put(music, c.fridge + 1.4 - (SAD_ON[1] - 6.0), fade(cut(sad, 6.0, 6.0 + n2), .002, min(.8, n2 * .6)), SAD_G)
put(fx, c.inside, fade(stereo(drone(c.pound - c.inside + .3, 55)), .3, .3), -19)                                              # the pressure in there
k = 0
while c.inside + .35 + k * .68 < c.pound - .15: beat3(c.inside + .35 + k * .68, -12 + k); k += 1
for k, n in enumerate(('pound1', 'pound2', 'pound3')):
    put(fx, CUE[n], stereo(lay(thump(95, .3, .6), thump(240, .1, .3) * .6, filt(clink(1100, .25), 'low', 1800) * .8)), -13 + 3 * k)
put(fx, c.pound3 + .02, stereo(crack()), -7)
swl = W('sfx_swell'); rsw = cut(swl, len(swl) / SR - .02 - (c.smash - c.tip) - .25, len(swl) / SR - .02)                     # a swell into the smash
put(fx, c.smash - len(rsw) / SR, fade(rsw, .2, .005), -9)
for dt, g in ((0, 13), (.07, 9), (.14, 9)): put(fx, c.smash - SMASH0 + dt, W('sfx_smash'), g)
put(fx, c.smash, stereo(boom()), -5); put(fx, c.smash, stereo(shatter()), 1)
# the kitchen floor: silence after it, glass still settling, a ring in the ears, a low drone
for k in range(7): put(fx, c.smash + .4 + (c.stand - c.smash - .5) * (k + rng.random()) / 7, stereo(clink(rng.uniform(3000, 6000), .3), rng.uniform(-.6, .6)), -15 - 1.5 * k)
tr = tsec(c.sink - c.smash); put(fx, c.smash + .1, stereo(np.sin(2 * np.pi * 3100 * tr) * np.exp(-tr / .9) * .05), -6)
put(music, c.floor, fade(stereo(drone(c.day1 - c.floor, hz('G1'))), .3, .5), -13)
put(fx, c.stand - .2, stereo(whoosh(.4, 200, 1500)), -16); put(fx, c.stand, stereo(thump(80, .2, .3)), -16)
# the sink
gd = c.glugEnd - c.glug
put(fx, c.sink + .15, stereo(clink(1700, .3), -.2), -14)
put(fx, c.glug - POUR0, W('sfx_pour'), 5); put(fx, c.glug + gd / 2 - POUR0, W('sfx_pour'), 4)
put(fx, c.glug, stereo(glugs(gd, max(4, int(gd * 6)))), -9); put(fx, c.glugEnd - .1, stereo(gurgle()), -9)
deflate(c.flinch, 4, -6)
put(fx, c.afraid, stereo(inhale(min(.6, c.day1 - c.afraid - .25))), -8)                                                      # a breath, held

# ---------- 7. DAY 1 to DAY 40: the anthem. Far off and muffled while he ties his shoe, the impact as he runs ----------
B = lambda k: R0 + k * RB                                                                   # RISE's beats
L = c.run - c.day1; e = B(32); intro = cut(rise, e - L, e - .03)                            # ends on a bar line
u = (np.linspace(0, 1, len(intro)) ** 2)[:, None]
intro = (filt(intro, 'low', 500) * (1 - u) + filt(intro, 'low', 2500) * u) * db(np.linspace(-10, -5, len(intro)))[:, None]
put(music, c.day1, fade(intro, .3, .03), 0)
RISE_G = 2
put(music, c.run - R0, fade(cut(rise, 0, c.day60 - c.run + R0), .001, .01), RISE_G); put(fx, c.run, stereo(boom()), -5)
writing(c.justOne, 'just one. for the shakes.', 1.1, -18, True)
put(fx, c.up1, stereo(whoosh(.4, 300, 2500)), -14)
put(fx, c.run + .12, stereo(steps(c.day14 - c.run - .3, 5.4)), -10)
for n in ('rep1', 'rep2', 'rep3', 'pull1', 'pull2'): put(fx, CUE[n] - .15, stereo(whoosh(.35, 200, 1800)), -15)
writing(c.noFun, "you're no fun.", 1.1, -16, True)
deflate(c.slide, 3, -6, .2); put(fx, c.bump, stereo(bump(), .3), -7)
put(fx, c.smile40, stereo(lay(mbox(hz('G6'), .9), after(.09, mbox(hz('B6'), 1.0))), -.4), -6)                                # her first small smile
deflate(c.dropOff, 2, -8, -.2); put(fx, c.dropOff + .32, stereo(bump(), -.3), -10)
dead(c.day60, music)

# ---------- 8. DAY 60: the bar's door. Evening air, the bar's music far off (its tune), a heartbeat; her hand ----------
L = c.walkOn - c.day60 + .6
far = reverb(filt(mono(cut(theme, T_TUNE, T_TUNE + L)), 'band', [280, 1100]), 1.0, .45, 1800)[:int(L * SR)]
put(fx, c.day60, fade(stereo(far, .5), .05, .9), -17)
put(fx, c.day60, fade(stereo(crickets(L), -.4), .05, .9), -7); put(fx, c.day60, fade(stereo(bed(L, 500, 5000)), .05, .9), -38)
put(fx, c.stop60, stereo(step(1.0)), -12)
writing(c.sip60, "just a sip. i'm so small.", 1.1, -22, True)
for k in range(3): beat3(c.tempt + k * (c.handShot - c.tempt) / 3, -10 + k)
put(music, c.hand - E0, fade(cut(ending, 0, 1.9), .003, 1.0), -1)                                                              # one warm chord
off = c.setDown - B(R_LAST)                                                                 # the anthem's last hit lands as he sets it on the shelf
k0 = int(round((c.walkOn - off - R0) / RB)); t0 = off + B(k0)                               # ...so it comes back, softly, on the beat nearest walkOn
back = ride_db(cut(rise, B(k0), 24.0), t0, [(t0, -9), (c.day90 - .1, -6), (c.day90 + .3, -1.5)])
put(music, t0, fade(back, .25, .4), RISE_G)

# ---------- 9. DAY 90: the anthem at its peak; the bottle, the cork, the highest shelf ----------
put(fx, c.day90, stereo(boom(1.5)), -11)
k = 0
while c.day90 + .25 + k * .21 < c.bottleDown - .05: put(fx, c.day90 + .25 + k * .21, stereo(chirp(), .2), -14 - (k % 2)); k += 1   # it stamps, tiny
put(fx, c.lower, stereo(whoosh(.45, 300, 2500)), -14)
put(fx, c.bottleDown, stereo(lay(clink(1700, .5), thump(170, .12, .4))), -9)
put(fx, c.cork90 - .015, cork, 0)
put(fx, c.shelf - .2, stereo(whoosh(.5, 400, 3500)), -13)
put(fx, c.setDown, stereo(lay(clink(1500, .4), thump(120, .2, .4))), -9)

# ---------- 10. the new drawing, the hug: ENDING, its strings' swell on the hug, then down to a hush ----------
e0 = c.hug - E_SWELL; ts = max(e0, c.newDraw - .3)
seg_ = ride_db(cut(ending, ts - e0, c.night + .6 - e0), ts, [(ts, -1), (c.kneel, 0), (c.hug - .1, 0), (c.hug, 2), (c.hug + 1.3, 1), (c.night - .2, -10), (c.night + .6, -40)])
put(music, ts, fade(seg_, .02, .3), 0)
put(fx, c.newDraw + .1, stereo(rustle(), .2), -17)
for k in range(4): put(fx, c.runIn + k * (c.hug - c.runIn - .1) / 4, stereo(step(.5), -.3 + .1 * k), -19)
put(fx, c.hug, stereo(thump(90, .25, .3)), -16)

# ---------- 11. night, the shelf: the first tune once more, tiny, the music box a little out of tune and running down ----------
L = c.black - c.night
OFF = {'G6': -9, 'D6': 11, 'B5': -16, 'G5': 5, 'E6': 14, 'E5': -7}                           # cents: each tine bent its own way, and all of it 15 flat
nb = np.zeros(int((L + 3) * SR)); bq = .56
for b, n, note in TUNE[:9]:                                                                # the first tune, on the recorded music box
    tn = .3 + sum(bq * 1.035 ** j for j in range(int(b * 2))) / 2                             # each beat a little slower than the last
    if tn > L - .35: break
    i = int(tn * SR); y = tine(note, OFF[note] - 15); nb[i:i + len(y)] += y
nb = filt(nb, 'high', 500)[:int((L + .7) * SR)]
put(music, c.night, fade(stereo(nb), .001, .5), -6)
put(music, c.night, fade(stereo(drone(c.everyDay - c.night, hz('G1'))), 1.0, .2), -16)
put(fx, c.night, fade(stereo(bed(c.everyDay - c.night + .1, 300, 3000)), .4, .05), -36)
put(fx, c.eyesOpen, stereo(blink()), -12)
put(fx, c.fog, stereo(breath()), -8)
put(fx, c.drawSmile, stereo(squeak(max(.3, min(.8, c.tap1 - c.drawSmile - .2))), .1), -6)
put(fx, c.tap1, stereo(tap(), .1), -6); put(fx, c.tap2, stereo(tap(), .1), -7)
writing(c.wait, 'i can wait.', 1.1, -22, True)

# ---------- 12. black: "So starve it." One firm hit on "Every day.", ringing out ----------
writing(c.starve, 'So starve it.', .9, -22)
put(music, c.everyDay - .004, fade(cut(rise, B(R_LAST) - .004, 24.0), .003, .3), 2)                                          # the anthem's own last chord...
put(music, c.everyDay, stereo(lay(boom(2.2), nrm(kick(), .8))), -4)                                                          # ...with weight under it

# ---------- master ----------
mix = master((music + fx)[:int(DUR * SR)])
end = int((DUR - 1.2) * SR); mix[end:] *= (np.linspace(1, 0, len(mix) - end) ** 1.5)[:, None]
write(os.path.join(HERE, 'audio', 'mix.wav'), mix)

# ---------- the report ----------
lv = lambda a, b, x=mix: round(float(20 * np.log10(np.sqrt((x[int(a * SR):int(b * SR)] ** 2).mean()) + 1e-9)), 1)
phone = filt(mix, 'high', 300, 4)                                                           # what a phone speaker keeps


def onset(t, w=.15):
    """where the level (above 150 Hz, 2 ms frames) jumps near t: ms after the cue, and by how many dB"""
    m = filt(mono(mix), 'high', 150); n = int(.002 * SR); a = int((t - w) * SR); s = m[a:int((t + w) * SR)]; k = len(s) // n
    e = 20 * np.log10(np.sqrt((s[:k * n].reshape(k, n) ** 2).mean(axis=1)) + 1e-5); es = np.convolve(e, np.ones(3) / 3, 'same')
    d = es[4:] - es[:-4]; i = int(d[2:-2].argmax()) + 2; pk = es[i:i + 20].max(); j = i
    while j < len(es) - 1 and es[j] < pk - 9: j += 1
    return {'ms_after_cue': int(round((a / SR + j * .002 - t) * 1000)), 'jump_db': round(float(d[i]), 1)}


KEY = ('pop21', 'pop26', 'pop31', 'pop34', 'cantSee', 'smash', 'run', 'hand', 'hug', 'everyDay')
sil = lambda a, b: {'full': lv(a, b), 'phone_300Hz_up': lv(a, b, phone)}
print(json.dumps({
    'loudness': report(mix), 'seconds': len(mix) / SR,
    'hits_dbfs (0.4 s after the cue, and the 0.4 s before it)': {n: [lv(CUE[n], CUE[n] + .4), lv(CUE[n] - .45, CUE[n] - .05)] for n in KEY},
    'hits on a phone (300 Hz up), after and before': {n: [lv(CUE[n], CUE[n] + .4, phone), lv(CUE[n] - .45, CUE[n] - .05, phone)] for n in KEY},
    'alignment': {n: onset(CUE[n]) for n in KEY},
    'silences_dbfs': {'cold open': sil(.9, c.eyes0), 'the truth (truth to fridge)': sil(c.truth + .05, c.fridge), 'inside the bottle': sil(c.inside + .3, c.pound),
                      'the kitchen floor (after the smash)': sil(c.smash + .9, c.sink), 'held breath (afraid to DAY 1)': sil(c.afraid + .6, c.day1),
                      'the bar door (DAY 60)': sil(c.day60 + .1, c.hand - .05), 'black, before the hit': sil(c.black + .1, c.everyDay - .05)},
    'sections_dbfs': {'AGE 21': lv(c.a21, c.a26), 'AGE 26': lv(c.a26, c.a31), 'AGE 31': lv(c.a31, c.a34), 'AGE 34': lv(c.a34, c.a38), 'AGE 38': lv(c.a38, c.truth),
                      'lone piano (fridge)': lv(c.fridge, c.inside), 'the sink': lv(c.sink, c.day1), 'anthem intro': lv(c.day1, c.run), 'anthem (run to DAY 60)': lv(c.run, c.day60),
                      'walk on': lv(c.walkOn, c.day90), 'DAY 90': lv(c.day90, c.newDraw), 'drawing and hug': lv(c.newDraw, c.night), 'night, the shelf': lv(c.night, c.black),
                      'the last hit': lv(c.everyDay, c.everyDay + 1.0)}}, indent=1))
