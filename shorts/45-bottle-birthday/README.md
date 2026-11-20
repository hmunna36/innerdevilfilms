# Short 45: bottle-birthday (26.0 s, 1080 x 1920)

The third Short in the look of film 07, built from source by the cloud routine on 20 Nov 2026:
**https://youtu.be/lT-QpmSturs, public 20 Nov 2026 20:00 IST.**

- **Film:** 07 THE BOTTLE | It Was So Small (https://youtu.be/ivH0FQPHEVo); times are seconds in the film's edit
  (`films/07-it-was-so-small/cues_edit.json`).
- **The idea: WHAT SHE SAW.** The story through Lily's eyes, and her sixth birthday seen twice. The hook is her
  frightened face at the birthday with the Short's own line, "his daughter saw everything.", then the window pans from
  her (and Dad in the bottle) to the giant over the cake and the Short slams THEY CAN'T SEE ME. Then back to the start,
  "from the day she was born.": AGE 31 the nursery (it at his shoulder, the flask held out, he drinks with her in his
  arms and it grows); AGE 34 the dinner (it sits between them, she holds up her drawing, its hand turns his chin back
  to the glass, "i'll talk. you rest." while she lowers it, it swells over the table); AGE 38 her birthday (the giant in
  his chair, its claws lift him and cork him in the bottle). Then the same table as her family saw it: no devil, Dad
  slumped in the paper hat, the cake knocked over, his face, her mother pulls her away while the Short slams THEY ONLY
  SEE YOU.; and the drawing on the fridge, MY FAMILY with Daddy in red and horns, "this is what she saw." (the one slow
  moment, 0.85x). He sees it through the glass ("now he saw it too."), tears, anger, pounds, the bottle breaks and he
  stands up to the giant; the end card (THE BOTTLE / it was so small / watch the full film, an arrow to the Related
  video link). 25 pieces, 3 beats of black.
- **Not a copy of 43 or 44:** 43 counted the drinks from his first glass (ONE DRINK. ... ONE MORE.) and 44 was only the
  devil's lines; 45 is told from Lily: its hook is her face (not the giant), its words are hers and his family's
  (THEY ONLY SEE YOU., the drawing), and it is the only one of the three with the truth shot, the fridge drawing and
  the turn (inside the bottle, the break-out). It stops where 47 (STARVE IT) starts: at the sink.
- **Framing** (`short.js`): each piece its own tall window. The film's red words are hidden where they would sit on
  Lily, his face or his body, and the Short slams them itself where the floor is dark (THEY CAN'T SEE ME. on the pan's
  arrival at the giant, THEY ONLY SEE YOU. over a pan from her mother and her to him); the fridge drawing is framed low
  so "this is what she saw." sits on the dark fridge door above it.
- **Sound** (`stage/audio/short_mix.py`): the film's own mix under every piece, a cut sound on each of the Short's 25
  cuts, the marker on every written line, a low hit and three notes on the end card. -16.1 LUFS, true peak -2.5 dBTP
  in the mix (-1.85 in the AAC), 11.6 % of the energy under 60 Hz, 1.12 sound events a second; the phone band
  (300 Hz-6 kHz) stays between -15 and -28 dB every second before the last fade; **0 s of silence on a phone**.
  **Nobody has listened to it**: it is judged from these numbers.
- **QA:** three rounds of safe-area sheets (`sheet_safe.jpg`: red = covered by the app, green = where words go), two of
  full-size stills, one of the rendered frames (`sheet.jpg`) and the MP4.
  - fixed: the hook's line written over her face and bow (window lowered); the first frame showing the end of the cork
    shot (start moved a frame into her close-up); red words over Lily's legs, the slumped dad's body and his face
    (hidden and slammed by the Short where the floor is dark); the pan from her mother and Lily to Dad reframed so the
    red sits on the floor; "this is what she saw." written over the white drawing (drawing framed lower); his face cut
    off at the edge inside the bottle and at the pounding; the dinner's red line on the bright table edge (window
    raised so it sits on the dark table front); the flask framed on the devil holding it out.
  - the MP4 (`engine/qa.mjs`): H.264 yuv420p 1080x1920 30 fps, AAC 48 kHz, 25.97 s, -16.03 LUFS, true peak -1.85 dBTP,
    no black stretch over 0.25 s. All ok.
  - the render: 779 frames in 59 s on the cloud's Linux machine (4 browsers).
  - not checked: playing it on a phone.
- **Files:** `short.js`, `cues_edit.json` (built), `publish.json`, `sheet_safe.jpg`, `sheet.jpg`, `short45_phone.mp4`
  (720p archive copy). The full render `short45.mp4` and `mix.wav` are rebuilt from source:
  `node stage/render.mjs shorts/45-bottle-birthday cues && $PYTHON stage/audio/short_mix.py shorts/45-bottle-birthday &&
  stage/make.sh shorts/45-bottle-birthday`.
- **Left by hand after upload:** Studio, the Short's Related video = the film.
