# Short 33: doomscrolling-comeback (29.8 s, 1080 x 1920)

One idea: it ate his hours and told him Grandpa didn't have years, so he took his hours back. Built, QA'd and uploaded
by the cloud routine of 14 Nov 2026: **YouTube P2VgruCBHAI** (https://youtu.be/P2VgruCBHAI), public 14 Nov 2026 20:00
IST. The fifth Short of DOOMSCROLLING.

- **Film:** 05 DOOMSCROLLING | It Eats Your Hours (https://youtu.be/4cDycr2W4p0), times from
  `films/05-doomscrolling/film.js` (57.35-59.3, 60.2-62.1, 67.2-87.1, 98.8-101.8).
- **The cut** (`short.js`, 23 segments): behind him, its claws in him and the hours pouring out of him, "HE DOESN'T
  HAVE YEARS." (the first frame); its teeth on Grandpa's photo; his aged face turning to resolve; the drawer slammed on
  its claws; 6:00 AM, the music turns: push-ups ("You're missing everything."), his face at dawn; 6:20 AM the run: it
  chases (framed close on it, then pulled out to both), his stride ("You're wasting your time."), his face, it falls
  behind; 7:05 AM pull-ups, squats, curls, his calm face; 7:50 PM a book under the lamp, Grandpa's photo stood back up
  (framed on the photo as it rises), his smile; 10:45 PM asleep with no phone, a pan to its eyes in the window ("You'll
  get bored."); the end card (DOOMSCROLLING / IT EATS YOUR HOURS / FULL FILM ON THE CHANNEL and an arrow).
- **How it differs from Shorts 29-32 and the other comebacks (18, 26):** its through-line is Grandpa's photo, bitten
  in the first seconds and stood back up at the end; the training, the evening (the book, the photo) and the night
  after (10:45 PM, "You'll get bored.", a stretch no other Short uses) are new to the Shorts; the real line is the only
  reveal beat, with no black glass, no chip and no banners.
- **Sound** (`audio` in `short.js`, built by `engine/audio/short_mix.py`): the reveal in sync (its stinger, the bite on
  the photo, the film's planned silence before the drawer and its slam), then the comeback anthem from its 6:00 AM
  impact unbroken to his smile (film 67.18-87.08), a boom into 10:45 PM on the anthem as it fades for sleep (film
  98.8), and a boom on the end card as the night's piano comes in. Mix: -16.0 LUFS, -2.5 dBTP, 14% under 60 Hz, no
  phone-band gap over 2 s.
- **QA** (three sheet rounds, then two on the MP4):
  - sheet 1 (the plan alone, automatic framings): 22.9 s plus the card, too close to the 25 s floor; the first frame a
    white clock flash; the devil missing from the run's framing; Grandpa's photo and the sleep shot's window cut off.
  - sheet 2: the opener added (its real line and the photo, his face, the drawer); the run framed close on it, then out
    to both; the photo's rise reframed; but the photo too tight under the top bar and the window still cut.
  - sheet 3: the photo framed whole as it stands; every word inside the green zone; faces between y 400 and 1500.
  - MP4 1 (`engine/qa.mjs` all ok: 29.77 s, -16.37 LUFS, -2.36 dBTP, no black stretch): by eye, his sleeping face
    ended under the buttons' column and the nightstand photo sat behind "You'll get bored." (the pan reframed: his
    head inside x 870, the whisper on clear floor, its eyes in the window).
  - MP4 2 (`engine/qa.mjs` all ok: H.264 1080x1920 30 fps, AAC 48 kHz, 29.77 s, -16.37 LUFS, -2.36 dBTP, no black
    stretch over .25 s): the real line held 1.65 s, whispers 1.3-2.0 s, clocks 0.6-0.7 s; the story reads with the
    sound off (its line and its teeth on the photo, the drawer, the clocks of one good day, it falling behind, the
    photo stood back up, his smile, its eyes still waiting).
- **Files:** `short.js` (the cut), `publish.json`, `short33_phone.mp4` (720p archive copy). The full render
  `short33.mp4` and `mix.wav` are rebuilt from source (`render.sh short shorts/33-doomscrolling-comeback`).
- **Left by hand after upload:** Studio, the Short's Related video = the film (DOOMSCROLLING, 4cDycr2W4p0).
