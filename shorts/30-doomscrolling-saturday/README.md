# Short 30: doomscrolling-saturday (26.1 s, 1080 x 1920)

The fishing Saturday he never went to, told through Grandpa. Built, QA'd and uploaded by the cloud routine of 10 Nov 2026:
**YouTube J-agcpDhblU** (https://youtu.be/J-agcpDhblU), public 11 Nov 2026 20:00 IST. The second Short of DOOMSCROLLING.

- **Film:** 05 DOOMSCROLLING | It Eats Your Hours (https://youtu.be/4cDycr2W4p0), times from
  `films/05-doomscrolling/film.js` (10.3-15.6, 17.5-21.1, 27.7-35.5, 37.2-38.75, 41.85-42.45, 45.4-48.4).
- **The cut** (`short.js`, 13 segments): Grandpa's banner "Fishing Saturday? Like old times" framed close from the first
  frame and swiped away (slowed to .75); the photo of the two of them on the dock under "He has plenty of Saturdays.";
  the wall calendar, 14 WEDNESDAY flicking to 17 SATURDAY, which shivers and flies through the window glass into its
  grin as the pan follows it (the months flurry after it); Mom's "Merry Christmas. Grandpa waited." and, at the foot of
  the bed, "You'll go next year."; Mom's "Grandpa's in the hospital. Call!" and, beside him, "He's fine. Call
  tomorrow." (slowed to .7); Grandpa calling, his thumb on Decline, "Call declined"; his face; its grin; Grandpa's
  "Haven't seen you in months, kid."; his face, ashamed; the montage flashing all four banners back ("five more
  minutes…"); the end card (DOOMSCROLLING / IT EATS YOUR HOURS / FULL FILM ON THE CHANNEL and an arrow).
- **How it differs from Short 29 (the hook) and the other cost Shorts (20, 23):** one person's thread (Grandpa) instead of
  the escalation; no date cards and no time chip framed (29's device): the banners themselves, each answered by a
  whisper, and two pictures of its own (the photo, the calendar's Saturday snapped through the glass); the Decline is
  shown; it ends on the montage's flash of every banner instead of the black glass.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the nights' pulse unbroken under the first
  eight segments (film 9.87-23.43), timed so the calendar's own whooshes and its teeth snapping the page land in sync;
  a boom into the call, in sync so the click of Decline lands on his thumb, then the score's sub-only drop under his
  face (cut to 1.7 s); a boom on its grin as the pulse comes back (film 35.0-38.6); a boom into the montage, in sync
  (film 45.4-51.5): the dead phone's silence under the end card (planned, under 1 s) and the stinger.
  Mix: -16.0 LUFS, -2.5 dBTP, 31% under 60 Hz; no phone-band gap over 2 s.
- **QA** (four sheet/still rounds, one mix round, two on the MP4):
  - sheet 1 (automatic framings): the banners too small to read; the calendar cut at the frame's edge; a leftover
    whisper ("You have all the time in the world.") fading over his ashamed face.
  - sheet 2: banners framed close, the calendar framed whole, then a pan after the Saturday page to its grin; the
    ashamed face starts at 41.85 (no leftover). Stills: the montage's word reached x 72 (its left edge; the engine
    placed it anywhere in x 260-730 whatever its width) and sat on the banners; "Accept" on the call screen reached
    under the buttons' column; Mom's Christmas line reached x 1005 at the end of its push-in.
  - engine: the vertical montage word is now kept inside the safe area (`engine/shots.js`: centre clamped by its own
    width, x 100-980 above y 1000 and 100-870 below, push-in included); earlier Shorts' montage words already fit.
  - stills 3-4: the montage frames its banners low so the word floats in the dark above them; the call framed at x 975
    ("Accept" ends at x 801, the labels above y 1610); the banners centred at x 990 and pushed in less (z 1.14-1.19):
    every banner line in x 195-918.
  - mix 1: a 2.3 s phone-band gap after the Decline (the score drops to its sub there); the music now comes back on its
    grin with a boom (gap 1.7 s).
  - MP4 1 (`engine/qa.mjs` all ok: 25.90 s, -15.99 LUFS, -2.01 dBTP): by eye, his leg covered "He's fine." at the start
    of its shot (the automatic framing pushed in under the words); fixed with a set framing (both of them above the
    words) and slowed to .7 so the line holds longer.
  - MP4 2 (`engine/qa.mjs`): H.264 1080x1920 30 fps, AAC 48 kHz, 26.13 s, -15.95 LUFS, true peak -2.29 dBTP, no black
    stretch over .25 s. By eye: the first frame is Grandpa's banner over the feed; whispers 66 px and on screen
    1.6-1.9 s; banners about 30 px type framed close, each held 2.0-2.1 s; every word inside the green zone; faces
    between y 400 and 1500; the story reads with the sound off (the banners, the photo, the torn Saturday, where it
    stands, Decline, his face).
- **Files:** `short.js` (the cut), `publish.json`, `short30_phone.mp4` (720p archive copy). The full render `short30.mp4`
  and `mix.wav` are rebuilt from source (`render.sh short shorts/30-doomscrolling-saturday`).
- **Left by hand after upload:** Studio, the Short's Related video = the film (DOOMSCROLLING, 4cDycr2W4p0).
