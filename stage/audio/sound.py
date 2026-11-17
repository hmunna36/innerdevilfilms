"""THE STAGE'S SOUND KIT (the reusable part of film 07's mix, 17 Nov 2026). A film's mix.py, or stage/audio/short_mix.py,
starts with:

    import os, sys; HERE = os.path.dirname(os.path.abspath(__file__))
    sys.path.insert(0, os.path.join(HERE, '..', '..', 'stage', 'audio'))
    import sound; sound.start(HERE); from sound import *

start(folder) reads <folder>/cues_edit.json (`node stage/render.mjs <folder> cues` writes it) and gives: DUR, CUE (name ->
seconds in the edit), c (c.pop21 = CUE['pop21']), CUTS (every picture cut and its kind) and two empty stereo buses,
`music` and `fx`. Never write a time by hand: everything is placed on a cue, so a re-cut only needs the mix run again.
Then the film's own part: put(music, t, sound, gain_db, pan) / put(fx, ...) for every piece of music and every action
(W('music_THEME') and W('sfx_cork') load the film's own recordings from audio/music and audio/sfx), and at the end:

    cut_sounds(skip=[c.hit1, ...])        a whoosh on every cut, a snap on every punch-in or jump back, a thud and air on
                                          every beat of black (not on cuts that are a hit or a stop themselves)
    captions(white=[('cue', seconds), ...], red=[...])      the marker scratching for every written line
    print(json.dumps(finish(), indent=1)) master (films -18 LUFS, -2 dBTP; a Short -16, -2.5), write the wav, and the report:
                                          loudness, sound events a second, the phone band second by second, and every
                                          stretch a phone would play as silence (there must be none)

The owner's rule (17 Nov 2026): "sound effects like that" = a sound on every cut, every written line and every action, and
the sound never drops out on a phone. Measure, don't guess: a phone speaker plays 300 Hz to 6 kHz only, so a sub boom or
an airy hiss alone is silence there; give every effect a part in that band (see slamhit, swish, liquid, hum, beat3).
Film 07's own mix.py still carries its own copy of these functions: it is the delivered film's record and is left as it is.
"""
import json, os, sys
STAGE_AUDIO = os.path.dirname(os.path.abspath(__file__)); REPO = os.path.abspath(os.path.join(STAGE_AUDIO, '..', '..'))
sys.path.insert(0, os.path.join(REPO, 'engine', 'audio'))          # mixlib.py: loading, loudness, the master, basic hits
import numpy as np
from mixlib import *

rngc = np.random.default_rng(11)             # its own dice for the cut sounds and the captions, so they stay the same from run to run
HERE = None; ED = {}; CUE = {}; CUTS = []; DUR = 0.0; c = None; music = None; fx = None; EV = []
impact = marker = zoom = whup = None          # four recordings the kit uses when a film has them (audio/sfx/*.mp3)


def W(name, folder=None): return src(folder or HERE, name)


def start(here, sfx_from=None, cues='cues_edit.json'):
    """here: the film's (or Short's) folder. sfx_from: the folder whose audio/sfx recordings the kit may use (default: here)"""
    global HERE, ED, CUE, CUTS, DUR, c, music, fx, impact, marker, zoom, whup
    HERE = here; ED = json.load(open(os.path.join(here, cues), encoding='utf8'))
    CUE, CUTS, DUR = ED['cues'], ED['cuts'], ED['END']
    c = type('Cues', (), {'__getattr__': lambda self, k: CUE[k]})()
    music = np.zeros((int(DUR * SR) + 2 * SR, 2)); fx = np.zeros((int(DUR * SR) + 2 * SR, 2)); EV.clear()
    f = sfx_from or here; has = lambda n: os.path.exists(os.path.join(f, 'audio', 'sfx', n + '.mp3'))
    impact = mono(W('sfx_impact', f)) if has('impact') else boom(2.0)                                        # a sub boom
    marker = mono(W('sfx_marker', f)) if has('marker') else _marker()                                        # 3 s of scratchy strokes
    zoom = nrm(mono(cut(W('sfx_zoom', f), .02, .3)), .5) if has('zoom') else nrm(swish(.28, 900, 6000, True), .5)   # a bright swish, peak .075 s
    whup = nrm(mono(cut(W('sfx_whoosh', f), 0, .16)), .5) if has('whoosh') else nrm(thump(180, .16, .6), .5)       # a short low "whup"


def _marker():                                   # a stand-in for the recorded marker: 3 s of scratchy strokes
    t = tsec(3.0); g = np.repeat(rngc.random(int(3.0 * 14) + 2), SR // 14 + 1)[:len(t)]
    return nrm(filt(rngc.standard_normal(len(t)), 'band', [1500, 9000]) * (.2 + g ** 2), .4)


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



# ---------- notes ----------
SEMI = {'C': 0, 'C#': 1, 'D': 2, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'Ab': 8, 'A': 9, 'Bb': 10, 'B': 11}
hz = lambda n: 440 * 2 ** ((SEMI[n[:-1]] + 12 * (int(n[-1]) + 1) - 69) / 12)


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


# ---------- small synthesized effects (mono) ----------
def clink(f=2350, d=.5):                         # glass
    t = tsec(d); return sum(np.sin(2 * np.pi * min(f * k, 20000) * t) * np.exp(-t * (9 + 6 * i)) / (1 + i) for i, k in enumerate((1, 2.3, 3.9))) * .3


def eyes(): return lay(mbox(hz('E7'), .35) * .8, after(.07, mbox(hz('B7'), .45)))       # its eyes: two tiny bright notes


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



def slow(x, r): return np.stack([varispeed(x[:, ch], r, r) for ch in (0, 1)], axis=1)     # a recording at r times its speed (.5: an octave down, twice as long)


def room(x, secs=1.3, wet=.22, tail=.3):         # a recording in a room, so its rests are never empty; the ring is cut `tail` s after its end
    y = np.stack([reverb(x[:, ch], secs, wet, 5000) for ch in (0, 1)], axis=1)[:len(x) + int(tail * SR)] / (1 - wet)
    return fade(y, .001, tail * .8)


def scratch(t, d, red=False, pan=0.0, g=0.0):    # a line writing itself: the recorded marker, slowed (slower and doubled for the red lines)
    r = .5 if red else .72; a = int(rngc.uniform(.1, 2.85 - d * r) * SR)
    y = vs(marker[a:a + int(d * r * SR) + 300], r)[:int(d * SR)]
    if red:
        b = int(rngc.uniform(.1, 2.85 - d * .62) * SR); y2 = vs(marker[b:b + int(d * .62 * SR) + 300], .62)[:len(y)]; y = lay(y, y2 * .8)
    y = lay(y, filt(y, 'band', [700, 4000]) * (1.6 if red else 1.0))
    put(fx, t, stereo(fade(nrm(y, .5 if red else .38), .008, .03), pan), g + (-7 if red else -9))


# ---------- every written line: the marker (white lines about 0.45 s, red ones about 0.8 s) ----------
def captions(white=(), red=()):
    """white / red: [(cue name or seconds, how long the line takes to write), ...]"""
    T = lambda v: CUE[v] if isinstance(v, str) else v
    for n, d in white: scratch(T(n), d, False, rngc.uniform(-.3, .3))
    for n, d in red: scratch(T(n), d, True, rngc.uniform(-.3, .3))


# ---------- every cut: a whoosh on a cut, a snap on a punch-in or a jump back, a thud and air on a beat of black. Each is
# set against what is playing round it (the phone band, 0.4 s either side), so it is heard but stays under the music ----------
band_ = lambda x: filt(filt(mono(x), 'high', 300, 4), 'low', 6000, 4)


def cut_sounds(skip=(), cuts=None, over=0.0):
    """skip: times (s) of cuts that are a hit or a stop themselves (and 0.0 is always skipped); cuts: default CUTS;
    over: dB added to every cut sound"""
    refm, reff = band_(music), band_(fx)

    def placed(t, parts, pan, ov, at):           # parts: (seconds before t, mono sound); its loudest 60 ms goes `ov` dB above the scene
        pre = max(p for p, _ in parts); x = lay(*[after(pre - p, y) for p, y in parts]); yb = band_(x); n = int(.06 * SR)
        loud = 10 * np.log10(max((yb[i:i + n] ** 2).mean() for i in range(0, max(1, len(yb) - n), n // 2)) + 1e-12)
        i0, i1 = max(0, int((at - .4) * SR)), int((at + .4) * SR); ref = 10 * np.log10((refm[i0:i1] ** 2).mean() + .25 * (reff[i0:i1] ** 2).mean() + 1e-12)
        put(fx, t - pre, stereo(x, pan), float(np.clip(ref, -34, -17)) + ov + over - loud, at=at)

    SKIP = [0.0] + list(skip); last_black = -9
    for i, x in enumerate(CUTS if cuts is None else cuts):
        t, kind = x['t'], x['kind']; pan = (.35 if i % 2 else -.35) * rngc.uniform(.5, 1)
        if kind == 'black':
            last_black = t; d = rngc.uniform(.26, .34)
            thud = lay(fade(impact[:int(.5 * SR)], .002, .3) * .5, nrm(vs(impact[:int(1.0 * SR)], rngc.uniform(4.5, 6.5)), .5), thump(rngc.uniform(240, 300), .1, .4) * .4)
            placed(t, [(0, thud), (d * .3, swish(d, 300, 1800, False) * .6)], pan * .3, 2, t)
        elif kind == 'end' or any(abs(t - q_) < .03 for q_ in SKIP) or t - last_black < .2: continue
        elif kind == 'cut':
            d = rngc.uniform(.26, .42)
            placed(t, [(d * .55, swish(d, rngc.uniform(400, 700), rngc.uniform(3000, 5200), rngc.random() < .6)), (.03, vs(whup, rngc.uniform(1.6, 2.6)) * .7)], pan, -2.5 + rngc.uniform(-1, 1), t)
        else:
            up = kind == 'punch'; d = rngc.uniform(.15, .22) if up else rngc.uniform(.2, .27); r = rngc.uniform(.5, .62) if up else rngc.uniform(.36, .46)
            placed(t, [(d * (.85 if up else .5), swish(d, 900 if up else 600, rngc.uniform(5000, 7000) if up else 4000, up) * .8), ((.075 - .02) / r, vs(zoom, r))], pan, -1 + rngc.uniform(-1, 1), t)


# ---------- the master and the report ----------
def _onset(mix, t, w=.15):
    """where the level (above 150 Hz, 2 ms frames) jumps near t: ms after the cue, and by how many dB"""
    m = filt(mono(mix), 'high', 150); n = int(.002 * SR); a = max(0, int((t - w) * SR)); s = m[a:int((t + w) * SR)]; k = len(s) // n
    e = 20 * np.log10(np.sqrt((s[:k * n].reshape(k, n) ** 2).mean(axis=1)) + 1e-5); es = np.convolve(e, np.ones(3) / 3, 'same')
    d = es[4:] - es[:-4]; i = int(d[2:-2].argmax()) + 2; pk = es[i:i + 20].max(); j = i
    while j < len(es) - 1 and es[j] < pk - 9: j += 1
    return {'ms_after_cue': int(round((a / SR + j * .002 - t) * 1000)), 'jump_db': round(float(d[i]), 1)}


def finish(path=None, target=-18.0, ceiling=-2.0, tail=1.0, until=None, keys=()):
    """master music + fx, fade the last `tail` seconds, write the wav (default <folder>/audio/mix.wav) and return the
    report. until: the time after which quiet is planned (the last picture fading out); default DUR - tail.
    keys: cue names of the film's big hits; the report says how many ms after its cue each one is heard (within 30)."""
    if os.environ.get('IDF_STEMS'):                 # for checking the balance: the two buses as they go into the master
        write(os.path.join(os.environ['IDF_STEMS'], 'music.wav'), music[:int(round(DUR * SR))] * .25); write(os.path.join(os.environ['IDF_STEMS'], 'fx.wav'), fx[:int(round(DUR * SR))] * .25)
    mix = master((music + fx)[:int(round(DUR * SR))], target, ceiling)
    end = int((DUR - tail) * SR); mix[end:] *= (np.linspace(1, 0, len(mix) - end) ** 1.5)[:, None]
    path = path or os.path.join(HERE, 'audio', 'mix.wav'); write(path, mix)
    until = DUR - tail if until is None else until
    phone = filt(filt(mix, 'high', 300, 4), 'low', 6000, 4)                                     # what a phone speaker keeps
    # the same measure as wojak-story/scripts/silence-check.py: the phone band in half-second steps, a full-scale sine reading 0 dB
    n5 = int(.5 * SR); pw = 10 * np.log10(2 * (mono(phone)[:len(mix) // n5 * n5].reshape(-1, n5) ** 2).mean(axis=1) + 1e-12)
    runs, i = [], 0
    while i < len(pw):
        j = i
        while j < len(pw) and pw[j] < -38: j += 1
        if j - i >= 2 and i * .5 < until: runs.append([i * .5, j * .5, round(float(pw[i:j].mean()), 1)])
        i = max(j, i + 1)
    sec = np.array([max(pw[i], pw[min(i + 1, len(pw) - 1)]) for i in range(0, len(pw), 2)])[:int(until) + 1]
    placed = sorted(t for t in EV if 0 <= t < DUR); made = [placed[0]] + [t for a, t in zip(placed, placed[1:]) if t - a > .1] if placed else []
    tens = range(0, int(DUR) + 1, 10)
    return {'wrote': os.path.relpath(path, REPO), 'seconds': round(len(mix) / SR, 3), 'loudness': report(mix),
            'key hits: ms after the cue, and the jump': {n: _onset(mix, CUE[n]) for n in keys},
            'sound events placed (merged within 0.1 s)': {'per 10 s': {'%d-%d s' % (a, min(a + 10, int(DUR))): int(sum(a <= t < a + 10 for t in made)) for a in tens}, 'a second': round(len(made) / max(1e-9, DUR), 2)},
            'phone band (300 Hz-6 kHz), dB per second': ' '.join('%d' % round(v) for v in sec),
            'phone band spread, 10th to 90th percentile of the seconds (dB)': round(float(np.percentile(sec, 90) - np.percentile(sec, 10)), 1),
            'stretches of 1 s or more under -38 dB in the phone band [from, to, dB] (must be empty)': runs}
