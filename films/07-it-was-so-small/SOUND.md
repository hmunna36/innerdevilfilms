# THE BOTTLE | It Was So Small: the sound of the re-cut (17 Nov 2026, third pass)

Music and effects only. No narration, no voices, no words, no laughter. **Nobody has listened to it**: everything
below was judged from measurements (levels, onsets, keys and tempos, the phone-band silence check).

`mix.py` reads every time from `cues_edit.json` (`END`, `cues`, `cuts`) and nothing else. After a re-cut:
`node films/07-it-was-so-small/render.mjs cues`, then
`. .claude/skills/idf/bin/env.sh && $PYTHON films/07-it-was-so-small/mix.py` (about a minute). It writes
`audio/mix.wav` (48 kHz stereo, exactly `END` seconds) and prints the report: loudness, the ten key hits against
their cues, sound events per 10 s, the phone-band level of every second, and any stretch a phone would hear as
silence (the same measure as `wojak-story/scripts/silence-check.py`).

## What plays

| Where | Music | 
|---|---|
| Hook, `hk1` | The cap on the first frame, fizz, a warm tone swelling, a riser into the hit. |
| Hook, `hk2` | The biggest moment of the first ten seconds: the HORROR brass blast, a boom, the recorded impact, a growl (an engine-and-metal roar, not a voice), a slam on "17 YEARS LATER", the tiny fists on the glass. |
| Hook, `hk3` | Everything stops dead; a soft fizz, a chime as its eyes open, two curious music-box notes, a three-note run up into the waltz. |
| AGE 21 (`a21`) | THEME: the waltz kicks in on the cut, the tune at once. It is cut once, in one of its own rests, so that the tune's highest note lands on pop21. Played in a small room so its rests ring. |
| AGE 26 | THEME's second pass with a soft string pad; cut the same way so a downbeat lands on pop26; the wrong low note (the brass blast's ring slowed to E flat) at `shadow26`. |
| AGE 31 | LULLABY's seven music-box notes, re-spaced so the first is on the cut and the seventh on pop31, in a room; a drone creeping in; the brass far off with the pop. |
| AGE 34 | HEAVY (low brass, half-time drums, G minor, the waltz's tempo), the first tune ghosting over it on the music box. It is cut once on its own bar line, under the punch-in nearest to it, so that its last chord lands on pop34; it dips 5 dB for the line. |
| AGE 38 | HEAVY at half speed under DREAD's first hit; a riser as it leans in; on `cantSee` the loudest moment of the film (the blast, DREAD's second hit, HEAVY's last chord at half speed, the growl, a slam); the blast and the brass backwards, swelling; a cut on `truth`. |
| `truth` to the sink | A drop of about 10 dB, never silence: a fridge hum, a kitchen clock twice a second, a dripping tap; SAD's two piano notes on the fridge; inside the bottle the clock muffled, the bottle ringing, a heartbeat with a click in it; the thuds, the crack, the smash; the pour. |
| DAY 1 to DAY 40 | RISE, muffled and climbing, then its impact on `run`; a dead stop at `day60`. |
| DAY 60 | A drop of about 10 dB: crickets, the bar's music far off (the first waltz; there is no murmur of voices), a heartbeat with a click; ENDING's first chord on `hand`; RISE back softly at `walkOn`, its last hit on `setDown`. |
| Drawing, hug | ENDING, its strings' swell on `hug`. |
| Night | The first tune on the recorded music box, a little out of tune, running down; the kitchen clock. |
| Black | A riser through the black; RISE's own last chord, a boom and a slam on `everyDay`; two music-box notes on the title. |

**Every cut** has a sound: a whoosh on a `cut`, a tighter snap on a `punch` or `back`, a low thud with air on a
`black`; each one different (length, pitch, direction, side). Their level is set against what is playing in the
0.4 s either side: about 2.5 dB under it for a cut, 1 dB under for a snap, 2 dB over for a thud. No cut sound on the
cuts that are themselves a hit or a stop (`hk2`, `truth`, `run`, `day60`) or on the cut that ends a black.
**Every written line** has the marker: about 0.45 s for a white line, about 0.8 s, slower and doubled, for a red one;
an impact for the slammed capitals.
**The pop** (`pop(size)`) is the film's motif: the recorded cartoon pop on top, a made body and thump under it; lower
and heavier at `popUp`, `pop21`, `pop26`, `pop31`, `pop34`; backwards with the recorded balloon at `flinch`, `slide`,
`dropOff`.

## Recorded and made

Recorded (ElevenLabs): all the music; the cap (`hiss`); the pop's top (`bloop`); the marker; glass clinks (the toast,
the tings, the flask, the bottle set down, under the taps); the balloon (`deflate`); footsteps (`steps`: the two pairs
of feet, the small feet leaving, the run, the stop, her run, under the bumps); knuckles on glass (`knock`, from film
07-the-bottle); the `growl`; the `impact` (the weight under hk2, cantSee, the smash and `run`; played 5 to 9 times
faster it is the hard knock in the slams and the black thuds); `gulp`, `cork`, `pour`, `smash`, `swell`, `stinger`;
and as layers only, because they came out weak: `fizz` (nearly all above 6 kHz), `zoom` (a 0.15 s swish) and
`whoosh` (a short low "whup").

Made in `mix.py` (numpy): the air of every whoosh and snap and every riser; the pop's body and thump; flares, lick,
burp, sneeze, the shake; the chimes (its eyes, Lily's smile, his laugh); paper; the cold note; the chair's creak; the
sad party horn; the chair scrape; the clock, the fridge, the tap; the heartbeat; the crack and the glass settling;
glugs and drain and the mid layer of every pour; breath, the finger on glass, the tiny stamping; crickets; room tone;
booms; the string pad (the hook's tone, AGE 26) and the low drones.

## What was measured in the pieces

THEME: G major, 3/4, 120 bpm, a bar every 1.5 s, the tune from 12.034 s, a 0.75 s rest before every second bar.
LULLABY: G major, notes at 1.052 to 7.052 s, one a second. HEAVY: G minor, 120 bpm, chords Gm D, downbeats
0.03 + 1.5 k, last chord 9.022 s. DREAD: hits at 0.03 and 4.035 s. HORROR: blast at 0.026 s. RISE: impact 0.026 s,
beats every 0.4687 s, last hit 22.054 s. ENDING: swell from 6.036 s. SAD: notes at 2.056 and 6.054 s. Effects:
bloop 0.04 s; steps 0.14 s then every 0.3 s; knock 0.08, 0.56, 0.82, 1.10 s; zoom peak 0.075 s; hiss 0.068 s;
gulp 0.448 to 0.67 s; cork 0.118 s; pour 0.176 s; smash 0.04 s. (All in the comments at the top of `mix.py`.)

## The report of the last run (cues_edit.json of 17 Nov 10:09)

- -18.0 LUFS, loudest 3 s -13.9, loudest 0.4 s -10.7, true peak -2.0 dBTP, 16 % of the energy under 60 Hz; 86.183 s.
- Key hits, ms after their cue: hk2 0, pop21 0, pop26 2, pop31 2, pop34 0, cantSee 2, smash 0, run 0, hug 2,
  everyDay 0.
- Sound events placed (effects, merged within 0.1 s) per 10 s: 27, 22, 23, 23, 39, 22, 29, 17, 13 (last 6 s):
  2.4 a second in the first 40 s, 2.5 a second over the film. Onsets heard in the finished mix: 3.9 a second in the
  first 40 s, 4.1 over the film.
- Silence check (`silence-check.py`, phone band 300 Hz to 6 kHz): **no stretch of 1 s or more under -38 dB**. First
  second -23 dB, second and third -20 and -19 (the hit). Quietest seconds: -33 (the truth), -31 (the bar door),
  -29 (the black before the last hit). The seconds of the film sit within 8 dB (10th to 90th percentile).
- The drops, phone band: the truth -31, inside the bottle -28.5, the bar door -29, against -20 to -23 around them.

## Credits

ElevenLabs balance 56,317 before the film, 54,765 now: **1,552 spent** on this film (first pass 903, second 427,
this pass 222 for ten effects: about 22 each, not the 200 the tool estimates).

## Not verified, and what to know

- Nobody has listened. In particular: how loud the cut sounds feel (they are set by measurement), whether the made
  whooshes sound like the reference's, the growl, and the joins in the music (THEME cut in its rests, HEAVY cut on a
  bar line, HEAVY at half speed).
- The recorded whoosh and zoom came out weak, so the whooshes are mostly made air. A second try at recorded whooshes
  and a dozen other effects (chair creak, party horn, paper, clock, crickets, glass smash, drain) would cost about
  300 credits; it was not done.
- The two pairs of feet at AGE 34 are seven footfalls spread over the shot (`a34` to `bar34`), which is what the
  picture's walk gives; "one more." is scratched at `pour34 + 0.3`; neither has a cue.
- Written lines are scratched for the lengths given for this edit (white 0.45 s, red 0.8 s); if the picture writes
  slower or faster the scratch will end early or late.
