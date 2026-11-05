# Short 25: gambling-deal (27.5 s, 1080 x 1920)

One idea: it deals, and the cards pile up on his floor. Built, QA'd and uploaded by the cloud routine of 5 Nov 2026:
**YouTube ssk1y6Yiz-A** (https://youtu.be/ssk1y6Yiz-A), public 6 Nov 2026 20:00 IST. The fourth Short of GAMBLING.

- **Film:** 04 GAMBLING | The House Always Wins (https://youtu.be/kfhGpirPNsk), times from `films/04-gambling/film.js`
  (13.4-15.0, 8.0-9.6, 15.0-15.8, 18.4-24.6 without 22.6-23.8, 28.6-30.4, 32.4-35.3, 37.5-44.9).
- **The cut** (`short.js`, 15 segments): it opens on its eyes in the dark window over its whisper ("Win a little more.
  Then send it."), and the camera drops fast to the card at his feet as it flips over to its grin and glows red (slowed
  to .7). Then the four nights as two-shots, each framed low so his floor is in the picture and the words sit under the
  floor: from the window it deals the second card ("See? You're good at this."); 12:47 AM, from the foot of the bed it
  deals three ("He can wait. You're due for a win."), his face, its face ("Double it. Then stop.", slowed to .6 so the
  line holds 1.25 s); 2:16 AM, beside him it deals four ("You'll win it back by morning."), his face, its grin; 3:58 AM,
  behind him five more fall as its claws come down ("You still have something to bet..."), his face, its grin closest;
  the last shot is the pile around his feet, its grin card among them, as six more drop and its claws close on his
  shoulders; the end card (GAMBLING / THE HOUSE ALWAYS WINS / FULL FILM ON THE CHANNEL and an arrow). The deals run at
  .8-.85 so each card can be seen land.
- **How it differs from Shorts 22-24 (GAMBLING) and 17 (LUST's closer):** it opens on the first card's flip, which no
  earlier Short used; its framings are on the floor and the pile (22 framed the same nights around him and his phone,
  23 around the banners, 24 is the reveal); no phone screen at all; its own sound plan (below) and title.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the film's casino chime over its first pulse
  (film 4.5-8.4) under the eyes and the flip, a low boom as the card turns; a boom on 12:47 AM, then the nights' pulse
  unbroken (film 27.2-47.85) climbing to its peak on the pile; the end card lands on the reveal's explosion (film
  48.85-52.6) with a boom. Mix: -16.0 LUFS, -2.5 dBTP, 21% under 60 Hz; no phone-band gap over 2 s.
- **QA** (four sheet rounds, two on the MP4):
  - sheet 1 (the planned stretches, automatic framings): 24.3 s, too short; the first frame was the clock's white flash
    (no words); the first card's flip sat at the frame's edge; the cards on his floor were tiny and under the whisper.
  - sheets 2-4: opened on its eyes in the window with the whisper and a fast drop to the card as it flips (z 1.5 -> 2.2);
    night 1 as a two-shot (z .72); the deals framed low (z .7-.8) so the floor and the cards sit in the middle of the
    frame and the words below them; the beside shot's end zoom eased (its face reached y 396) and the pile framed so his
    head stays under the top bar (y 414+).
  - MP4 1 (`engine/qa.mjs` all ok, 26.57 s, -15.86 LUFS, -1.91 dBTP): "Double it. Then stop." was readable for only
    .75 s; that shot slowed to .6 and the sound plan re-timed.
  - MP4 2 (`engine/qa.mjs` all ok): H.264 1080x1920 30 fps, AAC 48 kHz, 27.50 s, -15.86 LUFS, true peak -2.4 dBTP, no
    black stretch over .25 s. By eye: the first frame is its eyes in the window with the whisper; whispers 66 px, each
    held 1.2 s+; faces between y 400 and 1500; every word in the green zone; the story reads with the sound off.
- **Files:** `short.js` (the cut), `publish.json`, `short25_phone.mp4` (720p archive copy). The full render `short25.mp4`
  and `mix.wav` are rebuilt from source (`render.sh short shorts/25-gambling-deal`).
- **Left by hand after upload:** Studio, the Short's Related video = the film (GAMBLING, kfhGpirPNsk).
