# Film 06: RAGE | It Holds His Fists

- **YouTube:** https://youtu.be/aWCx-6AL-U8, uploaded 5 Nov 2026 by the cloud routine with the code-drawn thumbnail
  (`thumb_code.jpg`, copied to `thumb.jpg`), private until it goes public on 9 Nov 2026 at 05:30 IST (Sunday 8 Nov 19:00
  New York). The ChatGPT thumbnail is still to make on the Mac (`/idf thumb 06`), before the release.
- **What it is:** 1:56 (116 s), 16:9, 1920 x 1080, 30 fps, in the house style of LUST (`films/03-lust`): no narration, an
  ElevenLabs score, the devil's words on screen (pink whispers, then red slammed capitals), a story that reads with the
  sound off. Its own film (reference/film.md, "Every film is its own film"):

  | | RAGE | 03-05 |
  |---|---|---|
  | Structure | ONE NIGHT: one evening in real time, 7:02 PM to 9:17 PM; the comeback is days (DAY 1, 4, 9, 12) | NIGHTS |
  | How it closes in | it grows every time he loses it: his shadow on the kitchen wall steps off it a head taller; at the shout its horns reach the ceiling; at the wall it is bent double under it; at the door it is wedged into the hallway, its horns gouging the ceiling; starved at the end, it is knee-high | one step closer each night |
  | Place | the family kitchen and the hallway (Sam's door, the hall mirror) | the bedroom |
  | Palette | ember orange, redder and darker with every snap; the comeback in steel-blue brick and gold morning light | red, casino green, icy blue |
  | Reveal | the cracked hall mirror: the evening flashes past in its shards, then every shard shows IT, its claw lowering in step with his fist; then his little brother's small shadow grows two tiny horns ("LOOK. HE'S LEARNING.") | the dead phone's black glass |
  | Break | he opens his fist, prying its claws off, and kneels at Sam's door with his palms open; Sam opens it | throwing the phone, the drawer, the card |
  | Comeback | a boxing gym (roll-up shutter, rope, push-ups, a failed pull-up on DAY 1 and clean ones on DAY 9, squats, curls, breathing with open hands) and a run over a city bridge at sunrise; it shrinks one step a day (his height, chest-high, waist-high, small under the table, knee-high) | the bedroom floor, the dawn road, the gym |

- **The story** (`STORY.md`, locked after three critic rounds): see the beat table there.
- **Files:** `film.js` (the film on the engine), `STORY.md`, `music.json` and `audio/music`, `audio/sfx` (the ElevenLabs
  mp3s and their prompts), `mix.py` (the sound into `audio/mix.wav`, git-ignored), `publish.json`, `thumb.jpg` /
  `thumb_code.jpg`, `film06_phone.mp4` (a 720p archive copy). Rebuild: `python films/06-rage/mix.py`, then
  `.claude/skills/idf/bin/render.sh film films/06-rage`.
- **Shorts:** 36-42 in `.claude/skills/idf/shorts.md`.

## New in this film (all in `film.js`, drawn in the engine's style)

`film.js` is one file in sections (A the palette, poses and LED clocks; B the sets; C the kitchen shot; D the close-ups,
hallway, Sam's room, the cracked mirror and the phone; E the comeback and the code thumbnail; then the cut).
- **His poses and Sam's** (`figPose`, `kidSit`, `kidCrouch`, `kidInBed`, `manKneel`): profile figures that face either
  way, fists, a kneel with the palms open on the floor; Sam (about half his height, a tuft of hair) sits at the table,
  stands on a stool, sits up in bed under his quilt. `wallShadow`: his shadow on the wall, thrown by the lamp.
- **The sets** (`kitchenSet`, `hallSet`, `samRoomSet`, `gymSet`, the `bridge` shot): filled and lit like the engine's
  bedroom (SKILL.md rule 15). The kitchen's ember light heats up with every snap (`HEAT`); the lamp swings after the shout;
  the pot, the juice, the hole in the wall (later patched), Sam's drawing on the fridge (it drops, is taped back, a new one
  with open hands beside it) all follow film time.
- **The clocks** (`led`): a seven-segment display drawn in code: the oven's amber clock at night, the boxing gym's red
  round timer with DAY 1 / 4 / 9 for the mornings.
- **New shots:** `fist` (his fist close, its clawed hand closing over it, and prying off), `samface`, `dface` (its face in
  this film's light), `stove`, `table`, `chair`, `hole` (its eye opens inside the hole in the wall), `drawing`, `hall` (the
  door, the one blow, the split frame, its horns in the ceiling, the kneel, the door opening a crack), `samroom` (Sam in
  bed, his shadow growing horns), `cracked` (the cracked mirror: a montage of the evening in its shards, then IT in every
  shard), `fridge`, `gym` (shutter, rope, push-ups, the failed and the clean pull-up, squats, curls, breath, pads, the two
  of them breathing, its doorway), `bridge`, and `thumb` (the code thumbnail in this film's own composition).
- **The phone:** the lock screen is a photo of Mom, him and Sam; its notifications and the chat are drawn at about twice
  the engine's size, so they read on a phone.

## Sound

- **Made by ElevenLabs** (`music.json`, through `engine/audio/music.mjs`, 5 Nov 2026), planned about 2,163 credits (the
  shared account read 105,563 before; its counter lags, so the exact spend shows later):
  - SCORE: 64.6 s, three chunks: the intro (a riser into one brass hit), the evening (an industrial pulse, metal
    percussion like pans and doors, a detuned toy piano for Sam), the reveal (silence, an explosion, a dark choir);
  - RISE: the comeback anthem, 37 s, a boxing anthem with electric guitars (unlike 03-05's strings and synths);
  - ENDING: a sparse piano, 16 s;
  - two new sounds: the fist through the wall, the fist on the hall wall. The pot's clang, the boxing bell, the split
    plaster, the crayon and the door's creak are mixlib-made (free); scream, shriek, scare, stinger, swell and smash are
    the shared hits in `engine/audio/sfx`.
- **The mix** (`mix.py`, which writes `audio/mix.wav`), on times measured in the mp3s: SCORE's intro hit at 1.2 s (moved
  onto the title at 2.6), its evening chunk from 4.0 s (the pulse kicks in at 8.0 s, 7.2 in the film), its reveal's
  explosion at 45.9 s (moved onto IT in the glass at 44.45); RISE's impact at 0.05 s on DAY 1 (63.4), out for the attack
  (90.4-93.1); ENDING's piano from the fridge drawings (99.0). The pulse holds its breath (-9 dB) while Sam watches the door
  from his bed. Three planned silences: before IT shows in the glass (44.0-44.45), before his fist opens (52.8-54.05), the
  attack. Report: -18.0 LUFS, loudest 3 s -13.5, loudest burst -11.3, true peak -2.0 dBTP, sub-bass share 27.7 %.

## QA (reference/film.md, "Ship bar")

- **Story:** three critic rounds (61, 73, then 77 of 100, every item 7-8), each round's changes made; the last critique is in
  `STORY.md`. Its safety notes shaped the film: the door holds and is never touched, the one blow lands on the wall, the
  devil only ever stands behind him, its door whisper is a kind lie, Sam never raises his hands or covers his head.
- **Sheets:** about ten rounds of contact sheets and close stills while building (the lamp's glow clipping green when the
  camera was close, the phone text at twice the engine's size, the claw given a hand, the fridge beat, the mirror's dark
  foot so its red words read, the devil's size per snap and per day).
- **Video round 1** (render 1): `engine/qa.mjs` all ok (1:56, H.264/AAC, -18.17 LUFS, -2.04 dBTP, the only black stretch
  the planned one before the end card). A blind viewer with no context, shown only the one-frame-a-second sheet with the
  sound off, told the story back right: the brothers, Mom's night shift, the evening, the devil growing with each
  outburst, "YOU NEVER LOST CONTROL." / "YOU HANDED IT TO ME.", the horns on Sam's shadow, the open fist and the kneel,
  "No. I scared him. I'm getting help.", the training while a shrinking devil heckles, DAY 12 resisted, the knee-high devil
  and "IT STARVES.". Its flags, all fixed for render 2: Sam's snapped crayon could read as an adult hand at his collar (now
  in his own two small hands), the shadow behind Sam's bed could read as someone looming (now his own shape under the
  blanket), Sam's close-up could be taken for his brother's (a star on his T-shirt), his body merged with the devil's limbs
  (a brighter rim), a too-small spill, ghostly shadows after the turn, the gym timer's "ROUND 1".
- **Video round 2** (render 2): `engine/qa.mjs` all ok again (1:56, -18.17 LUFS, -2.04 dBTP, the planned black only); the
  fixed frames checked in the MP4 itself (Sam's own hands and crayon, his shadow his own shape, the star on his T-shirt).
  Every ship-bar item 8 or more: uploaded.

| Ship bar item | Score | Why |
|---|---|---|
| 1 Cold open | 8.5 | the cold line types over his trembling fist from the first frame; its eyes open on "GROWS"; claws; RAGE on the hit at 2.6 s |
| 2 Sound off | 8.5 | the blind viewer's retelling (above) |
| 3 Pace | 8.5 | 77 shots, average 1.5 s, none over 3 s but the end card (3.0) and the title; flashes on the clocks, its face and the title; glitches on the turns; the montage in the mirror's shards |
| 4 The devil | 8.5 | the Shadow Twin against lit ember sets, its red edge and light; its eyes and grin read small; it grows each snap (a head taller, the ceiling, bent double, through the ceiling) and shrinks each day; pink whispers, then red |
| 11 Its own film | 8.5 | ONE NIGHT in a kitchen and hallway, ember orange, the cracked mirror and Sam's shadow, a boxing gym and a bridge; beside 05's icy-blue bedroom it is plainly another film |
| 5 His face | 8 | a clear expression in every face shot (tired, rage, shout, ashamed, empty, shock, resolve, strain, calm, laugh) and Sam's own (startled, frozen with a tear, looking, laughing) |
| 6 The phone | 8.5 | no vice on it: a family photo on the lock screen, notifications under the clock and the chat at twice the engine's size; no brands |
| 7 The comeback | 8.5 | 7:30, 7:15, 6:45 AM, 7:40 PM; rope, push-ups, a failed then a clean pull-up, the run, squats, curls, the breath; the anthem hits on DAY 1's first frame |
| 8 The ending | 8.5 | "LOSE IT ONCE. THAT'S ALL I NEED.", then "EVERY TIME YOU DON'T… IT STARVES."; RAGE, IT HOLDS HIS FISTS |
| 9 Sound | 8 | the score's sections change on the turns (measured onsets), the anthem clearly different (guitars), silences only where planned; -18.0 LUFS, loudest 3 s -13.5, burst -11.3, sub 27.7 % (judged from the measurements: no listening here) |
| 10 Mechanics | 9 | `engine/qa.mjs` all ok |
