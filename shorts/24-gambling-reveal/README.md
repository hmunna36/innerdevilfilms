# Short 24: gambling-reveal (28.5 s, 1080 x 1920)

One idea: what the house was really playing for. Built, QA'd and uploaded by the cloud routine of 4 Nov 2026:
**YouTube pwv-gBgjMVI** (https://youtu.be/pwv-gBgjMVI), public 5 Nov 2026 20:00 IST. The third Short of GAMBLING.

- **Film:** 04 GAMBLING | The House Always Wins (https://youtu.be/kfhGpirPNsk), times from `films/04-gambling/film.js`
  (38.15-42.5, then 44.9-66.0 in sync).
- **The cut** (`short.js`, 14 segments): it opens on its last kind whisper, already typed, as it bends over him with its
  claws coming down: "You still have something to bet…"; his face; its grin. The montage ("win it back… win it back…",
  every banner it cost him), the zeros pour down the dead phone (pushed in to read them), the black glass: "I LET YOU
  WIN." / "I AM THE HOUSE."; it is in the room and the cards on the floor flip to its grin: "YOU HAVE ONE THING LEFT TO
  BET." (the whisper's answer); its claw deals him a card with his own face, pushed in: "YOU."; his face from shock to
  resolve; he snaps his bank card; the cards burn and it screams; its face, the scream dying; alone, a pan from him to
  its eyes opening in the window; the end card (GAMBLING / THE HOUSE ALWAYS WINS / FULL FILM ON THE CHANNEL and an arrow).
- **Why more than the planned stretch:** 47.9-64.8 is 16.9 s; the Short opens 10 s earlier on the kind whisper that its
  real line answers ("You still have something to bet…" -> "YOU HAVE ONE THING LEFT TO BET." -> "YOU."), and ends on
  its eyes in the window.
- **How it differs from Short 22 (GAMBLING's hook, which ends on "I AM THE HOUSE.") and 16 (LUST's reveal):** it is the
  whole reveal and the break, not the escalation: the montage, the bet on himself, the card with his face, the snap and
  the burn, none of which 22 used; it opens on a whisper, not the cold line; its own framings (the zeros, the card, the
  snap, the window), sound plan and title.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the nights' pulse under the whisper, a boom on
  the jump into the montage, then the film's mix in sync from 44.9 (the dead silence of the zeros, the reveal, the
  stinger, the silence before the snap, the snap, the scream); under its dying face and the window the cold open's
  reversed swell and riser (+6 dB) rise into the title's hit on the end card, with the casino chime over the first pulse
  under it. Mix: -16.0 LUFS, -3.8 dBTP, 11% under 60 Hz; no phone-band gap over 2 s.
- **QA** (three sheet rounds, one mix round, one on the MP4):
  - sheet 1 (automatic framings): reads well; the zeros small on a dark phone, the card with his face small, the snap
    panning off the card, the last shot losing him under the buttons and the window at the frame's edge.
  - sheets 2-3: the zeros pushed in (z 1.04-1.12), the card pushed in (z 1.05 -> 1.5, held above "YOU."), the snap framed
    wide (z .9-.84) so both hands and both halves show, the last shot a pan from him to its eyes in the window (z 1.1 ->
    1.6); the end card moved 0.2 s later.
  - mix 1: the film's aftermath after the scream and the end card's low drone left 3.5 s and 2.7 s under the phone band;
    replaced by the cold open's swell into the title's hit (no gap left).
  - MP4 1 (`engine/qa.mjs` all ok): H.264 1080x1920 30 fps, AAC 48 kHz, 28.47 s, -16.49 LUFS, true peak -3.7 dBTP, no
    black stretch over .25 s (the zeros' dead phone is under .25 s). By eye: the first frame is the whisper over it
    bending to him; whispers 66 px, real lines 92 px, each held 1.2 s+; faces between y 400 and 1500; every word in the
    green zone; the story reads with the sound off.
- **Files:** `short.js` (the cut), `publish.json`, `short24_phone.mp4` (720p archive copy). The full render `short24.mp4`
  and `mix.wav` are rebuilt from source (`render.sh short shorts/24-gambling-reveal`).
- **Left by hand after upload:** Studio, the Short's Related video = the film (GAMBLING, kfhGpirPNsk).
