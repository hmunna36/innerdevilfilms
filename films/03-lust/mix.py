"""LUST | It Watches Back: the sound. Music only, no narration: the extreme ElevenLabs score carries the film, its sections
changing on the film's turns; at 6:00 AM it stops dead on a boom and the training anthem RISE takes over; weeks later a
calm piano, then the score's biggest hit comes back. A few heavy hits on top, three dead silences.
run: python films/03-lust/mix.py   (any folder; writes films/03-lust/audio/mix.wav and prints a report)
Sources: audio/music/*.mp3 and audio/sfx/*.mp3 (made by music.json; the original scripts are in original/tools)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'engine', 'audio'))
import numpy as np
from mixlib import *

DUR = 110.5
W = lambda name: src(HERE, name)
music, fx = (np.zeros((int(DUR * SR) + SR, 2)) for _ in range(2))


def put(bus, t, x, gain_db=0.0, pan=0.0):
    x = stereo(x, pan) if x.ndim == 1 else x
    i = int(t * SR); x = x[:max(0, len(bus) - i)]
    bus[i:i + len(x)] += x * db(gain_db)


def mute(x, t0, a, b, ramp=.02, back=.02):  # silence a stretch of a clip placed at t0 (a, b in film time)
    g = np.ones(len(x)); i, j, r, q = int((a - t0) * SR), int((b - t0) * SR), int(ramp * SR), int(back * SR)
    g[i - r:i] = np.linspace(1, 0, r); g[i:j] = 0; g[j:j + q] = np.linspace(0, 1, q)
    return x * g[:, None]


# ---------- the horror score: 0:00-1:00.6, its sections change on the film's turns ----------
score = W('music_SCORE')[:int(60.6 * SR)]
score = mute(score, 0, 43.0, 43.8)            # the phone dies: dead silence
score = mute(score, 0, 53.7, 55.15, .25)      # silence before he throws it
put(music, 0, fade(score, .01, .05))          # ...and it stops dead at 6:00 AM
# ---------- he starts to change: the music turns into a training anthem ----------
rise = W('music_RISE')[:int(34.9 * SR)]
rise = mute(rise, 60.6, 84.3, 86.0, .01, .15)  # it drops out while the devil attacks, back when he deletes the app
put(music, 60.6, fade(rise, .01, .3))
# ---------- weeks later: calm piano, then it comes back ----------
M1, M4 = W('music_M1'), W('music_M4')
put(music, 95.5, fade(M4[:int(4.6 * SR)], .3, .3), -6)
put(music, 100.1, fade(stereo(varispeed(M1[:int(1.8 * SR)], .94, .9)), .02, .25), -2)   # the lullaby's first notes, detuned
put(music, 100.1, fade(stereo(drone(1.6)), .1, .2), -14)
slam = W('music_SCORE')[int(59.8 * SR):int(62.4 * SR)]                                   # the score's biggest hit, again
put(music, 103.9, fade(slam, .005, .8))
put(music, 105.9, fade(stereo(drone(4.6)), .2, 1.2), -12)

# ---------- a few heavy hits on top ----------
put(fx, 3.4, boom(), -9)
put(fx, 48.6, W('sfx_stinger'), -6)
put(fx, 55.15, W('sfx_smash'), -5); put(fx, 55.2, W('sfx_scream'), -5)
put(fx, 60.6, boom(), -7)                     # the turn
put(fx, 84.3, W('sfx_scare'), -3)
put(fx, 88.2, W('sfx_shriek'), -6)
put(fx, 103.9, boom(), -6)
put(fx, 105.9, boom(), -10)

# ---------- master ----------
mix = master((music + fx)[:int(DUR * SR)])
end = int((DUR - 1.4) * SR); mix[end:] *= np.linspace(1, 0, len(mix) - end)[:, None]
write(os.path.join(HERE, 'audio', 'mix.wav'), mix)
lv = lambda a, b: round(20 * np.log10(np.sqrt((mix[int(a * SR):int(b * SR)] ** 2).mean()) + 1e-9), 1)
print(json.dumps({'loudness': report(mix), 'seconds': len(mix) / SR,
                  'silences_dbfs': {'phone dies 43.1-43.7': lv(43.1, 43.7), 'before the throw 54-55': lv(54, 55), 'attack gap 85.0-85.9': lv(85.0, 85.9)}, 'anthem_dbfs': lv(61, 84), 'horror_nights_dbfs': lv(4, 43)}))
