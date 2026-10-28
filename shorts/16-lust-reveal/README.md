# Short 16: lust-reveal (26.6 s, 1080 x 1920)

The moment LUST's devil drops its kind voice. Built, QA'd and uploaded by the cloud routine of 28 Oct 2026:
**YouTube uWRSbx31Zhw** (https://youtu.be/uWRSbx31Zhw), public 29 Oct 2026 20:00 IST.

- **Film:** 03 LUST | It Watches Back (https://youtu.be/aqiuimf3dCg), times from `films/03-lust/film.js`.
- **The cut** (`short.js`, 12 segments): two of its kind whispers first: its grin beside him, "I'll never leave you."
  (the first frame); behind him with its hands on his shoulders, "She'd never understand you… not like I do.", his
  ashamed face; its claws around him, close. Then the phone dies, and the black glass shows it behind him: "I WAS NEVER
  IN THE PHONE." / "I WAS ALWAYS… IN YOU."; it steps into the room; its face: "EVERY NIGHT… YOU FED ME."; his face:
  "NOW YOU'RE MINE."; he throws the phone (a whip pan to the wall as it smashes, then back to its scream); it fades,
  still screaming; the dark room, a push to its eyes in the window as they go out; the end card (LUST / IT WATCHES BACK /
  FULL FILM ON THE CHANNEL and an arrow to the Related video link).
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the film's own score: the nights' pulse under
  the whispers (28.0-34.3, unbroken under the jump cuts), a boom on the jump to the dying phone, then the reveal unbroken
  from 43.2 to 60.5 (the film's dead silence when the phone dies and before the throw, the stinger, the smash and the
  scream), and under the end card the rest of the score's biggest hit (film 104.6-107.6, the same hit continuing).
  Mix: -14.0 LUFS, -2.0 dBTP; no unplanned gap.
- **QA** (two rounds on safe-area sheets, one on the MP4):
  - round 1 fixed: the first frame (the whisper was still typing: now starts at 28.0, fully typed), the length (23.8 s:
    added its claws around him and his face), the smash (the wall was out of the tall frame: a keyframed whip pan to it),
    the last shot (an empty dark frame: now a push to its eyes in the window), the sound plan (the first piece overlapped).
  - round 2 fixed: its screaming head sat under the top bar (framing lowered), the push to the window started too late.
  - the MP4 (`engine/qa.mjs`): H.264 1080x1920 30 fps, AAC 48 kHz, 26.60 s, -14.47 LUFS, true peak -2.09 dBTP; one black
    stretch, 6.60-6.90 s, the phone dying (planned, the film's own).
  - by eye: the first frame has its grin and the whisper; every word inside the safe area; no face under the buttons or
    the top bar; every line held 1.3 s or more; the story reads with the sound off (kind whispers, the black glass, the
    red lines, his face turning, the smash, the scream, its eyes still in the window).
- **Files:** `short.js` (the cut), `publish.json`, `short16_phone.mp4` (720p archive copy). The full render `short16.mp4`
  and `mix.wav` are rebuilt from source (`render.sh short shorts/16-lust-reveal`).
- **Left by hand after upload:** Studio, the Short's Related video = the film.
