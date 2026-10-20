# Making a Short (`/idf short next`)

A Short is a 25-40 s vertical cut (1080x1920, 30 fps) of one public film: a hook in the first second, one idea,
and an end card that sends people to the full film. The model is `anim/src/ShortTomorrow.tsx` (composition
`Short01`) with `anim/scripts/short01_score.py`; copy both.

## How it is built

- `RAW`: a list of segments, each plays film time `f0..f1` at normal speed with its own vertical camera
  `[zoom, x, y, rot]` (film coordinates; at zoom 1 a 1080-wide window shows the middle of the 1920 frame, so most
  shots need zoom 1.8-3 to fill the tall frame). Segments may carry a `card` ("earlier", "cta").
- `CutView cut={...} W={1080} H={1920}` draws the film's scene through the Short's camera.
- Captions, the phone chats and the notice are re-placed for the tall frame (see the model's wrappers).
- The score script `exec`s the film's score up to its first section to reuse its instruments, then re-times the
  hits to the Short's cuts. Write the cut times in its docstring.
- Register `ShortNN` in `anim/src/Root.tsx` with `durationInFrames` from the segment list.

## The menu (seven Shorts per film, planned when the film is made)

1. **The hook cut** (the whole story in 30 s: climax, "N DAYS EARLIER", the stake, the delay, Devil Mode, the drop).
2. **The stake**: the text or notice that makes it personal, his face reading it, the clock.
3. **The Angel**: the comfort that feels good and costs him ("Rest. Tomorrow."), with the days slipping.
4. **The entry**: the Devil's arrival beat by beat (clock, horns, smoke, eyes, "Then move.") and the drop.
5. **The montage**: Devil Mode at full speed, the counter rising, ending on the payoff.
6. **The cost**: what it took, held in silence.
7. **The reveal**: the voice was his own; the final line.

Each opens on its strongest frame (no fade-in, no title first), and has text on screen in the first second.
Shorts 2-7 end on the same end card: the film's one-line hook, its TITLE WORD, "Full film on the channel", an arrow.

## Safe area (measured on Harshad's iPhone, 30 Sep 2026)

The top 375 px are covered by the app; the right column from x 880 is covered below y 1000 (buttons); the bottom
from y 1680 is covered (title, music). Key text must sit in x 100-980 for y 400-1000 and x 100-870 for y 1000-1640.
Faces should sit between y 400 and 1400.

## Ship bar (every item must pass)

1. 25-40 s; the first frame has a face or a big word and text.
2. A contact sheet (one frame a second) shows no blank, black or wrong frame, no face cut off, no letterbox bar
   crossing a face or a hand.
3. Every text is inside the safe area (check the sheet with the safe-area box drawn on it), 70 px+ and held 1 s+.
4. The story reads without sound.
5. The sound: hits on the cuts, a silence before the drop if the Short has one, peaks below 0 dBFS, the phone band
   (300 Hz-6 kHz) never under -38 dB for more than 2 s.
6. The end card names the film and is readable.

## Publishing a Short

- Folder `shorts/NN-<slug>/` with `publish.json`, `README.md` (the film, the segments, the QA notes) and the archive
  copy `shortNN_phone.mp4` (`bin/phone-copy.sh`). The upload file itself (`shortNN.mp4`) is git-ignored.
- Title: under 60 characters, a hook, ending with `#Shorts`; never "Devil Mode" alone as the title.
- Description: one line of story, `Full film: <the film's URL>` (from `yt.mjs latest-film`), then
  `#Shorts #animation #shortfilm #motivation #innerdevil`.
- `node $K/bin/yt.mjs upload shorts/NN-<slug>/publish.json --schedule=auto` (next free 20:00 IST).
- What the API cannot do (Harshad does it in Studio, list it in the report): set the Short's "Related video" to the
  film.
- A line in `$K/shorts.md` may say `built` (the Short exists and passed QA, not uploaded yet): then skip building,
  re-render it from source if its MP4 is missing, and upload it.
