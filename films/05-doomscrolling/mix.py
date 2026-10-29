"""DOOMSCROLLING | It Eats Your Hours: the sound. Music only, no narration: the extreme ElevenLabs score carries the film,
its sections changing on the film's turns (the title, the nights, the dead phone, the drawer); at 6:00 AM it stops dead
on a boom and the comeback anthem RISE takes over, thinning while the drawer buzzes and dropping out while it attacks;
weeks later a calm piano, the score's ticking arpeggio comes back detuned with the phone in the doorway, then the score's
biggest hit on "NOT ENOUGH.". A few heavy hits on top, a clock's honest tick after the drawer, and three planned
silences (the dead phone, before the drawer, the attack).
run: python films/05-doomscrolling/mix.py   (any folder; writes films/05-doomscrolling/audio/mix.wav and prints a report)
Sources: audio/music/*.mp3 and audio/sfx/*.mp3 (made by music.json with engine/audio/music.mjs)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'engine', 'audio'))
import numpy as np
from mixlib import *

DUR = 117.0
TITLE, DEAD0, DEAD1, HUSH, SLAM = 3.2, 47.9, 48.85, 59.0, 60.6   # the title; the dead phone; silence before the drawer
TURN, BUZZ, ATTACK, BACK = 66.2, 87.1, 90.6, 92.3                # 6:00 AM; the drawer buzzes; the jump scare; FEED deleted
W = lambda name: src(HERE, name)
music, fx = (np.zeros((int(DUR * SR) + SR, 2)) for _ in range(2))


def put(bus, t, x, gain_db=0.0, pan=0.0):
    x = stereo(x, pan) if x.ndim == 1 else x
    i = int(t * SR); x = x[:max(0, len(bus) - i)]
    bus[i:i + len(x)] += x * db(gain_db)


def mute(x, t0, a, b, ramp=.02, back=.02):  # silence a stretch of a clip placed at t0 (a, b in film time)
    g = np.ones(len(x)); i, j, r, q = int((a - t0) * SR), int((b - t0) * SR), int(ramp * SR), int(back * SR)
    g[max(0, i - r):i] = np.linspace(1, 0, i - max(0, i - r)); g[i:j] = 0; g[j:j + q] = np.linspace(0, 1, len(g[j:j + q]))
    return x * g[:, None]


def duck(x, t0, a, b, depth_db, ramp=.25):  # lower a stretch of a clip placed at t0
    g = np.ones(len(x)); i, j, r = int((a - t0) * SR), int((b - t0) * SR), int(ramp * SR); lo = db(depth_db)
    g[i:j] = lo; g[max(0, i - r):i] = np.linspace(1, lo, i - max(0, i - r)); g[j:j + r] = np.linspace(lo, 1, len(g[j:j + r]))
    return x * g[:, None]


def buzz(d):                                # a phone vibrating in a wooden drawer: pulses of a low rattling hum
    t = tsec(d); on = (np.sin(2 * np.pi * 1.6 * t) > -.2).astype(float)
    y = np.sign(np.sin(2 * np.pi * 148 * t)) * .5 + np.sin(2 * np.pi * 296 * t) * .3
    return filt(y * on, 'low', 900) * .5


# ---------- the cold open: a clock ticking under the cold line, then the score's own riser and hit on the title ----------
score_all = W('music_SCORE')
HIT0 = 1.0                                       # in SCORE.mp3 the intro's hit lands at HIT0 s (measured below)
put(music, 0, fade(stereo(drone(2.6)), .4, .4), -18)
for k in range(4): put(fx, .15 + k * .5, stereo(tick()), -4)                            # tick, tick, tick, tick
put(music, .1, fade(score_all[int(1.1 * SR):int(3.3 * SR)][::-1], .5, .25), -12)        # the hit's tail reversed: a swell
put(music, TITLE - HIT0, fade(score_all[:int((4.45 - (TITLE - HIT0)) * SR)], .01, .2))  # the riser, THE HIT on the title
# ---------- the horror score from night 1 to 6:00 AM, its sections changing on the film's turns ----------
score = score_all[:int(TURN * SR)]
score = mute(score, 0, 0, 4.3, .01, .2)          # (its own intro is the one above)
score = mute(score, 0, DEAD0, DEAD1)             # the time chip races and the phone dies: dead silence
score = mute(score, 0, HUSH, SLAM, .25)          # silence before he slams the drawer
put(music, 0, fade(score, .01, .05))             # ...and it is gone by 6:00 AM (its own aftermath fades out by 64 s)
# ---------- he starts to change: the anthem, its opening impact on 6:00 AM ----------
RISE0 = .95                                      # RISE.mp3 rises for RISE0 s into its first impact (measured below)
rise = W('music_RISE')
rise = duck(rise, TURN - RISE0, BUZZ, 88.7, -9, .3)        # it thins while the drawer buzzes in the dark
rise = mute(rise, TURN - RISE0, ATTACK, BACK, .01, .15)    # it drops out while the devil attacks, back when FEED is deleted
put(music, TURN - RISE0, fade(rise, .3, .4))
# ---------- weeks later: calm piano, then it comes back ----------
ending = W('music_ENDING')
put(music, 101.1, fade(ending[:int(5.9 * SR)], .05, .6), -5)
loop = filt(score_all[int(4.4 * SR):int(7.6 * SR)], 'high', 450)                        # the feed's arpeggio over the first pulse
put(music, 106.8, fade(stereo(varispeed(loop, .95, .86)), .02, .4), 5)                  # ...detuned, as its eyes open
put(music, 106.8, fade(stereo(drone(2.4)), .1, .2), -14)
put(music, 111.2 - .25, fade(score_all[int((HIT0 - .25) * SR):int((HIT0 + 2.4) * SR)], .005, .8))   # the title's hit, again
put(music, 113.3, fade(stereo(drone(3.7)), .2, 1.2), -12)

# ---------- the pictures' own sounds and a few heavy hits on top ----------
put(fx, TITLE, boom(), -9)                       # the title
for k, t0 in enumerate([13.52, 13.82, 14.02, 14.16]): put(fx, t0, stereo(whoosh(.22, 900, 5000)), -14 + k)   # calendar pages
put(fx, 14.26, stereo(fade(bed(.7, 1500, 7000, .6), .02, .3)), -13)                    # ...then a flurry of them
put(fx, 25.15, stereo(tick()), -2); put(fx, 25.2, stereo(whoosh(1.1, 300, 2500)), -12)  # its claw spins the clock
put(fx, 53.9, boom(), -10)                       # his reflection starts to age
put(fx, 56.5, W('sfx_stinger'), -6)              # it is in the room, still hungry
put(fx, SLAM, W('sfx_drawer'), -2); put(fx, SLAM, boom(), -8)   # the drawer slams on its claws
put(fx, 61.3, W('sfx_scream'), -5)               # it screams; the hours spill out of it
for t0 in (64.95, 65.95): put(fx, t0, stereo(tick()), -3)       # the clock ticks honestly again
put(fx, TURN, boom(), -7)                        # the turn
put(fx, BUZZ + .1, stereo(buzz(1.4)), -10)       # the phone buzzes in the shut drawer
put(fx, ATTACK, W('sfx_scare'), -3)              # the jump scare
put(fx, 94.5, W('sfx_shriek'), -6)               # it shrieks as FEED goes
put(fx, 111.2, boom(), -6)                       # NOT ENOUGH.
put(fx, 113.3, boom(), -10)                      # the title

# ---------- master ----------
mix = master(filt(music + fx, 'high', 25)[:int(DUR * SR)])
end = int((DUR - 1.4) * SR); mix[end:] *= np.linspace(1, 0, len(mix) - end)[:, None]
write(os.path.join(HERE, 'audio', 'mix.wav'), mix)
lv = lambda a, b: round(20 * np.log10(np.sqrt((mix[int(a * SR):int(b * SR)] ** 2).mean()) + 1e-9), 1)
print(json.dumps({'lufs': round(lufs(mix), 2), 'true_peak_dbtp': round(true_peak(mix), 2), 'seconds': len(mix) / SR,
                  'lengths_s': {'SCORE': round(len(score_all) / SR, 2), 'RISE': round(len(W('music_RISE')) / SR, 2), 'ENDING': round(len(ending) / SR, 2)},
                  'title_hit_dbfs': lv(3.2, 3.6), 'not_enough_dbfs': lv(111.2, 111.6), 'doorway_dbfs': lv(106.9, 108.9),
                  'silences_dbfs': {'dead phone 48.0-48.7': lv(48.0, 48.7), 'before the drawer 59.2-60.5': lv(59.2, 60.5), 'attack gap 91.5-92.2': lv(91.5, 92.2)},
                  'sections_dbfs': {'intro 0-3.1': lv(0, 3.1), 'nights 3.8-47.8': lv(3.8, 47.8), 'reveal 48.9-58.9': lv(48.9, 58.9),
                                    'anthem 66.5-87.0': lv(66.5, 87.0), 'buzz 87.2-88.6': lv(87.2, 88.6), 'ending 101.1-106.7': lv(101.1, 106.7)}}))
