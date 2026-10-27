"""LUST | It Watches Back: places the devil's voice, the music and the sound on the cut, masters to -14 LUFS.
run: ~/.cache/cp/venv/bin/python -I mix.py   (from tools/; writes ../audio/mix.wav and prints a report)"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np, soundfile as sf
from mixlib import *

DUR = 104.0
A = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'audio')
W = lambda name: load(os.path.join(A, 'wav', name + '.wav'))
voice, music, fx = (np.zeros((int(DUR * SR) + SR, 2)) for _ in range(3))


def put(bus, t, x, gain_db=0.0, pan=0.0):
    x = stereo(x, pan) if x.ndim == 1 else x
    i = int(t * SR); x = x[:max(0, len(bus) - i)]
    bus[i:i + len(x)] += x * db(gain_db)


def norm(x, target):                                  # set a clip to a loudness before placing it
    return x * db(target - lufs(x if x.ndim == 2 else stereo(x)))


# ---------- the devil's voice: [id, start] (starts nudged so no line runs into the next) ----------
PLACE = [('VO01', .1), ('VO02', 5.1), ('VO03', 8.0), ('VO04', 11.3), ('VO05', 14.9), ('VO06', 19.3), ('VO07', 22.9),
         ('VO08', 27.3), ('VO09', 32.6), ('VO10', 39.95), ('VO11', 44.1), ('VO12', 46.7), ('VO13', 50.75), ('VO14', 53.2),
         ('VO16', 61.5), ('VO17', 65.4), ('VO18', 77.2), ('VO20', 86.4), ('VO21', 93.8)]
REAL = {'VO11', 'VO12', 'VO13', 'VO14', 'VO21'}       # its real voice
RATE = {'VO12': 1.12}                                 # 'in you' must end before the 0:48.6 stinger
report = []
for vid, t in PLACE:
    x = W('takes_' + vid)
    if vid in RATE: x = stereo(stretch(mono(x), RATE[vid]))        # a touch quicker, to land before a hit
    y = demon(x, .7) if vid == 'VO12' else demon(x) if vid in REAL else demon(x, .5) if vid == 'VO18' else kind(x)   # 'in you' blurs at full depth
    y = norm(stereo(y), -17 if vid in REAL else -19)
    put(voice, t, fade(y, .004, .03))
    report.append((vid, t, round(len(y) / SR, 2)))
c = np.cumsum(np.abs(mono(voice))); w = int(.25 * SR)
vo_env = np.pad((c[w:] - c[:-w]) / w, (w // 2, w - w // 2))      # a quarter-second moving average
duck = 1 - 0.45 * np.clip(vo_env / (vo_env.max() * .15 + 1e-9), 0, 1)   # music dips about 5 dB under the voice

# ---------- music ----------
M1, M2, M3, M4 = (W('music_' + m) for m in ('M1', 'M2', 'M3', 'M4'))
m1 = norm(M1, -26)[:int(36 * SR)]                     # the lullaby, nights 1-4
put(music, 4.0, fade(m1, .5, .05))
warp = stereo(varispeed(norm(M1, -24)[int(33 * SR):], 1.0, 1.9))[:int(3.0 * SR)]   # it speeds up and warps
put(music, 40.0, fade(warp, .02, .02))                # ...and stops dead at 0:43
m2 = norm(M2, -23)
cut = np.ones(len(m2)); a, b = int((53.0 - 43.8) * SR), int((55.2 - 43.8) * SR)
cut[a:b] = 0; cut[a - 2400:a] = np.linspace(1, 0, 2400)
put(music, 43.8, fade(m2 * cut[:, None], .8, .4))     # silence before the throw
m3 = norm(M3, -21)
gap = np.ones(len(m3)); a, b = int((77.2 - 60.6) * SR), int((78.3 - 60.6) * SR)
gap[a:b] = 0; gap[b:b + 4800] = np.linspace(0, 1, 4800)
put(music, 60.6, fade(m3 * gap[:, None], .3, .6))     # drops out for the jump scare
m4 = norm(M4, -27)[:int(4.6 * SR)]
put(music, 89.0, fade(m4, .4, .3))
notes = stereo(varispeed(norm(M1, -24)[:int(1.8 * SR)], .94, .9))   # the lullaby's first notes, detuned
put(music, 93.6, fade(notes, .02, .25))
put(music, 99.4, fade(stereo(drone(4.6)), .2, 1.2), -20)

# ---------- sound ----------
put(fx, 2.3, W('sfx_swell'), -8)
for t in (3.4, 97.4, 99.4): put(fx, t, boom(), -6 if t == 97.4 else -9)
for t in (3.4, 42.6, 55.15, 58.6, 77.2, 81.2, 95.2): put(fx, t, glitch(.45 if t != 95.2 else .6), -14)
for t in (4, 14, 22, 30, 60.6, 64, 71, 75, 85): put(fx, t, tick(), -16); put(fx, t, thump(60, .4, .2), -22)
for t in (9.8, 15.0, 23.0, 31.0, 76.0): put(fx, t, ping(), -20)
for t in (10.7, 15.9, 23.9, 31.9): put(fx, t, whoosh(.28, 600, 5000), -22, .3)
for k in range(13): put(fx, 30 + k, heartbeat(), -24 + k * .9)
put(fx, 43.5, click(.05, 1800), -16)
put(fx, 48.6, W('sfx_stinger'), -6); put(fx, 48.6, thump(40, .9, .6), -10)
put(fx, 51.0, whoosh(.35, 200, 2500), -18)
put(fx, 54.8, whoosh(.35, 300, 6000), -12, .4)
put(fx, 55.15, W('sfx_smash'), -5); put(fx, 55.2, W('sfx_scream'), -5)
put(fx, 61.4, fade(stereo(bed(2.6, 800, 9000, .25)), .2, .3), -18)                    # shower
put(fx, 64.8, steps(6.2), -17)
put(fx, 71.8, ping(660, 880, .4), -22)
put(fx, 77.2, W('sfx_scare'), -4)
for t in (79.3, 79.6): put(fx, t, click(.02, 2600), -22)
put(fx, 80.25, click(.04, 1500), -16)
put(fx, 81.2, W('sfx_shriek'), -6)
for t in (82.6, 83.0): put(fx, t, whoosh(.18, 1500, 7000), -24)
put(fx, 84.0, ping(990, 1320, .26), -24)
put(fx, 90.4, fade(stereo(bed(4.8, 200, 2500, .05)), .3, .3), -24)
for t in (91.1, 92.4, 93.2): put(fx, t, drip(), -18)
for t0, t1 in ((4, 43), (59.2, 60.6), (85.8, 89)):                                         # room tone in the nights
    put(fx, t0, fade(stereo(bed(t1 - t0, 30, 600, .02)), .3, .3))
music[int(43.0 * SR):int(43.8 * SR)] = 0                                                   # total silence as the phone dies
a, b = int(43.15 * SR), int(43.35 * SR); voice[a:b] *= np.linspace(1, 0, b - a)[:, None]; voice[b:int(44.05 * SR)] = 0
fx[int(43.6 * SR):int(43.8 * SR)] *= 0

# ---------- master ----------
mix = voice + music * duck[:, None] + fx
mix = filt(mix, 'high', 25)[:int(DUR * SR)]
mix *= db(-14 - lufs(mix))
mix = limit(mix, -2.0)
mix *= db(-14 - lufs(mix)); mix = limit(mix, -2.0)   # AAC adds about half a dB
end = int((DUR - 1.4) * SR); mix[end:] *= np.linspace(1, 0, len(mix) - end)[:, None]
sf.write(os.path.join(A, 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
print(json.dumps({'lufs': round(lufs(mix), 2), 'true_peak_dbtp': round(true_peak(mix), 2), 'seconds': len(mix) / SR,
                  'voice': report}, indent=None))
