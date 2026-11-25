# Making a Short (`/idf short next`)

A Short is a 25-35 s vertical film (1080x1920, 30 fps) cut from ONE public film in the look of film 07, made from the
film's own code on the stage: its own choice of moments, each seen through a tall window, its own words on top, a sound
on every cut, and an end card that sends people to the film. The model is `shorts/43-bottle-hook` (27.9 s): read its
`short.js` and README first; the stage side is in `reference/engine.md`, "A Short".

**Only films from 07 on.** Films 03-06 are the old look (the owner, 17 Nov 2026: "every video/short should follow this
direction and character design"); their unmade Shorts were dropped and no new ones are cut from them.

## How it is built

1. Read the Short's line in `$K/shorts.md` and the film's contact sheets (`node stage/render.mjs films/NN-slug sheet a b
   n name --cols=8 --tw=420`) and `cues_edit.json`: every moment has a cue name and a time in the film's edit.
2. Write `shorts/NN-slug/short.js` (first line `// film: films/NN-slug`): `piece()` after `piece()`, 0.5-2.5 s each,
   every one with its own window (`win`), a `gap()` where the chapter turns, `cap()` for the Short's own words, an
   `endCard()`.
   - **The hook is the first 2 seconds**: the strongest picture of the film with a line the Short writes itself (43:
     the giant at the birthday, "this is his drinking problem."). Never a title, never black, never a slow start.
   - **One idea per Short** and its own device in its own words (43 counts the drinks: ONE DRINK. ONE TOAST. ONE FLASK.
     ONE MORE.). At most about 6 words a line.
   - Frame for the tall screen: the subject between y 700 and 1450; a face fills the width when it matters (z 1 or
     more), two or three figures need z .58-.7; move the window (`to:`) to follow the action.
   - Keep pieces at speed 1 so the film's own sound runs under them as it is (at another speed the sound slows or
     speeds up with the picture, like tape: use it only for one deliberate slow moment).
3. Look: `node stage/render.mjs shorts/NN-slug sheet 0 <dur> 48 a --cols=12 --tw=280 --safe` (red is what the YouTube
   app covers, green is where words must sit) and three or four full stills. Fix windows, words, order; repeat.
4. The sound: `node stage/render.mjs shorts/NN-slug cues`, then `$PYTHON stage/audio/short_mix.py shorts/NN-slug`
   (it builds the film's mix first if it is missing) and read its report.
5. Render: `stage/make.sh shorts/NN-slug` (in the background with a log; about 2 minutes on the Mac).
6. QA: `node engine/qa.mjs shorts/NN-slug/shortNN.mp4`, a sheet of the rendered frames (`$PYTHON stage/sheet.py
   shorts/NN-slug 0 <dur> 36 final 12 280`) and the first frame, the turn and the end card at full size. Loop until the
   ship bar passes.

## The menu (seven Shorts per film, planned when the film is made)

Each is its own piece: its own moments, windows, words, order and title, never an earlier Short with the words swapped
(YouTube's partner review rejects mass-produced, repetitive channels). Starting points, to be made the film's own:

1. **The hook**: the worst it gets first, then how it got there, step by step.
2. **The devil's words**: only its lines, kind to cruel, the picture cut to each one.
3. **The turn**: the moment someone he loves sees it, and what he does next.
4. **The cost**: the people he is losing, face by face.
5. **The comeback**: day by day, the devil a size smaller each time.
6. **The temptation**: the one moment it nearly wins, played slower, then the hand that pulls him away.
7. **The ending**: the last picture, its last line, what it means.

## Safe area (measured on the owner's iPhone, 30 Sep 2026)

The app covers the top 375 px, the right column from x 880 below y 1050 (buttons), the bottom from y 1680 (title,
channel, the Related video link) and about 52 px each side. Words must sit in x 100-980 for y 400-1050 and x 100-870
for y 1050-1640: `stage/vertical.js` lays them out there (white from y 520 down, red ending by y 1610 at x 110-860, the
counter top right at y 446, the end card's arrow at x 485). Faces should sit between y 400 and 1500.

## Ship bar (every item must pass)

1. 25-35 s; the first frame is a strong picture and the Short's own line is being written on it within the first second.
2. The safe-area sheet: every word inside the green zone; no face under the app's buttons or top bar; no blank or wrong
   frame; the cast on model.
3. Words readable at phone size (they are sized and wrapped by the stage; check red words are not over something bright:
   move them with `band:` or move the window) and held long enough to read.
4. Something new every 1-2 seconds; the Short's story reads with the sound off; it is not a shorter copy of the film's
   opening or of an earlier Short.
5. Sound (`short_mix.py`'s report): -16 LUFS ±1, true peak at most -2.5 dBTP in the mix (at most -1 in the MP4), a sound
   on every cut, **no stretch of 1 s or more under -38 dB in the phone band** before the last fade (on the Mac also
   `~/.cache/music-analysis/venv/bin/python ~/Desktop/nightly routines/wojak-story/scripts/silence-check.py shorts/NN-slug/mix.wav`).
6. The end card names the film and points to it.
7. Mechanics: `engine/qa.mjs` all ok (H.264 yuv420p 1080x1920 30 fps, AAC 48 kHz).

## Publishing a Short

- `shorts/NN-slug/`: `short.js`, `cues_edit.json`, `publish.json`, `README.md` (the film, the idea, the cut, the sound's
  numbers, the QA rounds), `sheet_safe.jpg` (the safe-area sheet) and the archive copy `shortNN_phone.mp4`
  (`$K/bin/phone-copy.sh`). The full render `shortNN.mp4`, `mix.wav` and `out/` are git-ignored: the source rebuilds
  them.
- Title: under 60 characters, the Short's own hook line ("This is his drinking problem."), ending with `#Shorts`.
- Description: one or two lines of story, `Full film: <the film's URL>` (from `yt.mjs latest-film`), then
  `#Shorts #animation #shortfilm #selfimprovement #thedevilyoufeed`.
- `node $K/bin/yt.mjs upload shorts/NN-slug/publish.json --schedule=auto` (next free 20:00 IST); then
  `node $K/bin/yt.mjs status <id>` until it has processed.
- A line may say `[built]` (made and passed QA, not uploaded): rebuild its sound and MP4 from source, run `qa.mjs`, and
  upload it.
- Left by hand (list it in the report): in Studio, the Short's Related video = the film.
