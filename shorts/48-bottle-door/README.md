# Short 48: bottle-door (26.2 s, 1080 x 1920)

The sixth Short in the look of film 07, built by the cloud routine on 24 Nov 2026:
**https://youtu.be/sQs0guDSccU, public 24 Nov 2026 20:00 IST.**

- **Film:** 07 THE BOTTLE | It Was So Small (https://youtu.be/ivH0FQPHEVo); times are seconds in the film's edit
  (`films/07-it-was-so-small/cues_edit.json`).
- **The idea: IT ASKED NICELY (the temptation).** DAY 60, evening: the devil sits on the step of the bar's lit doorway,
  the size of a cat, a tiny glass in both hands, enormous eyes. The whole DAY 60 scene is played a little slower
  (0.75x; the film's sound slows and drops with it, like tape), the last piece at 0.5x.
  - The hook is its begging face, close, then closer ("day 60. it asked nicely."), and what it was: "it was huge once."
    over three flashes of the giant (it swells over the dinner table, its claws lift him to the bottle, it grins down
    at him on the floor).
  - The ask: he walks up to the lit door, stops; it holds up the glass: "just a sip. i'm so small." (its own line,
    written again by the Short in red, in the top band), its eyes, his face, sweating.
  - The first time, when it was even smaller (AGE 15): his first beer with two friends, it climbs out of the foam and
    shakes it off ("it was smaller at fifteen."), his face goes from shock to a laugh, his grin with it sitting on his
    glass, he drinks it down and it pops a size bigger ("he said yes.").
  - His face again, then what yes cost: Lily holds up her drawing at dinner while its hand turns his chin to the glass,
    her face at her birthday, Dad slumped in the paper hat, MY FAMILY on the fridge with Daddy in red.
  - He swallows. Her hand slides into his ("he had a reason."), they walk on, its ears droop and it shrinks on the step
    ("it will ask again."). The end card: THE BOTTLE / it was so small / watch the full film, the arrow to the Related
    video link. 28 cuts, 2 beats of black.
- **Not a copy of 43-47:** 43 went up the sizes counting the drinks, 44 was only its lines, 45 her birthday twice, 46
  the two drawings, 47 down the sizes day by day. 48 is one moment, slowed: the small polite ask, with a mirror inside
  it (the same small ask at fifteen, when he said yes, against DAY 60, when he had a reason). Its giant flashes avoid
  the birthday cake shot 47 used; 49 keeps DAY 90, the corking and the night.
- **Framing** (`short.js`): the film's words are hidden in every piece (the DAY 60 shots carry a 7:40 PM time stamp the
  tall layout would set as a caption) and the Short writes its own; the counter stays on (DAY: 60 / AGE: 34 / AGE: 38 /
  AGE: 15 tell the two times apart with the sound off), except over the paper hat. The devil's red line sits in the
  top band so it never covers his face; the devil is placed low in its close-ups so the words sit above its horns.
- **Sound** (`stage/audio/short_mix.py`): the film's own mix under every piece (slowed with the DAY 60 pieces), a cut
  sound on each of the Short's 28 cuts, the marker on every written line, the end card's low hit and notes.
  -16.0 LUFS, true peak -2.5 dBTP in the mix (-2.36 in the AAC), 1.26 sound events a second; the phone band
  (300 Hz-6 kHz) stays between -12 and -26 dB every second before the last fade; **0 s of silence on a phone**.
  **Nobody has listened to it**: it is judged from these numbers.
- **QA:** three rounds of safe-area sheets (`sheet_safe.jpg`: red = covered by the app, green = where words go), two
  of full-size stills, one of the rendered frames (`sheet.jpg`) and the MP4.
  - fixed: the first cut came to 25.6 s (the DAY 60 scene is 5.2 s of film), lengthened with the AGE 15 mirror and a
    third giant; the foam-only frame at the start of the AGE 15 flash; the climbing devil framed so close it looked big
    (now the whole glass); the red line moved to the top band off his face; "fifteen." and "nicely." moved off the
    horns; the man on the left edge of the walk and the devil under the app's buttons; the 2.25 s first shot split in
    two (close, closer); the glass and the tiny devil kept inside the frame by his grin.
  - the MP4 (`engine/qa.mjs`): H.264 yuv420p 1080x1920 30 fps, AAC 48 kHz, 26.17 s, -15.86 LUFS, true peak -2.36 dBTP,
    no black stretch over 0.25 s. All ok.
  - the render: 785 frames in 64 s on the cloud's Linux machine (4 browsers).
  - not checked: playing it on a phone.
- **Files:** `short.js`, `cues_edit.json` (built), `publish.json`, `sheet_safe.jpg`, `sheet.jpg`, `short48_phone.mp4`
  (720p archive copy). The full render `short48.mp4` and `mix.wav` are rebuilt from source:
  `node stage/render.mjs shorts/48-bottle-door cues && $PYTHON stage/audio/short_mix.py shorts/48-bottle-door &&
  stage/make.sh shorts/48-bottle-door`.
- **Left by hand after upload:** Studio, the Short's Related video = the film.
