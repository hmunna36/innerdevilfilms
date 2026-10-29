# Short 17: lust-closer (28.0 s, 1080 x 1920)

One idea: watch where it stands. Built, QA'd and uploaded by the cloud routine of 29 Oct 2026:
**YouTube MQoXmEmeoxU** (https://youtu.be/MQoXmEmeoxU), public 30 Oct 2026 20:00 IST.

- **Film:** 03 LUST | It Watches Back (https://youtu.be/aqiuimf3dCg), times from `films/03-lust/film.js` (8.3-40.0).
- **The cut** (`short.js`, 15 segments): four nights, each framed as a two-shot (him and it in one picture, so the
  distance between them is the story), its kind whispers the only words, his face emptier each night. Night 1: him on
  the bed and its eyes in the window, "You worked hard today. You deserve this." (the first frame); him close, "Just
  one more. Then sleep."; the lights go out and the shot pushes to its eyes in the window. Night 2: 12:31 AM; him and it
  at the foot of the bed (a wide two-shot), "She'll call again. Stay with me."; his tired face; its face, "See? You feel
  better already.". Night 3: 1:47 AM; beside him, bending closer, "Who needs them? You have me."; his empty face; its
  grin, "I'll never leave you.". Night 4: 3:05 AM; its hands settle on his shoulders, "She'd never understand you… not
  like I do."; his ashamed face; its grin, closest; its claws around him; the end card (LUST / IT WATCHES BACK / FULL
  FILM ON THE CHANNEL and an arrow to the Related video link).
- **How it differs from 15 (the hook):** no cold line, no phone screens, no reveal; longer two-shots instead of the
  hook's quick phone/face/room cycle, new stretches (night 1's lights-out, the foot of the bed wide, the faces of nights
  2-3, its claws close at the end) and its own title.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the film's own nights pulse as one unbroken
  piece (film 18.02-43.0) timed so the Short's last night lands on the top of the score, just before the film's dead
  silence; then a boom and the reveal's stinger (film 48.6-51.6) under the end card. Mix: -14.0 LUFS, -2.0 dBTP; no
  unplanned gap.
- **QA** (two rounds on safe-area sheets, one on the MP4):
  - round 1 fixed: the first frame (the 11:48 PM clock was still fading in: now it opens on the window two-shot with the
    whisper's first sentence typed), night 1's window (it was out of frame: a two-shot), the push to its eyes (started
    off them), night 2's foot of the bed (a pan from him: now a wide two-shot).
  - round 2 fixed: night 1's two-shot (him too near the buttons column), the push's first framing, night 2's end
    framing (his back at the left edge), the sound plan synced to the 24.98 s picture.
  - the MP4 (`engine/qa.mjs`): H.264 1080x1920 30 fps, AAC 48 kHz, 27.97 s, -13.88 LUFS, true peak -1.35 dBTP; no black
    stretch.
  - by eye: the first frame has its eyes, him and a whisper; every word inside the safe area; no face under the buttons
    or the top bar; every whisper held 1.2 s or more; the story reads with the sound off (the clocks, where it stands,
    his face, its claws).
- **Files:** `short.js` (the cut), `publish.json`, `short17_phone.mp4` (720p archive copy). The full render `short17.mp4`
  and `mix.wav` are rebuilt from source (`render.sh short shorts/17-lust-closer`).
- **Left by hand after upload:** Studio, the Short's Related video = the film.
