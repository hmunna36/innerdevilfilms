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

DUR = 117.0
TURN, ATTACK, BACK = 66.2, 90.6, 92.3          # 6:00 AM; the payday jump scare; he deletes the app
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


# ---------- the cold open: the score's own riser and hit, moved so the hit lands on the title (3.2) ----------
score_all = W('music_SCORE')
HIT0 = 1.0                                       # in SCORE.mp3 the intro rises from 0.1 s into its hit at 1.0 s
put(music, 0, fade(stereo(drone(2.6)), .4, .4), -18)                                    # a low drone under the cold line
put(music, .1, fade(score_all[int(1.1 * SR):int(3.3 * SR)][::-1], .5, .25), -12)        # the hit's tail reversed: a swell
put(music, 3.2 - HIT0, fade(score_all[:int((4.45 - (3.2 - HIT0)) * SR)], .01, .2))      # the riser from 2.3, THE HIT at 3.2
# ---------- the horror score from night 1 to 6:00 AM, its sections changing on the film's turns ----------
score = score_all[:int(TURN * SR)]
score = mute(score, 0, 0, 4.3, .01, .2)          # (its own intro is the one above)
score = mute(score, 0, 47.9, 48.85)              # the zeros pour down the dead phone: dead silence
score = mute(score, 0, 59.0, 60.6, .25)          # silence before he snaps the card
put(music, 0, fade(score, .01, .05))             # ...and it is gone by 6:00 AM (its own aftermath fades out by 64 s)
# ---------- he starts to change: the anthem, its opening impact on 6:00 AM ----------
RISE0 = .95                                      # RISE.mp3 rises for .95 s into its first impact
rise = W('music_RISE')
rise = mute(rise, TURN - RISE0, ATTACK, BACK, .01, .15)   # it drops out while the devil attacks, back when he deletes the app
put(music, TURN - RISE0, fade(rise, .3, .4))      # (it fades out on its own as he goes to sleep, about 97-98 s)
# ---------- weeks later: calm piano, then it comes back ----------
ending = W('music_ENDING')
put(music, 101.1, fade(ending[:int(5.9 * SR)], .05, .6), -5)
chime = filt(score_all[int(4.4 * SR):int(7.6 * SR)], 'high', 450)                       # the casino chime over the first pulse
put(music, 106.8, fade(stereo(varispeed(chime, .95, .88)), .02, .4), 6)                 # ...detuned, as its eyes open
put(music, 106.8, fade(stereo(drone(2.4)), .1, .2), -14)
put(music, 111.2 - .25, fade(score_all[int((HIT0 - .25) * SR):int((HIT0 + 2.4) * SR)], .005, .8))   # the title's hit, again
put(music, 113.3, fade(stereo(drone(3.7)), .2, 1.2), -12)

# ---------- a few heavy hits on top ----------
put(fx, 3.2, boom(), -9)                        # the title
put(fx, 53.9, W('sfx_stinger'), -6)             # it is in the room
put(fx, 57.1, boom(), -11)                      # "YOU." (his own face on the card)
put(fx, 60.6, W('sfx_snap'), -3); put(fx, 60.6, boom(), -8)   # the card snaps
put(fx, 61.3, W('sfx_scream'), -5)              # it screams as the cards burn
put(fx, TURN, boom(), -7)                       # the turn
put(fx, ATTACK, W('sfx_scare'), -3)             # payday: the jump scare
put(fx, 94.5, W('sfx_shriek'), -6)              # it shrieks as the app goes
put(fx, 107.2, W('sfx_coin'), -6)               # the coin in the doorway
put(fx, 111.2, boom(), -6)                      # STILL ME.
put(fx, 113.3, boom(), -10)                     # the title

# ---------- master ----------
mix = master((music + fx)[:int(DUR * SR)])
end = int((DUR - 1.4) * SR); mix[end:] *= np.linspace(1, 0, len(mix) - end)[:, None]
write(os.path.join(HERE, 'audio', 'mix.wav'), mix)
lv = lambda a, b: round(20 * np.log10(np.sqrt((mix[int(a * SR):int(b * SR)] ** 2).mean()) + 1e-9), 1)
print(json.dumps({'loudness': report(mix), 'seconds': len(mix) / SR,
                  'lengths_s': {'SCORE': round(len(score_all) / SR, 2), 'RISE': round(len(W('music_RISE')) / SR, 2), 'ENDING': round(len(ending) / SR, 2)},
                  'chime_dbfs': lv(106.9, 108.9), 'title_hit_dbfs': lv(3.2, 3.6), 'still_me_dbfs': lv(111.2, 111.6), 'silences_dbfs': {'zeros 48.0-48.7': lv(48.0, 48.7), 'before the snap 59.2-60.5': lv(59.2, 60.5), 'attack gap 91.5-92.2': lv(91.5, 92.2)},
                  'sections_dbfs': {'intro 0-3.1': lv(0, 3.1), 'nights 3.8-47.8': lv(3.8, 47.8), 'reveal 48.9-58.9': lv(48.9, 58.9),
                                    'anthem 66.5-90.5': lv(66.5, 90.5), 'ending 101.1-106.7': lv(101.1, 106.7)}}))
