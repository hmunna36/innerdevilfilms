# Short 29: doomscrolling-hook (29.1 s, 1080 x 1920)

The whole escalation of DOOMSCROLLING. Built, QA'd and uploaded by the cloud routine of 9 Nov 2026:
**YouTube LSFDkW5z8sk** (https://youtu.be/LSFDkW5z8sk), public 10 Nov 2026 20:00 IST. The first Short of DOOMSCROLLING.

- **Film:** 05 DOOMSCROLLING | It Eats Your Hours (https://youtu.be/4cDycr2W4p0), times from
  `films/05-doomscrolling/film.js` (1.6-9.6, 15.6-21.1, 24.6-25.4, 27.4-31.2, 35.8-41.4, 42.5-43.6, 48.4-54.6).
- **The cut** (`short.js`, 18 segments): the cold line typed in full from the first frame ("YOU SAID FIVE MINUTES…
  …HOW MANY HOURS DID IT EAT?", held 1.2 s); a pan from his wall calendar as its page flies through the window glass to
  its grin, and a push in on its burning eyes; DOOMSCROLLING; then four nights, each a date card, FEED's time chip and
  it closer: OCTOBER 14 11:37 PM, the feed at 2h 16m ("Five more minutes. It's early."), it in the window eating his
  first hours ("There's always more."); DECEMBER 25 12:52 AM, the chip at 4h 51m framed close, it at the foot of the bed
  ("You'll go next year."); MARCH 3 2:31 AM, Mom's "Grandpa's in the hospital. Call!" over the chip at 7h 09m, beside
  him ("He's fine. Call tomorrow.", slowed to .9); JUNE 15 4:07 AM, Grandpa's "Haven't seen you in months, kid." over
  11h 26m, behind him with its hands on his shoulders ("You have all the time in the world."), its grin, closest; the
  chip racing to the loop as the phone dies; the black glass: "YOU WEREN'T KILLING TIME." / "I WAS EATING YOU." while
  his reflection ages; the end card (DOOMSCROLLING / IT EATS YOUR HOURS / FULL FILM ON THE CHANNEL and an arrow).
- **How it differs from the earlier hooks (15 LUST, 22 GAMBLING):** its own film, device (FEED's time chip climbing
  night by night: the escalation is told by the number), cold line, dates instead of bare clocks, and reveal (the black
  glass with his face growing old); the opening is the calendar page snapped through the window, not its eyes alone.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the film's cold open (the clock ticks, the
  reversed swell) timed so the title hit lands on DOOMSCROLLING at 2.5 s, then the nights' pulse unbroken under the jump
  cuts (film 0.85-20.98); in sync from the racing chip (film 48.4-57.0): a boom on the jump, the dead phone's silence
  (planned, under 1 s), the stinger in the black glass, the reveal, and a boom under the end card.
  Mix: -16.0 LUFS, -2.5 dBTP, 24.7% under 60 Hz; no phone-band gap over 2 s.
- **QA** (three sheet rounds, one on the MP4):
  - sheet 1 (automatic framings): the window shot missed the calendar and cut its grin; the chip was too small to read
    on nights 2-4; the date cards (OCTOBER 14, DECEMBER 25, MARCH 3) and DOOMSCROLLING reached past x 100-980.
  - sheet 2: the window shot now pans from the calendar after its flying page into the window and pushes in on its
    eyes; the chip framed close (z 1.1-1.32: about 60-70 px figures, the banners above it readable); the date card fitted
    to 780 px. DOOMSCROLLING was still 986 px wide: in `film.js` its tracking did not shrink with its size (the same in
    the date card); both now scale it, and the title fits 760 px (with the push-in, x 135-946).
  - sheet 3 and full stills: the engine's end card had the same fault ("IT EATS YOUR HOURS" and "FULL FILM ON THE
    CHANNEL" reached x 89-878 with the push-in, past the 100-870 band): in `engine/short.js` every end-card line now fits
    700 px with its tracking scaled (x 117-854 at the end of the push). Every later Short gets it.
  - MP4 1 (`engine/qa.mjs`): H.264 1080x1920 30 fps, AAC 48 kHz, 29.13 s, -15.83 LUFS, true peak -2.23 dBTP, no black
    stretch over .25 s. By eye: the first frame is the full cold line; whispers 66 px and on screen 1.6-2.3 s, red lines
    92 px, dates and chips fitted; faces between y 400 and 1500; the story reads with the sound off (dates, the chip,
    the banners, where it stands, his face); the title hit measured on the cut (-29 dB before, -12.7 dB at 2.5 s).
- **Files:** `short.js` (the cut), `publish.json`, `short29_phone.mp4` (720p archive copy). The full render `short29.mp4`
  and `mix.wav` are rebuilt from source (`render.sh short shorts/29-doomscrolling-hook`).
- **Left by hand after upload:** Studio, the Short's Related video = the film (DOOMSCROLLING, 4cDycr2W4p0).
