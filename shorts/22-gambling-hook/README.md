# Short 22: gambling-hook (31.1 s, 1080 x 1920)

The whole escalation of GAMBLING. Built, QA'd and uploaded by the cloud routine of 2 Nov 2026:
**YouTube L2xTUzEaVtM** (https://youtu.be/L2xTUzEaVtM), public 3 Nov 2026 20:00 IST. The first Short of GAMBLING.

- **Film:** 04 GAMBLING | The House Always Wins (https://youtu.be/kfhGpirPNsk), times from `films/04-gambling/film.js`
  (1.45-11.45, 15.0-15.8, 18.4-20.2, 23.8-30.3, 34.5-35.3, 37.5-40.1, 47.9-53.9).
- **The cut** (`short.js`, 16 segments): the cold line typed in full from the first frame ("EVERY NIGHT YOU BET… …WHO DO
  YOU THINK IS DEALING?", held 1.2 s); a card spins out of the window to his feet and its eyes open; GAMBLING; 11:52 PM,
  the first win ("Just one bet. For fun."); his face, hungry ("See? You're good at this."); Sis's banner "Did you send my
  college fees?" framed close and slowed; 12:47 AM, it at the foot of the bed dealing cards ("He can wait. You're due
  for a win."); 2:16 AM, its claw takes Grandma's gold chain ("Mom won't miss it."); the deposit, DOUBLE OR NOTHING,
  HOUSE WINS, $0.00; beside him ("You'll win it back by morning."); 3:58 AM, behind him with its claws on his shoulders
  ("You still have something to bet…"); the zeros pour down the dying phone; the black glass: "I LET YOU WIN." /
  "I AM THE HOUSE."; the end card (GAMBLING / THE HOUSE ALWAYS WINS / FULL FILM ON THE CHANNEL and an arrow).
- **How it differs from the LUST Shorts:** its own film, device (the HOUSE app, the cards it deals, the chain), cold
  line and reveal; his face at the window shot instead of it (the window is the opening shot here); the money told by
  the app itself, framed so its balance and buttons sit inside the safe area.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the film's cold open and title hit (timed so
  the hit lands on GAMBLING), then the nights' pulse unbroken under the jump cuts (film 0.68-22.97); in sync from the
  zeros (film 47.9-56.7): a boom on the jump, the reveal, its stinger and a boom under the end card.
  Mix: -16.0 LUFS, -2.5 dBTP, 16.5% under 60 Hz; no phone-band gap over 2 s.
- **QA** (five sheet rounds, two on the MP4):
  - sheet 1 (automatic framings): Sis's banner and the HOUSE table were tiny on the whole phone; the night-1 window
    whisper ran into his foot.
  - sheets 2-3: a push-in on the first win put its whisper over the balance (back to the automatic framing, the whisper
    above the phone); a two-shot of him and the window cut both of them (now his face, the whisper on top); the
    banner and the table re-framed (the table at z .94-.98 so $0.00 and DOUBLE OR NOTHING sit in x 100-870).
  - sheets 4-5: the banner drifted left as it zoomed (now z 1.38-1.44, about 38 px letters, x 165-924).
  - MP4 1 (`engine/qa.mjs` all ok, -15.76 LUFS, -2.3 dBTP): the first frame had the cold line half typed ("…W"). Now
    it opens on the full line, slowed to hold 1.2 s, and the sound is re-timed. In the tall frame the four-row cold
    line reached y 1105 with "…WHO DO YOU THINK" at y 1004 and x 929 (past the safe area's 870 below y 1000): in the
    engine, `typeBlock` now keeps the whole block above y 1000 (LUST's cold line moves up the same way).
  - MP4 2 (`engine/qa.mjs`): H.264 1080x1920 30 fps, AAC 48 kHz, 31.07 s, -15.75 LUFS, true peak -2.09 dBTP, no
    black stretch over .25 s. By eye: the first frame is the full cold line; whispers 66 px, red lines 92 px, the
    banner about 38 px for 2.7 s, clocks fitted; faces between y 400 and 1500; the story reads with the sound off.
- **Files:** `short.js` (the cut), `publish.json`, `short22_phone.mp4` (720p archive copy). The full render `short22.mp4`
  and `mix.wav` are rebuilt from source (`render.sh short shorts/22-gambling-hook`).
- **Left by hand after upload:** Studio, the Short's Related video = the film (GAMBLING, kfhGpirPNsk).
