# The engine (`engine/`): how a film and a Short are built

Every film is code-drawn on one canvas, and every frame is a pure function of time t, so frames render in any order.
The engine is LUST's own code made reusable (27 Oct 2026); LUST on the engine matches the uploaded film frame for frame.
Read `films/03-lust/film.js` before writing a film: it is the model, and most of a new film is the same table with new
data.

## Files

| File | What |
|---|---|
| `engine/core.js` | the canvas, the 16:9 / 9:16 formats, maths (`clamp lerp inv win keys E rnd mix rgba`), camera (`cam screen ui px`), push-ins, shake, flash, glitch, vignette, text (`slam spaced typeLine typeBlock wrapText fitSize`), the devil's words, `defineFilm`, `defShot`, `renderFilm` |
| `engine/cast.js` | the man (`drawPerson`, poses `poseSit poseStand poseWalk poseLie posePushup posePullup poseSquat poseCurl`, `rep`), his face (`face`, `EXPR`, `exprAt`, `faceShot`, `LOOKS`), the devil (`drawDevil devilEyes devilGrin devilArms devilSmoke tether redEyes`, `SPOTS`, `placeDevil`, `devilO`) |
| `engine/sets.js` | `fill`, the bedroom (`drawRoom drawWindow`, `BED`, `SIT`, `FILM.roomProps`), `shards`, the dawn road (`roadWorld hills embers`), the gym (`gymBg plate`), `toScreenBox unionBox` |
| `engine/phone.js` | `phoneFrame`, banners (`notif notifDrop`, kinds `mom call mail msg vice bank warn`), `callScreen chatScreen homeScreen`, icons drawn as shapes (`icon`, `textHeart`), pieces for a vice screen (`mosaic badge18 statusClock progressBar feed`) |
| `engine/shots.js` | the shot library (below) |
| `engine/short.js` | the Short runtime: `defineShort`, the vertical framing per segment, the end card, the sound plan |
| `engine/player.html` + `player.js` | open `engine/player.html?film=films/03-lust` (or `?short=shorts/15-lust-hook`) in a browser to play and scrub (space, arrows, `#t=12.5`) |
| `engine/render.mjs` | `film` / `short` (MP4 with several browsers at once), `stills`, `sheet` (contact sheets, `--safe` for Shorts), `info` |
| `engine/qa.mjs` | the mechanical checks on an MP4 and its contact sheet |
| `engine/audio/` | `music.mjs` (ElevenLabs), `mixlib.py` (DSP, loudness, limiter), `short_mix.py`, `sfx/` (shared hits made for LUST: scream, shriek, smash, scare, stinger, swell) |
| `engine/fonts/` | Inter and Gelasio (SIL OFL): the same on the Mac and in the cloud. Never name a system font |

## Two spaces

- **The screen**, 1920 x 1080 (`W`, `H`): every picture is drawn here. `cam(z, cx, cy)` puts world point (cx, cy) at
  the screen's centre, zoomed z; `screen()` draws in screen pixels. Both include the shot's slow push-in and the shake.
- **The output**: 1920 x 1080 for a film (the screen as it is), 1080 x 1920 for a Short, where a 9:16 window of the
  screen is shown (`VP`). Text that must sit in the right place in both (titles, clocks, the devil's words) is drawn
  through `ui()` and laid out per format (`if (!OUT.vertical) … else …`, see the text shots in `shots.js`).
- Shadows (`shadowBlur`) are in output pixels: multiply world-space blurs by `VP.k`.

## A film: `films/NN-slug/film.js`

```js
defineFilm({
  title: 'GAMBLING', subtitle: 'THE HOUSE ALWAYS WINS', dur: 110,
  app: { name: 'Lucky7', label: '7', icon: '7', color: [20, 150, 70] },   // the vice's app: its banner, home-screen icon, delete dialog
  viceScreen: (x, y, w, h, s, t, a, dy) => { … },   // what his phone shows (dy: how far a banner pushed it down)
  handScreen: t => { … },                            // the tiny phone in his hand in the room (draw in -13..13 x -23..21)
  roomProps: (a, col) => { … },                      // optional: what this film adds to his room (thin lines, same style)
  phases: [{ name, a, b }],                          // the player's chapter buttons
  words: [{ id, t, d, text, real, show }],           // the devil's lines (below)
  slams: [3.4, …],  glitch: [[a, b, strength]],  flash: { clock: [255, 255, 255], devilface: [255, 60, 60], sting: [255, 60, 60] },
  vignette: [[t, darkness]],  heartbeat: [[a, b]],
  expr: [[t, 'glazed'], [16.4, 'tired'], …],         // his face, beat by beat
  shots: [[0, 'cold', {…}], [2, 'room', {…}], …]     // the cut
});
```

- **Words.** No narration ever. `words` are the devil's lines on screen: kind ones (whispers, pink italic, typed on)
  until the reveal, then `real: true` (red glitching capitals, slammed). `t` start, `d` how long; a line starting with
  `(` is a sound note and is not shown; `show: false` for a line another shot writes (the cold line, the montage word).
  At most about 8 words a line; one line at a time; held at least 1.6 s (the reader needs it).
- **Expressions** (`EXPR`): glazed, tired, empty, ashamed, shock, resolve, strain, focus, calm, smile, sleep, fear, rage,
  hungry. Add a new one to `EXPR` in the film if needed (same fields).
- **Looks** for face close-ups (`LOOKS`): night, grey, red, sun, shower, lamp, dawn, gym. Add one in the film the same
  way (`LOOKS.casino = {…}`).
- **Spots** where the devil stands in the bedroom (`SPOTS`): window, foot, beside, behind, chase. `placeDevil([x, y,
  scale])` for any other place.
- A new shot: `defShot('name', (t, p, L) => { fill(…); cam(…); … }, (t, p, L, len) => [x0, y0, x1, y1])`. The second
  function is its subject in screen pixels (what a Short frames); leave it out for a text-only shot.

## The shot library (`shots.js`)

| Shot | p | What it shows |
|---|---|---|
| `cold` | `{ lines: [[text, from, to]…], out: [a, b] }` | the cold opening line, typed on (film time) |
| `clock` | `'11:48 PM'` | the time, thin and cold, a screen's glow below |
| `card` | `'WEEKS LATER'` | a typed card |
| `sting` | - | the title for a split second |
| `black` | - | black |
| `end` | `{ line, typeAt, slam, slamAt }` | the cold line comes back with its answer |
| `title` | `{ at }` | the title and subtitle |
| `room` | `{ spot, o(t), creep, hunch, lit, flicker, fr, throwAt, shardsAt }` | his room at night, him on the bed with the phone, the devil where `spot` says; `o(t)` returns `{ a, eyes, grin, reach, lean, scream }` |
| `face` | `'night'` or `{ look, expr }` | his face, close |
| `devilface` | `{ spot, o(t), twitch, scare }` | its face, close |
| `phone` | `{ screen: 'vice' / 'call' / 'chat' / 'home', notif, swipe, dying, call, chat, del, focus }` | his phone: the vice, a call `{ name, initial, from }`, a chat `{ name, items: [{ at, text, me, y, until, fade, col }] }`, the home screen (`del`: he deletes the app); `notif [t0, kind, title, text]` slides in and pushes the screen down, `swipe` sends it away |
| `reflection` | `{ appear, z }` | the black glass: his face, and it behind him |
| `montage` | `{ step, word, seq: [[shot, p]…] }` | cuts every `step` s through phone banners, faces, clocks, its face |
| `shower` | `{ eyes: [a, b] }` | cold water, its eyes in the steam |
| `run` | `{ fr, run: [a, b] }` | running into the dawn; it chases and falls behind |
| `pushups` | `{ fr }` | push-ups on the bedroom floor at dawn |
| `gym` | `{ move: 'pullup' / 'squat' / 'curl', fr }` | the gym |
| `sleep` | `{ eyes: [a, b] }` | asleep, no phone; its eyes in the window |
| `mirror` | `{ eyes: [a, b] }` | weeks later, the mirror; its eyes in the doorway |

## A Short: `shorts/NN-slug/short.js`

```js
defineShort({
  film: 'films/03-lust',
  segments: [{ from: 1.0, to: 2.0 }, { from: 2.0, to: 3.4, vf: [[0, 1.8, 430, 400], [1.4, 2.7, 452, 452]] }, …],
  end: { dur: 2.8 },                                         // title, line and cta default to the film's
  audio: { pieces: [{ at: 0, from: 1.0, to: 22.8 }, …], hits: [{ at: 21.8, gain: -10 }] }
});
```

- Segments are stretches of film time played back to back. Each is framed automatically around its shot's subject (both
  him and the devil when they fit, else a pan from him to it), with the devil's words above a phone or low in the
  frame. Override with `vf: [z, cx, cy]` (screen point at the centre; z 1 = the full screen height) or keyframes
  `[[u, z, cx, cy], …]` (u = seconds into the segment), and `slot: 'top' | 'low' | 'mid'`.
- `rate: .6` plays a segment slower: a still screen (a chat, a dialog) held long enough to read, its push-in still
  moving. Give such a Short its own `audio.pieces` (the default plan follows film time).
- The sound comes from the film's own mix. By default each segment brings its own stretch; better, run the music
  unbroken under jump cuts (one long piece) and put a boom (`hits`) on each big jump.
- Every cut of the Short gets a two-frame white flash; the film's own flashes and slams come with the shots.

## Sound

- A film: `films/NN/music.json` (what ElevenLabs makes; `node engine/audio/music.mjs films/NN --dry-run` first), then
  `films/NN/mix.py` (copy LUST's: place the score, mute the silences, the anthem from the turn, the hits, `master()`),
  writing `films/NN/audio/mix.wav`. Decoded WAVs and mixes are git-ignored; the mp3s are committed.
- A Short: `python engine/audio/short_mix.py shorts/NN-slug` (it builds the film's mix first if needed).
- Python: the cloud's `$PYTHON` (bin/env.sh); on the Mac `~/.cache/cp/venv/bin/python -I`.

## Render and check

```
node engine/render.mjs sheet short shorts/NN-slug --every 1 --cols 8 --width 240 --safe --out /tmp/sheet.jpg   # look at it
node engine/render.mjs short shorts/NN-slug                  # -> shorts/NN-slug/shortNN.mp4 (with mix.wav)
node engine/render.mjs film films/NN-slug                    # -> films/NN-slug/filmNN.mp4 (with audio/mix.wav)
node engine/qa.mjs shorts/NN-slug/shortNN.mp4                # streams, length, loudness, black stretches, contact sheet
```

Speed: in the cloud about 60 ms a frame (a 31 s Short in a minute, a 1:50 film in about 4 minutes); the Mac is about 10
times slower. Long renders run in the background with a log (`reference/cloud.md`).
