"""GAMBLING | The House Always Wins: the sound. Music only, no narration: the extreme ElevenLabs score carries the film,
its sections changing on the film's turns (the title, the nights, the zeros, the snap); at 6:00 AM it stops dead on a
boom and the comeback anthem RISE takes over, dropping out only while it attacks on payday; weeks later a calm piano,
the casino chime comes back detuned with the coin, then the score's biggest hit on "STILL ME.". A few heavy hits on top
and three planned silences (the phone full of zeros, before the snap, the payday attack).
run: python films/04-gambling/mix.py   (any folder; writes films/04-gambling/audio/mix.wav and prints a report)
Sources: audio/music/*.mp3 and audio/sfx/*.mp3 (made by music.json with engine/audio/music.mjs)."""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, '..', '..', 'engine', 'audio'))
import numpy as np
from mixlib import *

DUR = 112.0
TURN, ATTACK, BACK = 61.8, 85.5, 87.2          # 6:00 AM; the payday jump scare; he deletes the app
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


# ---------- the horror score: 0:00-1:01.8, its sections change on the film's turns ----------
score_all = W('music_SCORE')
score = score_all[:int(TURN * SR)]
score = mute(score, 0, 43.6, 44.55)            # the zeros pour down the dead phone: dead silence
score = mute(score, 0, 54.6, 56.2, .25)        # silence before he snaps the card
put(music, 0, fade(score, .01, .05))           # ...and it stops dead at 6:00 AM
# ---------- he starts to change: the anthem ----------
rise = W('music_RISE')
rise = rise[:int((98.4 - TURN) * SR)]
rise = mute(rise, TURN, ATTACK, BACK, .01, .15)  # it drops out while the devil attacks, back when he deletes the app
put(music, TURN, fade(rise, .01, .4))
# ---------- weeks later: calm piano, then it comes back ----------
ending = W('music_ENDING')
put(music, 98.4, fade(ending[:int(4.1 * SR)], .3, .5), -5)
chime = score_all[int(6.0 * SR):int(8.2 * SR)]                                         # the casino chime of the nights
put(music, 101.9, fade(stereo(varispeed(chime, .95, .88)), .02, .3), -4)              # ...detuned, as its eyes open
put(music, 101.9, fade(stereo(drone(2.3)), .1, .2), -14)
hit_at = 43.6 + 6.0                                                                     # the reveal's first massive hit
slam = score_all[int((hit_at - .15) * SR):int((hit_at + 2.4) * SR)]
put(music, 106.3 - .15, fade(slam, .005, .8))                                           # the score's biggest hit, again
put(music, 108.4, fade(stereo(drone(3.6)), .2, 1.2), -12)

# ---------- a few heavy hits on top ----------
put(fx, 3.9, boom(), -9)                        # the title
put(fx, 49.6, W('sfx_stinger'), -6)             # it is in the room
put(fx, 52.4, boom(), -11)                      # "YOU."
put(fx, 56.2, W('sfx_snap'), -3); put(fx, 56.2, boom(), -8)   # the card snaps
put(fx, 56.9, W('sfx_scream'), -5)              # it screams as the cards burn
put(fx, TURN, boom(), -7)                       # the turn
put(fx, ATTACK, W('sfx_scare'), -3)             # payday: the jump scare
put(fx, 89.4, W('sfx_shriek'), -6)              # it shrieks as the app goes
put(fx, 102.4, W('sfx_coin'), -6)               # the coin in the doorway
put(fx, 106.3, boom(), -6)                      # STILL ME.
put(fx, 108.4, boom(), -10)                     # the title

# ---------- master ----------
mix = master(filt(music + fx, 'high', 25)[:int(DUR * SR)])
end = int((DUR - 1.4) * SR); mix[end:] *= np.linspace(1, 0, len(mix) - end)[:, None]
write(os.path.join(HERE, 'audio', 'mix.wav'), mix)
lv = lambda a, b: round(20 * np.log10(np.sqrt((mix[int(a * SR):int(b * SR)] ** 2).mean()) + 1e-9), 1)
print(json.dumps({'lufs': round(lufs(mix), 2), 'true_peak_dbtp': round(true_peak(mix), 2), 'seconds': len(mix) / SR,
                  'lengths_s': {'SCORE': round(len(score_all) / SR, 2), 'RISE': round(len(W('music_RISE')) / SR, 2), 'ENDING': round(len(ending) / SR, 2)},
                  'silences_dbfs': {'zeros 43.7-44.4': lv(43.7, 44.4), 'before the snap 54.8-56.1': lv(54.8, 56.1), 'attack gap 86.4-87.1': lv(86.4, 87.1)},
                  'sections_dbfs': {'intro 0-3.8': lv(0, 3.8), 'nights 4.5-43.5': lv(4.5, 43.5), 'reveal 44.6-54.5': lv(44.6, 54.5),
                                    'anthem 62-85': lv(62, 85), 'ending 98.4-104': lv(98.4, 104)}}))
