# The stage (`stage/`): how a film and a Short are built

Since 17 Nov 2026 every film and Short is made on the stage: the code of THE BOTTLE | It Was So Small
(`films/07-it-was-so-small`) made shared. Every frame is a pure function of time (no `Math.random`, no `Date`), so
frames render in any order. Read film 07 before writing a line: `STORY.md`, `cues.js`, `src/10-open-21.js` (one scene),
`src/90-hook.js`, `src/95-edit.js`, `mix.py`, `SOUND.md`. Most of a new film is the same shapes with a new story.

**`engine/` is the OLD look** (LUST, films 04-06, their Shorts): the Shadow Twin, the bedroom, the phone. Nothing new is
built on it. Two things in it are still used: `engine/audio/` (`mixlib.py`: loading, loudness, the master; `music.mjs`:
ElevenLabs) and `engine/qa.mjs` (the mechanical checks on an MP4), plus `engine/node_modules` (playwright-core).

## Files

| File | What |
|---|---|
| `stage/lib.js` | the canvas (1920 x 1080, `W`, `H`), maths (`clamp lerp inv smooth rnd noise1 mix rgba`), paint (`rectf disc oval poly stroke blob curve taper`), `ik`, `inside`, `blurred`, `additive`, `alpha`, `at`, `glow`, `cone`, `bokeh`, `finish` (bloom, vignette, grain) |
| `stage/rig.js` | **THE LOOK AND THE CAST, LOCKED.** Colours `D`, the handwriting `hw` and `counter`, the stage `stageD(floorY, { pool })`, faces `FX` / `faceD` (people) and `DX` / `faceDevil`, **`figure(o)`** (everyone), `devArm`, props `outlined glassD bottleD lampD`, motion `eo eio eback seg camD lightsD blinkAt devEx samEx foamD macroGlass` |
| `stage/kit.js` | `shot()` (a source shot), **the edit** `cut()` / `blink()` / `FILM(t)` / `EDITCUES()`, words `say red slam over`, effects `flareK popRing popFlash burp sparks`, small props `tieD bowD hatD tableD chairD flaskD shadowFig` |
| `stage/vertical.js` | Shorts: `piece gap cap endCard`, the 9:16 window, the words laid out in the safe area, `SHORTCUES()` |
| `stage/page.html` | loads a film (and a Short) by `?film=…&short=…`; `DRAW(t)`, `SHEET(times, cols, tw)` |
| `stage/render.mjs` | `still`, `sheet` (`--safe` for Shorts), `frames`, `cues`, `info` (its header has the arguments) |
| `stage/build.sh`, `stage/make.sh` | `film.js` from a film's `src/`; every frame and the MP4 |
| `stage/sheet.py` | a contact sheet from rendered frames (after a full render) |
| `stage/fonts/` | the bundled handwriting, Balsamiq Sans (SIL OFL) as "IDF Hand": the same letters on the Mac and in the cloud. Never name a system font. (`--font=mac` is only for re-rendering film 07 as delivered, in the Mac's Chalkboard SE.) |
| `stage/audio/sound.py` | the sound kit: buses, the synthesized effects, `cut_sounds()`, `captions()`, `finish()` and its report |
| `stage/audio/short_mix.py` | a Short's sound from its own `cues_edit.json` and the film's mix |
| `$K/bin/stage.sh` | `build`, `render`, `make`, `mix` with the toolchain found (`bin/env.sh`) |

## The cast (never redraw it)

`figure({ kind, x, y, h, … })`: (x, y) are the feet, h the height. `kind: 'sam'` (a grown-up), `'lily'` (a child: bigger
head, a yellow bow), `'devil'`. Useful options: `expr` (a name from `FX` / `DX`, or `samEx(name, t, blinkTimes)` /
`devEx(…)` so it blinks), `look: [x, y]`, `turn`, `tilt`, `lean`, `armL` / `armR: [x, y]` (where the arm's end goes),
`bendL` / `bendR`, `stretch`, `stride`, `lift`, `sit` (± knees forward), `flat`, `kneel`, `drop`, `bun`, `lash`, `col`,
`dim` (a far figure), `glowOn`, `noFace noArms noLegs`, `t` (always pass it: the line boils 8 times a second).
The devil adds `stage` 0 (thumb-sized) to 4 (giant), `heat`, `tail: [dx, dy]`, `hat`, `noBelly`, `noTail`.
It returns `{ head, hr, shL, shR, hip, hipY, shY, sx, bw, h, armEndL, armEndR, belly }` for hanging props on it
(`tieD(f)`, a glass at `f.armEndR`).

- People differ by ONE small thing (a tie, a bow tie, a bun, lashes, a hat, a colour `col`), never by a new body.
- People faces: calm, smile, laugh, tired, tempted, horror, fear, sad, resolve, strain. Devil faces: sweet, happy,
  charm, sly, plead, rage, grin, sulk. A film may add a face as an object with the same fields; it may not change these.
- The devil's size tells the story. Its manner goes with its size (THE BOTTLE: a puppy at 0, charming at 1-2, his equal
  at 3, a giant that commands at 4; sulking and begging on the way back down).
- A place is the black stage plus a floor line, one pool of light and three to six flat props drawn with `outlined()`
  in muted colours (`D.prop`, `D.wood`): a table, a crib, a lamp-post, a bar shelf. One accent colour per film that
  means something (THE BOTTLE: yellow is Lily's). Draw a film's own props in its `src/00-props.js`.

## A film: `films/NN-slug/`

    cues.js            const CUE = { … }   ONE table of times (seconds) for the picture and, through the edit, the sound
    src/00-props.js    this film's own props
    src/10-….js …      the scenes: shot('startCue', 'endCue', 'AGE: 15', (L, u, t, c) => { … })
    src/90-hook.js     the hook's three shots (their cues sit after the story's, e.g. from 200)
    src/95-edit.js     THE EDIT: cut(…), blink() lines only
    film.js            BUILT by stage/build.sh from src/ (commit it; never edit it)
    cues_edit.json     BUILT by `render.mjs cues`: END, every cue and every cut in the edit's time (commit it)
    music.json, mix.py, audio/music/*.mp3, audio/sfx/*.mp3      the sound (reference/film.md)
    STORY.md, SOUND.md, README.md, publish.json, thumb.jpg

**A source shot** draws one continuous piece of action: `L` seconds into it, `u` 0..1, `t` source time, `c('cue')` that
cue's time inside the shot. Start with `stageD(floorY, { pool: [x, y, r, colour, strength] })`, draw props, then the
figures, then words: `say(text, x, y, size, L, c('cue'), writeSeconds)` (white), `red(…)` (the devil), `slam(text, x,
y, size, L, c('cue'))` (red slammed capitals). Words queue themselves and are drawn after the picture, so a punch-in
never zooms them. Wrap a moving camera in `camD(zoom, cx, cy, () => { … })`. Every action gets a cue in `cues.js`
(a clink, a blink, a pop): the sound is placed on those names.

**The edit** (`src/95-edit.js`) is what ships. `cut('shotName', { a, b, sp, cam: [zoom, x, y] })` plays seconds a..b of
a source shot at speed `sp` (1.2-1.6 is normal: the scenes are acted a little slow and cut fast), with an optional
punch-in on a point of the frame; `blink()` is a 0.12 s beat of black between chapters. The house pattern for a scene:
wide, a punch-in on the face or the action for under a second, back out. THE BOTTLE: 68 cuts in 86 s.

    stage/build.sh films/NN-slug                                   # after every edit of src/
    node stage/render.mjs films/NN-slug sheet 0 30 40 a --cols=8 --tw=420     # LOOK at every scene and every cut
    node stage/render.mjs films/NN-slug still 12.4
    node stage/render.mjs films/NN-slug cues                       # writes cues_edit.json for the sound
    $PYTHON films/NN-slug/mix.py                                   # the sound; read its report
    stage/make.sh films/NN-slug                                    # every frame, then filmNN.mp4 (about 5 min on the Mac)
    node engine/qa.mjs films/NN-slug/filmNN.mp4

While a film has no edit list yet, `FILM(t)` plays the source shots back to back by `cues.js`, so the scenes can be
looked at before they are cut.

## A Short: `shorts/NN-slug/short.js` (the model: `shorts/43-bottle-hook`)

Its first line is `// film: films/NN-slug`. It is its own edit of that film's finished edit, on a 1080 x 1920 canvas:

    t = piece('hk2', 'hk3', { win: [.72, 880, 540], to: [.84, 900, 520], words: false });
    cap('say', 'this is his drinking problem.', t + .05, 1.4, { write: .4 });
    piece(['lick', -.15], ['pop21', .7], { win: [.82, 1130, 420], words: false });
    cap('devil', 'ONE DRINK.', FTS('pop21'), .7, { slam: true, band: 'top' });
    gap(.1);
    endCard({ dur: 2.9, title: 'THE BOTTLE', line: 'it was so small', cta: 'watch the full film' });

- `piece(a, b, o)`: the film's edit from a to b: seconds in the FILM'S EDIT (read them off the film's sheets or its
  `cues_edit.json`), a cue name, or `[cue, offset]`.
- `win: [z, cx, cy]` is the tall window: z = 1 shows the stage's full height (and 607 px of its width), z = 2 half of
  that, z below 1 more width with the black stage above and below (z = .5625 is the whole 16:9 frame); (cx, cy) is the
  point of the 1920 x 1080 frame that sits in the middle of the tall screen. `to:` moves the window during the piece
  (default: a slow 4 % push-in). The stage is redrawn through the window, so it stays sharp at any zoom.
- The film's own words are laid out again for the tall screen: white in the top band (from y 520), red in the low band
  (ending by y 1610, x 110-860), wrapped and sized to fit; the counter sits top right at y 446. `words: false` hides
  them for a piece; `band: 'top' | 'low'` moves them; `count: false` hides the counter.
- `cap(kind, text, at, seconds, { slam, band, size, write })` are the Short's OWN words ('say' white, 'devil' red), in
  Short time; `FTS('cue')` is the Short time at which that moment of the film plays; `now()` the time so far.
- `gap(d)` a beat of black; `endCard({ … })` the last picture (the little devil, the title, the line, the arrow down to
  the Related video link).

    node stage/render.mjs shorts/NN-slug sheet 0 28 48 a --cols=12 --tw=280 --safe    # red = covered by the app, green = where words go
    node stage/render.mjs shorts/NN-slug cues && $PYTHON stage/audio/short_mix.py shorts/NN-slug
    stage/make.sh shorts/NN-slug && node engine/qa.mjs shorts/NN-slug/shortNN.mp4

The film's `film.js` must exist (`stage/build.sh films/NN-slug`; it is committed) and, for the sound, its
`audio/mix.wav` (git-ignored: `short_mix.py` runs the film's `mix.py` first if it is missing, from the committed mp3s).

## Gotchas

- Canvas does not scale glows with the picture. In a film's own punch-in (`cut(… cam)`) the devil's red edge therefore
  looks a little thinner; in a Short's window the stage scales them (`vertical.js` patches the context), so do not
  multiply blurs by hand.
- `ctx.setTransform(1, 0, 0, 1, 0, 0)` inside a shot means "the whole frame" and works in both formats; never read
  `ctx.canvas.width` in a scene.
- Text is always `hw()` / `say` / `red` / `slam` (the bundled font); never `ctx.font` with a system font name.
- Symbols are drawn as shapes, never emoji.
- A cue used by `shot()` must exist in `cues.js` when the file loads; a typo throws "no shot …" or draws nothing.
- JPEG frames are full-range; `make.sh` converts to video range (`yuv420p`), which `qa.mjs` checks.
