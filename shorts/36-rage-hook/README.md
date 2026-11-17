# Short 36: rage-hook (30.0 s, 1080 x 1920)

The hook of RAGE: the whole escalation of one evening, every snap making it bigger. Built, QA'd and uploaded by the
cloud routine of 17 Nov 2026: **YouTube aqp2YPNzupM** (https://youtu.be/aqp2YPNzupM), public 17 Nov 2026 20:00 IST.
The first Short of RAGE.

- **Film:** 06 RAGE | It Holds His Fists (https://youtu.be/aWCx-6AL-U8), times from `films/06-rage/film.js`
  (0.5-4.0, 11.7-17.5, 18.25-19.0, 20.6-23.1, 23.4-25.3, 26.35-27.7, 28.6-31.9, 32.9-34.8, 35.3-37.2, 38.6-40.0,
  44.1-46.75).
- **The cut** (`short.js`, 20 segments): the cold line, "EVERY TIME YOU LOSE IT… …IT GROWS.", over his fist (the
  first frame), its eyes opening in the fist's shadow and its claws closing on it; RAGE; 7:02 PM; the pot slammed in the
  sink (pushed in on him); his shadow's eyes open and it steps off the wall a head taller; Sam startled; its grin, "Long
  day. You're allowed."; 7:48 PM; the shout, its horns at the ceiling (framed on it, its face below the app's top
  bar); Sam frozen, his crayon snapping; "He has to learn."; 8:32 PM, Mom's banner "Sam texted me. Is everything ok??"
  (at 0.75x, framed close); his hot face; the fist through the wall with it bent double over him, "You couldn't help
  it.", on over the drawing (ME + MY BROTHER) slid down the wall; its eye in the hole; 9:17 PM; wedged into the hallway,
  "You just want to talk."; the one blow on Sam's door; the cracked mirror, its claw lowering in step with his fist, "YOU
  NEVER LOST CONTROL."; the end card (RAGE / IT HOLDS HIS FISTS / FULL FILM ON THE CHANNEL and an arrow).
- **How it differs from the other RAGE Shorts (37-42):** it is the only one built on the four clocks of the evening,
  pairing each snap with the lie it told after it, and it stops at the reveal's first red line (37 takes the reveal
  from there; 38 frames each snap against the ceiling; 39 follows Sam).
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the film's own mix in ten pieces, each placed
  from the segment table so the picture's own sound lands on it: the cold open and the title's hit (0.5-4.0), then the
  evening's pulse in stretches that start on a cut (or under a clock), so the pot's clang, its stinger, the shout's
  blast, the crayon, Mom's ping, the wall punch, its eye's swell and the blow land on their pictures (measured in the
  mix: clang 3.60 s, crayon 11.64, punch 16.88, blow 23.20); the reveal's dead silence and explosion in sync (IT at
  24.66), its music running on under the end card with a boom (26.95). Mix: -16.0 LUFS, -2.5 dBTP, 23% under 60 Hz,
  no phone-band gap over 2 s.
- **QA** (two sheet rounds, two still rounds, one mix round, two rounds on the MP4):
  - sheet 1: in the shout and "He has to learn." the auto framing followed him and Sam, so the devil was cut off at
    the left edge and its horns at the ceiling were lost (framed on it and him); in the hallway and the blow its face
    sat under the app's top bar, and the wall shot cut off its head (framed lower and wider, z 0.85); Mom's banner too
    small to read (framed close and slowed); the cold line's claws covered the words early (the segment starts at 0.5,
    so the line is up 1.1 s before they come in).
  - sheet 2 / stills: the banner's text reached x 864 below y 1000 (moved 30 px of screen left: now x 200-800); the pot
    snap framed too wide, him at the edge (pushed in on him and the pot); every word inside the green zone, faces between
    y 400 and 1500 and clear of the buttons' column.
  - MP4 1 (`engine/qa.mjs` all ok: 29.37 s, -16.01 LUFS, -2.18 dBTP, no black stretch): "You couldn't help it." on
    screen only 1.3 s with its typing (the 0.6 s after it, the drawing slid down the wall with the line still on, added).
  - MP4 2 (`engine/qa.mjs` all ok: H.264 1080x1920 30 fps, AAC 48 kHz, 29.97 s, -16.01 LUFS, -2.12 dBTP, no black
    stretch over 0.25 s): every line held 1.7 s or more (the cold line 2.1 s, the banner 1.7 s); the story reads with
    the sound off (the clocks, the snaps, it bigger each time, Sam frightened, Mom worried, its lies, the mirror's
    truth).
- **Files:** `short.js` (the cut), `publish.json`, `short36_phone.mp4` (720p archive copy). The full render
  `short36.mp4` and `mix.wav` are rebuilt from source (`render.sh short shorts/36-rage-hook`).
- **Left by hand after upload:** Studio, the Short's Related video = the film (RAGE, aWCx-6AL-U8).
