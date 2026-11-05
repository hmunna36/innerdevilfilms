"""RAGE | It Holds His Fists: the sound. Music only, no narration: the extreme ElevenLabs score carries the film, its sections
changing on the film's turns (the title, the evening's snaps, the cracked mirror, the open fist); at 7:30 AM on DAY 1 it
stops dead on a boom and the boxing anthem RISE takes over, thinning as his fist clenches and dropping out while it
attacks; weeks later a calm piano, the boxing bell, the score's toy piano detuned in the doorway, then the score's
biggest hit on "IT STARVES.". The night's own sounds on top: the pot's clang, the shout's blast, the fist through the
wall, six blows on Sam's door, the mirror cracking. Planned silences: before IT shows in the glass, before his fist
opens, the attack.
run: python films/06-rage/mix.py   (any folder; writes films/06-rage/audio/mix.wav and prints a report)
Sources: audio/music/*.mp3 and audio/sfx/*.mp3 (made by music.json with engine/audio/music.mjs)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'engine', 'audio'))
import numpy as np
from mixlib import *

DUR = 116.0
TITLE, NIGHT1, POT, BIRTH, SHOUT, CRAYON, PUNCH, EYE = 2.6, 3.2, 11.8, 13.2, 20.8, 22.6, 29.7, 33.2
HOLD0, HOLD1, BLOW, CRACK = 37.2, 38.6, 38.9, 39.0                  # Sam's room: the pulse holds its breath; the one blow
MONT0, REVEAL, IT, HORNS, HUSH, PRY, SCREAM, AJAR = 41.0, 44.0, 44.45, 49.15, 52.8, 54.05, 55.3, 59.9
TURN, PULLDROP, CLENCH, ATTACK, BACK, WEEKS, BELL, EYES, STARVE, END_TITLE = 63.4, 69.8, 89.6, 90.4, 93.1, 100.5, 103.1, 105.4, 109.6, 111.5
# measured in the mp3s after they were made (films/06-rage/README.md, "Sound"): where the intro's hit lands, where the
# nights' pulse starts, where the reveal's explosion lands, RISE's opening impact, the ending's first piano note
HIT0, PULSE0, BOOM0, RISE0, PIANO0 = 3.9, 4.6, 46.5, .02, .3
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


mute = lambda x, t0, a, b, ramp=.02: gain_env(x, t0, a, b, -120, ramp)


def clang(d=1.6):                            # a metal pot slammed into a steel sink: inharmonic partials and a splash
    t = tsec(d); y = sum(np.sin(2 * np.pi * f * t + k) * np.exp(-t * (4 + 2.5 * k)) / (1 + .4 * k) for k, f in enumerate((412, 1037, 1613, 2481, 3290)))
    splash = filt(filt(rng.standard_normal(len(t)), 'high', 1500), 'low', 9000) * np.exp(-t * 7) * .5
    return (y * .5 + splash) * .8


def bell(d=2.6):                             # the boxing bell: one bright strike, a long ring
    t = tsec(d); y = sum(np.sin(2 * np.pi * f * t) * np.exp(-t * dk) * a for f, dk, a in ((1180, 1.6, 1), (2950, 2.4, .5), (4620, 3.5, .3), (590, 1.2, .3)))
    return reverb(y * .5, 1.2, .2, 7000)[:len(t)]


def crackwood(d=.5):                         # the frame splitting: a dry crack and splinters
    t = tsec(d); n = rng.standard_normal(len(t))
    return filt(n, 'band', [700, 5000]) * np.exp(-t * 18) * .9 + filt(n, 'high', 3000) * np.exp(-t * 6) * .2


def creak(d=.6, f0=180):                     # the door opening a crack
    t = tsec(d); f = f0 + 60 * np.sin(2 * np.pi * 1.3 * t)
    return np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * filt(rng.standard_normal(len(t)), 'band', [300, 1600]) * np.sin(np.pi * t / d) * .25


score_all = W('music_SCORE')
# ---------- the cold open: a drone and a low growl under the cold line, the eyes, the score's own hit on the title ----------
put(music, 0, fade(stereo(drone(2.6)), .2, .2), -16)
put(fx, .85, W('sfx_swell'), -12)                                                  # the eyes open in its shadow, on "GROWS"
put(fx, 1.6, stereo(whoosh(.45, 300, 2600)), -14)                                  # its claws close on his fist
tail = score_all[int(.2 * SR):int(2.4 * SR)][::-1]                                # the intro's swell, reversed into the hit
put(music, TITLE - HIT0 - len(tail) / SR + HIT0, fade(tail, .6, .01), -14)
put(music, TITLE - HIT0, fade(score_all[:int((HIT0 + 1.4) * SR)], .3, .5))        # THE HIT on the title
# ---------- the evening: the pulse from 7:02 PM to the end of the cracked-mirror montage ----------
nights = score_all[int((PULSE0 - .05) * SR):int((PULSE0 - .05 + REVEAL - NIGHT1) * SR)]
nights = gain_env(nights, NIGHT1, HOLD0, HOLD1 + .25, -9, .35)              # it holds its breath in Sam's room
put(music, NIGHT1, fade(nights, .05, .03))
# ---------- it shows itself: dead silence, then the reveal's explosion on IT in the glass; silent again before the fist ----------
rev = score_all[int(BOOM0 * SR):]
rev = mute(rev, IT, HUSH, PRY, .3)
put(music, IT, fade(rev[:int((TURN - IT) * SR)], .003, .4))
# ---------- he starts to change: the anthem, its opening impact on DAY 1 ----------
rise = W('music_RISE')
rise = gain_env(rise, TURN - RISE0, CLENCH, ATTACK, -9, .3)                         # it thins as his fist clenches
rise = mute(rise, TURN - RISE0, ATTACK, BACK, .01)                                  # it drops out while the devil attacks
rise = gain_env(rise, TURN - RISE0, 99.6, 999, -60, 1.0, hold=False)                # and fades as the day ends
put(music, TURN - RISE0, fade(rise, .003, .4))
# ---------- weeks later: the calm piano, the bell, then it comes back in the doorway ----------
ending = W('music_ENDING')
pk = np.sqrt((ending[int(PIANO0 * SR):int((PIANO0 + 4) * SR)] ** 2).mean()); lift = -24 - 20 * np.log10(pk + 1e-9)
put(music, WEEKS - PIANO0, fade(ending[:int((EYES + .2 - WEEKS + PIANO0) * SR)], .01, .6), lift)
toy = filt(score_all[int((PULSE0 + 8) * SR):int((PULSE0 + 11.2) * SR)], 'high', 700)   # the score's toy piano...
put(music, EYES, fade(stereo(varispeed(toy, .95, .86)), .02, .5), 2)                      # ...detuned, as its eyes open
put(music, EYES, fade(stereo(drone(4.2)), .1, .3), -14)
put(music, STARVE - HIT0, fade(score_all[:int((HIT0 + 2.2) * SR)], .25, .8))             # the title's hit, again
put(music, END_TITLE, fade(stereo(drone(4.2)), .2, 1.2), -12)

# ---------- the pictures' own sounds and a few heavy hits on top ----------
put(fx, TITLE, boom(), -9)
put(fx, 4.85, stereo(thump(70, .3, .4)), -14)                                       # his work bag on the counter
put(fx, 7.95, stereo(ping()), -16)                                                  # Mom's notification
put(fx, 10.9, stereo(click(.03, 1800)), -10)                                        # he grabs the handle
put(fx, POT, stereo(clang()), -4); put(fx, POT, boom(), -12)                        # SNAP 1: the pot in the sink
put(fx, BIRTH, W('sfx_stinger'), -9); put(fx, 13.45, stereo(whoosh(.5, 200, 1800)), -12)   # its eyes open; it steps off the wall
put(fx, 19.7, stereo(ping(2400, 1900, .2)), -18); put(fx, 19.75, stereo(fade(bed(.6, 900, 5000, .5), .02, .3)), -16)   # the glass tips, the juice
put(fx, SHOUT, boom(), -5); put(fx, SHOUT, W('sfx_stinger'), -7); put(fx, SHOUT, stereo(whoosh(.7, 120, 900)), -6)    # SNAP 2: the shout's blast
put(fx, CRAYON, stereo(click(.02, 2600)), -8); put(fx, CRAYON + .01, stereo(click(.015, 4200)), -12)                  # the crayon snaps
put(fx, 26.45, stereo(ping()), -16)                                                 # "Sam texted me"
put(fx, PUNCH - .02, W('sfx_wallpunch'), -2); put(fx, PUNCH, boom(), -11)           # SNAP 3: the fist through the wall
put(fx, 29.9, stereo(whoosh(.5, 800, 5000)), -20)                                   # the drawing slides down
put(fx, EYE, W('sfx_swell'), -15)                                                   # its eye in the hole
put(fx, BLOW - .01, W('sfx_wallpunch'), -3); put(fx, BLOW, W('sfx_doorthud'), -6); put(fx, BLOW, boom(), -8)          # SNAP 4: one blow on the hall wall
put(fx, CRACK, W('sfx_smash'), -8)                                                  # the hall mirror cracks
for k in range(9): put(fx, MONT0 + k * .333, stereo(glitch(.08)), -18 if k % 2 else -14)   # the montage's cuts
put(fx, IT, boom(), -7); put(fx, IT, W('sfx_stinger'), -6)                          # IT in every shard
put(fx, HORNS, W('sfx_stinger'), -5); put(fx, HORNS, boom(), -9)                    # the horns on Sam's shadow
put(fx, PRY, boom(), -6); put(fx, PRY, stereo(whoosh(.6, 150, 1500)), -8); put(fx, PRY + .05, W('sfx_smash'), -14)    # his fist opens
put(fx, SCREAM, W('sfx_scream'), -5)                                                # it screams and shrinks
put(fx, AJAR, stereo(creak()), -14)                                                 # Sam opens the door a crack
put(fx, 61.15, stereo(click(.02, 2200)), -14)                                       # his reply to Mom, sent
put(fx, TURN, boom(), -7)                                                           # DAY 1: the turn
put(fx, 65.05, stereo(fade(bed(1.1, 300, 3000, .6), .05, .3)), -18)                 # the gym's shutter rolls up
put(fx, PULLDROP, stereo(thump(80, .25, .3)), -12)                                  # DAY 1: he drops off the bar
put(fx, 88.9, stereo(ping(2400, 1900, .2)), -18)                                    # the juice again
put(fx, 89.15, stereo(whoosh(.4, 300, 2600)), -12)                                  # it leaps from under the table
put(fx, 89.75, stereo(whoosh(.5, 300, 2600)), -16)                                  # its claws close on his fist
put(fx, ATTACK, W('sfx_scare'), -3)                                                 # the jump scare
put(fx, BACK, W('sfx_shriek'), -6); put(fx, BACK, boom(), -13)                      # his fist opens; it shrieks; the anthem is back
put(fx, 97.2, stereo(ping()), -16)                                                  # Mom: "Sam says you made dinner"
put(fx, BELL, stereo(bell()), -9)                                                   # the bell
put(fx, STARVE, boom(), -6)                                                         # IT STARVES.
put(fx, END_TITLE, boom(), -10)                                                     # the title

# ---------- master ----------
mix = master((music + fx)[:int(DUR * SR)])
end = int((DUR - 1.4) * SR); mix[end:] *= np.linspace(1, 0, len(mix) - end)[:, None]
write(os.path.join(HERE, 'audio', 'mix.wav'), mix)
lv = lambda a, b: round(20 * np.log10(np.sqrt((mix[int(a * SR):int(b * SR)] ** 2).mean()) + 1e-9), 1)
print(json.dumps({'loudness': report(mix), 'seconds': len(mix) / SR,
                  'lengths_s': {'SCORE': round(len(score_all) / SR, 2), 'RISE': round(len(W('music_RISE')) / SR, 2), 'ENDING': round(len(ending) / SR, 2)},
                  'title_hit_dbfs': lv(2.6, 3.0), 'starves_dbfs': lv(109.6, 110.0), 'doorway_dbfs': lv(105.5, 107.5), 'piano_lift_db': round(float(lift), 1),
                  'silences_dbfs': {'before IT 44.05-44.4': lv(44.05, 44.4), 'before the fist opens 53.1-54.0': lv(53.1, 54.0), 'attack gap 91.2-93.0': lv(91.2, 93.0)},
                  'sections_dbfs': {'cold open 0-2.5': lv(0, 2.5), '7:02 PM 3.3-18.1': lv(3.3, 18.1), 'the evening 18.1-37.1': lv(18.1, 37.1), 'held breath 37.3-38.5': lv(37.3, 38.5),
                                    'montage 41.0-43.9': lv(41.0, 43.9), 'reveal 44.5-52.7': lv(44.5, 52.7), 'aftermath 55.4-63.3': lv(55.4, 63.3), 'anthem 63.5-89.5': lv(63.5, 89.5),
                                    'anthem again 93.2-99.5': lv(93.2, 99.5), 'piano 100.6-105.3': lv(100.6, 105.3)}}))
