# Making a film (`/idf film next`)

Target: 2:20-3:30, 1920x1080, 30 fps, wordless-ish (short spoken lines as captions, no voiceover), an original
synthesized score. The model is film 1, TOMORROW (`anim/src/Film04.tsx`, `films/01-tomorrow/`): read its code
before writing a line of a new one, and keep what works.

## The shape (every film; this IS the channel)

| Part | Share | What happens |
|---|---|---|
| Cold open | 0-4 s | The climax first: the Devil's line or his eyes, a hit, then "N DAYS EARLIER" |
| The want and the clock | ~15% | One concrete stake with a deadline, said plainly (a notice, a text, a calendar): rent, a test, a match, a promise |
| The Angel's comfort | ~20% | He tries, gets tired; the Angel says "Rest. Tomorrow." and he believes it. The clock moves; small losses |
| The low point | ~10% | The stake gets personal (someone he loves is hurt by his delay). Silence. |
| Devil Mode | ~25% | The Angel's light gutters; the clock ticks; the shadow rises; the eyes open; ONE hard line ("Then move."). Silence, then the drop: DEVIL MODE, the beat, a fast montage of him working (cuts every 1-2 s, a counter rising) |
| The cost | ~10% | What the hard voice took (sleep, a friend, his kindness) shown, not said |
| The reveal and the end | ~15% | The voice was his own (the mirror, the shadow is his shape); a final image and one line that lands, then the title card |

Each film keeps the three characters and the counter device (DAYS LEFT, or the film's own unit), and ends on its
title word. Each must also have ONE new idea of its own (a set used a new way, a new device, a twist in who the
voices are), so the channel does not repeat itself.

## The story (before any code)

1. Three loglines for the topic ("When ___, ___ must ___ before ___, but ___"). Pick the one with the sharpest stake
   and the most surprising cost.
2. A beat table: time, what we see, what is said (every on-screen word), the sound. Plant the twist's clues (at
   least two, visible on a second watch).
3. **The critic.** Start a sub-agent (Agent tool, general-purpose) with the beat table and this brief: "You are a
   jury member at an animation festival and a YouTube strategist. Attack this short film: is the stake concrete and
   felt within 15 s; is the turn earned; does the cost hurt; is the twist planted and surprising; would a stranger
   watch past 30 s; what is cliché; what is confusing without sound; is any line shorthand or local slang. Score
   each 1-10 and give the three changes that matter most." Make the changes; send it again until no score is below
   8 (at most three rounds). Keep the last critique in `STORY.md`.
4. Lock `films/NN-<slug>/STORY.md`: logline, title (`reference/publish.md`), the beat table, the clues, the critique.

## The kit (what to build with)

- `Film04.tsx` structure: `Scene` = a function of time drawing one set-up; `CUTS` = camera set-ups `[zoom, x, y,
  rot]` over scenes; `CutView` draws a cut at any size (W, H), which is how Shorts reuse the film. `flashOf(t)` and
  `daysAt(t)` are the film's flash and counter tracks; give the new film its own.
- Characters: `Char` (kit.tsx) wraps Bean's rig with props (phone, paper, pen, mug), a chair seat and a light;
  poses in `rig/beanPoses.ts`; `walk(t)` for steps. `DevilFig`, `WallShadow` and smoke for the Devil; `angel.tsx`.
- Phones and paper: `PhonePOV` (the chat on his phone, from his eyes; give it a `name`, a `clock`, `items` and
  `typing`), `DrawerPhone` (the lock screen), `NoticeCard` (a paper held in his hands, thumbs over it),
  `FloorLetter`, `TopDownNotice`.
- The desk: `DeskTop`, `DeskFront`, `Laptop` with `ScreenUI` states (off, form, sent, rejected, inbox, gigs, paid),
  `ScreenInsert` for a close-up of the screen, `FaceGlow`.
- Sets: the PNGs in `anim/public/poses/set_*.png`. Character PNGs there (bean_*, devil_*, angel_*, friend_*) are
  older still poses: use them only for a background figure; the main action uses the rigs.
- What does not exist must be drawn in code (SVG), in the same flat style: thick dark outline, soft shading, warm
  practical lights, deep shadows. Nothing photographic.

## The score (`anim/scripts/filmNN_score.py`)

Copy `film04_score.py`'s instruments (everything above "# ================= COLD OPEN") and write new sections:
the Angel's soft piano in a minor key, ticking that speeds up, a heartbeat, the rising choir, total silence before
the drop, the Devil-mode beat (128 BPM, power chords, chugs, a lead motif), a quiet ending. Every visual hit gets a
sound. Write to `anim/public/audio/filmNN_mix.wav` and play it with `<Audio>` in the composition. Check the
phone band (300 Hz-6 kHz): no stretch longer than 2 s under -38 dB; add a pad there if one is.

## Ship bar (score each 1-10 from the contact sheets and spot frames; every item 8+)

1. The stake is clear by 15 s, without sound.
2. Every on-screen word is readable at phone size (caption 70 px+, held 1.2 s+) and in plain English.
3. Motion: no shot is a still with a zoom; characters walk, reach, type, turn.
4. Physics: props sit on things, paper lies flat, nothing floats or clips through a hand, a face or a frame edge.
5. Faces and hands: never cut off by the frame, letterbox or an insert; the expression matches the beat.
6. Cuts: no blank, black or wrong frame at a cut (check 2 frames either side of every cut).
7. The Devil Mode sequence lands: build, silence, drop, montage.
8. The ending lands: the reveal is clear, the last image holds 2 s+, the title card is spelled right.
9. Sound: every hit has a sound, the mix peaks below 0 dBFS, the phone-band check passes.
10. Length 2:20-3:30; the first 3 s would stop a thumb.

Record the scores and rounds in `films/NN-<slug>/README.md`.

## Thumbnail

A composition like `ThumbA` in `anim/src/Thumb.tsx`: Bean's face big and worried (left two-thirds), the film's one
object (the notice, the phone), the Devil's grin or eyes in the dark behind, 1-3 fat words ("30 DAYS", "AGAIN?"),
red glow. Render a still, save as `films/NN-<slug>/thumb.jpg` under 2 MB, and look at it at 320 px wide: the words
must still read.
