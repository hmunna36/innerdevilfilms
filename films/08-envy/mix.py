"""ENVY | It Showed Him Everyone Else, version 2 (22 Nov 2026: one boy, a dramatic score; the owner found the tango "very bad"): the sound (music and effects, no voices). Every time comes from cues_edit.json
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

DREAD = W('music_DREAD'); ENDING = W('music_ENDING')
# version 2's score, measured 22 Nov 2026: DARK 40 s, D minor-ish, builds from very quiet (-28 dB, phone -45) to full at
#   21 s (-17), ends 38 s: brightened +10 dB. TENDER 14 s, piano, first note 0.02, ends 13.2. SORROW 18 s, strings from
#   0.2, a swell peaking at 9.0 s, gone by 14. EPIC 32 s: a quiet piano build to 19 s, a near-silent breath at 19-20,
#   the full orchestra from 21.0 to the end.
DARK = brighten(W('music_DARK'), 10); TENDER = W('music_TENDER'); SORROW = brighten(W('music_SORROW'), 4); EPIC = brighten(W('music_EPIC'), 3)
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

# ---------------- the hook: DARK at full, DREAD's hit on the first frame ----------------
put(music, 0, ride_db(cut(DARK, 21.0, 21.0 + c.floor), 0, [(0, -2), (c.floor - .4, -4), (c.floor, -40)]), 0)
put(fx, 0, stereo(nrm(DREAD[:int(3 * SR), 0], .7)), -3); put(fx, c.hkSame, stereo(slamhit()), -4, at=c.hkSame)
put(fx, c.hk2, stereo(slamhit()), -9, at=c.hk2); beat3(c.hk2 + .3, -6); beat3(c.hk2 + .95, -7)
motif(c.hk3 + .05, 1.4, -2); put(fx, c.hkLook, stereo(slamhit()), -7, at=c.hkLook)

# ---------------- two friends: TENDER ----------------
put(music, c.floor, ride_db(cut(TENDER, 0, c.winTurn - c.floor + .5), c.floor, [(c.floor, -2), (c.glowOn, -5), (c.winTurn - .1, -8), (c.winTurn + .4, -40)]), 0)
for k in range(6): put(fx, c.drawM + k * .38, stereo(fade(vs(pen[int(k * .4 * SR):int((k * .4 + .45) * SR)], .7), .01, .05), -.3), -14)
handclap(c.five, -3); put(fx, c.five, stereo(lay(mbox(hz('G6'), .5), mbox(hz('C7'), .6) * .7)), -10)
counter_tick(c.count30, False, -12)
for k in range(4): put(fx, c.night + .3 + k * .42, stereo(fade(vs(pen[int((1 + k * .4) * SR):int((1.45 + k * .4) * SR)], .7), .01, .05), .2), -15)
put(fx, c.glowOn, stereo(fade(nrm(lay(filt(rngc.standard_normal(int(1.2 * SR)), 'band', [800, 3000]) * np.linspace(0, 1, int(1.2 * SR)) * .3, mbox(hz('Eb6'), 1.2) * .5), .4), .3, .2), -.6), -14)
put(fx, c.winIn - .25, stereo(swish(.35, 400, 3000, True), -.6), -10, at=c.winIn); motif(c.winIn + .05, 1.0, -6, pan=-.4)
put(fx, c.winTurn, stereo(lay(mbox(hz('A6'), .6), click(.01, 3000) * .4)), -8, at=c.winTurn)
for k in range(5): put(fx, c.hearts + k * .19, stereo(vs(bloop, 1.2 + .15 * k), .3), -16)
put(fx, c.devLean, stereo(thump(70, .4, .4)), -10, at=c.devLean)
put(fx, c.smileGone, stereo(mbox(hz('D4'), 1.2) * 1.4), -10, at=c.smileGone)

# ---------------- the devil's rounds: DARK from its quiet start, building ----------------
put(music, c.winTurn, ride_db(cut(DARK, 0, c.turnAway - c.winTurn + .4), c.winTurn, [(c.winTurn, 2), (c.medal, 0), (c.card, -2), (c.turnAway - .05, -3), (c.turnAway + .3, -40)]), 0)
put(fx, c.crush, stereo(nrm(lay(crum, filt(crum, 'band', [600, 3000])), .5)), -4, at=c.crush)
put(fx, c.toss - .15, stereo(swish(.25, 700, 4000, True), .3), -12); put(fx, c.catch, stereo(click(.02, 1500)), -8, at=c.catch)
put(fx, c.munch, stereo(nrm(munch, .5)), -3, at=c.munch); put(fx, c.gulp, stereo(lay(thump(140, .25, .7), vs(bloop, .6))), -6, at=c.gulp)
counter_tick(c.count29, True, -8)
dip(c.grow1, -6); motif(c.grow1, 1.35, -3, pan=-.3); put(fx, c.grow1, stereo(thump(90, .3, .6)), -6)
put(fx, c.cap1, stereo(vs(bloop, 1.1)), -8, at=c.cap1); put(fx, c.capOn, stereo(lay(thump(240, .08, .3), mbox(hz('A5'), .5) * .6)), -9, at=c.capOn)
motif(c.win2, 1.7, -3, pan=-.4); put(fx, c.win2, stereo(thump(80, .5, .6)), -8)
put(fx, c.rip - .7, stereo(nrm(lay(tearS, filt(tearS, 'band', [700, 4000]) * .8), .6), -.3), -1, at=c.rip)
put(fx, c.rip, stereo(nrm(DREAD[:int(2 * SR), 0], .5)), -8)
put(fx, c.munch2, stereo(nrm(munch, .5)), -3, at=c.munch2); counter_tick(c.rip + .05, True, -8)
put(fx, c.medalOn, stereo(lay(clink(3200, .4), keys[:int(.4 * SR)] * .5)), -8, at=c.medalOn)
put(fx, c.lampOff, stereo(lay(click(.012, 1800), thump(70, .5, .5) * .7, mbox(hz('D3'), 1.0) * .8)), -6, at=c.lampOff)
put(fx, c.cardIn - .1, stereo(nrm(lay(slideS, filt(slideS, 'band', [500, 4000])), .5)), -5, at=c.cardIn)
put(fx, c.devRead, stereo(lay(mbox(hz('A4'), .9) * .8, mbox(hz('Bb4'), .9) * .6)), -10, at=c.devRead)
put(fx, c.showL, stereo(fade(cut(clap, .2, 3.4), .1, .5)), -14)
put(fx, c.see, stereo(mbox(hz('E6'), .5)), -12); put(fx, c.wave, stereo(mbox(hz('G6'), .4)), -14)
put(fx, c.turnAway, stereo(thump(90, .5, .6)), -6, at=c.turnAway)
for k in range(5): put(fx, c.out + k * .3, stereo(step(.7), -.5), -11)

# ---------------- he walks out: SORROW, its swell on Max's face ----------------
s0 = c.fall - 9.0
put(music, c.turnAway, ride_db(cut(SORROW, c.turnAway - s0, 14.5), c.turnAway, [(c.turnAway, -2), (c.worst - .3, -4), (c.worst, -40)]), 0)
room_bed(c.turnAway, c.worst, -22)

# ---------------- the worst: DARK at full; DREAD on its line ----------------
put(music, c.worst, ride_db(cut(DARK, 21.0, 21.0 + c.cover - c.worst + .3), c.worst, [(c.worst, 0), (c.cover - .05, 0), (c.cover + .25, -40)]), 0)
put(fx, c.worst, stereo(nrm(lay(impact[:int(1.5 * SR)] * .6, slamhit() * .8), .6)), -4, at=c.worst)
put(fx, c.claws, stereo(lay(scrape(.4), crackle(.2, 6, 1800))), -10, at=c.claws)
motif(c.winWall, 2.2, -1, pan=-.2)
put(fx, c.amazing2 - .02, stereo(nrm(DREAD[:int(4 * SR), 0], .7)), -2); put(fx, c.amazing2, stereo(slamhit()), -3, at=c.amazing2)
# the truth: a glitch, then SORROW alone
g = c.coverIn + .35 / .7
put(fx, g, stereo(lay(crackle(.4, 30, 1500), swish(.3, 800, 6000, False))), -4, at=g)
put(music, g + .2, ride_db(cut(SORROW, 0, c.wrench - g + .5), g + .2, [(g + .2, 0), (c.eyesWide, 0), (c.wrench - .1, -3), (c.wrench + .2, -40)]), 0)
room_bed(g, c.slamDown, -24)
put(fx, c.eyesWide, stereo(lay(filt(lay(*[np.sin(2 * np.pi * f * tsec(1.2)) for f in (hz('D5'), hz('Eb5'), hz('A5'))]), 'low', 4000) * np.exp(-tsec(1.2) * 2) * .3, impact[:int(.8 * SR)] * .5)), -6, at=c.eyesWide)
beat3(c.eyesWide + .5, -6); beat3(c.eyesWide + 1.3, -7)
put(fx, c.pull1, stereo(lay(bump(), swish(.2, 500, 2500))), -6, at=c.pull1); put(fx, c.pull2, stereo(lay(bump(), swish(.2, 500, 2500, False))), -6, at=c.pull2)
put(fx, c.slip, stereo(lay(scrape(.35), crackle(.2, 8, 2200))), -6, at=c.slip)
put(fx, c.thud, stereo(nrm(lay(bump(), creak(.25), impact[:int(1.0 * SR)] * .5, crack()), .6)), -2, at=c.thud)
put(fx, c.rise, stereo(riser(c.slamDown - c.rise, 300, 1500, 1.6)), -6, at=c.rise)
dip(c.slamDown, -10, .2)
put(fx, c.slamDown, stereo(nrm(lay(impact[:int(1.6 * SR)] * .8, slamhit(), filt(slamS, 'high', 300), crack(), shatter(.3, 8) * .5), .6)), 0, at=c.slamDown)
put(fx, c.slamDown, stereo(nrm(DREAD[:int(4 * SR), 0], .7)), -3)
motif(c.slamDown, 1.8, -6, rev=True); screech(c.shriek, .9, -5)
put(fx, c.medalClink, stereo(lay(clink(3400, .5), after(.12, clink(2900, .4) * .6))), -6, at=c.medalClink)
room_bed(c.slamDown + .1, c.page1, -20)

# ---------------- one page a day: EPIC's piano on the first frame; the big entry when he turns the window down ----------------
put(music, c.page1, ride_db(cut(EPIC, 0, c.jump - c.page1 + .05), c.page1, [(c.page1, 0), (c.jump - .02, 0), (c.jump, -40)]), 0)
counter_tick(c.count1, False, -8)
for k in range(5): put(fx, c.count1 + .25 + k * .35, stereo(fade(vs(pen[int((.1 + k * .45) * SR):int((.5 + k * .45) * SR)], .7), .01, .05), -.2), -14)
motif(c.win3, .9, -10, pan=-.4)
put(fx, c.down2, stereo(lay(thump(200, .1, .5), click(.012, 1300))), -6, at=c.down2)
counter_tick(c.count40, False, -8)
dip(c.jump, -12, .1); motif(c.jump, 1.7, -2, pan=-.4); put(fx, c.jump, stereo(lay(vs(bloop, .6), thump(80, .4, .7))), -4, at=c.jump)
put(music, c.jump, ride_db(cut(DARK, 14.0, 14.0 + c.down3 - c.jump), c.jump, [(c.jump, -2), (c.board40, -6), (c.down3 - .02, -8), (c.down3, -40)]), 0)
for k in range(int((c.board40 - c.stuck) / .5) + 1): put(fx, c.stuck + k * .5, stereo(tock(k % 2 == 0)), -10)
beat3(c.stuck + .2, -6); beat3(c.stuck + .95, -7)
put(fx, c.boardSee, stereo(lay(mbox(hz('D6'), 1.4), mbox(hz('F#6'), 1.4) * .6)), -8, at=c.boardSee)
put(fx, c.down3, stereo(nrm(lay(thump(180, .14, .7), click(.015, 1200), impact[:int(.6 * SR)] * .5), .5)), -3, at=c.down3)
e2 = c.down3 - 21.0
put(music, c.down3 - .02, ride_db(cut(EPIC, 21.0 - .02, 32.0), c.down3 - .02, [(c.down3, 0), (c.read, -3), (c.hug2, 0), (c.last - .4, -2), (c.last + .3, -40)]), 0)
tail_ = c.down3 + 11.0                                   # EPIC's full section runs out: its last bars again up to the last picture
if tail_ < c.last: put(music, tail_ - .02, ride_db(cut(EPIC, 26.0, 26.0 + c.last - tail_ + .4), tail_ - .02, [(tail_, -1), (c.last - .1, -1), (c.last + .3, -40)]), 0)
counter_tick(c.count41, False, -8)
counter_tick(c.count120b, False, -10); knock3(c.knock, -4)
put(fx, c.open, stereo(creak(.5) * .8), -6, at=c.open); put(fx, c.hold, stereo(rustle(.35)), -8, at=c.hold)
put(fx, c.laughM, stereo(lay(mbox(hz('D6'), .4), after(.12, mbox(hz('F#6'), .4)), after(.24, mbox(hz('A6'), .6)))), -10, at=c.laughM)
put(fx, c.hug2, stereo(lay(mbox(hz('D5'), 1.2), mbox(hz('A5'), 1.2) * .7)), -6, at=c.hug2)
put(fx, c.capFall, stereo(lay(thump(260, .07, .3), vs(bloop, .8) * .7)), -8, at=c.capFall)
n = 18
for k in range(n): u = k / (n - 1); put(fx, c.count300 + (c.countDone - c.count300) * (u ** .8), stereo(tock(k % 2 == 0)), -13)
put(fx, c.countDone, stereo(lay(mbox(hz('D6'), 1.0), mbox(hz('A6'), 1.0) * .7)), -6, at=c.countDone)

# ---------------- the last picture and the title: ENDING ----------------
put(music, c.last, ride_db(cut(ENDING, 0, c.titleIn - c.last + 2.8), c.last, [(c.last, -3), (c.ahead, -7), (c.good, -4), (c.tap, -6), (c.titleIn, -5), (DUR, -14)]), 0)
motif(c.stamp, .7, -14, pan=-.3)
put(fx, c.good + .4, stereo(lay(mbox(hz('D5'), 1.4), mbox(hz('F#5'), 1.4) * .7, mbox(hz('A5'), 1.4) * .6)), -8, at=c.good)
put(fx, c.tap, stereo(lay(tap(), click(.01, 3200) * .4)), -4, at=c.tap); motif(c.tap + .02, .7, -12, rev=True, pan=-.3)
put(fx, c.dark2, stereo(click(.012, 1800)), -12, at=c.dark2)
put(fx, c.titleIn, stereo(nrm(lay(impact[:int(1.6 * SR)] * .7, slamhit() * .5), .5)), -6, at=c.titleIn)

# ---------------- every cut, every written line ----------------
cut_sounds(skip=[c.hk2, c.hk3, c.worst, c.page1, c.cover])
captions(white=[('capTogether', .6), ('hkWhy', .5), ('onePage', .55), ('good', .6)],
         red=[('amazing', .95), ('fourteen', .95), ('friends', .95), ('years', .8), ('oneLook', .7), ('ahead', .85), ('hkLook', .3)])
scratch(c.rip + .2 / 1.0, .65); scratch(c.turnAway + .5 / 1.05, .7); scratch(g + .5 / .7, 1.0)
print(json.dumps(finish(keys=['amazing2', 'thud', 'slamDown', 'jump', 'down3', 'tap']), indent=1))
