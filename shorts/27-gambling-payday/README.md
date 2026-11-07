# Short 27: gambling-payday (26.4 s, 1080 x 1920)

One idea: on payday it comes back with the very words of the first night, and this time he remembers what they cost.
Built, QA'd and uploaded by the cloud routine of 7 Nov 2026: **YouTube pSzqNd2BggQ** (https://youtu.be/pSzqNd2BggQ),
public 8 Nov 2026 20:00 IST. The sixth Short of GAMBLING.

- **Film:** 04 GAMBLING | The House Always Wins (https://youtu.be/kfhGpirPNsk), times from `films/04-gambling/film.js`
  (89.05-92.3, 3.8-7.8, 24.6-26.3, 35.55-37.3, 37.5-39.8, 92.3-101.1).
- **Why it is longer than planned:** the planned stretch (88.1-98.1) is 10 s, under the 25 s floor. Instead of taking
  Short 28's ending (as 19 took 21, which would make it 19's shape again), it adds a flash of the first night: the same
  words, and what they cost. Short 28's stretch (101.1-113.1) is left whole for it.
- **The cut** (`short.js`, 13 segments): it opens on the banner on his clean home screen, pushed in to read: "HOUSE:
  Payday! Your table is waiting."; the jump scare, its grin: "Just one bet. For fun…", his face in its red light. The
  flash: 11:52 PM, the first night, the same words over HOUSE ("Just one bet. For fun.", YOU WIN), his hungry face; its
  claw takes Grandma's chain ("Mom won't miss it."); "Sis: I had to drop out. It's okay"; it behind him on the bed: "You
  still have something to bet…". Back to tonight: the whisper still on his home screen as he deletes HOUSE (the dialog
  pushed in), it shrieks, Sis's chat slowed to read ("First payment sent. I'm so sorry." / "I'm back in!!" and a heart),
  11:00 PM, asleep with no phone while its eyes open in the window ("You'll be back."); the end card (GAMBLING / THE
  HOUSE ALWAYS WINS / FULL FILM ON THE CHANNEL and an arrow).
- **How it differs from Shorts 22-26 (GAMBLING) and 19 (LUST's attack):** the first Short to put the relapse next to the
  night it began (the same line then and now); no earlier GAMBLING Short shows the payday banner, the delete, Sis's
  "I'm back in!!" or the sleep; 19 opened on its grin and ran into weeks later, this opens on the banner, cuts back to
  the first night and ends on the threat, not the mirror. Its own framings (the banner, the delete dialog, the chat, a
  slow push from him to its eyes), sound plan and title.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the banner and the attack's dead silence with
  the scare; the horror score of nights 2-4 (film 27.8-37.55) unbroken under the whole flash, a boom into it and out of
  it; the anthem back on the delete through the shriek; the anthem's gym bars (film 83.0-89.0) under Sis's chat,
  fading as he sleeps; the calm piano under the end card with a boom. Mix: -16.0 LUFS, -2.7 dBTP, 17% under 60 Hz; no
  phone-band gap over 2 s (round 1 had 5 s of near silence from 18.3 s: the anthem's own fade under the slowed chat,
  replaced by its gym bars).
- **QA** (four sheet rounds, one on the MP4):
  - sheet 1 (automatic framings): the payday banner, Sis's banner and the chat too small to read; the delete dialog
    unread; asleep framed wide with its eyes at the frame's edge.
  - sheet 2: the banners pushed in (z 1.28-1.33), the delete pushed in (z 1.3-1.45), the chat at z 1.2, a pan from
    him to the window; the chat now ran past x 980 and its "Sis" header under the top bar; the eyes still at the edge.
  - sheet 3: the chat at z 1.02-1.06 (every bubble in the green zone); Sis's banner framed so HOUSE's LIVE badge sits
    under the app's buttons; banners centred at x 945 so their icons clear x 100.
  - sheet 4 (every 0.5 s, `--safe`): every word in the green zone; faces between y 400 and 1500 and clear of the
    buttons; the sleep push ends on a two-shot (z 1.28) that keeps its eyes inside the frame and his face off the buttons.
  - the MP4 (`engine/qa.mjs` all ok): H.264 1080x1920 30 fps, AAC 48 kHz, 26.40 s, -16.29 LUFS, true peak -2.44 dBTP,
    no black stretch over .25 s. Full frames checked: the first frame (the banner), the scare, the chat, its eyes in the
    window, the end card. The story reads with the sound off. The delete dialog shows for 0.65 s, as in the film and
    Short 19; the icon vanishing after it carries the beat.
- **Files:** `short.js` (the cut), `publish.json`, `short27_phone.mp4` (720p archive copy). The full render `short27.mp4`
  and `mix.wav` are rebuilt from source (`render.sh short shorts/27-gambling-payday`).
- **Left by hand after upload:** Studio, the Short's Related video = the film (GAMBLING, kfhGpirPNsk).
