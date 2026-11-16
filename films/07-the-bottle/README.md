# Film 07: THE BOTTLE | She Waited Till Dark

- **Status:** built on the Mac on 16 Nov 2026 at the owner's request ("create a new video below 2 minutes… I still
  couldn't get it right"). **Not uploaded**: it waits for the owner to watch it and say yes. `publish.json` is ready
  (no release time in it yet); `thumb_code.jpg` is the code-drawn stand-in thumbnail.
- **What it is:** 1:44 (103.9 s), 16:9, 1920 x 1080, 30 fps, no narration, an ElevenLabs score, the devil's words on
  screen, 60 shots (1.7 s on average; only the cold open and the last picture run over 3 s).
- **The story** is in `STORY.md` (the spine, every word on screen, the beat table, the critic's round and what changed).
  In one line: a father stops for one free drink before picking up his six-year-old; every drink costs him something
  he slides across the bar himself (his watch, his ringing phone, her photo), each corked in a bottle on the devil's
  shelf; she will not hug him that night; he earns it back by DAY 90.

## What is new against films 03-06 (they were watched 5 to 14 times each)

| | THE BOTTLE | 03-06 |
|---|---|---|
| Structure | THE DEAL: the devil is the bartender; three rounds, three trades | NIGHTS, NIGHTS, NIGHTS, ONE NIGHT |
| How it closes in | behind the bar, leaning over it, then its face at his ear and its arm round his shoulders; its shelf fills | a step closer each night; growing |
| Place | a bar at dusk, cut against the school steps | the bedroom, the kitchen |
| Palette | deep teal and amber glass light; indigo rain; Lily's yellow (the only yellow); pink-gold mornings | red, casino green, icy blue, ember orange |
| Who we care about | Lily, six, in a yellow raincoat: one picture that gets worse three times, no text | banners on a phone |
| Reveal | the photo in the third bottle turns its head and knocks on the glass; cut to her real knuckles on the stone step | the black glass, the cracked mirror |
| Comeback | training with her in every shot (the doorway, the bike, the next bar, his back), and the hug is withheld until the last minute | a gym montage alone |
| Clocks | a small time stamp in the corner of the picture | full-screen clock cards |
| Picture | a finishing pass on every shot (bloom, grain), lamp cones, haze, rain with wet reflections, blur near the lens, a keyframed camera | flat lit rooms |
| Cut | on the music: the bar on the score's beats (100 bpm), the comeback on the anthem's (127 bpm) | by the table |

## Files

- `src/`: the film in parts; `build.sh` joins them into `film.js` (edit the parts, never `film.js`).
  `00-kit.js` the film's drawing kit (camera keys, light, rain, wet reflections, the finishing pass, a jointed figure
  for the man, Lily, the bottle, the glass, the devil's hand close, clocks, the time stamp); `10-bar.js` the bar and its
  wide shots; `20-macro.js` the bar close (the cold open, pour, slide, the bottles, the twist, the smash); `25-top.js`
  the bar from above (the three trades, the ringing phone, the grab); `28-faces.js` faces, the reveal, the montage;
  `30-school.js` the school steps (13 shots); `40-street.js` his phone, the bar's door, the run, the last picture;
  `50-comeback.js` the walk home and the mornings; `80-end.js` the closing words, the words' own drawing (bigger than
  the engine's, for phones; a Short keeps the engine's), the code thumbnail; `90-film.js` the cut. `src/README.md` is
  the brief the parts were built to.
- `music.json`, `audio/music`, `audio/sfx` (the ElevenLabs mp3s and prompts), `mix.py` (the sound into `audio/mix.wav`).
- Rebuild: `films/07-the-bottle/build.sh`, `python films/07-the-bottle/mix.py`, `node engine/render.mjs film films/07-the-bottle --jobs 2`.
- `dev.sh <name>` builds one part alone with a test cut in `dev-<name>/cut.js` (not committed).

## Sound (numbers only: nobody has listened to it)

ElevenLabs: SCORE (50 s: an opening blast, a 100 bpm bar groove with a detuned bar piano, a last big hit), RUN (10 s),
SAD (three lone piano notes), RISE (the 127 bpm anthem), ENDING (piano and strings), two effects (a pour, knocking on
glass); about 2,080 credits. `mix.py` places them on the cut: the groove stops dead at 40.33 when his glass is empty;
4.8 s of near silence (the tapped glass, her knocking, the real knuckles); the score's biggest hit on his face at
45.13; a hit on each red line; a second of nothing; the smash turns the music (RUN); three piano notes for the steps
and the walk home; RISE from DAY 1, cut dead at the bar's door on DAY 60 (a heartbeat and rain), back softly when her
hand takes his; ENDING from the golden hour; the bar piano detuned under its last line; the opening blast again on
SHE DOES. Mastered to -18 LUFS, true peak -2 dBTP (`mix.py` prints the report).

## Not done, not verified

- Nobody has listened to the sound; the levels are judged from numbers.
- The vertical (Short) framing was looked at for the school and comeback parts only (one sheet each).
- The ChatGPT thumbnail (`/idf thumb 07`), the upload, the seven Shorts.
