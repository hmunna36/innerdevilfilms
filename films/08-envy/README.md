# Film 08: ENVY | It Showed Him Everyone Else

- **Status:** built in the cloud routine on 19 Nov 2026, in the look of film 07 (the black stage, the cream people, the
  black devil with the red glowing edge of `stage/rig.js`, untouched; handwritten words; no narration).
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

## QA

(filled in below by the run)
