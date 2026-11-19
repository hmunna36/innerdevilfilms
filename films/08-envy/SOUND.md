# ENVY | It Showed Him Everyone Else: the sound

Music and effects only: no narration, no voices, no words. **Nobody has listened to it**: everything below was judged
from measurements (levels, onsets, the phone-band silence check in `stage/audio/sound.py`).

`mix.py` reads every time from `cues_edit.json` (`node stage/render.mjs films/08-envy cues` writes it) and nothing else.
After a re-cut: the cues, then `. .claude/skills/idf/bin/env.sh && $PYTHON films/08-envy/mix.py` (about 15 s). It writes
`audio/mix.wav` (48 kHz stereo, exactly the edit's length) and prints the report.

## What plays

| Where | Music | Effects |
|---|---|---|
| Hook | HEAVY's first hit on the first frame; DREAD's hit and a slam on "why not me?"'s cut, a riser, a heartbeat; on "look." the window's shimmer (the motif) and a slam | marker for the white line, slams |
| Together, the night | WORK (his own warm piano) | pencil strokes, the high-five clap, a laugh chime, the counter's tick, a green shimmer when the light comes, the window's arrival (the motif), hearts popping |
| The window to the card | TANGO (the devil's), its first big accent on the window turning to him; it drops under the tear and under every cut to the right half in round 2 | crumple, toss, catch, munch, gulp, the counter ticking down, the motif bigger on each growth, the cap; the tear (loud rip), the slide, the devil's low chord, the clack of the window face down; round 2: the motif bigger, the sketchbook torn, munch, the pencil plucked and crunched, the medal, the lamp going out; the right half: pencil strokes on every cut to it, the eraser, the pin |
| Max's show | WORK for the hug; the tango, quieter, for the walk out; then a room | applause, the hug's chord, footsteps, a sad low chord on Max's face |
| The worst | HEAVY from the black; DREAD on "LOOK. ISN'T HE AMAZING?" | the claws, the motif at its biggest, a riser to the cover and a chord on his monster, a stinger and a heartbeat on his face |
| The turn | HEAVY to the fall, then a room (a hum, a clock, a heartbeat); WORK when their eyes meet | the struggle, the claws slipping, the fall; the pencil handed over (a chord); the slam (impact, crack, glass), the motif backwards, the devil's screech (made, no voice), the medal's clink |
| One page a day | RISE on the first frame after the black; dead on the slip, the tango slowed underneath; RISE again on the frame the window goes face down (on its own accent) | the lamp back on, pencil strokes, ticks of the counter, the small window, the clack; the jump (the motif, a thump), a clock and a heartbeat while the counter is stuck, a held chord on page 1 next to page 40 |
| Max's door, the stitch | RISE | three knocks, the door, paper, Max's laugh (chimes), the hug's chord, the cap falling; the counter rolling to 300, a stitch sound per stitch, a riser and a hit on the merge |
| The last picture, the title | ENDING | the tiny window, "good for them."'s chord, the tap on the window, the lamp's click, a last hit and four small notes of the devil's |

**Every cut** has a sound (`cut_sounds()`): a whoosh, a snap on a punch-in or a jump back, a thud on a beat of black;
not on the cuts that are hits themselves. **Every written line** has the marker (`captions()`).
**The motif** is the window's recorded shimmer, bigger and lower each time the window grows (`motif(t, size)`), and
backwards when it is slammed shut.

## Recorded and made

Recorded (ElevenLabs, `music.json`): TANGO, HEAVY, DREAD, WORK, RISE, ENDING; the window, crumple, tear, munch, pencil,
slide, applause, keys, slam. impact, marker, zoom, whoosh and bloop are film 07's (copied with their .json: no credits).
Made in `mix.py` and `stage/audio/sound.py` (numpy): every whoosh, snap, riser, chime, clock, hum, heartbeat, knock,
creak, scrape, clap, the devil's screech and its low chord.

## Credits

ElevenLabs balance 36,515 before the film and 34,543 after the music and effects were made: **1,972 spent** (six music
pieces, 130 s, and nine effects).
