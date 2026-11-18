# Short 43: bottle-hook (27.9 s, 1080 x 1920)

The first Short in the look of film 07 and the proof of the stage's vertical mode (17 Nov 2026). Built and checked on
the Mac; rebuilt from source and uploaded by the cloud routine on 18 Nov 2026: **https://youtu.be/WiTVJwmktGc, public 18 Nov
2026 20:00 IST.**

- **Film:** 07 THE BOTTLE | It Was So Small (https://youtu.be/ivH0FQPHEVo); times are seconds in the film's edit
  (`films/07-it-was-so-small/cues_edit.json`).
- **The idea: HOW IT GREW.** The giant at his daughter's birthday first (the Short's own line, "this is his drinking
  problem."), then back to the glass it started in ("it started this small."), his first one at fifteen, it climbing
  out of the foam, "you're funnier with me.", and then every drink it grew on, each counted in the Short's own slammed
  red capitals: ONE DRINK. (15), ONE TOAST. (26), ONE FLASK. (31), ONE MORE. (34); "it wore his tie.", "it took his
  chair.", it corks him in the bottle, THEY CAN'T SEE ME., the end card (THE BOTTLE / it was so small / watch the full
  film, an arrow to the Related video link). 17 pieces, 3 beats of black.
- **Framing** (`short.js`): each piece has its own tall window on the 16:9 frame; the stage is redrawn through it, not
  enlarged. White words sit in the top band, red in the low band, the four slams in the top band (the low band is over
  the beer in the first one), the counter top right.
- **Sound** (`stage/audio/short_mix.py`): the film's own mix under every piece, a whoosh, snap or thud on each of the
  Short's own cuts, the slam on each count, the marker on the written line, a low hit and three notes on the end card.
  -16.1 LUFS, true peak -2.5 dBTP in the mix (-2.3 in the AAC), 9 % of the energy under 60 Hz; the phone band stays
  between -15 and -27 dB every second; **0.0 s of silence on a phone** (`silence-check.py`: 0.0 s of 27.5 s).
  **Nobody has listened to it**: it is judged from these numbers.
- **QA**: three rounds on contact sheets with the safe area drawn (`sheet_safe.jpg`: red = covered by the app, green =
  where words go), one on the rendered frames (`sheet.jpg`) and the MP4.
  - fixed: the red slam was unreadable over the beer (moved to the top band); three windows were too tight (friends,
    his face, the dinner table cut off); a second of foam with nothing happening was trimmed.
  - the MP4 (`engine/qa.mjs`): H.264 yuv420p 1080x1920 30 fps, AAC 48 kHz, 27.92 s, -16.1 LUFS, true peak -2.3 dBTP,
    no black stretch over 0.25 s. All ok.
  - the cloud rebuild (18 Nov 2026, Linux, 4 browsers): the mix again -16.1 LUFS, true peak -2.5 dBTP, 0 s of phone
    silence; the render took 90 s (838 frames); qa.mjs all ok (27.92 s, -16.11 LUFS, -2.31 dBTP, no black stretch);
    the safe-area sheet and the rendered frames match the Mac's.
  - not checked: playing it on a phone.
- **Files:** `short.js`, `cues_edit.json` (built), `publish.json`, `sheet_safe.jpg`, `sheet.jpg`, `short43_phone.mp4`
  (720p archive copy). The full render `short43.mp4` and `mix.wav` are rebuilt from source:
  `node stage/render.mjs shorts/43-bottle-hook cues && $PYTHON stage/audio/short_mix.py shorts/43-bottle-hook &&
  stage/make.sh shorts/43-bottle-hook`.
- **Left by hand after upload:** Studio, the Short's Related video = the film.
