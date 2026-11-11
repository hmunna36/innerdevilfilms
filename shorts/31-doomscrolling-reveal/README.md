# Short 31: doomscrolling-reveal (25.8 s, 1080 x 1920)

One idea: its kind lies, then the truth. Built, QA'd and uploaded by the cloud routine of 11 Nov 2026:
**YouTube IMXfPq-HJ4Q** (https://youtu.be/IMXfPq-HJ4Q), public 12 Nov 2026 20:00 IST. The third Short of DOOMSCROLLING.

- **Film:** 05 DOOMSCROLLING | It Eats Your Hours (https://youtu.be/4cDycr2W4p0), times from
  `films/05-doomscrolling/film.js` (39.62-41.2, 12.1-13.8, then 48.4-67.1 unbroken).
- **The cut** (`short.js`, 14 segments): behind him, its claws coming down, "You have all the time in the world." typed
  in full from the first frame (slowed to .79, framed wide so both figures sit above the words); Grandpa's photo, the
  two of them on the dock, under "He has plenty of Saturdays." (slowed to .8); then the film in sync: FEED's chip racing
  to the loop as the phone dies (pushed in on the chip); the black glass, "YOU WEREN'T KILLING TIME."; "I WAS EATING
  YOU." while his reflection's hair greys and his face lines; "LOOK WHAT'S LEFT OF YOU." on the old face; it rips out
  of his chest, "HE DOESN'T HAVE YEARS.", its teeth on Grandpa's photo; his face from fear to resolve; the drawer slammed
  on its claws; the hours streaming back into him as it screams; its face dying; a pan from him to its eyes fading in
  the window; the end card (DOOMSCROLLING / IT EATS YOUR HOURS / FULL FILM ON THE CHANNEL and an arrow).
- **How it differs from Shorts 29 (the hook) and 30 (Saturday):** two of its whispers set up as lies and answered by
  its real lines (the time in the world against "I WAS EATING YOU", Grandpa's Saturdays against "HE DOESN'T HAVE
  YEARS"); 29 ended on the black glass and 30 on the montage, this one goes through the aging reflection, the photo
  eaten, the drawer and the scream to its eyes in the window; no date cards, no banners.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the last night's pulse under the two lies
  (film 39.5-43.6); a boom into the dying phone, then the film's mix in sync from 48.4 to 67.1 (the dead phone's
  silence, the reveal, the slam, the scream); the cold open's ticking riser (film .05-3.35, +6 dB) under its dying face
  and the window into the title's hit on the end card, with a boom. Mix: -16.0 LUFS, -2.5 dBTP, 19% under 60 Hz.
- **QA** (two sheet rounds, one still round, one mix round, two on the MP4):
  - sheet 1 (automatic framings): its claws and his leg crossed the opening whisper; the dying phone framed small;
    the montage's tail ("five more minutes") lay across its body (cut); the last shot put his face under the buttons'
    column and missed the window.
  - sheet 2 / stills: the opening framed wide (z .72-.75) so both sit above the words; the chip pushed in; the last
    shot pans from him to the window. Every word inside the green zone; faces between y 400 and 1500.
  - mix 1: a 3.7 s phone-band gap under the scream's tail and the window; filled with the cold open's ticking riser
    into the title hit (no gap over 2 s).
  - MP4 1 (`engine/qa.mjs` all ok: 25.83 s, -16.42 LUFS, -2.41 dBTP): by eye, the first frame's whisper was still typing
    ("the world." dim); the shot now starts at 39.62 at the same length.
  - MP4 2 (`engine/qa.mjs`): H.264 1080x1920 30 fps, AAC 48 kHz, 25.83 s, -16.42 LUFS, true peak -2.41 dBTP, no black
    stretch over .25 s (the dead phone's own black is about .3 s inside a cut). By eye: whispers 66 px held 2.0-2.1 s,
    real lines 92 px held 1.7-2.6 s; the story reads with the sound off (the lies in pink, the phone dies, the truth in
    red, his face aging, the photo in its teeth, the drawer, its scream, its eyes in the window).
- **Files:** `short.js` (the cut), `publish.json`, `short31_phone.mp4` (720p archive copy). The full render `short31.mp4`
  and `mix.wav` are rebuilt from source (`render.sh short shorts/31-doomscrolling-reveal`).
- **Left by hand after upload:** Studio, the Short's Related video = the film (DOOMSCROLLING, 4cDycr2W4p0).
