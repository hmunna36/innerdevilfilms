# Short 23: gambling-cost (28.9 s, 1080 x 1920)

One idea: what it took, one person at a time, opened and closed by his sister. Built, QA'd and uploaded by the cloud
routine of 3 Nov 2026: **YouTube 3rv3mTq6L6M** (https://youtu.be/3rv3mTq6L6M), public 4 Nov 2026 20:00 IST. The second
Short of GAMBLING.

- **Film:** 04 GAMBLING | The House Always Wins (https://youtu.be/kfhGpirPNsk), times from `films/04-gambling/film.js`
  (10.05-13.4, 15.0-15.8, 16.75-20.2, 21.2-22.6, 24.6-28.4, 30.6-35.3, 35.6-37.3, 40.45-42.5).
- **The cut** (`short.js`, 15 segments): it opens on his sister's first message, "Sis: Did you send my college fees?",
  over a balance of $1,540.00, and the devil answers ("Win a little more. Then send it."); 12:47 AM, "Landlord: Pay
  today or you're out." and its answer from the foot of the bed ("He can wait. You're due for a win.", then its face:
  "Double it. Then stop."); its claw takes Grandma's gold chain from his hand ("Mom won't miss it."); the deposit,
  DOUBLE OR NOTHING, HOUSE WINS, $0.00; "Mom: Have you seen Grandma's chain?", his face, its grin beside him; 3:58 AM,
  his sister's last message, "I had to drop out. It's okay", over $0.00; his empty face; its grin behind him; the end
  card (GAMBLING / THE HOUSE ALWAYS WINS / FULL FILM ON THE CHANNEL and an arrow).
- **Why more than the planned stretches:** the five banner stretches in the queue add up to about 13 s, so each person
  gets the devil's answer after them (its whispers and faces), with two clocks for the nights.
- **How it differs from Short 20 (LUST's cost) and Short 22 (GAMBLING's hook):** no flash-forward; the story is
  bookended by the sister (her first and her last message, $1,540.00 then $0.00), every banner is answered by a devil
  beat (its whisper or its face), and the Short uses the devil's faces at the foot of the bed, beside and behind him,
  which 22 did not. Its own sound plan and title.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the nights' pulse (film 18.5-44.45) unbroken
  under every cut, a low boom under her last message, then the film's last hit (the one on "STILL ME.", film 110.95-114.2)
  landing on the end card with a boom. Mix: -16.0 LUFS, -2.5 dBTP, 22% under 60 Hz; no phone-band gap over 2 s.
- **QA** (five sheet rounds, one on the MP4):
  - sheet 1 (automatic framings): the banners, the whole point, were tiny on the whole phone; "Win a little more. Then
    send it." was cut before it finished; the foot of the bed's whisper ran on over his next face.
  - sheets 2-3: banners framed close (first z 1.44, which cut the app's balance and LIVE badge at the frame's edges; now
    z 1.28-1.33 at x 958, about 45 px letters, held 2.3-2.8 s); whispers slowed (`rate`) so each holds 1.2 s+; the
    leftover "You still have something to bet…" moved off his last face (it starts at 40.45).
  - sheets 4-5: the DOUBLE OR NOTHING table re-framed (z .9-.925 at 988, 475) so its header clears the top bar and its
    balance and buttons sit in x 100-870; the chain beat trimmed to its whisper.
  - MP4 1 (`engine/qa.mjs` all ok): H.264 1080x1920 30 fps, AAC 48 kHz, 28.90 s, -16.22 LUFS, true peak -2.25 dBTP, no
    black stretch over .25 s. By eye: the first frame is Sis's banner, readable; whispers 66 px, banners about 45 px,
    clocks fitted; faces between y 400 and 1500; the story reads with the sound off.
- **Files:** `short.js` (the cut), `publish.json`, `short23_phone.mp4` (720p archive copy). The full render `short23.mp4`
  and `mix.wav` are rebuilt from source (`render.sh short shorts/23-gambling-cost`).
- **Left by hand after upload:** Studio, the Short's Related video = the film (GAMBLING, kfhGpirPNsk).
