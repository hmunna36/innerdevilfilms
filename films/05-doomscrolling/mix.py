"""DOOMSCROLLING | It Eats Your Hours: the sound. Music only, no narration: the extreme ElevenLabs score carries the film,
its sections changing on the film's turns (the title, the nights, the dead phone, the drawer); at 6:00 AM it stops dead
on a boom and the comeback anthem RISE takes over, thinning while the drawer buzzes and dropping out while it attacks;
weeks later a calm piano, the score's ticking arpeggio comes back detuned with the phone in the doorway, then the score's
biggest hit on "NOT ENOUGH.". A clock ticks under the cold line and again, honestly, after the drawer; a few heavy hits
on top; three planned silences (the dead phone, before the drawer, the attack).
run: python films/05-doomscrolling/mix.py   (any folder; writes films/05-doomscrolling/audio/mix.wav and prints a report)
Sources: audio/music/*.mp3 and audio/sfx/*.mp3 (made by music.json with engine/audio/music.mjs)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'engine', 'audio'))
import numpy as np
from mixlib import *

DUR = 117.6
TITLE, NIGHT1, DEAD0, DEAD1, HUSH, SLAM = 3.35, 4.0, 48.4, 49.35, 59.9, 61.5   # the title; night 1; the dead phone; silence before the drawer
TURN, BUZZ, OPEN, ATTACK, BACK, WEEKS = 67.2, 87.1, 88.75, 91.3, 93.0, 101.8  # 6:00 AM; the drawer buzzes; it opens; the jump scare; FEED deleted
# measured in the mp3s (29 Oct 2026): SCORE's intro hit lands at 0.04 s, its nights' pulse starts at 6.02 s after a
# second of near-silence, and it never falls silent on its own at the reveal (so the film's cut makes the silence);
# RISE hits at 0.02 s; ENDING's piano starts at 1.67 s
HIT0, PULSE0, RISE0, PIANO0 = .04, 6.02, .02, 1.67
CUT0 = PULSE0 - .2 + (DEAD0 - NIGHT1)          # where the nights end in the score: the reveal goes on from there after the silence
W = lambda name: src(HERE, name)
music, fx = (np.zeros((int(DUR * SR) + SR, 2)) for _ in range(2))


def put(bus, t, x, gain_db=0.0, pan=0.0):
    x = stereo(x, pan) if x.ndim == 1 else x
    i = int(t * SR); x = x[:max(0, len(bus) - i)]
    bus[i:i + len(x)] += x * db(gain_db)


def gain_env(x, t0, a, b, to_db, ramp=.25, hold=True):   # ramp a clip placed at t0 to to_db over [a - ramp, a]; back up at b
    g = np.ones(len(x)); i, j, r = int((a - t0) * SR), int((b - t0) * SR), int(ramp * SR); lo = db(to_db)
    i0 = max(0, i - r); g[i0:i] = np.linspace(1, lo, i - i0); g[i:j] = lo
    if hold: g[j:j + r] = np.linspace(lo, 1, len(g[j:j + r]))
    else: g[j:] = lo
    return x * g[:, None]


mute = lambda x, t0, a, b, ramp=.02: gain_env(x, t0, a, b, -120, ramp)


def buzz(d):                                # a phone vibrating in a wooden drawer: pulses of a low rattling hum
    t = tsec(d); on = (np.sin(2 * np.pi * 1.6 * t) > -.2).astype(float)
    y = np.sign(np.sin(2 * np.pi * 148 * t)) * .5 + np.sin(2 * np.pi * 296 * t) * .3
    return filt(y * on, 'low', 900) * .5


score_all = W('music_SCORE')
# ---------- the cold open: a clock ticking under the cold line, a swell, the score's own hit on the title ----------
put(music, 0, fade(stereo(drone(3.4)), .4, .3), -18)
for k in range(4): put(fx, .15 + k * .5, stereo(tick()), -3)                                  # tick, tick, tick, tick
tail = score_all[int(.3 * SR):int(2.6 * SR)][::-1]                                           # the hit's own tail, reversed: a swell
put(music, TITLE - HIT0 - len(tail) / SR, fade(tail, .6, .01), -11)
put(music, TITLE - HIT0, fade(score_all[:int(1.3 * SR)], .003, .5))                          # THE HIT on the title
# ---------- the nights: the pulse from night 1 to the end of the montage; then the dead phone, silence ----------
nights = score_all[int((PULSE0 - .2) * SR):int(CUT0 * SR)]
put(music, NIGHT1, fade(nights, .05, .02))
# ---------- it shows itself: the score goes on from the cut, silent again before the drawer ----------
rev = mute(score_all[int(CUT0 * SR):], DEAD1, HUSH, SLAM, .25)
put(music, DEAD1, fade(rev, .005, .3))         # (its own aftermath dies away by about 65 s)
# ---------- he starts to change: the anthem, its opening impact on 6:00 AM ----------
rise = W('music_RISE')
rise = gain_env(rise, TURN - RISE0, BUZZ, OPEN, -10, .3)            # it thins while the drawer buzzes in the dark
rise = mute(rise, TURN - RISE0, ATTACK, BACK, .01)                  # it drops out while the devil attacks, back when FEED goes
rise = gain_env(rise, TURN - RISE0, 101.4, 999, -60, 1.8, hold=False)   # it fades as he sleeps
put(music, TURN - RISE0, fade(rise, .003, .4))
# ---------- weeks later: the calm piano, then it comes back ----------
ending = W('music_ENDING')
pk = np.sqrt((ending[int(PIANO0 * SR):int((PIANO0 + 5) * SR)] ** 2).mean()); lift = -24 - 20 * np.log10(pk + 1e-9)   # calm but audible
put(music, WEEKS - PIANO0, fade(ending[:int((107.6 - WEEKS + PIANO0) * SR)], .01, .6), lift)
loop = filt(score_all[int(PULSE0 * SR):int((PULSE0 + 3.2) * SR)], 'high', 450)             # the feed's arpeggio over the first pulse
put(music, 107.5, fade(stereo(varispeed(loop, .95, .86)), .02, .5), 4)                     # ...detuned, as its eyes open
put(music, 107.5, fade(stereo(drone(2.4)), .1, .2), -14)
put(music, 111.9 - HIT0, fade(score_all[:int(2.6 * SR)], .003, .8))                       # the title's hit, again
put(music, 114.0, fade(stereo(drone(3.6)), .2, 1.2), -12)

# ---------- the pictures' own sounds and a few heavy hits on top ----------
put(fx, TITLE, boom(), -9)                       # the title
for t0 in (13.9, 14.0, 14.1): put(fx, t0, stereo(whoosh(.18, 900, 5000)), -15)           # Wednesday, Thursday, Friday flick off
put(fx, 14.8, stereo(whoosh(.4, 500, 4000)), -10)                                         # Saturday flies to the window...
put(fx, 15.2, stereo(thump(90, .3, .6)), -6)                                              # ...and its teeth snap it
put(fx, 15.25, stereo(fade(bed(.35, 1500, 7000, .6), .02, .2)), -14)                      # then the months, a flurry of pages
put(fx, 26.1, stereo(tick()), -2); put(fx, 26.15, stereo(whoosh(1.1, 300, 2500)), -12)    # its claw spins the clock
put(fx, 32.7, stereo(click(.03, 2400)), -4)      # his thumb on Decline
put(fx, DEAD1 + .05, boom(), -8); put(fx, DEAD1 + .05, W('sfx_stinger'), -8)              # the black glass: it is behind him
put(fx, 52.0, W('sfx_swell'), -7)                # his reflection starts to age
put(fx, 57.0, W('sfx_stinger'), -5); put(fx, 57.0, boom(), -9)                            # it is in the room; the photo
put(fx, 59.05, stereo(thump(60, .4, .5)), -3); put(fx, 59.05, boom(), -12)                # its teeth on the photo
put(fx, SLAM, W('sfx_drawer'), -2); put(fx, SLAM, boom(), -8)                             # the drawer slams on its claws
put(fx, 62.2, W('sfx_scream'), -5)               # it screams; the hours stream back into him
for t0 in (65.9, 66.9): put(fx, t0, stereo(tick()), -3)                                   # the clock ticks honestly again
put(fx, TURN, boom(), -7)                        # the turn
put(fx, BUZZ + .05, stereo(buzz(OPEN - BUZZ - .05)), -9)                                  # the phone buzzes in the shut drawer
put(fx, OPEN, stereo(whoosh(.5, 200, 1800)), -12)                                         # ...and it slides open
put(fx, ATTACK, W('sfx_scare'), -3)              # the jump scare
put(fx, BACK, boom(), -12)                       # FEED deleted: the anthem slams back
put(fx, 95.2, W('sfx_shriek'), -6)               # it shrieks as FEED goes
put(fx, 108.3, stereo(glitch(.2)), -14)          # the mirror blinks to his old face
put(fx, 111.9, boom(), -6)                       # NOT ENOUGH.
put(fx, 114.0, boom(), -10)                      # the title

# ---------- master ----------
mix = master((music + fx)[:int(DUR * SR)])
end = int((DUR - 1.4) * SR); mix[end:] *= np.linspace(1, 0, len(mix) - end)[:, None]
write(os.path.join(HERE, 'audio', 'mix.wav'), mix)
lv = lambda a, b: round(20 * np.log10(np.sqrt((mix[int(a * SR):int(b * SR)] ** 2).mean()) + 1e-9), 1)
print(json.dumps({'loudness': report(mix), 'seconds': len(mix) / SR,
                  'lengths_s': {'SCORE': round(len(score_all) / SR, 2), 'RISE': round(len(W('music_RISE')) / SR, 2), 'ENDING': round(len(ending) / SR, 2)},
                  'title_hit_dbfs': lv(3.35, 3.75), 'not_enough_dbfs': lv(111.9, 112.3), 'doorway_dbfs': lv(107.6, 109.6), 'piano_lift_db': round(float(lift), 1),
                  'silences_dbfs': {'dead phone 48.45-49.3': lv(48.45, 49.3), 'before the drawer 60.0-61.45': lv(60.0, 61.45), 'attack gap 92.2-92.9': lv(92.2, 92.9)},
                  'sections_dbfs': {'cold open 0-3.3': lv(0, 3.3), 'night 1 4.3-15.6': lv(4.3, 15.6), 'nights 2-4 15.6-48.3': lv(15.6, 48.3), 'reveal 49.4-59.8': lv(49.4, 59.8),
                                    'aftermath 62.5-67.1': lv(62.5, 67.1), 'anthem 67.3-87.0': lv(67.3, 87.0), 'buzz 87.2-88.7': lv(87.2, 88.7),
                                    'anthem again 93.1-99.0': lv(93.1, 99.0), 'piano 101.9-107.4': lv(101.9, 107.4)}}))
