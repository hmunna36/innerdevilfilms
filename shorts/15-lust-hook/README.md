# Short 15: lust-hook (31.1 s, 1080 x 1920)

The first Short in the new style, and the test of the engine's vertical mode (27 Oct 2026). Built on the Mac; it passed
QA there, and the cloud routine of 28 Oct 2026 re-rendered it from source, re-ran `qa.mjs` (all ok: 31.10 s, -13.8 LUFS,
-1.6 dBTP) and uploaded it: **YouTube ngv3Y26JGyM** (https://youtu.be/ngv3Y26JGyM), public 28 Oct 2026 20:00 IST.

- **Film:** 03 LUST | It Watches Back (https://youtu.be/_UwESHNcD7A), times from `films/03-lust/film.js`.
- **The cut** (`short.js`): the cold line (already typed), its eyes opening in the window (a push-in on them), LUST,
  then four nights with it closer each time: 11:48 PM, the phone ("Shh… it's okay."), his face, it in the window;
  12:31 AM, the foot of the bed, its face; 1:47 AM, beside him, its grin; 3:05 AM, behind him with its hands on his
  shoulders, its grin; "one more"; the phone dies and the black glass shows it: "I WAS NEVER IN THE PHONE.";
  the end card (LUST / IT WATCHES BACK / FULL FILM ON THE CHANNEL and an arrow to the Related video link).
  18 segments, framed automatically around each shot's subject except the window (a push-in on its eyes).
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the film's own score, the nights' pulse
  unbroken from 0:00 to 0:21.8 under the jump cuts, then the montage, the dead silence when the phone dies and the reveal,
  with booms on the jump to the montage and on the end card. -14.1 LUFS, -2.0 dBTP.
- **QA** (two rounds on contact sheets with the safe area drawn, one on the MP4):
  - round 1 fixed: the pans ran too fast (the shot's length was not passed to the framing), the window shot was too
    wide for the hook (now a push-in on its eyes), the end card's call to action was small, the cut flash too strong.
  - the MP4 (`engine/qa.mjs`): H.264 1080x1920 30 fps, AAC 48 kHz, 31.10 s, -13.8 LUFS, true peak -1.5 dBTP; one black
    stretch, 25.33-25.60 s, the phone dying (planned).
  - by eye: the first frame has the cold line; every word sits inside the safe area; whispers 66 px, the reveal 92 px;
    the story reads with the sound off.
- **Files:** `short.js` (the cut), `publish.json`, `short15_phone.mp4` (720p archive copy). The full render `short15.mp4`
  and `mix.wav` are rebuilt from source (`render.sh short shorts/15-lust-hook`).
- **Left by hand after upload:** Studio, the Short's Related video = the film.
