# Short 46: bottle-drawing (26.8 s, 1080 x 1920)

The fourth Short in the look of film 07, built by the cloud routine on 21 Nov 2026:
**https://youtu.be/KfJHRkp9ym4, public 21 Nov 2026 20:00 IST.**

- **Film:** 07 THE BOTTLE | It Was So Small (https://youtu.be/ivH0FQPHEVo); times are seconds in the film's edit
  (`films/07-it-was-so-small/cues_edit.json`).
- **The idea: TWO DRAWINGS.** Lily drew her dad twice. The hook is the two drawings back to back with the Short's own
  line, "she drew her dad twice.": MY FAMILY on the fridge (Daddy in red, with horns), then the new one (Daddy in blue,
  holding her hand, a yellow sun), her eyes over the top of it. Then what she saw before the first: AGE 31 the yellow
  blanket with the devil at his shoulder ("it never left."); AGE 34 the dinner, it sitting between them, her drawing
  held up while its hand turns his chin back to the glass ("he never looked."), her lowering it; AGE 38 the giant over
  her birthday cake (THEY CAN'T SEE ME.), her frightened face, and what she actually saw: only Dad, slumped in the paper
  hat; the fridge ("so she drew what she saw."). Then the turn: he sees that drawing through the bottle's glass, pounds,
  the glass cracks ("then he looked."), he pours the bottle away. And what she sees changes: DAY 40 her first small
  smile while the child-sized devil drops off his ankle; DAY 60 her hand in his while the cat-sized devil begs at the
  bar door and its ears droop; DAY 90 the new drawing ("so he changed what she saw."), his face going from sad to
  tears and a smile, he kneels, she runs in, the hug, held to the end of the scene; the end card (THE BOTTLE / it was
  so small / watch the full film, the arrow to the Related video link). 21 pieces, 2 beats of black.
- **Not a copy of 43, 44 or 45:** 43 counted the drinks, 44 was only the devil's lines, 45 was her birthday seen twice
  and stopped at the sink. 46 is built on the pair of drawings (its hook is the two drawings, not a face or the giant),
  its words are a four-line rhyme of looking and seeing ("he never looked." / "so she drew what she saw." / "then he
  looked." / "so he changed what she saw."), and half of it is the comeback through Lily (DAY 40, DAY 60, the new
  drawing, the hug) that no earlier Short reached. It touches DAY 40 and DAY 60 only for her moments; 47 (STARVE IT)
  and 48 (DAY 60) still have those scenes to themselves.
- **Framing** (`short.js`): the fridge drawing framed low so the hook line sits on the dark fridge door above it; the
  new drawing framed with the black stage above Lily's head, so both drawings sit under the same line; the film's
  words hidden where they would sit on a face or the paper (the Short writes its own); the counter hidden on the
  slumped dad's close-up (his paper hat reached it).
- **Sound** (`stage/audio/short_mix.py`): the film's own mix under every piece, a cut sound on each of the Short's 21
  cuts, the marker on every written line, a low hit and three notes on the end card. -16.0 LUFS, true peak -2.5 dBTP
  in the mix (-2.37 in the AAC), 8.4 % of the energy under 60 Hz, 0.93 sound events a second; the phone band
  (300 Hz-6 kHz) stays between -13 and -27 dB every second before the last fade; **0 s of silence on a phone**.
  **Nobody has listened to it**: it is judged from these numbers.
- **QA:** three rounds of safe-area sheets (`sheet_safe.jpg`: red = covered by the app, green = where words go), two of
  full-size stills, one of the rendered frames (`sheet.jpg`) and the MP4.
  - fixed: the hook line written over MY FAMILY and the paper (both drawings framed lower); the nursery close-up that
    lost the devil and put a red line on the yellow blanket (the wide nursery instead); the chin turn with his face at
    the edge (window moved onto him); her birthday close-up that ran into the giant's wide shot, the glug that ran into
    the flinch punch, the new drawing that ran into his face and the hug that ran into the night shot (each piece now
    ends on its own shot); the birthday reordered (giant, her face, what she saw, the fridge); the paper hat under the
    counter (counter hidden there).
  - the MP4 (`engine/qa.mjs`): H.264 yuv420p 1080x1920 30 fps, AAC 48 kHz, 26.80 s, -15.93 LUFS, true peak -2.37 dBTP,
    no black stretch over 0.25 s. All ok.
  - the render: 804 frames in 57 s on the cloud's Linux machine (4 browsers).
  - not checked: playing it on a phone.
- **Files:** `short.js`, `cues_edit.json` (built), `publish.json`, `sheet_safe.jpg`, `sheet.jpg`, `short46_phone.mp4`
  (720p archive copy). The full render `short46.mp4` and `mix.wav` are rebuilt from source:
  `node stage/render.mjs shorts/46-bottle-drawing cues && $PYTHON stage/audio/short_mix.py shorts/46-bottle-drawing &&
  stage/make.sh shorts/46-bottle-drawing`.
- **Left by hand after upload:** Studio, the Short's Related video = the film.
