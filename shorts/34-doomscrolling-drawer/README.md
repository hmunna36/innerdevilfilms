# Short 34: doomscrolling-drawer (27.2 s, 1080 x 1920)

One idea: he locked it in a drawer, and it came back out with the same lie. Built, QA'd and uploaded by the cloud
routine of 15 Nov 2026: **YouTube lVEMTV4rhO4** (https://youtu.be/lVEMTV4rhO4), public 15 Nov 2026 20:00 IST. The sixth
Short of DOOMSCROLLING.

- **Film:** 05 DOOMSCROLLING | It Eats Your Hours (https://youtu.be/4cDycr2W4p0), times from
  `films/05-doomscrolling/film.js` (45.4-48.4, 60.9-65.0, 87.1-89.4, 89.8-98.8).
- **The cut** (`short.js`, 15 segments): months of "five more minutes" (the film's montage at half speed: Grandpa's
  invite, Christmas, the hospital, 4:39 AM, its grin, "Haven't seen you in months, kid.", the word on every cut; the
  first frame is Grandpa's banner under "five more minutes"); the film's silence, then he throws the phone in the
  drawer and slams it on its claws; it screams behind him; its face shrinks away; 9:40 PM: the shut drawer buzzes, slides
  open by itself and its fingers curl over the edge (slowed to half speed, framed close); "FEED: You missed 99+ new
  posts"; its face lunges: "Five more minutes…"; his face, resolved; he deletes FEED; it shrieks; he answers Grandpa's
  old invite: "Is that offer still open?" / "Always. 6 AM." and a heart (slowed to read); the end card
  (DOOMSCROLLING / IT EATS YOUR HOURS / FULL FILM ON THE CHANNEL and an arrow).
- **How it differs from Shorts 29-33 and the other attacks (19, 27):** its through-line is the drawer (shut on its
  claws, then opening by itself) and the one lie, "five more minutes", from the months it worked to the night it didn't;
  no flashback inside the attack (27 cut to the first night between the scare and the delete): it runs forward from the
  montage to the answer, the drawer's fingers and the 99+ banner are new to the Shorts, and it ends on Grandpa's answer
  instead of sleep.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the nights' pulse peaking under the montage
  and cut dead (film 42.4-48.4), the film's own silence before the slam, the slam and its scream in sync (60.9-65.0),
  then from 9:40 PM unbroken and in sync (87.1-101.2: the buzz, the scare and its dead air, the anthem slamming back on
  the delete, under the chat; the slowed fingers are paid back by starting the banner 0.4 s later, so the scare lands
  on its sound), a boom into 9:40 PM, and the anthem's big bars (82-85) under the end card on a boom. Mix: -16.0 LUFS,
  -2.9 dBTP, 12% under 60 Hz, no phone-band gap over 2 s.
- **QA** (four sheet/still rounds, one mix round, one round on the MP4):
  - sheet 1 (automatic framings): the banner, the delete dialog and Grandpa's chat far too small to read; the drawer's
    fingers tiny.
  - sheet 2 (framed close on each): readable; but the window shot after its scream showed its eyes too faintly (dropped:
    its face plays on instead), and the 99+ banner reached past x 980.
  - mix 1: a 2.3 s quiet stretch under its fading face (trimmed to 64.1-65.0; the gap is gone).
  - sheet 3/4: the banner too small at z 1.0 (pushed to 1.1-1.14, its words in x 265-765); the fingers on screen only
    0.4 s (slowed to half speed, the banner starting 0.4 s later to keep the scare in sync); every word inside the green
    zone, faces between y 400 and 1500.
  - MP4 1 (`engine/qa.mjs` all ok: H.264 1080x1920 30 fps, AAC 48 kHz, 27.20 s, -16.18 LUFS, -3.11 dBTP, no black
    stretch over .25 s): the montage word held through 6 s, "Five more minutes…" 1.2 s, the banner 1.5 s, the chat
    4.8 s, the clock 0.7 s; the story reads with the sound off (the months it ate, the drawer shut on its claws, the
    drawer opening by itself, the same lie, the delete, the answer to Grandpa).
- **Files:** `short.js` (the cut), `publish.json`, `short34_phone.mp4` (720p archive copy). The full render
  `short34.mp4` and `mix.wav` are rebuilt from source (`render.sh short shorts/34-doomscrolling-drawer`).
- **Left by hand after upload:** Studio, the Short's Related video = the film (DOOMSCROLLING, 4cDycr2W4p0).
