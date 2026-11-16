# Short 35: doomscrolling-lake (26.9 s, 1080 x 1920)

One idea: the photo on his nightstand comes true. Built, QA'd and uploaded by the cloud routine of 16 Nov 2026:
**YouTube QczFcFOTz_o** (https://youtu.be/QczFcFOTz_o), public 16 Nov 2026 20:00 IST. The seventh and last Short of
DOOMSCROLLING.

- **Film:** 05 DOOMSCROLLING | It Eats Your Hours (https://youtu.be/4cDycr2W4p0), times from
  `films/05-doomscrolling/film.js` (37.2-38.8, 12.0-13.8, 57.3-59.3, 84.2-86.2, 96.4-98.8, 102.2-113.8).
- **The cut** (`short.js`, 10 segments): Grandpa's banner, "Haven't seen you in months, kid." (the first frame, framed
  close); the photo by his bed (a boy and his Grandpa on a dock, holding up a fish) under its lie, "He has plenty of
  Saturdays." (at 0.8x to read); its real voice, "HE DOESN'T HAVE YEARS.", and its teeth on the photo; the photo stood
  back up under the lamp; his answer to the old invite, "Is that offer still open?" / "Always. 6 AM." and a heart (at
  0.6x to read); WEEKS LATER (at 0.7x); the dock from the photo, Grandpa holding up the fish; the mirror; its claw holds
  out a glowing phone from the dark doorway, "Just scroll.", the blink to his old face; the film's black; "HOW MANY
  HOURS DID IT EAT?" / "NOT ENOUGH."; the end card (DOOMSCROLLING / IT EATS YOUR HOURS / FULL FILM ON THE CHANNEL and an
  arrow).
- **How it differs from Shorts 29-34:** its through-line is the photo (a lie, then bitten, stood back up, and lived), it
  is the only one with the lake, the mirror and the film's last line, and it opens on Grandpa's last banner instead of
  the invite (30) or the cold line (29).
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the last night's pulse unbroken under the
  banner and the photo (film 37.2-41.05), the bite in sync on a boom (57.3-59.3), the comeback anthem under the photo
  and the chat on a boom (78.2-84.2), then from WEEKS LATER unbroken and in sync (101.77-113.8: the calm piano, the
  detuned tick with the phone, the score's biggest hit on "NOT ENOUGH."), and the score's title hit (3.3-6.3, the one
  under the film's own title) on the end card with a boom. Mix: -16.0 LUFS, -2.5 dBTP, 24% under 60 Hz, no phone-band
  gap over 2 s.
- **QA** (three sheet rounds, one still round, two mix rounds, one round on the MP4):
  - sheet 1: Grandpa's banners and the chat far too small to read; the cut opened on the invite, as Short 30 did
    (replaced by his last banner, "Haven't seen you in months, kid.", framed close).
  - sheet 2 / stills: the chat's right bubble reached past x 980 at z 1.15 and its heart sat at x 54 (reframed to
    z 1.03-1.07, centred lower so the blue bubble sits above y 1000); WEEKS LATER opened on a blank card (starts at
    102.2, slowed).
  - mix 1: a 2.4 s quiet stretch under the end card (the film's outro fades): the score's title hit put there instead.
  - sheet 3: the banner's tile touched the left edge (moved 17 px right); every word inside the green zone, faces between
    y 400 and 1500.
  - MP4 1 (`engine/qa.mjs` all ok: H.264 1080x1920 30 fps, AAC 48 kHz, 26.87 s, -16.12 LUFS, -2.04 dBTP; one black
    stretch, 20.2-20.5 s, the film's own black before the cold line returns): every word held 1.4 s or more (the chat
    4 s); the story reads with the sound off (Grandpa waiting, its lie, its bite, the photo stood up, the answer, the
    dock, its phone in the doorway, "NOT ENOUGH.").
- **Files:** `short.js` (the cut), `publish.json`, `short35_phone.mp4` (720p archive copy). The full render
  `short35.mp4` and `mix.wav` are rebuilt from source (`render.sh short shorts/35-doomscrolling-lake`).
- **Left by hand after upload:** Studio, the Short's Related video = the film (DOOMSCROLLING, 4cDycr2W4p0).
