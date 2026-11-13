# Short 32: doomscrolling-hours (27.3 s, 1080 x 1920)

One idea: what it eats, night by night. Built, QA'd and uploaded by the cloud routine of 13 Nov 2026:
**YouTube BXKDBEuDgQo** (https://youtu.be/BXKDBEuDgQo), public 13 Nov 2026 20:00 IST. The fourth Short of DOOMSCROLLING.

- **Film:** 05 DOOMSCROLLING | It Eats Your Hours (https://youtu.be/4cDycr2W4p0), times from
  `films/05-doomscrolling/film.js` (8.55-9.4, 7.35-8.0, 15.6-16.6, 19.6-27.4, 33.6-36.8, 39.0-45.4, 62.1-64.1).
- **The cut** (`short.js`, 17 segments): night 1, its grin in the window and a few clock faces drifting out of his phone
  into it, "There's always more." (slowed to .6, framed on the window and the stream); his face, young, in the feed's
  light; DECEMBER 25: a stream from the foot of the bed, a calendar page torn into its mouth ("You'll go next year."),
  his face a notch older (bags), its face: "Nobody's counting." (slowed to .8), the stream rising past him (framed on
  him and the faces); MARCH 3: its claw spins his wall clock, his face greying, its grin beside him; JUNE 15: a torrent
  from behind him ("You have all the time in the world."), his face lined, its grin, the torrent; then the hours stream
  back into him as it screams; the end card (DOOMSCROLLING / IT EATS YOUR HOURS / FULL FILM ON THE CHANNEL and an arrow).
- **How it differs from Shorts 29 (the hook), 30 (Saturday) and 31 (the reveal):** told by the hours themselves and by
  his face (the four face close-ups, one a night, each older), with the wall clock and "Nobody's counting." (both new
  to the Shorts); no chip, no banners, no Grandpa, no black glass; it ends on the hours going back into him.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the nights' pulse unbroken under the jump
  cuts (film 23.5-32.7), on past the film's quiet sub drop after the Decline (32.7-35.0) from MARCH 3 with a soft boom,
  peaking under the torrent (to 48.15); a boom into the hours streaming back, in sync with its scream (62.1-64.1); the
  end card on the comeback anthem's opening impact (film 67.17). Mix: -16.0 LUFS, -2.5 dBTP, 21% under 60 Hz.
- **QA** (three sheet rounds, one mix round, one on the MP4):
  - sheet 1 (automatic framings): the opener framed him and missed the window; "He's fine. Call tomorrow." left over on
    the night-3 stream (cut).
  - sheet 2: the opener's window cut at the left and its top under the app's bar; dim leftovers of "Five more minutes."
    and "You have all the time in the world." on two face close-ups (their starts moved past the fade); the stream shot
    panned off him to an empty frame.
  - sheet 3: the opener framed on the window and the stream (z 1.0-1.2); the stream shot reframed on him and the faces;
    every word inside the green zone; faces between y 400 and 1500.
  - mix 1: a 2.3 s phone-band gap (the film's quiet drop after the Decline); the pulse split around it on the MARCH 3
    cut with a soft boom (no gap over 2 s).
  - MP4 1 (`engine/qa.mjs` all ok): H.264 1080x1920 30 fps, AAC 48 kHz, 27.33 s, -16.33 LUFS, true peak -2.37 dBTP, no
    black stretch over .25 s. By eye: whispers 66 px held 1.4-1.5 s, date cards 1.25 s; the story reads with the sound
    off (its grin eats the clock faces, the dates jump months, his face ages a notch a night, the torrent, the hours
    going back).
- **Files:** `short.js` (the cut), `publish.json`, `short32_phone.mp4` (720p archive copy). The full render
  `short32.mp4` and `mix.wav` are rebuilt from source (`render.sh short shorts/32-doomscrolling-hours`).
- **Left by hand after upload:** Studio, the Short's Related video = the film (DOOMSCROLLING, 4cDycr2W4p0).
