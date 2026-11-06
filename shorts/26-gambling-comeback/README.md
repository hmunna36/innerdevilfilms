# Short 26: gambling-comeback (28.0 s, 1080 x 1920)

One idea: it told him he had one thing left to bet, and he bet on himself. Built, QA'd and uploaded by the cloud
routine of 6 Nov 2026: **YouTube put7Q-N7U9o** (https://youtu.be/put7Q-N7U9o), public 7 Nov 2026 20:00 IST. The fifth
Short of GAMBLING.

- **Film:** 04 GAMBLING | The House Always Wins (https://youtu.be/kfhGpirPNsk), times from `films/04-gambling/film.js`
  (54.6-56.4, 57.2-58.5, 60.0-61.2, 66.2-72.5, 73.7-88.1).
- **The cut** (`short.js`, 21 segments): it opens on its real voice in his room, towering over him on the bed with the
  cards on the floor: "YOU HAVE ONE THING LEFT TO BET." (the first frame); its claw holds out the card with his own face
  ("YOU."), his face; he snaps his bank card in half. 6:00 AM, the music turns: push-ups ("Come back. I'll let you
  win."), his face at dawn, 6:30 AM the run (a fast pull from its burning face to a two-shot of the chase, "You can't
  outrun the odds.", then a wide two-shot where it fades behind him), then the double shift that pays it back: 8:00 AM
  boxes under the DOUBLE SHIFT board (SHIFT 1 and SHIFT 2 ticked), onto the top shelf, 2:00 PM the second shift, his
  face in the warehouse light, 8:30 PM the gym (pull-ups, squats, curls), his calm face; the end card (GAMBLING / THE
  HOUSE ALWAYS WINS / FULL FILM ON THE CHANNEL and an arrow).
- **How it differs from Shorts 22-25 (GAMBLING) and 18 (LUST's comeback):** the first GAMBLING Short of the film's
  second half: it opens on the bet it offers ("ONE THING LEFT TO BET" / "YOU.") and answers it with the snapped card
  and the double shift, which no earlier Short shows; the DOUBLE SHIFT board framed whole in both shifts; its own run
  framing (a pull from its face to a two-shot, not 18's pan), sound plan and title. It ends on his calm face, not a
  threat.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the reveal's score under its line, a boom on
  "YOU.", the film's planned silence before the snap and the snap itself, then the anthem RISE from its 6:00 AM impact
  unbroken under every cut to the end card (film 66.2-90.3, ending before the payday attack), with a boom on the end
  card. Mix: -16.0 LUFS, -2.6 dBTP, 11% under 60 Hz; no phone-band gap over 2 s.
- **QA** (three sheet rounds, one on the MP4):
  - sheet 1 (automatic framings): the run lost its chase (it was out of frame on the left) and its falling behind; the
    DOUBLE SHIFT board sat under the top bar and off the right edge in both shifts.
  - sheet 2: the run now pulls from its face (z 1.3) to a two-shot (z .64); the board framed whole (z .7-.74, centre
    y 440) in both shifts; the falling-behind two-shot moved left so it sits inside the safe area.
  - sheet 3 (every second, `--safe`): every word in the green zone; faces between y 400 and 1500; the first frame is its
    line over the room.
  - the MP4 (`engine/qa.mjs` all ok): H.264 1080x1920 30 fps, AAC 48 kHz, 28.00 s, -16.09 LUFS, true peak -2.74 dBTP,
    no black stretch over .25 s. Full frames checked: the first frame, "YOU.", the chase, both shifts' board, the end
    card. The story reads with the sound off.
- **Files:** `short.js` (the cut), `publish.json`, `short26_phone.mp4` (720p archive copy). The full render `short26.mp4`
  and `mix.wav` are rebuilt from source (`render.sh short shorts/26-gambling-comeback`).
- **Left by hand after upload:** Studio, the Short's Related video = the film (GAMBLING, kfhGpirPNsk).
