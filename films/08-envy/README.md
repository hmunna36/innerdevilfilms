# Film 08: ENVY | It Showed Him Everyone Else

- **Status:** built in the cloud routine on 19 Nov 2026, in the look of film 07 (the black stage, the cream people, the
  black devil with the red glowing edge of `stage/rig.js`, untouched; handwritten words; no narration).
- **Uploaded 19 Nov 2026:** https://youtu.be/IJiYpjTS_wE, private until it goes public on **23 Nov 2026 05:30 IST**
  (Sun 22 Nov 19:00 New York, `--schedule=auto`); processing succeeded; the code-drawn thumbnail is set (`thumb.jpg`, the
  devil's grin over his green-lit face, ENVY on top). `film08_phone.mp4` is the small archive copy, `sheet_final.jpg`
  48 frames of the uploaded render.
- **Left for the owner, by hand:** `/idf thumb 08` on the Mac (the ChatGPT thumbnail, before Sunday; an unused idea: the
  split frame of the two of him); in Studio, the end screen and the pinned comment.
- **What it is:** 1:27 (87.3 s), 16:9, 1920 x 1080, 30 fps; a three-shot hook in the first 4.1 s; 76 cuts (a cut every
  1.15 s); two beats of black.
- **The story** is in `STORY.md` (locked after three critic rounds: v1 scored 4-7, v2 6-8, v3 8-9 on every item; the
  critiques are at the end of the file). The sound is in `SOUND.md`.

## Its own film

| | THE BOTTLE (07) | ENVY (08) |
|---|---|---|
| Structure | THE YEARS (one life, an AGE counter) | TWO OF HIM: one boy torn into two mirrored boys at two desks, a PAGES counter over each half; the turn is the two of him looking at each other; the comeback closes the tear |
| The devil's trick | grows a size each time it is fed | never grows: it gets closer and dresses up in what its window shows (Max's cap, the medal); its window grows (postcard, book, poster, wall); it only ever praises other people |
| Place, light | a kitchen party, a wedding, a nursery, a birthday | his desk under a lamp, the floor, Max's show, Max's door; green (the window: other people's lives) against warm (his lamp, his pencil) |
| Cost | his daughter's face | his best friend's face at his first show, as he walks out |
| Turn | the drawing on the fridge | his own monster on the prize the window shows; across the tear, the 300 pages it never showed |
| Comeback | DAY 1-90, the giant shrinking | one page a day, PAGE 1 to 300, a slip at 40 he gets out of by looking at his own page 1; Max's door; the tear stitched shut |
| Last line | "i can wait." | "they're still ahead." / "good for them." |
| Tune | a waltz | a sly tango (the devil) and a small warm piano (his own) |

## How it is built (the stage)

`cues.js` (one table of source times), `src/00-props.js` (the window, the split `SPLIT()` with the mirror `M()`/`fig()`,
the pencil, the cap, the medal, pages, the board, the desk lamp, the gallery, the door), `src/05-sets.js` (his desk as a
half-scene), `src/10-…80` (the scenes), `src/90-hook.js`, `src/95-edit.js` (the edit), `mix.py` (the sound),
`audio/measure.py` (measures the recordings). `stage/build.sh films/08-envy`, `node stage/render.mjs films/08-envy cues`,
`$PYTHON films/08-envy/mix.py`, `stage/make.sh films/08-envy`.

## QA (the ship bar, scored from the sheets, spot frames and the MP4)

Rounds: story 3 critic rounds; picture about 8 sheet rounds before the first render (the window hid the devil's face in
three scenes; words over the cap, the horns, the board and the litter; the halves of the split; the mirror trick), then
4 full renders:

1. Render 1 (5 min, 4 browsers): qa.mjs all ok. A blind sound-off viewer (no context, the sheets only) told the whole
   story back: the friends, the devil's window and its praise, the split ("same boy, two paths"), the walk-out, "it
   never showed the 300 pages", the pencil through the tear, one page a day, Max's door, the stitch, "good for them".
   Their flags were fixed for render 2: the right counter seemed to drop (round 2 now shows only the active half's
   counter); a brown box (the sketchbook is drawn as a book); words over things (moved); faces crossed by the devil's
   arms (it stands behind him at the worst; the pluck arcs over his eyes); the card unreadable (an insert of the card);
   squeezed eyes that read as knocked out; the door's counter on the wrong side; the shared comic mirrored; his
   arm stretched along the floor at the fall.
2. Render 2 (3 min): two small fixes for render 3 (the crush face, the door punch-in and the cap falling away from the
   devil's face).
3. Render 3 (3 min): a second blind viewer (fresh, on render 2's sheets) also told the story back (8/10; weakest
   stretch 45-57 s, the turn) and flagged words on the devil's teeth and on the floor litter, the devil's arm across his
   mouth in round 2, a floating tail tip in the hook, a tangle as he falls, the slip's red line on the window's edge in
   the punch-in and a small title line: all fixed for render 4.
4. Render 4 (the upload): qa.mjs all ok (87.27 s, -18.13 LUFS, -1.99 dBTP; the one black stretch, 84.30-84.60, is the
   planned fade of the last picture before the title).

| Item | Score | Why |
|---|---|---|
| 1 Hook | 8 | three shots with words in the first 4.1 s: SAME BOY. SAME DESK. under the two huge counters; "why not me?" on his green-lit face with its grin; "look." with the window held out to us. The first frame is the split. |
| 2 Sound off | 9 | two viewers with no context told the story back with the sound off (the second scored it 8/10) |
| 3 Pace | 9 | 76 cuts in 87.3 s (one every 1.15 s), punch-ins, two blacks where the chapters turn; nothing over 3 s but the stitch (2.6) and the title (3.0) |
| 4 The devil | 8 | the rig untouched; its red edge and face read at phone size; its own trick (the window, the dressing up, praise only); it gets closer, then is undressed |
| 5 The people | 8 | on model, a clear face in every face shot; the faces the viewer found hidden are clear now |
| 6 Its own film | 9 | structure, place, light, devil, cost, turn, comeback and tune all differ from 07 (table above) |
| 7 Words | 8 | the bundled hand, white the story and red the devil, moved off busy picture, held long enough; the counters right in every scene |
| 8 Comeback and ending | 8 | a page a day for a year with a slip at 40; RISE on the first frame after the turn's black; "good for them." and the tap land; the title is right |
| 9 Sound | 8 | -18.0 LUFS, -2.0 dBTP, 7.8 % under 60 Hz, 2.6 events a second, the phone band within 9.7 dB, no second under -38 dB; the key hits within 6 ms of their cues. Nobody has listened. |
| 10 Safe and true | 9 | no phones, apps or brands (the window is the devil's own); nothing graphic; no age on screen; the effort is real, with a slip |
| 11 Mechanics | 10 | qa.mjs all ok |
