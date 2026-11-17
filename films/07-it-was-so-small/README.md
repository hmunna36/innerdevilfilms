# Film 07 (third version): THE BOTTLE | It Was So Small

- **Status:** built on the Mac on 17 Nov 2026 after the owner rejected the second version ("redesign the characters
  completely and make a fantastic storyline, the devil should be really good") and pointed at the look he wants
  (a black stage, cream cartoon people, a black devil with a red glowing edge, handwritten words). He approved the
  stills and a 13-second moving test of the first scene, then said yes to the full film.
- **Uploaded 17 Nov 2026** (the owner: "Yes. Upload and every video/short should follow this direction and character
  design. Create a thumbnail from ChatGPT and upload. Change the DP too if needed"): https://youtu.be/ivH0FQPHEVo,
  public 17 Nov 2026 21:00 IST (a one-off slot the same evening, not the Sunday slot: the channel's Shorts move to
  this look only once this film is public). `publish.json`; processing succeeded.
- **Thumbnail** (`thumb.jpg`, drawn by ChatGPT from `thumb/ref_*.jpg`, the original is `thumb/gpt_a.png`; first try
  accepted): the bottle huge in the middle with him trapped inside, palms on the glass; the giant devil behind it
  with both claws round the bottle; THE BOTTLE huge on the left, IT WAS SO SMALL small under it; black and red with
  pale teal glass.
- **Channel picture** changed the same day to this film's devil (`channel/logo.png`, drawn with the rig:
  `channel/brand/2026-11-17/logo_film.js`); the banner still shows the old devil.
- **What it is:** 1:26 in its second cut (the first cut was 1:50.5), 16:9, 1920 x 1080, 30 fps, no narration; the devil's words are red handwriting, the story's
  voice is white handwriting; a counter top right (AGE: 15 … DAY: 90).
- **The story** is in `STORY.md`; the cut, shot by shot with the sound wanted, in `CUT.md`.
  In one line: he takes his first drink at 15 and feeds something small for 23 years and it grows a size each time, until it sits in his chair
  and he is the small one; then he starves it back down to the size it was when they met.

## Second cut (17 Nov 2026, the same day): 1:26

The owner watched the 1:50 cut and said: "It should have a very engaging hook and also it should [be] fast paced like
day one films and also sound effects like that." What changed (measured against one of that channel's films first: a
cut about every 1.5 s, sound that never drops out, one to two sound events a second in its first 40 s):

- **A hook** (0-4.2 s, `src/90-hook.js`): "it was just one drink." / hard cut to the giant at the birthday, "23 YEARS
  LATER" / two eyes in the foam, "it started this small."
- **The edit** (`src/95-edit.js`): the shots in `src/10..80` are now the source; the edit plays pieces of them 1.2-1.6x
  faster with punch-ins on the key moments and a beat of black between ages: 68 cuts in 86.2 s. Short white captions
  were added to scenes that had no words. `node render.mjs cues` writes `cues_edit.json` (every cue and cut in the
  edit's own time): the sound reads only that file. `cues.js` is the source-time table; `cues_v1.js` is the first cut.
- **The sound** (`mix.py`, `SOUND.md`): loud from the first frame, a sound on every cut, caption and action, no stretch
  of 1 s under -38 dB in the phone band (`silence-check.py` from the wojak-story repo). Whooshes are mostly synthesized:
  a second batch of recorded effects (about 300 credits) was not bought.

## How it is built (the stage)

Since 17 Nov 2026 the reusable parts live in `stage/` (the channel's shared engine for this look: `lib.js`, `rig.js`,
`kit.js`, `page.html`, `render.mjs`, `build.sh`, `make.sh`, the bundled handwriting); this folder keeps the film's own
`cues.js`, scenes, `src/00-props.js`, the cut list `src/95-edit.js`, the sound, and thin wrapper scripts so the commands
below still work. The delivered film was rendered in Chalkboard SE (`--font=mac` reproduces it); new renders use the
bundled font. The text below describes the folder as it was when the film was made.

Plain canvas 2D, every frame a pure function of the time. `page.html` loads `lib.js` (drawing helpers), `rig.js`
(the look: the stage, the faces, one `figure()` for Sam, Lily, the wife and the devil at five sizes, props),
`cues.js` (ONE table of times for the picture and the sound) and `film.js`.

- `src/`: the film in parts; `./build.sh` joins them into `film.js` (edit the parts, never `film.js`).
  `00-kit.js` the cut (`shot(startCue, endCue, counter, draw)`), words, the grow/shrink effects, small props;
  `10-open-21.js` the cold open and AGE 21 (the approved moving test, unchanged); `20-wedding.js` AGE 26;
  `30-nursery.js` AGE 31; `40-age34.js` the walk, the bar, the dinner; `50-birthday.js` AGE 38 and the same picture
  without the devil, the fridge; `60-turn.js` inside the bottle, the smash, the sink; `70-starve.js` DAY 1 to DAY 90;
  `80-end.js` the new drawing, the hug, the last picture, the closing words.
- `node render.mjs sheet <a> <b> [n] [name]` a contact sheet; `still <t>`; `frames <a> <b>` (into `out/frames`).
- `./make.sh` renders every frame (two browsers), then joins picture and `audio/mix.wav` into `film07.mp4`.
- Sound: `music.json` (ElevenLabs, via `engine/audio/music.mjs`), `mix.py` (reads `cues.js`), notes in `SOUND.md`.
- The handwriting is Chalkboard SE, a font that comes with macOS: a cloud render needs a bundled handwriting font.

## Not done, not verified

- Nobody has listened to the sound; the levels are judged from numbers.
- The picture was checked on contact sheets (about one frame in fifteen), not by watching it play.
- In Studio, by hand: the end screen and the pinned comment (the owner's).
