# Short 19: lust-jumpscare (27.7 s, 1080 x 1920)

One idea: it comes back for him, and it will always come back. Built, QA'd and uploaded by the cloud routine of 31 Oct
2026: **YouTube N7ymztwn2OI** (https://youtu.be/N7ymztwn2OI), public 1 Nov 2026 20:00 IST.

- **Film:** 03 LUST | It Watches Back (https://youtu.be/_UwESHNcD7A), times from `films/03-lust/film.js` (81.5-93.1,
  95.6-105.45, and a 0.8 s flash of 37.45-38.25).
- **Why it also takes Short 21's ending:** the planned stretch (82.4-89.4) is 7 s and the ending planned as Short 21
  (95.5-108) is 12.5 s; neither reaches 25 s without padding or repeating Short 18. Together they make one arc: the
  attack, what he chose instead, and its answer. Short 21 is marked merged in the queue.
- **The cut** (`short.js`, 19 segments): it opens on its grin and the whisper "Just one look…" (the first frame), a flash
  of the scare to come, then the night it happens: his smile under the lamp, 9:30 PM, his clean home screen and the
  banner "XXX: New videos for you" (a push-in, then closer), a 0.8 s flash of the nights he fed it (it behind him, its
  claws on his shoulders), the jump scare in its red flash, his strained face in its light, the delete ("Delete “XXX”?",
  the icon gone), its shriek as it fades; Maya's chat played at 0.6x so every message reads ("I waited an hour…",
  "I'm sorry about last week.", "Coffee on Saturday?", "Saturday :)", a heart); 11:00 PM, asleep with no phone; WEEKS
  LATER; he is fine in the mirror, the dark doorway behind him, its eyes open: "I'LL WAIT."; black; the film's last line
  "YOU THINK YOU'RE ALONE WHEN YOU WATCH IT… YOU'RE NOT."; the end card (LUST / IT WATCHES BACK / FULL FILM ON THE
  CHANNEL and an arrow to the Related video link).
- **How it differs from 15-18:** the only LUST Short built on the attack and the ending: its own hook (a whisper, not a
  slammed line), the phone close-ups (the banner, the delete dialog, the chat), the mirror, and the cold line's answer
  as its last word. Its own sound plan and title.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the scare under the first frame; the training
  anthem in its own order around the attack (film 76.25-80.3 under the smile, 9:30 PM and the banner, a soft boom on the
  flash of the nights; the scare and the dead silence of the attack; the anthem back on the delete, the shriek; film
  80.3-84.3 under Maya; its last chord over 11:00 PM); the weeks-later piano with its dead air cut out (in the picture
  too, so the lullaby still lands on its eyes); the film's planned silence before the last line and the score's biggest
  hit on "YOU'RE NOT."; the same hit again under the end card. Mix: -14.1 LUFS, -2.5 dBTP; the only phone-band gap over
  2 s is the film's own silence before the last line.
- **QA** (three sheet rounds, three on the MP4):
  - sheet 1 (automatic framings) fixed: the closer banner cut its icon at the frame edge, the chat ran outside the safe
    area, the doorway two-shot cut his face in half, the sleep was a dark wide shot; and in the engine the vertical `end`
    shot set "YOU'RE NOT." at y 1015-1125 reaching x 970 (the buttons' column): it now sits above y 1000, fitted to 780 px.
  - sheet 2 fixed: the shot's own push-in (7%) and the phone's growth carried the chat and the delete dialog past x 870;
    the framings now allow for both. The sound plan was rebuilt so no stretch sags (the anthem's strongest bars under
    Maya, the weeks-later dead air cut).
  - MP4 1: "Saturday :)" showed 0.8 s and the heart 0.35 s: the chat now plays at 0.6x (`rate`, new in the engine), 4.0 s.
  - MP4 2: true peak -0.93 dBTP (AAC added 1.07 dB to a transient at 2.0 s): `short_mix.py` now masters to -2.5 dBTP.
  - MP4 3 (`engine/qa.mjs`): H.264 1080x1920 30 fps, AAC 48 kHz, 27.70 s, -14.54 LUFS, true peak -1.85 dBTP; no black
    stretch over .25 s. By eye: the first frame has its grin and the whisper; every word inside the safe area; whispers
    66 px, real lines 92 px, the banner 54-63 px, the dialog 56 px, the chat 35 px (held 4 s); the story reads with the
    sound off (the banner, the scare, the delete, Maya's yes, weeks later, its eyes and its line).
- **Files:** `short.js` (the cut), `publish.json`, `short19_phone.mp4` (720p archive copy). The full render `short19.mp4`
  and `mix.wav` are rebuilt from source (`render.sh short shorts/19-lust-jumpscare`).
- **Left by hand after upload:** Studio, the Short's Related video = the film.
