# THE BOTTLE | It Was So Small: the sound (17 Nov 2026, second pass)

Music and effects only. No narration, no voices, no words. **Nobody has listened to it**: everything below was judged
from measurements (levels, onsets, keys and tempos, the notes read back out of the mix).

`mix.py` reads every time from `cues.js`. After a cue moves: `. .claude/skills/idf/bin/env.sh && $PYTHON films/07-it-was-so-small/mix.py`
(about a minute). It writes `audio/mix.wav` (48 kHz stereo, exactly `END` seconds) and prints the report.

## The idea

The devil's music grows up with it. All of it is recorded now, in one key (G) and one waltz time (a bar every 1.5 s,
or every 3 s at half speed):

| Age | What plays |
|---|---|
| 21 | THEME: a light waltz. It vamps under the party, rests for one second while the eyes show in the foam, and the tune enters on the glockenspiel as it pops up; the tune's highest note lands on pop21. |
| 26 | THEME's second pass (a sparkle on top) with a soft string pad on its own chords; one wrong low note (E flat) at `shadow26`: the brass blast's ring, slowed. |
| 31 | LULLABY: a lone music box, one note a second (G, D, B: the tune's own notes). Its seven notes are re-spaced so the first is on the cut and the seventh on pop31. A low drone creeps in; the brass blast, far off, with the pop. |
| 34 | HEAVY: the waltz turned sinister, low brass and half-time drums, G minor, THEME's own tempo. The first tune ghosts over it, quietly, on the music box. It breaks off as the hand turns his chin, comes back hushed under "i'll talk. you rest.", and its last chord lands on pop34. |
| 38 | HEAVY at half speed (the same waltz an octave down) under DREAD's first hit and rumble; 0.4 s of almost nothing as it leans in; then the biggest hit of the film on `cantSee` (the HORROR blast, DREAD's second hit, HEAVY's last chord at half speed); the blast and the brass backwards, swelling; dead cut on `truth`. |
| Last picture | The first tune's opening two bars on the recorded music box, each note 5 to 30 cents out, running down. |
| "Every day." | The anthem's own last chord, with a boom under it. |

**The pop** (`pop(size)` in `mix.py`) is one designed sound: a quick upward "bloop" with a snap, and a thump under it.
The same at `popUp`, `pop21`, `pop26`, `pop31`, `pop34`, each time lower and heavier. `deflate()` plays it backwards
with a sagging wheeze at `flinch`, `slide`, `dropOff`.

## The pieces and what was measured in them

| File | What it is | Landmarks |
|---|---|---|
| `THEME.mp3` (49.5 s) | Asked for the tune at five ages; **it came out as one light waltz** (G major, 3/4, exactly 120 bpm). AGE 21, AGE 26 and, far off, the bar's music on DAY 60. | Vamp only 0-12 s; rest 11.0-12.0; the tune enters 12.034 s, runs twice (12-24, 24-36); last chord 46.5. Downbeats used: 9.034, 12.034, 21.05, 28.57. |
| `LULLABY.mp3` (9 s, new) | A lone music box in G major (+3 cents), 60 bpm. **No drone came with it** (the drone is a low tone made in `mix.py`). Its first two notes are clean single tines: `tine()` re-pitches them wherever the first tune is played on the music box. | Notes at 1.052 (G5), 2.054 (D6), 3.054 (D6+G6), 4.052 (B5+G5), 5.056 (G6+B5), 6.052 (G5), 7.052 (G5+G6); silent before 1.0 and after 8.5 s. Notes differ by 16 dB; `mix.py` sets them level. |
| `HEAVY.mp3` (12 s, new) | Low brass and drums, G minor (0 cents), 3/4 at exactly 120 bpm, starts at once. One chord a bar: Gm D Gm D Gm D, then a last Gm chord. | Downbeats 0.03, 1.53, 3.026, 4.526, 6.03, 7.526; last chord 9.022 s; rings out by 10.5 s. |
| `DREAD.mp3` (10 s, new) | **Not a continuous bed**: two colossal low hits with a rumble of low drums after each; almost nothing above 300 Hz once a hit has passed; no clear key. Used as the hits at the cut to AGE 38 and under `cantSee`. | Hits at 0.03 and 4.035 s; silent after about 7.5 s. |
| `HORROR.mp3` (12 s asked) | One colossal brass blast on a low G; only the first 3 s hold sound. Full on `cantSee`, far off under pop31 and pop34, backwards in the build, slowed to E flat as the wedding's wrong note. | Onset 0.026 s, second hit 0.74 s. |
| `RISE.mp3` (film 07-the-bottle's) | The anthem. Muffled and rising under DAY 1, the impact on `run`, cut dead at `day60`, back softly on the beat nearest `walkOn`, its last hit on `setDown`; that last chord again on `everyDay`. | Impact 0.026 s; a beat every 0.4687 s; last hit 22.054 s; silent by 23.5 s. |
| `ENDING.mp3` | Warm piano and strings: its first chord at `hand`; then from `newDraw`, its swell on `hug`. | First chord 0.03 s; swell from the note at 6.036 s. |
| `SAD.mp3` | Two lone piano notes on the fridge drawing. | Notes at 2.056, 6.054, 10.056 s. |
| `hiss`, `gulp`, `cork` (new effects) | The cap; the gulps at 26 and 31; the cork at 38 and on DAY 90. | hiss 0.068 s (its fizz is almost silent: the foam is made in `mix.py`); gulp 0.448-0.67 s; cork 0.118 s. |
| `pour`, `smash`, `swell`, `stinger` | The bar pour and the sink; the bottle breaking; the swell into the smash; under the biggest hit. | pour 0.176 s, smash 0.04 s. |

## What is still synthesized (numpy, in `mix.py`)

- **No synthesized brass, drums, choir or music box are left in the music.** AGE 31, 34 and 38 are recordings only,
  plus the low drone under the lullaby (a tone, not an instrument).
- A soft string pad (filtered saws): under the waltz at AGE 26, and as the thin part of the cold open's tone.
- Low drones (the cold open, AGE 31, the kitchen floor, the shelf at night) and a boom and a kick under the big hits.
- A small bright chime for its eyes blinking and for Lily's first smile.
- All the effects: the pops and deflates, flares, lick, burp, sneeze, glass clinks and tings, ticks for every written
  line, footsteps, paper, the cold note, the chair's creak, the sad party horn, room tone and clock, heartbeat, thuds
  and crack, glass tinkle, glugs and drain, crickets, the tiny stamping, breath and finger on glass, the taps.

## Loudness (the report of the last run, on the cues of 17 Nov 09:14)

- -18.0 LUFS, loudest 3 s -13.1, loudest 0.4 s -10.5, true peak -2.0 dBTP, 17 % of the energy under 60 Hz.
- The ten key hits (pop21, pop26, pop31, pop34, cantSee, smash, run, hand, hug, everyDay) each start within 2 ms of
  their cue in the finished mix (the report's `alignment`; the limit was 40 ms).
- Sections (dBFS): AGE 21 -23, AGE 26 -20, AGE 31 -25, AGE 34 -21, AGE 38 -17 (the hit on `cantSee` -12, the loudest
  moment of the film), anthem -17, DAY 90 -17, drawing and hug -22, the shelf at night -29, the last hit -15.
- The silences are never empty: a room and a clock after `truth`, a muffled clock and a heartbeat in the bottle, glass
  settling and a ring after the smash, crickets and the far-off waltz at the bar door. On a phone (300 Hz and up) they
  sit at -39 to -49 dBFS.
- The script was also run against cues moved by 0.15 to 0.4 s (in memory, `cues.js` untouched): it ran and every hit
  still landed.

## Credits

ElevenLabs balance 56,317 before the film, 54,987 now: **1,330 spent** (first pass 903: THEME, HORROR, three effects;
second pass 427: LULLABY, HEAVY, DREAD). Asked limit: about 2,000.

## Not verified, and what to know

- Nobody has listened. Keys and tempos were measured, so the pieces should sit together, but how the joins sound is
  unknown: the lullaby's re-spaced notes; HEAVY breaking off and coming back; HEAVY at half speed; the music box
  ghosting the tune over HEAVY (one line in `mix.py`, section 4, removes it).
- DREAD gave hits, not a sustained brass-and-choir bed, so AGE 38's bed is HEAVY at half speed. There is no choir.
- From AGE 31 on, the recordings do not play THEME's tune (LULLABY plays its notes G, D, B one a second; HEAVY has its
  own tune in G minor). The first tune itself returns on the music box over HEAVY and in the last picture.
- The footsteps at AGE 34 follow the picture's walk (3.5 steps a second, `WALK` in `mix.py`, from `src/40-age34.js`),
  not the music's beat (2 a second).
- The red line "one more." is ticked at `pour34 + 0.5` (that is where `src/40-age34.js` writes it; it has no cue).
- Written lines tick for 1.1 s (red) and 0.9 s (cream), the kit's defaults.
