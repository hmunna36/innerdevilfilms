# Short 49: bottle-wait (26.3 s, 1080 x 1920)

The seventh and last Short in the look of film 07, built by the cloud routine on 25 Nov 2026:
**https://youtu.be/OqAuCzzBU5g, public 25 Nov 2026 20:00 IST.**

- **Film:** 07 THE BOTTLE | It Was So Small (https://youtu.be/ivH0FQPHEVo). Times are seconds in the film's edit
  (`films/07-it-was-so-small/cues_edit.json`).
- **The idea: IT CAN WAIT (the ending).** The bottle, both ways.
  - The hook is DAY 90. His hand lifts the thumb-sized devil by its tail while it snarls, drops it into the empty
    bottle and corks it ("he won.").
  - It had done the same to him first. At 38, the giant behind her birthday cake, its claws carry him to a bottle and
    cork it ("it bottled him first."). Inside the glass his face goes from scared to crying to furious, he pounds, and
    the glass breaks ("he broke out.").
  - DAY 90 again, with no words. It stamps and shakes its fist next to his amused face. He sets the bottle on the
    highest shelf. Then Lily's new MY FAMILY drawing, his face going from tears to a smile, she runs in, the hug, held
    in the light.
  - Night, slowed to 0.75x: two small eyes open inside the bottle ("it didn't die."). The same two eyes once opened in
    the foam of his first beer ("it was this small at fifteen.", AGE: 15). Every size it grew to after flashes by, the
    counter climbing AGE 26 / 31 / 34 / 38 ("and it grew."), ending on the giant over her cake.
  - Back on the shelf, still at 0.75x, it breathes on the glass, draws a smile in the fog and taps, politely: "i can
    wait." (the film's own red line). The end card: THE BOTTLE / so starve it. every day. / watch the full film, with
    the arrow to the Related video link.
  - 28 cuts, 2 beats of black.
- **Not a copy of 43-48.** 43 went up the sizes counting the drinks, 44 was only its lines, 45 her birthday twice, 46
  the two drawings, 47 down the sizes day by day, 48 the polite ask at DAY 60. 49 is the ending as a mirror:
  - the bottle it put him in against the bottle he puts it in;
  - his pounding against its polite tap;
  - its eyes opening in the bottle against its eyes opening in the foam at fifteen.
  The growth flashes are one picture each with no counting words, unlike 43's ONE DRINK. / ONE TOAST.
- **Framing** (`short.js`): the film's words are hidden in every piece except the last, where its red "i can wait." is
  laid out again in the low band. The DAY 90 "small again." is left out, because "it was this small at fifteen." says
  it later. The counter stays on (DAY: 90 / AGE: 38 / AGE: 15-38) and tells the times apart with the sound off. The
  AGE 15 and AGE 34 windows are set low, so the white line sits above the devil's horns.
- **Sound** (`stage/audio/short_mix.py`):
  - the film's own mix under every piece, slowed with the night pieces;
  - a cut sound on each of the Short's 28 cuts, the marker on every written line, and the end card's low hit and
    notes, over the film's own ending ("starve it. every day.") fading out.
  - Numbers: -16.0 LUFS, true peak -2.5 dBTP in the mix (-2.37 in the AAC), 1.17 sound events a second. The phone
    band (300 Hz-6 kHz) stays between -15 and -27 dB every second before the last fade: **0 s of silence on a
    phone**. **Nobody has listened to it**: it is judged from these numbers.
  - Fixed in `stage/audio/short_mix.py` on this run: a piece at another speed got only as many samples of sound as the
    film had, not as many as the slowed piece is long. At 0.75x the last quarter of every slowed piece was digital
    silence (0.2-0.45 s holes here, found at 0.1 s resolution). The film's sound is now resampled to the piece's full
    length, still slower and lower like tape. 47 and 48, which have slowed pieces, were mixed before the fix.
- **QA:** four rounds of safe-area sheets (`sheet_safe.jpg`: red = covered by the app, green = where words go), one of
  full-size stills, two of the sound, and one of the rendered frames (`sheet.jpg`) and the MP4.
  - Fixed in the cut:
    - the first cut came to 25.5 s, so the giant's face at 38 and the cake giant were added;
    - the claws shot showed only claws and the cake (the film clips the giant's head), so the wide shot of the giant at
      the table with him tiny beside the bottle came first;
    - his face was framed so close it was cut on both sides;
    - Lily was on the left edge as she ran in;
    - the AGE 15 devil was framed so close it looked big, and its line ran over its horns (now the whole glass, set
      low);
    - "and it grew." ran over the AGE 34 giant's horns.
  - Fixed in the sound: the holes at the end of the slowed pieces (above). The film's own ending goes quiet 1 s before
    a 3.2 s end card would end, so the card is 2.8 s (the stage's default) and the fade sits at the very end.
  - The MP4 (`engine/qa.mjs`): H.264 yuv420p 1080x1920 30 fps, AAC 48 kHz, 26.33 s, -15.96 LUFS, true peak
    -2.37 dBTP, no black stretch over 0.25 s. All ok.
  - The render: 790 frames in 74 s on the cloud's Linux machine (4 browsers).
  - Not checked: playing it on a phone.
- **Files:** `short.js`, `cues_edit.json` (built), `publish.json`, `sheet_safe.jpg`, `sheet.jpg` and `short49_phone.mp4`
  (the 720p archive copy). The full render `short49.mp4` and `mix.wav` are rebuilt from source:
  `node stage/render.mjs shorts/49-bottle-wait cues && $PYTHON stage/audio/short_mix.py shorts/49-bottle-wait &&
  stage/make.sh shorts/49-bottle-wait`.
- **Left by hand after upload:** in Studio, set the Short's Related video to the film.
