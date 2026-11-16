"""THE BOTTLE | She Waited Till Dark: the sound. Music only, no narration.
The score's bar groove (a drunk, detuned bar piano over a slow sub pulse) runs under the deal and stops dead when his
glass is empty; the twist plays in near silence (her knocking, then the real knuckles on the stone step); the explosion
lands on his face; the hits follow the red lines; a second of silence, then the smash turns the music: RUN carries him
through the rain and dies at the school steps; three lone piano notes for the steps and the walk home; the anthem RISE
from DAY 1 at 6:00 AM, cut dead at the bar's door on DAY 60 (a heartbeat, the rain), back softly when her hand takes
his; ENDING for the golden hour and the hug; the bar piano, detuned, under its last line; the title's hit on SHE DOES.
run: python films/07-the-bottle/mix.py   (any folder; writes films/07-the-bottle/audio/mix.wav and prints a report)
Sources: audio/music/*.mp3 and audio/sfx/*.mp3 (made by music.json with engine/audio/music.mjs)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'engine', 'audio'))
import numpy as np
from mixlib import *

DUR = 103.9
# the cut (src/90-film.js)
TITLE, DEAL, DOOR, POUR, SLIDE, DRINK, WATCH, B1, POUR2, PHONE, TRADE2, B2, TWO, B3 = 3.6, 4.33, 6.73, 12.13, 13.33, 14.53, 15.73, 17.53, 20.53, 24.13, 25.33, 27.13, 29.53, 34.33
MONT, EMPTY, TWIST, KNUCK, BOOM, DEVFACE, REPLAY, TOWER, BIG, HUSH, SMASH, SCREAM, GRAB = 37.33, 40.33, 41.73, 44.33, 45.13, 46.13, 47.93, 49.43, 50.03, 51.83, 53.05, 54.03, 55.23
RUNSIDE, PUDDLE, ARRIVE, HURT, KNEEL, REACH, HOME, DAY1, OFFER, TEMPT, HAND, AFTER, GOLD, JUMP, HUG, EYES, AWAY, SHEDOES, END_TITLE = 56.43, 58.03, 59.93, 61.93, 63.43, 65.83, 67.83, 70.03, 82.34, 84.74, 85.94, 87.34, 89.14, 91.14, 92.94, 95.74, 97.94, 100.0, 101.54
# measured in the mp3s (16 Nov 2026): SCORE's opening blast peaks at 0.25 s and rings to about 2.6 s; its bar groove kicks
# in at 5.08 s (100 bpm, a heavy bar every 4.8 s) and runs to 41.0 s; its biggest hit is at 43.52 s, then it dies by 47 s.
# RUN is at full speed from 0 with a last hit at 6.5 s; SAD has three lone notes at 2.05, 6.05 and 10.05 s; RISE's impact
# is at 0.03 s (127 bpm) and it is loud to 22.5 s; ENDING starts at once.
HIT0, GROOVE0, BIGHIT, RISE0 = .25, 5.08, 43.52, .03
W = lambda name: src(HERE, name)
music, fx = (np.zeros((int(DUR * SR) + SR, 2)) for _ in range(2))


def put(bus, t, x, gain_db=0.0, pan=0.0):
    x = stereo(x, pan) if x.ndim == 1 else x
    i = int(t * SR)
    if i < 0: x, i = x[-i:], 0
    x = x[:max(0, len(bus) - i)]
    bus[i:i + len(x)] += x * db(gain_db)


def gain_env(x, t0, a, b, to_db, ramp=.25, hold=True):   # ramp a clip placed at t0 to to_db over [a - ramp, a]; back up at b
    g = np.ones(len(x)); i, j, r = int((a - t0) * SR), int((b - t0) * SR), int(ramp * SR); lo = db(to_db)
    i0 = max(0, i - r); g[i0:max(i0, i)] = np.linspace(1, lo, max(0, i - i0)); g[max(0, i):max(0, j)] = lo
    if hold: g[max(0, j):max(0, j) + r] = np.linspace(lo, 1, len(g[max(0, j):max(0, j) + r]))
    else: g[max(0, j):] = lo
    return x * g[:, None]


def cut(x, a, b): return x[int(a * SR):int(b * SR)]


def glassring(d=3.0, f=1244.5):              # a wet finger round the rim of a glass
    t = tsec(d); y = sum(np.sin(2 * np.pi * f * k * t * (1 + .002 * np.sin(2 * np.pi * 5 * t))) * a for k, a in ((1, 1), (2.76, .25), (5.4, .08)))
    return y * np.minimum(1, t / .9) * np.exp(-np.maximum(0, t - d * .6) * 3) * .12


def clink(f=2350, d=.5):                     # glass on wood, glass on glass
    t = tsec(d); y = sum(np.sin(2 * np.pi * f * k * t) * np.exp(-t * (9 + 6 * i)) / (1 + i) for i, k in enumerate((1, 2.3, 3.9)))
    return y * .3 + thump(140, .12, .3)[:1].sum() * 0


def cork(d=.35):                             # a cork pushed home
    t = tsec(d); return thump(190, d, .8) * .7 + filt(rng.standard_normal(len(t)), 'band', [900, 2600]) * np.exp(-t * 30) * .3


def buzz(d=1.0, muffled=False):              # a phone ringing on a bar top: two bursts a second
    t = tsec(d); y = np.sign(np.sin(2 * np.pi * 148 * t)) * (np.sin(2 * np.pi * 1.0 * t) > -.2) * .25 + filt(rng.standard_normal(len(t)), 'band', [1500, 4000]) * .08 * (np.sin(2 * np.pi * 1.0 * t) > -.2)
    return filt(y, 'low', 500 if muffled else 3200)


def ringtone(d=1.1):                         # the same phone, ringing out loud
    t = tsec(d); y = (np.sin(2 * np.pi * 1318.5 * t) + np.sin(2 * np.pi * 1568 * t)) * (np.sin(2 * np.pi * 9 * t) > 0) * (np.sin(2 * np.pi * 1.6 * t) > -.3)
    return y * .1


def splash(d=.7):
    t = tsec(d); return filt(rng.standard_normal(len(t)), 'band', [700, 7000]) * np.exp(-t * 7) * np.minimum(1, t / .01) * .6 + thump(90, .25, .5)[:len(t)].sum() * 0


def bell(d=1.9):                             # the school bell: the day is over
    t = tsec(d); trem = .6 + .4 * np.sin(2 * np.pi * 17 * t)
    y = sum(np.sin(2 * np.pi * f * t) * a for f, a in ((1570, 1), (2360, .6), (3140, .35), (4180, .2))) * trem * np.minimum(1, t / .02) * np.exp(-np.maximum(0, t - d * .55) * 5)
    return y * .1


def rainbed(d, level=1.0):
    return fade(stereo(bed(d, 900, 7000, .22 * level)), .4, .5)


score = W('music_SCORE'); knock = W('sfx_knock'); one_knock = fade(cut(knock, .03, .3), .002, .08)

# ---------- the cold open: a drone, a ringing glass, her fists on the glass, its eyes; the score's blast on the title ----------
put(music, 0, fade(stereo(drone(3.7)), .2, .2), -11)
put(music, 0, fade(stereo(glassring(3.5)), .05, .3), -7)
for k in range(7): put(fx, .1 + k * .2, one_knock, -13 - (k % 2) * 2, .25)                 # she beats on the glass
put(fx, 1.25, W('sfx_swell'), -11)                                                       # its eyes
put(fx, 1.58, stereo(whoosh(.5, 250, 2400)), -11)                                        # its hand closes round the bottle
tail = cut(score, .5, 2.6)[::-1]
put(music, TITLE - len(tail) / SR, fade(tail, .7, .01), -13)                              # the blast's own ring, backwards, into it
put(music, TITLE - HIT0, fade(cut(score, 0, HIT0 + 1.5), .05, .8))                        # THE HIT on the title
put(fx, TITLE, boom(), -9)
# ---------- the deal: the bar groove, from his phone to the last cut of the montage ----------
deal = cut(score, GROOVE0 - .04, GROOVE0 - .04 + (EMPTY - DEAL) + .04)
put(music, DEAL - .04, fade(deal, .02, .015))
put(fx, DEAL + .5, stereo(ping()), -15)                                                  # the reminder
put(fx, DOOR + .1, W('sfx_swell'), -13)                                                  # it beckons
put(fx, 7.5, fade(stereo(bell(1.9)), .01, .5), -3, -.2)                                    # the school bell, over the cut to her
put(fx, POUR, W('sfx_pour'), 4); put(fx, POUR2 + .2, W('sfx_pour'), 1)
put(fx, SLIDE + .05, stereo(whoosh(.8, 500, 3500)), -15, -.2); put(fx, SLIDE + .88, stereo(clink(2100)), -12)
put(fx, DRINK + .9, stereo(thump(70, .3, .4)), -13)
for k in (.12, .34): put(fx, WATCH + k * 1.8 / 2 * 2, stereo(tick()), -8)                 # its claw taps his watch
put(fx, WATCH + 1.0, stereo(whoosh(.7, 400, 2600)), -17)
for b in (B1, B2, B3): put(fx, b + .78, stereo(cork()), -8)
for k in range(8): put(fx, B1 + .75 + k * .055, stereo(tick()), -15)                      # the watch, racing
put(fx, PHONE + .2, stereo(fade(buzz(2.6), .02, .1)), -10)                                # SCHOOL, on the bar
put(fx, TRADE2 + .7, stereo(whoosh(.9, 400, 2600)), -17)
put(fx, B2 + .1, stereo(fade(buzz(1.3, True), .02, .3)), -8)                              # ...and in the bottle
put(fx, TWO + .1, W('sfx_swell'), -14)
put(fx, 33.13 + .1, stereo(whoosh(.7, 400, 2600)), -17)
step = (EMPTY - MONT) / 10
for k in range(10):
    put(fx, MONT + k * step, stereo(glitch(.07)), -17)
    if k in (0, 2, 6): put(fx, MONT + k * step + .02, stereo(clink(2300 - 100 * k)), -8); put(fx, MONT + k * step + .02, stereo(thump(110, .2, .5)), -10)
# ---------- his glass is empty: silence. Her knocking. The real knuckles ----------
put(fx, EMPTY, fade(stereo(bed(4.8, 60, 300, .05)), .3, .1), -6)                          # the room, barely
ring = glassring(BOOM - EMPTY - .05, 1244.5) * np.linspace(.35, 1.0, int((BOOM - EMPTY - .05) * SR))
put(music, EMPTY + .05, fade(stereo(ring), .4, .03), -5)                                  # a glass ringing, thin and rising: the film never goes dead on a phone
for k in (.3, .75): put(fx, EMPTY + k, stereo(clink(2500, .4)), -13)                      # he taps for more
put(fx, TWIST + .42, stereo(thump(120, .25, .4)), -12); put(fx, TWIST + .44, stereo(clink(1700, .6)), -15)   # the bottle set down
for k in (1.5, 1.86, 2.22): put(fx, TWIST + k, one_knock, -2, .1)                         # she knocks from inside
for k in (.1, .35, .6): put(fx, KNUCK + k, stereo(thump(260, .12, .3)), -9); put(fx, KNUCK + k, stereo(click(.02, 1500)), -14)
put(fx, KNUCK, fade(rainbed(.8, .6), .05, .02), -12)
# ---------- he understands: the explosion, and a hit on each of its lines ----------
rev = cut(score, BIGHIT - .22, 49.8)
put(music, BOOM - .22, fade(rev, .01, .6), 1)
blast = fade(cut(score, .05, 2.4), .02, .9)
put(fx, BOOM, boom(), -6); put(fx, BOOM, W('sfx_stinger'), -6)
put(music, BOOM + .1, fade(stereo(drone(6.5, 41.2)), .3, .2), -8)
put(music, DEVFACE - .2, blast, -3); put(fx, DEVFACE, boom(), -9)
for k, t in enumerate((REPLAY, REPLAY + .5, REPLAY + 1.0)): put(fx, t, W('sfx_stinger'), -8 + k); put(fx, t, stereo(glitch(.12)), -12)
put(fx, TOWER, boom(), -7)
put(music, BIG - .2, blast, -2); put(fx, BIG, boom(), -8); put(fx, BIG + .2, W('sfx_swell'), -9)
# ---------- a second of nothing; then he breaks them, and the music turns ----------
music[int((HUSH + .05) * SR):int((SMASH - .02) * SR)] *= 0; fx[int((HUSH + .05) * SR):int((SMASH - .25) * SR)] *= .15
sw = cut(W('sfx_swell'), 0, .9)[::-1]; put(fx, SMASH - .9, fade(sw, .5, .01), -3)
for k, g in ((0, 2), (.07, -2), (.14, -2)): put(fx, SMASH + k, W('sfx_smash'), g)
put(fx, SMASH, boom(), -3)
run = W('music_RUN')
put(music, SMASH, fade(run, .003, 1.0), -1)
put(fx, SCREAM, W('sfx_scream'), -9)
put(fx, GRAB, stereo(fade(ringtone(1.15), .01, .05)), -9)                                 # SCHOOL, still ringing
put(fx, GRAB - 1.0, fade(rainbed(DAY1 - GRAB + 1.0, 1), 2.5, .15), -15)            # the rain, from the door to the walk home
put(fx, RUNSIDE, stereo(steps(ARRIVE - RUNSIDE - .3, 5.6)), -11)
put(fx, PUDDLE + .15, stereo(splash()), -5)
put(fx, ARRIVE + .5, stereo(thump(60, .4, .3)), -14)
# ---------- the steps, the walk home: three lone notes ----------
sad = W('music_SAD')
for src_t, at in ((2.02, KNEEL), (6.02, REACH), (10.02, HOME)): put(music, at, fade(cut(sad, src_t, src_t + 3.95 if src_t < 10 else 12.0), .005, .5), 5)
# ---------- DAY 1, 6:00 AM: the anthem; it stops dead at the bar's door ----------
rise = W('music_RISE')
put(music, DAY1 - RISE0, fade(cut(rise, 0, OFFER - DAY1 + RISE0), .003, .03))
put(fx, DAY1, boom(), -9)
put(fx, OFFER - .05, fade(rainbed(AFTER - OFFER + 2.0, .9), .05, 1.2), -14)                # evening, rain
put(fx, OFFER + .55, stereo(whoosh(.9, 500, 3000)), -13, .3); put(fx, OFFER + 1.3, stereo(clink(2200)), -12, .3)   # the glass slides out
put(fx, OFFER + .7, W('sfx_swell'), -12)
for k in range(3):                                                                       # he wants it: a heartbeat a phone can play too
    put(fx, TEMPT + k * .86, stereo(heartbeat()), -5); put(fx, TEMPT + k * .86, stereo(thump(150, .16, .3)), -12); put(fx, TEMPT + k * .86 + .24, stereo(thump(140, .14, .3)), -15)
ending = W('music_ENDING')
put(music, HAND + .75, fade(cut(ending, 0, 1.9), .01, 1.0), 0)                            # her hand: one chord
put(music, AFTER, fade(cut(rise, 14.05, 14.05 + GOLD - AFTER + .3), .05, .8), -7)         # they walk on
for k in range(4): put(fx, AFTER + .6 + k * .27, stereo(drip()), -12, .3)                 # rain fills the glass
# ---------- DAY 90: the golden hour, the hug; its last line; SHE DOES. ----------
e = gain_env(ending, GOLD, EYES, AWAY, -10, .4)
pk = np.sqrt((cut(ending, 0, 6) ** 2).mean()); lift = -17 - 20 * np.log10(pk + 1e-9)
put(music, GOLD, fade(e[:int((SHEDOES + 1.2 - GOLD) * SR)], .05, 1.5), lift)
put(fx, JUMP + .05, stereo(whoosh(.5, 600, 4000)), -18)                                   # the doors
pno = filt(cut(score, GROOVE0 + 9.6, GROOVE0 + 12.6), 'high', 600)                        # the bar piano...
put(music, EYES + .1, fade(stereo(varispeed(pno, .94, .82)), .05, .6), 2)                 # ...detuned, in the dark doorway
put(music, EYES, fade(stereo(drone(2.3)), .15, .4), -11); put(fx, EYES + .35, W('sfx_swell'), -14)
put(music, SHEDOES - HIT0, fade(cut(score, 0, HIT0 + 2.2), .12, 1.0), -1)                 # the title's hit, again
put(fx, SHEDOES, boom(), -7)
put(music, END_TITLE, fade(stereo(drone(2.4)), .2, 1.2), -12); put(fx, END_TITLE, boom(), -11)
put(music, END_TITLE - .3, fade(stereo(glassring(2.6)), .05, 1.4), -6)                     # the ringing glass again, as it began

# ---------- master ----------
mix = master((music + fx)[:int(DUR * SR)])
end = int((DUR - 1.3) * SR); mix[end:] *= np.linspace(1, 0, len(mix) - end)[:, None]
write(os.path.join(HERE, 'audio', 'mix.wav'), mix)
lv = lambda a, b: round(20 * np.log10(np.sqrt((mix[int(a * SR):int(b * SR)] ** 2).mean()) + 1e-9), 1)
print(json.dumps({'loudness': report(mix), 'seconds': len(mix) / SR, 'ending_lift_db': round(float(lift), 1),
                  'hits_dbfs': {'title 3.6': lv(3.6, 4.0), 'explosion 45.13': lv(45.13, 45.6), 'smash 53.05': lv(53.05, 53.5), 'SHE DOES 100.0': lv(100.0, 100.4)},
                  'silences_dbfs': {'empty and twist 40.4-45.1': lv(40.4, 45.1), 'before the smash 51.9-52.8': lv(51.9, 52.8), 'the bar door 82.4-85.9': lv(82.4, 85.9)},
                  'sections_dbfs': {'cold open 0-3.5': lv(0, 3.5), 'deal 4.4-37.3': lv(4.4, 37.3), 'montage 37.3-40.3': lv(37.3, 40.3), 'reveal 45.2-51.8': lv(45.2, 51.8), 'run 53.1-59.9': lv(53.1, 59.9),
                                    'steps 60-70': lv(60, 70), 'anthem 70.1-82.3': lv(70.1, 82.3), 'they walk on 87.4-89.1': lv(87.4, 89.1), 'golden hour 89.2-95.7': lv(89.2, 95.7), 'doorway 95.8-97.9': lv(95.8, 97.9), 'last picture 98-100': lv(98, 100)}}, indent=1))
