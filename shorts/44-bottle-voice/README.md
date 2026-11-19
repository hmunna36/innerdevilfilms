# Short 44: bottle-voice (29.0 s, 1080 x 1920)

The second Short in the look of film 07, built from source by the cloud routine on 19 Nov 2026:
**https://youtu.be/9jDDWl9GeyI, public 19 Nov 2026 20:00 IST.**

- **Film:** 07 THE BOTTLE | It Was So Small (https://youtu.be/ivH0FQPHEVo); times are seconds in the film's edit
  (`films/07-it-was-so-small/cues_edit.json`).
- **The idea: IT NEVER LIES.** Only the devil's lines, kind to cruel and then begging, the picture cut to each one, its
  face close when it speaks and his face answering. The hook is the giant's grin at the birthday with the Short's own
  line, "it never lied to him."; then AGE 15 on the rim of his first glass ("you're funnier with me." / his delighted
  face), AGE 26 tapping the glass ("to us." / it drinks from his glass behind his back), AGE 31 the flask over the baby
  ("you earned it." / his face, he takes it), AGE 34 at the bar ("one more."), at dinner (her drawing, its hand turns his
  chin back, "i'll talk. you rest."), AGE 38 (her face, THEY CAN'T SEE ME.), then the same voice begging as it shrinks:
  DAY 1 the giant in the doorway ("just one. for the shakes." / he stands up), DAY 14 on his back ("you're no fun." / it
  slides off), DAY 60 on the bar's step ("just a sip. i'm so small." / his face), and in the bottle "i can wait.", which
  stays on screen over the cut back to the giant at the birthday: "every word was true."; the end card (THE BOTTLE / it
  was so small / watch the full film, an arrow to the Related video link). 31 pieces, 9 beats of black.
- **Not a copy of 43:** 43 counted the drinks (ONE DRINK. ... ONE MORE.) from the glass to the bottle; 44 has none of
  its words, its hook is the giant's face close (43 opened wide on the birthday), and it covers the comeback (DAY 1 to
  the last night), which 43 does not.
- **Framing** (`short.js`): each piece its own tall window. Where the film's red words would sit on the beer, the
  yellow blanket or his face (AGE 15, AGE 31, DAY 60), the Short writes the same line itself in the top band (`cap`)
  and hides the film's; "i can wait." is the Short's own copy so it can be held over the cut to the giant.
- **Sound** (`stage/audio/short_mix.py`): the film's own mix under every piece, a cut sound on each of the Short's 36
  cuts, the marker on every written line, a low hit and three notes on the end card. -16.0 LUFS, true peak -2.5 dBTP in
  the mix (-2.33 in the AAC), 11 % of the energy under 60 Hz, 1.24 sound events a second; the phone band (300 Hz-6 kHz)
  stays between -15 and -26 dB every second before the last fade; **0 s of silence on a phone**.
  **Nobody has listened to it**: it is judged from these numbers.
- **QA:** four rounds of safe-area sheets (`sheet_safe.jpg`: red = covered by the app, green = where words go), one of
  full-size stills, one of the rendered frames (`sheet.jpg`) and the MP4.
  - fixed: red words over the beer, the yellow blanket, his cream face and body and his legs (moved to the top band or
    the window moved so they sit on the dark floor); the giant's face cut off at the edge on DAY 1 and at the birthday;
    the devil's face missing at the dinner table (window widened to both faces); Lily's punch-in framed on the empty
    table; the sip shot cutting off his head; "i can wait." held only 0.3 s (now 1.9 s, carried over the last cut) and
    sitting on the bottle (window raised).
  - the MP4 (`engine/qa.mjs`): H.264 yuv420p 1080x1920 30 fps, AAC 48 kHz, 29.00 s, -16 LUFS, true peak -2.33 dBTP, no
    black stretch over 0.25 s. All ok.
  - the render: 870 frames in 75 s on the cloud's Linux machine (4 browsers).
  - not checked: playing it on a phone.
- **Files:** `short.js`, `cues_edit.json` (built), `publish.json`, `sheet_safe.jpg`, `sheet.jpg`, `short44_phone.mp4`
  (720p archive copy). The full render `short44.mp4` and `mix.wav` are rebuilt from source:
  `node stage/render.mjs shorts/44-bottle-voice cues && $PYTHON stage/audio/short_mix.py shorts/44-bottle-voice &&
  stage/make.sh shorts/44-bottle-voice`.
- **Left by hand after upload:** Studio, the Short's Related video = the film.
