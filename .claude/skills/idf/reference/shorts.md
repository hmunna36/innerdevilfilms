# Making a Short (`/idf short next`)

A Short is a 25-40 s vertical cut (1080x1920, 30 fps) of one public film, made from the film's own code: stretches of
the film played back to back, each framed for the tall screen, with the film's own score under them and an end card
that sends people to the film. The model is `shorts/15-lust-hook/short.js` (31.1 s); the engine side is in
`reference/engine.md`, "A Short".

## How it is built

1. Pick the stretches from the film's `film.js` (its shot table gives every cut's time) and the Short's line in
   `$K/shorts.md`. Open on the strongest frame with words on it (the cold line, a slammed word, a clock): no fade-in.
   Keep the film's rhythm: segments of 0.6-3.5 s.
2. Write `shorts/NN-slug/short.js` with `defineShort({ film, segments, end, audio })`. Segments are framed around their
   shot's subject automatically; where the hook needs more (its eyes in the window, a banner to read), give `vf`
   keyframes: a push-in on the subject is the house move. `slot: 'top'` puts the devil's words above, `'low'` below.
3. The sound: `audio.pieces` from the film's mix. Let the music run unbroken under jump cuts (one long piece over
   several picture segments), jump only where the picture jumps act (the montage, the reveal), and put a boom (`hits`)
   on each such jump and on the end card. Then `$PYTHON engine/audio/short_mix.py shorts/NN-slug` (it builds the film's
   mix first if needed) and read its report.
4. Look: `$K/bin/render.sh sheet short shorts/NN-slug --every 1 --cols 8 --width 240 --safe --out /tmp/sheet.jpg`
   (the red is what the YouTube app covers; the green outline is where words must sit). Fix framings, slots, segments.
5. Render: `$K/bin/render.sh short shorts/NN-slug` (in the background with a log; about 5 minutes on the Mac).
6. QA: `node engine/qa.mjs shorts/NN-slug/shortNN.mp4` and look at its contact sheet and 3-4 full frames (the first,
   the reveal, the end card). Loop until the ship bar passes.

## The menu (seven Shorts per film, planned when the film is made; LUST's are 15-21 in `$K/shorts.md`)

1. **The hook**: the whole escalation: the cold line, its eyes, the nights with it closer each time, the reveal's first
   red line, the end card.
2. **The reveal**: the black glass, its real voice line by line, his shock, the break (the phone smashed), its scream.
3. **Closer**: one shot per night, it nearer each time (window, foot of the bed, beside him, behind him), on the score.
4. **The comeback**: from the moment the music turns: the training at waking hours, his face from strain to calm.
5. **The attack**: the relapse at night, the jump scare, the app deleted, its shriek.
6. **The cost**: the people he lost, banner by banner, his face emptier each night.
7. **The ending**: weeks later, the mirror, its eyes, its last line, the cold line and its answer.

Each opens on a word-bearing frame, keeps one idea, and ends on the end card (the film's title, its hook line,
"FULL FILM ON THE CHANNEL", an arrow down to the Related video link). Each is its own piece: its own stretches, framings,
sound plan and title, never an earlier Short with the words swapped (YouTube's partner review rejects mass-produced,
repetitive channels), and no sexual wording in its title or description.

## Safe area (measured on the owner's iPhone, 30 Sep 2026)

The app covers the top 375 px, the right column from x 880 below y 1050 (buttons), the bottom from y 1680 (title,
channel, the Related video link) and about 52 px each side. Words must sit in x 100-980 for y 400-1000 and x 100-870
for y 1000-1640: the engine's Short layout does this (`top` slot at y 560, `low` at y 1470, end card centred at x 485).
Faces should sit between y 400 and 1500.

## Ship bar (every item must pass)

1. 25-40 s; the first frame has words on it and a strong picture.
2. The safe-area sheet: every word inside the green zone; no face under the app's buttons or top bar; no blank, black or
   wrong frame (a black stretch only where the film has one, like the phone dying).
3. Words readable at phone size (whispers 66 px, real lines 92 px, clocks and cards fitted to the width) and held 1.2 s+.
4. The Short's story reads with the sound off.
5. Sound: the music runs under the cuts, a boom on each big jump, silences only where the film has them
   (`short_mix.py`: no phone-band gap over 2 s unless planned), -14 LUFS ±1, true peak at most -1 dBTP (`qa.mjs`).
6. The end card names the film and points to it.

## Publishing a Short

- `shorts/NN-slug/`: `short.js`, `publish.json`, `README.md` (the film, the cut, the sound, the QA rounds) and the
  archive copy `shortNN_phone.mp4` (`$K/bin/phone-copy.sh`). The full render `shortNN.mp4` and `mix.wav` are
  git-ignored: the source rebuilds them.
- Title: under 60 characters, the hook (the cold line works: "You think you're alone when you watch it?"), ending with
  `#Shorts`. Never "Devil Mode".
- Description: one or two lines of story, `Full film: <the film's URL>` (from `yt.mjs latest-film`), then
  `#Shorts #horror #animation #shortfilm #thedevilyoufeed`.
- `node $K/bin/yt.mjs upload shorts/NN-slug/publish.json --schedule=auto` (next free 20:00 IST).
- A line may say `built` (made and passed QA, not uploaded): re-render from source if the MP4 is missing, run `qa.mjs`,
  and upload it.
- Left by hand (list it in the report): in Studio, the Short's Related video = the film.
