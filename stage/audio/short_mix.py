"""A Short's sound, built the way the film's is: from the Short's own cues_edit.json (`node stage/render.mjs
shorts/NN-slug cues` writes it: its pieces of the film's edit, every cut and its kind, its own words, the end card).
  1. under every piece: the film's finished mix for the same moment (the film's music, its actions, its own cut sounds);
     a piece played at another speed gets it at that speed (slower = lower, like tape)
  2. on every cut the Short makes (a jump in the film, the window punching in or out, a beat of black): the stage's cut
     sounds, so the joins in the music are covered and there is a sound on every cut
  3. the Short's own words: the marker for a written line, the slam for slammed capitals
  4. the end card: a low hit, the film carrying on under it and fading, three notes
then the master: -16 LUFS (a film is -18), -2.5 dBTP (AAC can add a full dB on a hard transient).
run:  python stage/audio/short_mix.py shorts/43-bottle-hook      (from anywhere; builds the film's mix first if it is missing)
writes shorts/NN-slug/mix.wav and prints the report: loudness, events a second, the phone band second by second, and every
stretch a phone would play as silence (there must be none before the last fade)."""
import json, os, re, subprocess, sys
ME = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, ME)
folder = os.path.abspath(sys.argv[1]); REPO_ = os.path.abspath(os.path.join(ME, '..', '..'))
m = re.search(r'^//\s*film:\s*(\S+)', open(os.path.join(folder, 'short.js'), encoding='utf8').read(), re.M)
film = os.path.join(REPO_, m.group(1))
import sound; sound.start(folder, sfx_from=film); from sound import *

film_mix = os.path.join(film, 'audio', 'mix.wav')
if not os.path.exists(film_mix):
    print('building the film mix first:', os.path.relpath(film_mix, REPO_), file=sys.stderr)
    subprocess.run([sys.executable, os.path.join(film, 'mix.py')], check=True, stdout=subprocess.DEVNULL)
fm = load(film_mix); P = ED['pieces']; endAt = ED['endAt']

# 1. the film's own sound under every piece
for p in P:
    x = fm[int(p['a'] * SR):int(p['b'] * SR)]
    if abs(p['sp'] - 1) > 1e-3:                                    # slower = lower, like tape, and as long as the piece is on screen
        pos = np.arange(int(round(len(x) / p['sp']))) * p['sp']; pos = pos[pos < len(x) - 1]   # (varispeed() keeps the length: a hole at the end)
        x = np.stack([np.interp(pos, np.arange(len(x)), x[:, ch]) for ch in (0, 1)], axis=1)
    put(music, p['t0'], fade(x, .008, .015), 0)

# 4. the end card
if endAt < DUR - .2:
    d = DUR - endAt; b = P[-1]['b']; tailx = fm[int(b * SR):int((b + d) * SR)]
    if len(tailx): put(music, endAt, fade(tailx, .01, min(1.6, d * .8)), -5)
    put(fx, endAt, stereo(lay(boom(1.6) * .6, thump(110, .3, .3), thump(280, .12, .3) * .6, nrm(vs(impact[:int(1.2 * SR)], 5), .4))), -4)
    scratch(endAt + .05, .45, False, 0, 4); scratch(endAt + .45, .5, True, .1, 2)                    # the title, the line
    for k, n in enumerate(('G6', 'D6', 'G5')): put(fx, endAt + 1.0 + k * .16, stereo(mbox(hz(n), .7), -.2 + .2 * k), -5)   # the way to the film

# 3. the Short's own words
for cp in ED['caps']:
    if cp['slam']: put(fx, cp['t'], stereo(slamhit()), 0)
    else: scratch(cp['t'], max(.25, cp['write']), cp['kind'] == 'devil', 0, 3)

# 2. every cut the Short makes
cut_sounds(cuts=ED['cuts'], over=1.5)

print(json.dumps(finish(os.path.join(folder, 'mix.wav'), target=-16.0, ceiling=-2.5, tail=.4, until=DUR - .5), indent=1))
