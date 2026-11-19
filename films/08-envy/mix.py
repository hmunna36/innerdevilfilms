"""ENVY | It Showed Him Everyone Else: the sound (music and effects, no voices). Every time comes from cues_edit.json
(`node stage/render.mjs films/08-envy cues` writes it); nothing here is a typed time. run: $PYTHON films/08-envy/mix.py

The devil's music is a sly TANGO (A minor-ish, a strong beat every 1.0 s): it arrives with its window and runs under the
rounds; HEAVY, the same tango huge, is the worst; DREAD is one crushing hit. His own music is WORK, a small warm piano
figure: the floor, the night before the window, the hug at Max's show, the moment the two of him look at each other and
the pencil crosses the tear. RISE, the comeback, starts on the first frame after the turn's black, stops dead when he
slips at 40 (the tango creeps back) and comes back on the frame he turns the window face down. ENDING from the merge.
The motif is the window's own shimmer (recorded): a bigger, lower ring every time the window grows; backwards when it
is slammed shut. A sound on every cut (cut_sounds), every written line (captions) and every action.

Measured (19 Nov 2026, audio/measure.py and the envelopes):
  TANGO 36.0 s (sound to 32.8), strong beats every 1.0 s from 0.03 (the habanera's accent), big accents 8.03 16.03 22.03
    26.03 32.03; 77 % of it under 150 Hz and only 11 % in the phone band (300 Hz-6 kHz): it is brightened (+9 dB 300-5k).
  HEAVY 16.0 s, a hit every 1.0 s from 0.02, 45 % phone band. DREAD 10.0 s: ONE colossal hit at 0.02, 94 % under 150 Hz
    (3 % phone): always with a made mid hit on top. WORK 20.0 s, C major, its first chord at 0.02, notes 5.96 7.03 7.53
    10.03 14.03 16.04, 44 % phone. RISE 30.0 s, C major, accents at 0.02 1.52 3.03 9.03 12.03 15.03 (a grid of 1.5 s),
    level flat (-13 dB) to 29.6 s, 20 % phone: brightened (+6 dB). ENDING 18.0 s, C major, first chord 0.02, 56 % phone.
  Effects: window (the motif) a shimmer from 0, gone by 1.0 s, 39 % phone; crumple 1.0 s; tear 1.4 s (its loud rip from
    0.73); munch chomps at 0.06 0.37 0.58; pencil 3 s of strokes (21 % phone: played slower); slide 0.9 s; applause
    3.5 s (98 % phone); keys a jingle (4 % phone: a layer only); slam a 0.05 s click (weak: a made thump and crack carry
    it); impact a pure sub (100 % under 150 Hz); marker, zoom, whoosh, bloop as in film 07."""
import os, sys, json
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'stage', 'audio'))
import sound; sound.start(HERE); from sound import *

def brighten(x, gain_db, lo=300, hi=5000):          # a recording with its phone band lifted (parallel EQ), so a phone plays it
    b = np.stack([filt(filt(x[:, ch], 'high', lo, 2), 'low', hi, 2) for ch in (0, 1)], axis=1)
    return x + b * (db(gain_db) - 1)
def seg_(name, a, b): return cut(W(name), a, b)
def at_beat(x, first_beat, t): return t - first_beat     # where to put a recording so that its beat at `first_beat` lands on t

TANGO = brighten(W('music_TANGO'), 9); HEAVY = brighten(W('music_HEAVY'), 3); DREAD = W('music_DREAD'); WORK = W('music_WORK')
RISE = brighten(W('music_RISE'), 6); ENDING = W('music_ENDING')
win = mono(W('sfx_window')); crum = mono(W('sfx_crumple')); tearS = mono(W('sfx_tear')); munch = mono(W('sfx_munch')); pen = mono(W('sfx_pencil'))
slideS = mono(W('sfx_slide')); clap = mono(W('sfx_applause')); keys = mono(W('sfx_keys')); slamS = mono(W('sfx_slam')); bloop = mono(W('sfx_bloop'))

def motif(t, size=1.0, g=-4, rev=False, pan=0.0):   # the window's shimmer: bigger and lower each time it grows (size 1 .. 2.2)
    r = 1 / size; y = vs(win[:int(1.2 * SR)], r); y = y[::-1] if rev else y
    y = lay(y, filt(y, 'band', [500, 3000]) * .6)
    put(fx, t - (len(y) / SR if rev else .0), stereo(fade(nrm(y, .5), .005, .08), pan), g, at=t)
    put(fx, t, stereo(lay(mbox(hz('E6') / size, 1.2) * .8, mbox(hz('B6') / size, 1.0) * .5), pan), g - 4)
def tick_(t, g=-12): put(fx, t, stereo(lay(tock(True), click(.01, 2600) * .4)), g)
def counter_tick(t, down=False, g=-10): put(fx, t, stereo(lay(tock(not down), mbox(hz('A5' if down else 'E6'), .4) * .6)), g)
def knock3(t, g=-6): [put(fx, t + i * .22, stereo(lay(thump(160, .12, .5), click(.012, 900) * .6)), g) for i in range(3)]
def handclap(t, g=-6): tt = tsec(.12); put(fx, t, stereo(nrm(filt(rngc.standard_normal(len(tt)), 'band', [900, 4500]) * np.exp(-tt * 40), .5)), g)
def screech(t, d=.9, g=-6):                          # the devil's shriek (no voice): a metal screech rising and tearing
    tt = tsec(d); f = 700 + 900 * (tt / d) ** .7; y = np.sin(2 * np.pi * np.cumsum(f * (1 + .04 * np.sin(2 * np.pi * 31 * tt))) / SR)
    y = np.tanh(3 * (y + .4 * np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR))) * np.sin(np.pi * tt / d) ** .5
    put(fx, t, stereo(fade(nrm(filt(y, 'band', [400, 5000]), .5), .01, .2)), g)
def room_bed(t0, t1, g=-24):                         # a room so the drops are never silence on a phone: a hum and a slow clock
    put(fx, t0, stereo(fade(hum(t1 - t0), .2, .3)), g)
    k = t0 + .25
    while k < t1 - .1: put(fx, k, stereo(tock(int((k - t0) * 2) % 2 == 0)), g + 8); k += .5

# ---------------- the hook ----------------
put(music, c.hk1, ride_db(cut(HEAVY, 0, 1.45), c.hk1, [(c.hk1, 0), (c.hk2 - .05, -2), (c.hk2, -30)]), -1)          # its first hit (0.02) is the first frame
put(fx, c.hkSame, stereo(nrm(lay(impact[:int(1.5 * SR)] * .7, slamhit()), .6)), -2, at=c.hkSame)
put(fx, c.hk2 - .02, stereo(nrm(DREAD[:int(3 * SR), 0], .6)), -6); put(fx, c.hk2, stereo(slamhit()), -8, at=c.hk2)
put(fx, c.hk2 + .1, stereo(riser(c.hk3 - c.hk2 - .1, 220, 900, 1.6)), -10); beat3(c.hk2 + .3, -6); beat3(c.hk2 + .9, -6)
motif(c.hk3 + .05, 1.4, -2); put(fx, c.hkLook, stereo(slamhit()), -8, at=c.hkLook)
put(music, c.hk3, ride_db(cut(TANGO, 16.0, 16.0 + c.floor - c.hk3), c.hk3, [(c.hk3, -6), (c.floor - .1, -6), (c.floor, -40)]), 0)

# ---------------- together, and the night: WORK (his own music) ----------------
work_end = c.winTurn
put(music, c.floor, ride_db(cut(WORK, 0, work_end - c.floor + .4), c.floor, [(c.floor, -1), (c.winIn, -3), (work_end - .05, -6), (work_end + .35, -40)]), 0)
for k in range(6): put(fx, c.drawM + k * .38, stereo(fade(vs(pen[int(k * .4 * SR):int((k * .4 + .45) * SR)], .7), .01, .05), -.3), -14)
handclap(c.five, -3); put(fx, c.five, stereo(lay(mbox(hz('G6'), .5), mbox(hz('C7'), .6) * .7)), -10)
put(fx, c.laugh, stereo(lay(mbox(hz('E6'), .4), after(.12, mbox(hz('G6'), .4)))), -14)
counter_tick(c.count30, False, -12)
for k in range(4): put(fx, c.night + .3 + k * .42, stereo(fade(vs(pen[int((1 + k * .4) * SR):int((1.45 + k * .4) * SR)], .7), .01, .05), .2), -15)
put(fx, c.glowOn, stereo(fade(nrm(lay(filt(rngc.standard_normal(int(1.2 * SR)), 'band', [800, 3000]) * np.linspace(0, 1, int(1.2 * SR)) * .3, mbox(hz('Eb6'), 1.2) * .5), .4), .3, .2), -.6), -14)
put(fx, c.winIn - .25, stereo(swish(.35, 400, 3000, True), -.6), -10, at=c.winIn); motif(c.winIn + .05, 1.0, -6, pan=-.4)
put(fx, c.winTurn - .1, stereo(swish(.2, 900, 6000, True)), -10); put(fx, c.winTurn, stereo(lay(mbox(hz('A6'), .6), click(.01, 3000) * .4)), -8, at=c.winTurn)
for k in range(5): put(fx, c.hearts + k * .19, stereo(vs(bloop, 1.2 + .15 * k), .3), -16)
put(fx, c.devLean, stereo(lay(fade(filt(rngc.standard_normal(int(.6 * SR)), 'band', [200, 1500]) * np.sin(np.pi * np.arange(int(.6 * SR)) / (.6 * SR)) * .3, .01, .1), thump(70, .4, .4) * .5)), -10, at=c.devLean)
put(fx, c.smileGone, stereo(mbox(hz('E4'), 1.2) * 1.4), -10, at=c.smileGone)

# ---------------- the tango: from the window to the card ----------------
t0 = at_beat(TANGO, 8.03, c.winTurn)                  # its first big accent lands on the window turning to him
tango_end = c.showR
tg = cut(TANGO, c.winTurn - t0 - .15, 32.9)            # starts a beat before, swells in
pts = [(c.winTurn - .15, -14), (c.winTurn, -3), (c.tear - .05, -3), (c.tear, -18), (c.slideEnd, -18), (c.slideEnd + .3, -4), (c.card, -5), (c.cardIn + .3, -9), (tango_end - .05, -9), (tango_end + .2, -40)]
# round 2: the tango dips under every cut to the right half (his work), comes back on the left
for x in CUTS:
    if x['shot'] == 'work': pts += [(x['t'] - .02, -3), (x['t'] + .05, -11)]
    elif x['shot'] == 'medal' and x['t'] > c.medal + .1: pts += [(x['t'] - .02, -11), (x['t'] + .05, -3)]
pts.sort()
put(music, c.winTurn - .15, ride_db(tg, c.winTurn - .15, pts), 0)
# round 1
put(fx, c.eyeWin, stereo(mbox(hz('B5'), .5)), -16); put(fx, c.crush, stereo(nrm(lay(crum, filt(crum, 'band', [600, 3000])), .5)), -4, at=c.crush)
put(fx, c.toss - .15, stereo(swish(.25, 700, 4000, True), .3), -12); put(fx, c.catch, stereo(lay(click(.02, 1500), thump(300, .06, .3))), -8, at=c.catch)
put(fx, c.munch, stereo(nrm(munch, .5)), -3, at=c.munch); put(fx, c.gulp, stereo(lay(thump(140, .25, .7), vs(bloop, .6))), -6, at=c.gulp)
counter_tick(c.count29, True, -8)
dip(c.grow1, -6); motif(c.grow1, 1.35, -3, pan=-.3); put(fx, c.grow1, stereo(lay(vs(bloop, .7), thump(90, .3, .6))), -6)
put(fx, c.reach1, stereo(swish(.3, 600, 4000, True), -.3), -12); put(fx, c.cap1, stereo(lay(vs(bloop, 1.1), click(.01, 2000) * .4)), -8, at=c.cap1)
put(fx, c.capOn, stereo(lay(thump(240, .08, .3), mbox(hz('A5'), .5) * .6)), -9, at=c.capOn)
# the split
put(fx, c.prop, stereo(lay(tap(), thump(200, .1, .4) * .5)), -8, at=c.prop)
put(fx, c.dark, stereo(swish(.5, 300, 1500, False), -.4), -12, at=c.dark)
put(fx, c.tear - .02, stereo(nrm(lay(cut(tearS, .80, 1.48), filt(cut(tearS, .80, 1.48), 'band', [700, 4000]) * .8), .6)), 0, at=c.tear)
put(fx, c.tear, stereo(impact[:int(1.0 * SR)] * .5), -6); room_bed(c.tear, c.slideEnd + .2, -22)
put(fx, c.slide, stereo(lay(swish(.6, 300, 2500, True) * .8, after(.05, swish(.5, 300, 2500, False) * .8))), -8, at=c.slide)
put(fx, c.slideEnd, stereo(lay(mbox(hz('E5'), .9), mbox(hz('E6'), .9) * .5)), -8)
put(fx, c.lean, stereo(lay(thump(120, .2, .3), breath(.5) * 2)), -10, at=c.lean)
put(fx, c.grinL, stereo(lay(filt(lay(*[np.sin(2 * np.pi * f * tsec(.7)) for f in (hz('A2'), hz('E3'), hz('Bb3'))]), 'low', 1400) * np.exp(-tsec(.7) * 3) * .3, click(.01, 800) * .3)), -6, at=c.grinL)
put(fx, c.clack, stereo(lay(thump(180, .12, .6), click(.015, 1200), filt(slamS, 'high', 300))), -4, at=c.clack)
# round 2
motif(c.win2, 1.7, -3, pan=-.4); put(fx, c.win2, stereo(thump(80, .5, .6)), -8)
put(fx, c.rip - .7, stereo(nrm(lay(tearS, filt(tearS, 'band', [700, 4000]) * .8), .6), -.3), -1, at=c.rip)
put(fx, c.munch2, stereo(nrm(munch, .5)), -3, at=c.munch2); put(fx, c.munch2 + .5, stereo(lay(thump(130, .25, .7), vs(bloop, .55))), -6)
put(fx, c.pluck, stereo(lay(vs(bloop, 1.4), click(.01, 2500) * .5)), -8, at=c.pluck)
put(fx, c.crunch, stereo(nrm(lay(vs(munch, 1.6), crackle(.25, 12, 2000)), .5)), -4, at=c.crunch)
put(fx, c.medalTake, stereo(mbox(hz('C7'), .6)), -12); put(fx, c.medalOn, stereo(lay(clink(3200, .4), keys[:int(.4 * SR)] * .5)), -8, at=c.medalOn)
put(fx, c.lampOff, stereo(lay(click(.012, 1800), thump(70, .5, .5) * .7, mbox(hz('E3'), 1.0) * .8)), -6, at=c.lampOff)
counter_tick(c.rip + .05, True, -8)
for x in CUTS:                                       # the right half: the pencil working on every cut to it
    if x['shot'] == 'work':
        for k in range(3): put(fx, x['t'] + .05 + k * .3, stereo(fade(vs(pen[int((.2 + k * .5) * SR):int((.6 + k * .5) * SR)], .7), .01, .05), .4), -13)
put(fx, c.rub, stereo(fade(filt(rngc.standard_normal(int(.5 * SR)), 'band', [500, 3000]) * (.5 + .5 * np.sign(np.sin(2 * np.pi * 12 * tsec(.5)))) * .25, .02, .05), .4), -10, at=c.rub)
put(fx, c.pin, stereo(lay(thump(500, .04, .3), click(.01, 2400))), -8, at=c.pin)
put(fx, c.glance, stereo(mbox(hz('Eb6'), .8) * .7, .4), -14)
# the card
put(fx, c.cardIn - .1, stereo(nrm(lay(slideS, filt(slideS, 'band', [500, 4000])), .5)), -5, at=c.cardIn)
put(fx, c.grinR, stereo(lay(mbox(hz('C6'), .5), after(.1, mbox(hz('E6'), .5)), after(.2, mbox(hz('G6'), .7)))), -10, at=c.grinR)
for k in range(4): put(fx, c.runR + k * .2, stereo(step(.8), .5), -8)
put(fx, c.devRead, stereo(lay(mbox(hz('A4'), .9) * .8, mbox(hz('Bb4'), .9) * .6)), -10, at=c.devRead)

# ---------------- Max's show ----------------
put(music, c.showR, ride_db(cut(WORK, 7.45, 7.45 + c.showL - c.showR + .3), c.showR, [(c.showR, -2), (c.showL - .05, -2), (c.showL + .25, -40)]), 0)
put(fx, c.cheer - .1, stereo(nrm(lay(clap, filt(clap, 'band', [600, 4000])), .5)), -6, at=c.cheer)
put(fx, c.hugR, stereo(lay(mbox(hz('G5'), 1.0), mbox(hz('C6'), 1.0) * .7, mbox(hz('E6'), 1.0) * .5)), -8, at=c.hugR)
t1 = c.showL
put(music, t1, ride_db(cut(TANGO, 22.0, 22.0 + c.worst - t1), t1, [(t1, -6), (c.friends, -6), (c.turnAway, -9), (c.turnAway + .3, -40)]), 0)
put(fx, t1, stereo(fade(cut(clap, .2, 3.4), .1, .5)), -16)
put(fx, c.see, stereo(mbox(hz('E6'), .5)), -12); for_ = None
put(fx, c.wave, stereo(lay(mbox(hz('G6'), .4), after(.15, mbox(hz('G6'), .4)))), -14)
put(fx, c.turnAway, stereo(lay(thump(90, .5, .6), mbox(hz('D4'), 1.4) * .9)), -6, at=c.turnAway)
room_bed(c.turnAway, c.worst, -20)
for k in range(5): put(fx, c.out + k * .3, stereo(step(.7), -.5), -11)
put(fx, c.fall, stereo(lay(mbox(hz('A3'), 2.0) * 1.2, mbox(hz('C4'), 2.0) * .8, mbox(hz('E4'), 2.0) * .6)), -6, at=c.fall)

# ---------------- the worst: HEAVY; DREAD on his own monster ----------------
put(music, c.worst, ride_db(cut(HEAVY, 0, c.thud - c.worst + .05), c.worst, [(c.worst, -1), (c.amazing2 - .1, -2), (c.amazing2, 0), (c.cover, -3), (c.wide, -5), (c.wrench, -2), (c.thud - .02, -2), (c.thud, -40)]), 0)
put(fx, c.worst, stereo(nrm(lay(impact[:int(1.5 * SR)] * .6, slamhit() * .8), .6)), -4, at=c.worst)
put(fx, c.claws, stereo(lay(scrape(.4), crackle(.2, 6, 1800))), -10, at=c.claws)
motif(c.winWall, 2.2, -1, pan=-.2)
put(fx, c.amazing2 - .02, stereo(nrm(DREAD[:int(4 * SR), 0], .7)), -2); put(fx, c.amazing2, stereo(slamhit()), -3, at=c.amazing2)
put(fx, c.coverIn - .6, stereo(riser(.6, 300, 1500, 2.2)), -8)
put(fx, c.coverIn + .35, stereo(lay(mbox(hz('A5'), 1.2), mbox(hz('E6'), 1.2) * .7, mbox(hz('A6'), 1.2) * .5)), -6, at=c.coverIn + .35)
put(fx, c.eyesWide, stereo(lay(filt(lay(*[np.sin(2 * np.pi * f * tsec(1.2)) for f in (hz('D5'), hz('Eb5'), hz('A5'))]), 'low', 4000) * np.exp(-tsec(1.2) * 2) * .35, impact[:int(.8 * SR)] * .6)), -4, at=c.eyesWide)
beat3(c.eyesWide + .45, -6)
# the wrench and the fall
put(fx, c.pull1, stereo(lay(bump(), swish(.2, 500, 2500))), -6, at=c.pull1); put(fx, c.pull2, stereo(lay(bump(), swish(.2, 500, 2500, False))), -6, at=c.pull2)
put(fx, c.slip, stereo(lay(scrape(.35), crackle(.2, 8, 2200))), -6, at=c.slip)
put(fx, c.fallBack, stereo(swish(.3, 300, 2000, False)), -8)
put(fx, c.thud, stereo(nrm(lay(bump(), creak(.25), impact[:int(1.0 * SR)] * .5, crack()), .6)), -2, at=c.thud)

# ---------------- the turn: the room, then WORK when their eyes meet ----------------
room_bed(c.thud + .05, c.slamDown, -21)
beat3(c.thud + .5, -7); beat3(c.thud + 1.4, -8)
put(fx, c.turnHead, stereo(swish(.25, 600, 3000, True)), -12)
put(music, c.meet - .02, ride_db(cut(WORK, 0, c.slamDown - c.meet + .1), c.meet - .02, [(c.meet, -2), (c.slamDown - .3, -4), (c.slamDown - .02, -6), (c.slamDown, -40)]), 0)
put(fx, c.reach, stereo(swish(.35, 400, 2500, True)), -12, at=c.reach)
put(fx, c.give, stereo(lay(click(.01, 2000), thump(400, .04, .2))), -12, at=c.give)
put(fx, c.take, stereo(lay(mbox(hz('C6'), 1.0), mbox(hz('G6'), 1.0) * .6, click(.01, 2400) * .5)), -6, at=c.take)
put(fx, c.rise, stereo(swish(.4, 300, 2000, True)), -12, at=c.rise)
dip(c.slamDown, -10, .2)
put(fx, c.slamDown, stereo(nrm(lay(impact[:int(1.6 * SR)] * .8, slamhit(), filt(slamS, 'high', 300), crack(), shatter(.3, 8) * .5), .6)), 0, at=c.slamDown)
motif(c.slamDown, 1.8, -6, rev=True)
screech(c.shriek, .9, -5)
put(fx, c.medalFall, stereo(swish(.3, 800, 4000, False)), -12)
put(fx, c.medalClink, stereo(lay(clink(3400, .5), after(.12, clink(2900, .4) * .6), keys[:int(.5 * SR)] * .4)), -6, at=c.medalClink)
room_bed(c.slamDown + .1, c.page1, -20)

# ---------------- one page a day: RISE on the first frame ----------------
r_end = c.jump
put(music, c.page1, ride_db(cut(RISE, 0, r_end - c.page1 + .05), c.page1, [(c.page1, -1), (c.win3, -4), (c.down2 + .2, -2), (r_end - .02, -2), (r_end, -40)]), 0)
put(fx, c.page1, stereo(nrm(lay(impact[:int(1.2 * SR)] * .6, slamhit() * .5), .5)), -6, at=c.page1)
put(fx, c.page1 + .05, stereo(lay(click(.012, 1800), mbox(hz('C6'), .6) * .6)), -10)      # his lamp back on
counter_tick(c.count1, False, -8)
for k in range(5): put(fx, c.count1 + .25 + k * .35, stereo(fade(vs(pen[int((.1 + k * .45) * SR):int((.5 + k * .45) * SR)], .7), .01, .05), -.2), -14)
motif(c.win3, .9, -10, pan=-.4)
put(fx, c.down2, stereo(lay(thump(200, .1, .5), click(.012, 1300), filt(slamS, 'high', 300) * .6)), -6, at=c.down2)
counter_tick(c.count40, False, -8)
# the slip: RISE dies on the jump, the tango creeps back, the counter is stuck
dip(c.jump, -12, .1); motif(c.jump, 1.7, -2, pan=-.4); put(fx, c.jump, stereo(lay(vs(bloop, .6), thump(80, .4, .7))), -4, at=c.jump)
put(music, c.jump, ride_db(slow(cut(TANGO, 8.0, 8.0 + (c.down3 - c.jump) * .88), .88), c.jump, [(c.jump, -4), (c.stuck, -6), (c.board40, -10), (c.down3 - .02, -12), (c.down3, -40)]), 0)
put(fx, c.arms, stereo(lay(swish(.4, 300, 1500, False), thump(100, .3, .4) * .5)), -10, at=c.arms)
for k in range(int((c.board40 - c.stuck) / .5) + 1): put(fx, c.stuck + k * .5, stereo(tock(k % 2 == 0)), -10)
beat3(c.stuck + .2, -6); beat3(c.stuck + .95, -7)
put(fx, c.boardSee, stereo(lay(mbox(hz('C6'), 1.4), mbox(hz('E6'), 1.4) * .6)), -8, at=c.boardSee)
put(fx, c.board40, stereo(fade(pad([hz('C4'), hz('G4'), hz('E5')], c.down40 - c.board40 + .2, .3, .2), .01, .1)), -10)
# out of it: the window face down, RISE comes back on that frame (on its own accent at 12.03)
put(fx, c.down3, stereo(nrm(lay(thump(180, .14, .7), click(.015, 1200), filt(slamS, 'high', 300), impact[:int(.6 * SR)] * .5), .5)), -3, at=c.down3)
r2 = at_beat(RISE, 12.03, c.down3)
put(music, c.down3 - .02, ride_db(cut(RISE, c.down3 - .02 - r2, c.down3 - .02 - r2 + c.one - c.down3 + .5), c.down3 - .02, [(c.down3, -1), (c.door, -3), (c.read, -5), (c.hug2, -2), (c.stitch, -1), (c.one - .05, 0), (c.one + .4, -40)]), 0)
counter_tick(c.count41, False, -8)
# Max's door
counter_tick(c.count120b, False, -10); knock3(c.knock, -4)
put(fx, c.open, stereo(lay(creak(.5) * .8, swish(.3, 300, 1200, False) * .5)), -6, at=c.open)
put(fx, c.hold, stereo(rustle(.35)), -8, at=c.hold); put(fx, c.read, stereo(rustle(.4)), -9)
put(fx, c.laughM, stereo(lay(mbox(hz('E6'), .4), after(.12, mbox(hz('G6'), .4)), after(.24, mbox(hz('C7'), .6)))), -10, at=c.laughM)
put(fx, c.hug2, stereo(lay(mbox(hz('C5'), 1.2), mbox(hz('G5'), 1.2) * .7, mbox(hz('E6'), 1.2) * .6)), -6, at=c.hug2)
put(fx, c.capFall, stereo(lay(thump(260, .07, .3), vs(bloop, .8) * .7)), -8, at=c.capFall)
# the stitch: the counter rolls up, the tear is sewn shut, the two of him become one
n = 18
for k in range(n): u = k / (n - 1); put(fx, c.count300 + (c.countDone - c.count300) * (u ** .8), stereo(tock(k % 2 == 0)), -13)
put(fx, c.countDone, stereo(lay(mbox(hz('C6'), 1.0), mbox(hz('G6'), 1.0) * .7)), -6, at=c.countDone)
for k in range(10): put(fx, c.sew + (c.sewEnd - c.sew) * k / 10, stereo(swish(.12, 1500, 6000, k % 2 == 0), (-1) ** k * .3), -12)
put(fx, c.sewEnd - .3, stereo(riser(.5, 400, 1600, 1.5)), -10)
put(fx, c.one, stereo(nrm(lay(impact[:int(1.4 * SR)] * .6, slamhit() * .6, mbox(hz('C6'), 1.6) * .8, mbox(hz('E6'), 1.6) * .6, mbox(hz('G6'), 1.6) * .5), .6)), -2, at=c.one)

# ---------------- the last picture and the title: ENDING ----------------
put(music, c.one, ride_db(cut(ENDING, 0, c.titleIn - c.one + 2.8), c.one, [(c.one, -40), (c.one + .3, -4), (c.ahead, -7), (c.good, -4), (c.tap, -6), (c.dark2, -6), (c.titleIn, -5), (DUR, -14)]), 0)
motif(c.stamp, .7, -14, pan=-.3)
put(fx, c.smile, stereo(mbox(hz('E6'), .5)), -14)
put(fx, c.good + .4, stereo(lay(mbox(hz('C5'), 1.4), mbox(hz('E5'), 1.4) * .7, mbox(hz('G5'), 1.4) * .6)), -8, at=c.good)
put(fx, c.tap, stereo(lay(tap(), click(.01, 3200) * .4)), -4, at=c.tap); motif(c.tap + .02, .7, -12, rev=True, pan=-.3)
put(fx, c.dark2, stereo(click(.012, 1800)), -12, at=c.dark2)
put(fx, c.titleIn, stereo(nrm(lay(impact[:int(1.6 * SR)] * .7, slamhit() * .5), .5)), -6, at=c.titleIn)
for k, nn in enumerate(['A5', 'C6', 'E6', 'D#6']): put(fx, c.titleIn + .55 + k * .25, stereo(mbox(hz(nn.replace('#', '')) if '#' not in nn else hz('Eb6'), .8) * .8), -12)

# ---------------- every cut, every written line ----------------
cut_sounds(skip=[c.hk2, c.hk3, c.worst, c.page1, c.cover, c.one])
captions(white=[('capTogether', .55), ('hkWhy', .45), ('never', .7), ('onePage', .5), ('good', .55)],
         red=[('amazing', .85), ('fourteen', .8), ('friends', .8), ('years', .75), ('oneLook', .65), ('ahead', .8), ('hkLook', .3)])
put(fx, c.hkSame, stereo(slamhit()), -6)
print(json.dumps(finish(keys=['tear', 'clack', 'amazing2', 'thud', 'slamDown', 'jump', 'down3', 'one', 'tap']), indent=1))
