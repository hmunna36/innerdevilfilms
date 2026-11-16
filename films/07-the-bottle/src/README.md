# THE BOTTLE: how the parts are built (read this, STORY.md, src/00-kit.js and src/10-bar.js before writing a line)

The film is code-drawn on one canvas by the channel's engine (`engine/core.js`, `engine/cast.js`): every frame is a
pure function of time. `film.js` is the parts in `src/` joined in name order (`build.sh`). Each builder owns ONE part
file and never edits another part, the engine, or the kit (if the kit lacks something, write it in your own part).

## Why this film exists

The channel's last four films were watched 5 to 14 times each. They were small stick figures in wide flat rooms, text
on phone screens, clock cards and a gym montage. This one has to look and feel like a real short film: **big, simple,
beautiful pictures that read on a phone at arm's length, light with depth, and characters who act.** `ref/look_bar.jpg`
is a finished frame of this film: match its richness (lamp cones, glow, haze, a blurred thing near the lens, grain) in
your own palette. Look at it before you start.

## Rules for every shot

1. **One idea per shot, big in frame.** The subject fills a third to two thirds of the frame. No tiny figures in a
   wide empty set (a deliberate wide is still composed: a strong shape, a clear light, the subject where the eye goes).
2. **Never a dark figure on a dark background.** Every person stands against something lighter, or has a strong rim
   light (`drawMan` rim, `drawLily` is yellow). Colours stay vivid: night is saturated indigo with warm lamp light,
   never grey or muddy.
3. **Lily's yellow is the only yellow in the film** (her coat, her bike, his umbrella at the end, her photo). Nothing
   else is yellow: lamps are warm white-amber (`PAL.lamp`), never `PAL.yellow`. Red belongs to the devil only.
4. **Everything moves, for a reason.** A camera move per shot through `kcam` (a push on a realisation, a drift on a
   wait, a track with a runner); people breathe, shift weight, blink, anticipate and follow through (ease with
   `E.io`/`E.out`, overshoot a little); rain, light and cloth move. No frozen frame, no pose swap: animate between poses.
5. **Acting.** The face says what the beat is (`EXPR` in cast.js for him: tired, glazed, empty, ashamed, shock, resolve,
   strain, focus, calm, smile, fear, hungry; `LILY_EX` in the kit for her; blend with `mixExpr`). Bodies too: a slump,
   a half-step back, a hand that stops in the air.
6. **Depth.** At least three layers: something soft near the lens or at the frame edge (`blurred`), the subject, a
   lit background. Light sources are visible and throw light (`cone`, `pool`, `lite` inside `additive`, `haze`).
7. **No words** except the ones STORY.md lists for your shots (the time stamp via `stamp(L, '5:30 PM')` or
   `stamp(L, '6:00 AM', 'DAY 1')`). The devil's lines are drawn by the engine, low centre (y 880-1010) while they
   show: keep that band free of faces and key action in the shots that carry a line.
8. **Safety.** No brands, no logos, no readable signs except plain "BAR" and "SCHOOL". Drinking only ever looks like
   harm. The child is never touched, threatened or in danger; the devil never goes near her. No blood, nothing graphic.
9. **The cast is fixed.** The man: the engine's dark silhouette with a cream face (`man()` + `drawMan`, `manBust` for
   close-ups). The devil: the engine's Shadow Twin only (`placeDevil`, `devilO`, `drawDevil`, `devilEyes`,
   `devilGrin`, used exactly as in `barWide` in src/10-bar.js). Lily: `lily()` + `drawLily`, `lilyBust`. Other people
   (a teacher, parents, children) are plain dark silhouettes built with `man()` / `lily()`-like shapes, with muted
   teal, violet or grey-blue coats and umbrellas, never yellow or red.

## Technique

- A shot: `shot('name', (t, p, L, len) => { … }, { bloom: .45, grain: .5 }, [x0, y0, x1, y1])`. `t` film time, `p` the
  shot's settings from the cut, `L` seconds since the shot began, `len` its length. **Drive all motion from `L` and
  `u = L / len`, never from absolute `t`** (the cut will be retimed); `t` is fine for endless motion (rain, flicker).
  The last argument is the subject's box in screen px (what a vertical Short will frame): give one.
- Start a shot with `fill(top, bottom)` (the whole frame), then `const fr = kcam(L, len, [[0, z, cx, cy], [1, z, cx, cy]], { hand: .4, t })`
  and draw in world px (about 1920 x 1080). `screen()` switches to screen px for overlays (rain is already screen space).
  The engine adds a slow 7 % push-in to every shot by itself.
- No state between frames, no `Math.random()` (use `rnd(i)`), no `Date`. Frames render in any order.
- **Global names:** all part files share one scope with the engine. Start every top-level name in your part with your
  prefix (given in your brief). Never redeclare a name from the kit, 10-bar.js or the engine.
- Kit reference (src/00-kit.js): `PAL`, `seg`, `noise1`, `v2`, `lg`, `rg`, `poly`, `rectf`, `disc`, `oval`, `stroke`,
  `blurred`, `lite`, `kcam`, `cone`, `pool`, `bokeh`, `haze`, `motes`, `rain`, `ripples`, `wet`, `finish`, `shot`,
  `stamp`, `man`, `stride`, `drawMan`, `exMix`, `lily`, `LILY_EX`, `drawLily`, `lilyBox`, `bottle`, `tumbler`, `claw`,
  `wallClock`, `manBust`, `lilyBust`, `lilyPhoto`. Engine: `fill`, `cam`, `screen`, `px`, `ui`, `additive`, `glow`,
  `rgba`, `mix`, `lerp`, `clamp`, `inv`, `E`, `win`, `rnd`, `keys`, `line`, `rrect`, `font`, `SANS`, `ik`, `face`,
  `EXPR`, `mixExpr`, `drawPerson`, `specular`, `stripPts`.

## Test your part (never the whole film, never a video render: the Mac has 8 GB)

```
cd ~/Desktop/innerdevilfilms
# films/07-the-bottle/dev-<name>/cut.js: a defineFilm({ title: 'THE BOTTLE', subtitle: 'X', dur: N, words: [], expr: [[0, 'tired']], vignette: [[0, .45]], shots: [[0, 'yourshot', {…}], …] })
films/07-the-bottle/dev.sh <name>          # joins the kit, src/NN-<name>.js and your cut into dev-<name>/film.js
. .claude/skills/idf/bin/env.sh
node engine/render.mjs stills film films/07-the-bottle/dev-<name> --at 0.3,1.0,1.7 --out /tmp/claude-idf-<name>
node engine/render.mjs sheet film films/07-the-bottle/dev-<name> --every 0.25 --cols 8 --width 320 --out /tmp/claude-idf-<name>/sheet.jpg
```

Give each test shot the length it has in STORY.md. Look at the stills with the Read tool, at full size, three or more
moments per shot (start, middle, end), and a sheet at 4 frames a second to judge the motion. Be your own harshest
critic: if a frame would not make a good poster, or a limb bends wrong, or a figure floats, fix it. One browser at a
time; do not run renders in parallel. A script error shows as "[page error]" or a load error in the render output.

## Hand back

Your part file, working in the dev build with no page errors, and a short report: each shot's name, its `p` settings
and their defaults, what the picture shows at the start, middle and end, and anything you could not get right.
