# Short 18: lust-comeback (28.7 s, 1080 x 1920)

One idea: the day he stops feeding it. Built, QA'd and uploaded by the cloud routine of 30 Oct 2026:
**YouTube _5Eh35rT0HE** (https://youtu.be/_5Eh35rT0HE), public 31 Oct 2026 20:00 IST.

- **Film:** 03 LUST | It Watches Back (https://youtu.be/aqiuimf3dCg), times from `films/03-lust/film.js` (53.6-54.8,
  60.6-82.4, 91.8-94.5).
- **The cut** (`short.js`, 20 segments): it opens on his red face and its real line "NOW YOU'RE MINE." (the first
  frame), a flicker of it engulfing him, then the hard turn to 6:00 AM. Push-ups ("Come back… just once."), his face
  straining at dawn, the cold shower with its eyes in the steam, 6:30 AM, the run (a pan from its burning eyes to him,
  "You'll get tired.", then a pull back as it falls behind), 7:15 AM, pull-ups, squats, curls, his face; 8:00 PM, he calls
  Mom, his smile under the lamp; 11:00 PM, asleep with no phone while its eyes open in the window: "Tomorrow, then.";
  the end card (LUST / IT WATCHES BACK / FULL FILM ON THE CHANNEL and an arrow to the Related video link).
- **How it differs from 15-17:** the first Short of the film's second half: daylight, the training, its whispers now
  begging instead of luring, his face from strain to a smile, and it ends on a threat ("Tomorrow, then.") instead of the
  reveal. Its own framings (push-ins on the gym moves, the run's chase two-shot), sound plan and title.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the film's hit under "NOW YOU'RE MINE." and
  its silence, the 6:00 AM boom and the training anthem RISE to the smile (its quiet breath under the shower shortened
  from 3 s to 1.2 s, joined where both sides are quiet so there is no audible jump), a boom on the jump to 11:00 PM as the
  anthem fades to the quiet of the sleep, and the score's biggest hit (film 103.9) under the end card. Mix: -14.0 LUFS,
  -2.0 dBTP; no phone-band gap over 2 s.
- **QA** (three sheet rounds, one on the MP4):
  - round 1 (automatic framings) fixed: the run lost its chase (it was out of frame: now a pan from its eyes to him and
    a pull back that shows it falling behind), the shower's eyes sat under the top bar, the gym figures were small, the
    call screen was small, the sleep was a dark wide shot; the first frame showed the previous line fading.
  - round 2 fixed: push-ups (his head under the buttons column), the gym (heads under the top bar), the sleep framing.
  - round 3 (full-size stills, pixel bounds): the clocks reached x 971 at y 1037, outside the safe area's narrow part;
    the engine's vertical clock now sits at y 880 fitted to 780 px (x 136-933, y 771-953), for every Short from now on.
  - the MP4 (`engine/qa.mjs`): H.264 1080x1920 30 fps, AAC 48 kHz, 28.73 s, -14.33 LUFS, true peak -1.28 dBTP; no black
    stretch.
  - by eye: the first frame has its red line and his face; every word inside the safe area; no face under the buttons
    or the top bar; every line held 1.2 s or more; the story reads with the sound off (its claim, the clocks from 6:00 AM
    to 11:00 PM, the training, it falling behind, Mom's call, his smile, its eyes waiting).
- **Files:** `short.js` (the cut), `publish.json`, `short18_phone.mp4` (720p archive copy). The full render `short18.mp4`
  and `mix.wav` are rebuilt from source (`render.sh short shorts/18-lust-comeback`).
- **Left by hand after upload:** Studio, the Short's Related video = the film.
