# Short 28: gambling-coin (27.7 s, 1080 x 1920)

One idea: Grandma's gold chain, there and back, and it is still dealing. Built, QA'd and uploaded by the cloud routine of
8 Nov 2026: **YouTube cY5vsPFA9oY** (https://youtu.be/cY5vsPFA9oY), public 9 Nov 2026 20:00 IST. The seventh and last
Short of GAMBLING.

- **Film:** 04 GAMBLING | The House Always Wins (https://youtu.be/kfhGpirPNsk), times from `films/04-gambling/film.js`
  (30.75-32.2, 23.8-26.3, 28.6-30.4, 59.2-61.2, 78.8-81.8, 101.65-113.1).
- **Why it is longer than the planned stretch:** weeks later (101.1-113.1) alone is 12 s, under the 25 s floor. As the
  plan said, it is padded with the chain itself, so its return lands: Mom's question, the night its claw took it, then
  how he earned it back (the snapped card, the double shift).
- **The cut** (`short.js`, 14 segments): it opens on Mom's banner over HOUSE's empty balance ("Mom: Have you seen
  Grandma's chain?", $0.00, HOUSE WINS), pushed in to read; 2:16 AM that night: its claw takes the chain out of his hand
  ("Mom won't miss it."), it on the bed beside him ("You'll win it back by morning."); his face in its red light turns
  to resolve; he snaps his bank card; 2:00 PM, the double shift (a push from him to the board, SHIFT 2 ticked), his face
  under the work light. WEEKS LATER (slowed to read): Mom's chat with the photo of the chain ("Got it back. I'm so
  sorry." and a heart, slowed), the mirror with the two halves of the card in its frame, its eyes in the dark doorway
  and the gold coin it flips: "DOUBLE OR NOTHING?"; "WHO DO YOU THINK IS DEALING?" "STILL ME."; the end card (GAMBLING /
  THE HOUSE ALWAYS WINS / FULL FILM ON THE CHANNEL and an arrow).
- **How it differs from Shorts 22-27:** the only one to follow one object through the film; the first with the chat of
  the chain coming back, the mirror, the coin and the cold line's answer ("STILL ME."); 23 opened on Sis and ran banner
  by banner, this opens on Mom's question and answers it. Its own framings (the chat pulled back so every bubble sits in
  the safe area, the mirror wide enough to show the snapped card, the push to the shift board), sound plan and title.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the horror score of the nights unbroken under
  the banner and the flashback (film 24.0-29.75), a boom into the flashback; the dead silence before the snap and the
  snap itself (59.2-61.2); the anthem under the shift (78.8-81.8); the calm piano under weeks later and the chat, +6 dB
  (round 1 left 2.2 s under the phone band's floor there); then the ending as the film has it (the detuned chime and
  the coin, the hit on "STILL ME.", the title's boom), with the nights' score (41.1-44.6) low under the end card (it had
  2.9 s of near silence). Booms on each jump (1.45, 5.75, 7.75, 10.75 s). Mix: -16.0 LUFS, -2.5 dBTP; no phone-band gap
  over 2 s.
- **QA** (three sheet rounds, three on the MP4):
  - sheet 1 (automatic framings): "YOU." from the reveal left over his red face; "You'll be back." over WEEKS LATER;
    the shift board under the top bar and cut off; Mom's chat too small; the mirror without the snapped card.
  - sheet 2: the face starts at 59.2, the card at 101.4, the board framed by a push, the chat at z .98-1.02, the mirror
    at z .75; the chat's reply bubble reached x 912 below y 1000 (the buttons) and the card halves sat under the top bar.
  - sheet 3 (every 0.5 s, `--safe`): the chat at z .9-.94 centred at x 988 (every bubble in x 100-870), the mirror at z
    .7-.74; every word in the green zone, faces between y 400 and 1500 (the dark edge of his head in the mirror touches
    the buttons' column; his features are clear of it).
  - MP4 1: `qa.mjs` all ok, but WEEKS LATER was whole for only 0.4 s: the card slowed (rate .5). MP4 2: the slowed card
    showed the fading "You'll be back." from the shot before: the card starts at 101.65 (rate .4, whole for 1.1 s).
  - MP4 3 (`engine/qa.mjs` all ok): H.264 1080x1920 30 fps, AAC 48 kHz, 27.67 s, -16.35 LUFS, true peak -2.17 dBTP; one
    black stretch (20.6-20.9 s, the film's own black before the end line). Full frames checked: the first (the banner),
    WEEKS LATER, the chat, the coin, "STILL ME.", the end card. The story reads with the sound off.
- **Files:** `short.js` (the cut), `publish.json`, `short28_phone.mp4` (720p archive copy). The full render
  `short28.mp4` and `mix.wav` are rebuilt from source (`render.sh short shorts/28-gambling-coin`).
- **Left by hand after upload:** Studio, the Short's Related video = the film (GAMBLING, kfhGpirPNsk).
