# Making a film (`/idf film next`)

Target: 1:20-2:00, 1920x1080, 30 fps, no narration, code-drawn on the stage in the look of THE BOTTLE | It Was So Small
(`films/07-it-was-so-small`, 1:26). Read these before writing a line: its `STORY.md`, `cues.js`, two scenes in `src/`,
`src/90-hook.js`, `src/95-edit.js`, `mix.py`, `SOUND.md`, and `reference/engine.md`. THE BOTTLE is the model for HOW a
film is made (the look, the cast, the hook, the cut rate, the sound), never for its story.

## What the owner asked for (17 Nov 2026), in order

1. "redesign the characters completely and make a fantastic storyline the devil should be really good" -> the devil is
   the star and has a character; the story is an idea, not a list of nights.
2. "It should be like this channel" (Day One Films) -> the look: near-black stage, cream cartoon people, the black devil
   with a red glowing edge, handwritten words, a counter. He approved four stills, then a 13 s moving test, then the film.
3. "It should have a very engaging hook and also it should fast paced like day one films and also sound effects like
   that." -> the first cut (1:50, scenes played in full) was re-cut to 1:26: a three-shot hook, 68 cuts, a sound on
   every cut, written line and action.
4. "Let's be realistic, most people start first drink at 14,15 years not 21" -> true-to-life details.
5. "every video/short should follow this direction and character design."

What we measured in Day One's film "Lust Is Poison" (168 s, in the browser, numbers only): it opens on a 2.5 s black
text card; scenes of about 7 s are split by black blinks and inserts; something new every 1-2 s; the sound never drops
(the phone band stays within about 13 dB: 10th percentile -41, median -34, 90th -28) and has 1 to 2.6 sound events a
second in the first 40 s, about 0.8 overall. Match the shape; never copy their characters, stories, words or music.

## Every film is its own film (the owner, 30 Oct 2026)

The cast and the look never change (`stage/rig.js`). Everything else is new each time, and differs from the last three
films: YouTube's partner review rejects mass-produced, repetitive channels.

1. **The devil's character and trick.** Who is it to him (THE BOTTLE: his best friend who wants his place), what is its
   one rule the audience learns without a word (it grows a size each time it is fed), how does it speak (it never
   lies). A new one per vice: ENVY's might wear other people's faces; GREED's might keep a ledger.
2. **A structure** from the table below that none of the last three films used (07 used THE YEARS, 08 TWO OF HIM).
3. **A place and props of its own**, an accent colour that means something, a light of its own (the pool's colour).
4. **Its own hook, its own reveal, its own comeback setting, its own last line, its own tune.**
5. **Its own thumbnail composition** (`reference/publish.md`).

| Structure | Shape | What the devil does | The turn |
|---|---|---|---|
| THE YEARS (07) | one life in time jumps, an AGE counter | it grows a size each time it is fed | the moment someone he loves sees it in him |
| ONE NIGHT | a single evening in real time, a clock counter | it grows every time he gives in | the clock says morning |
| THE DEAL | the devil is a host across a table; round after round he slides something across | its side of the table fills | the receipt of everything he gave |
| THE CHASE | he is hunted through outside places | it catches up each time he gives in | cornered, he turns and faces it |
| TWO OF HIM (08) | one boy torn down the middle into two mirrored boys at two desks, a counter over each half (08: PAGES): the one who feeds it and the one who doesn't | on one side only (08: it gets closer and dresses up in what its window shows; its window grows) | the two look at each other; the tear stitches shut when the counters meet |
| ITS SIDE | told from the devil's point of view, its red words are its diary | the hunt tightens | he gets away and it starves |
| NIGHTS | night after night in one room (LUST, 04, 05: rested) | one step closer each night | |

A new structure is welcome if it is truly different; add it to the table. The suggestion in `topics.md` is a start.

**Ads.** Advertisers accept hard themes shown as harm. Never make the vice look fun or glamorous, never a real brand,
nothing sexual drawn, no sexual wording in titles, tags or thumbnails. A minor shown with the vice (THE BOTTLE's first
drink at fifteen) may limit ads or bring an age restriction: the owner chose true-to-life knowing that; keep such a
moment short, show it as where the harm starts, and say so in the report.

## The story (before any code)

1. Three loglines. Pick the one with the best devil and the cruelest, most human cost (someone he loves sees it).
2. Write `STORY.md` like THE BOTTLE's: in one line; the devil (its character, its rule, its manner at each size); the
   people (who, and the one thing that marks each); every word on screen in a table (white = the story's voice, red =
   the devil; at most about 6 words a line; its real lines in capitals); the beat table with times; the comeback
   (counted days, real effort, in the film's own place, the devil shrinking); the last picture and the last line.
3. **The hook**: three shots in the first 4 seconds that sell the film: a line the viewer has said themselves, the
   worst it gets, and the question that makes them stay (how did it get from this to that?). Write them first.
4. **The critic.** A sub-agent (Agent tool, general-purpose) gets STORY.md and this brief: "You are a jury member at an
   animation festival and a YouTube strategist. Attack this short film with no narration (simple cartoon people on a
   black stage, a black devil with a red glowing edge, handwritten words; the channel's last film was THE BOTTLE: a
   devil that grows from thumb-sized to a giant in his chair over 23 years; say if this one feels like it): do the first
   4 seconds stop a thumb; is the devil a character you would quote; is the cost felt by 0:20 with the sound off; is
   there something new to see every 2 seconds; is the turn earned; does the comeback feel like real effort; does the
   last line land; is anything graphic, a real brand, or untrue to life; is any idea held longer than it earns. Score
   each 1-10 and give the three changes that matter most." Make the changes; send it again until no score is below 8
   (three rounds at most). Keep the last critique in STORY.md. Push.

## Building the picture (`reference/engine.md`)

1. `cues.js`: the scenes' times at acting speed (the first cut of THE BOTTLE ran 110 s before the edit). One cue per
   action.
2. The scenes as source shots, one file per chapter. Look at a contact sheet of every scene (`render.mjs sheet`), fix
   what a stranger would misread (a hidden face, a figure leaving the frame, an arm that reads wrong, words over
   horns), repeat. Faces carry it: an expression change in every scene.
3. The hook shots, then THE EDIT: the hook first; each scene cut into pieces of 0.5-2.5 s at speed 1.2-1.6 with a
   punch-in on the face or the action; a `blink()` between chapters; the ending allowed to breathe (the hug, the last
   picture). Aim for a cut about every 1.3 s over the whole film and 1:20-2:00 in all. Sheets again, at the cuts.
4. `node stage/render.mjs films/NN-slug cues` writes `cues_edit.json`. Commit it with `film.js`.

## The sound (`stage/audio/sound.py`; the model is film 07's `mix.py` and `SOUND.md`)

- **Music** (`music.json`, made with `node engine/audio/music.mjs films/NN-slug --dry-run`, then without): one little
  tune that belongs to the devil and grows up with it (THE BOTTLE: a waltz at 120 bpm as THEME, a lone music-box
  LULLABY, a HEAVY low-brass version, DREAD hits, a HORROR blast), a clearly different anthem for the comeback (RISE),
  a warm ENDING. Single prompts per piece work better than one plan with sections (THEME ignored its sections). No
  vocals, no artist, film or franchise names; avoid trademark-like sound words. About 1,500-2,000 credits a film; a
  recorded effect is about 22 credits. The tool refuses below its reserve: then report, and make nothing more.
- **Measure every recording before placing it** (numpy): its length, its downbeats or onsets, its tempo and key, and
  how much of it a phone plays (300 Hz-6 kHz). Write the numbers at the top of `mix.py`. Never trust a prompt's timing.
- **`mix.py`** starts with `import sound; sound.start(HERE); from sound import *` and places everything on cue names
  from `cues_edit.json`, never on typed times: the music so that its downbeats land on the picture's hits (cut it once
  in one of its own rests), every action (a clink, a gulp, a step, a pop), then `cut_sounds(skip=[the cuts that are a
  hit or a stop themselves])`, `captions(white=[…], red=[…])` and `print(json.dumps(finish(), indent=1))`.
- **A motif**: one sound that is the film's (THE BOTTLE: the pop when it grows, lower and heavier each time, backwards
  when it shrinks).
- **The drops are never silence**: when the music stops, a room is still there (a hum, a clock, a tap, a heartbeat with
  a click in it). A sub boom or an airy hiss alone is silence on a phone: give every effect a part between 300 Hz and
  6 kHz.
- **The report must show**: about -18 LUFS, true peak at most -2 dBTP, `sub_share_pct` under 30, sound events placed at
  1 a second or more in the first 40 s, the phone band within about 13 dB from its 10th to 90th percentile, and **no
  stretch of 1 s or more under -38 dB** before the last fade. On the Mac also run
  `~/.cache/music-analysis/venv/bin/python ~/Desktop/nightly routines/wojak-story/scripts/silence-check.py films/NN-slug/audio/mix.wav`
  (the first mix of THE BOTTLE had 9.5 s nearly silent on a phone, its opening included).
- Nobody listens to the mix in an unattended run: say so in the report, with the numbers.

## Ship bar (score each 1-10 from the sheets, spot frames and the MP4; every item 8+)

1. **The hook**: the first 4 seconds are three strong shots with words; the first frame is not black and not a title.
2. **Sound off**: the story reads from the pictures. Show the sheet to a sub-agent with no context and ask it to tell
   the story back.
3. **Pace**: a cut about every 1.3 s on average, nothing held over 3 s except the ending's last pictures; punch-ins and
   blacks where the chapters turn; 1:20-2:00.
4. **The devil**: on model (`stage/rig.js`, untouched), its red edge and face reading at phone size, a character with
   its own trick, visibly changing through the film.
5. **The people**: on model, a clear expression in every face shot, never cut off by the frame or hidden by a prop.
6. **Its own film**: the structure, place, props, accent colour, the devil's trick, the hook and the tune differ from
   the last three films; its sheet next to the last film's does not look like the same film.
7. **Words**: handwritten in the bundled font, white and red used right, every line readable at phone size and held
   long enough to read, spelled right, the counter right in every scene.
8. **The comeback and the ending**: real effort over counted days, the music turns on its first frame, the last line
   lands, the title is right.
9. **Sound**: the report's numbers above; the motif lands on its cues (the key hits within 30 ms of their cues).
10. **Safe and true**: nothing graphic or sexual, no real brand, true-to-life details.
11. **Mechanics** (`node engine/qa.mjs films/NN-slug/filmNN.mp4`): H.264 yuv420p, AAC, 1:15-2:30, -18 LUFS ±1, true
    peak at most -1 dBTP, every black stretch planned.

Record the scores and rounds in `films/NN-slug/README.md`.
