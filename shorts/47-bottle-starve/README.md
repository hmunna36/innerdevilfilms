# Short 47: bottle-starve (26.3 s, 1080 x 1920)

The fifth Short in the look of film 07, built by the cloud routine on 22 Nov 2026:
**https://youtu.be/RBAv8zPG50A, public 22 Nov 2026 20:00 IST.**

- **Film:** 07 THE BOTTLE | It Was So Small (https://youtu.be/ivH0FQPHEVo); times are seconds in the film's edit
  (`films/07-it-was-so-small/cues_edit.json`).
- **The idea: STARVE IT.** The hook is the giant grinning down at him on the kitchen floor with the Short's own line,
  "you can't kill it." He stands and pours the bottle away ("he stopped feeding it.", the film's own line), it flinches
  and is a little smaller, and looks at its own hand. Then the days, the devil a size smaller in each, its size slammed
  in red capitals: DAY 1 the shoe and the giant in the doorway with a glass (A GIANT., "just one. for the shakes."), the
  run ("so it chased him."); DAY 14 the push-ups with it on his back in his shirt and tie (HIS SIZE., "you're no fun.");
  DAY 40 the pull-ups with it hanging from his ankle, Lily's first small smile, it drops off (A CHILD.); DAY 60 it sits
  on the bar's step holding up a tiny glass (A CAT.); DAY 90 it stamps on the counter, thumb-sized (A THUMB.). Inside
  every day a flash (about 1 s, the film's own words hidden) of the age at which it was that same size on the way up:
  AGE 38 the giant over her birthday cake, AGE 34 walking in step with him, AGE 31 on the stool by the crib, AGE 26 on
  his shoulder in a bow tie, AGE 15 climbing out of the foam. So the counter runs DAY 1 / AGE 38, DAY 14 / AGE 34,
  DAY 40 / AGE 31, DAY 60 / AGE 26, DAY 90 / AGE 15: the days count up while the ages count down, and it ends the
  size it was when they met. The answer to the first line closes it, over the thumb stamping (played at 0.5x):
  "you can starve it."; the end card (THE BOTTLE / it was so small / watch the full film, the arrow to the Related
  video link). 30 cuts, 5 beats of black.
- **Not a copy of 43-46:** 43 went UP the sizes (HOW IT GREW, counting the drinks); 47 goes down them, day by day, with
  the growth as one-second flashes inside each day. 44 was only the devil's lines, 45 her birthday seen twice, 46 the
  two drawings. Its hook (the giant over him on the floor) and its words ("you can't kill it." / "you can starve it.",
  the five sizes) are its own. It uses only DAY 60's opening (him walking, it on the step with its glass, no words) for
  its ladder: 48 keeps the begging, his face, Lily's hand and the walk-on; it stops on DAY 90 before his hand comes down
  with the bottle: 49 keeps the corking and the night.
- **Framing** (`short.js`): the film's words are hidden in every piece from DAY 1 on (each day's counter carries a small
  time stamp that the tall layout would set as a caption) and the Short writes the three lines it keeps itself; the
  slams sit in the top band above the devil's horns, the devil's lines in the low band over the dark floor (the DAY 1
  window was moved so "just one. for the shakes." is not over its furnace); the hook starts 0.04 s into the floor shot
  (its first frame is dark).
- **Sound** (`stage/audio/short_mix.py`): the film's own mix under every piece, a cut sound on each of the Short's 30
  cuts, the marker on every written line, a hit on every slam, the end card's low hit and notes. -16.1 LUFS, true peak
  -2.5 dBTP in the mix (-2.33 in the AAC), 10.9 % of the energy under 60 Hz, 1.37 sound events a second; the phone band
  (300 Hz-6 kHz) stays between -15 and -30 dB every second before the last fade; **0 s of silence on a phone**.
  **Nobody has listened to it**: it is judged from these numbers.
- **QA:** four rounds of safe-area sheets (`sheet_safe.jpg`: red = covered by the app, green = where words go), three
  of full-size stills, one of the rendered frames (`sheet.jpg`) and the MP4.
  - fixed: the 25.6 s first cut lengthened with the five age flashes (the comeback alone is 15 s of the film); the
    counter's time stamp that came out as a caption ("6:00 AM"); the man cut off at the left edge in the hook, the
    doorway and the run; the birthday flash changed from the claws (unreadable) to the giant over the cake with the
    doll-sized dad; the last piece stopped before his hand enters; the red line moved off the furnace; the slams moved
    off the bar, the horns, a head and a party hat; the dark first frame; "you can starve it." no longer jumps up the
    screen when the last slam ends.
  - the MP4 (`engine/qa.mjs`): H.264 yuv420p 1080x1920 30 fps, AAC 48 kHz, 26.33 s, -16.16 LUFS, true peak -2.33 dBTP,
    no black stretch over 0.25 s. All ok.
  - the render: 790 frames in 82 s on the cloud's Linux machine (4 browsers), the film's `film.js` rebuilt first.
  - not checked: playing it on a phone.
- **Files:** `short.js`, `cues_edit.json` (built), `publish.json`, `sheet_safe.jpg`, `sheet.jpg`, `short47_phone.mp4`
  (720p archive copy). The full render `short47.mp4` and `mix.wav` are rebuilt from source:
  `node stage/render.mjs shorts/47-bottle-starve cues && $PYTHON stage/audio/short_mix.py shorts/47-bottle-starve &&
  stage/make.sh shorts/47-bottle-starve`.
- **Left by hand after upload:** Studio, the Short's Related video = the film.
