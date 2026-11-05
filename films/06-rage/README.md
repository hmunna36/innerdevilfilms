# Film 06: RAGE | It Holds His Fists

- **YouTube:** (filled in at upload)
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

## QA

(filled in at the ship bar)
