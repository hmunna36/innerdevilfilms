---
name: idf
description: Produce Inner Devil Films videos end to end, made to run unattended in a Claude cloud routine. `/idf short next` (daily) makes one vertical YouTube Short (25-40 s, 1080x1920) cut from the channel's latest film with its own sound mix, QA's it, uploads it scheduled for the next free daily slot (20:00 IST) and pushes the source. `/idf film next` (weekly) makes one complete animated short film (2:20-3:30, 1920x1080) on the next topic in topics.md, with the channel's characters (Bean, the Angel, the Devil), built in code with Remotion and an original synthesized score, QA's it in a loop to the ship bar, uploads it scheduled for the next Sunday 19:00 New York time, plans the next seven Shorts from it, and pushes everything to github.com/hmunna36/innerdevilfilms.
argument-hint: short next | film next | short <film-folder> | film <topic>
effort: max
---

# /idf: Inner Devil Films, from idea to scheduled release

**The channel** (youtube.com/@InnerDevilFilms, id UCMWgThNed--oMhcPwyDKceA): wordless-ish animated short films
about the fights we have with ourselves. **The concept is Devil Mode** (the owner, Harshad, 19 Oct 2026: "the devil
mode is the concept"): in every film the kind voice (the Angel) comforts Bean and he keeps putting things off; when
kindness stops working, the hard voice (the Devil) takes over and makes him move; it costs him something; and in
the end the voice turns out to be his own. Each film has its OWN title (a topic word plus a hook line), never
"Devil Mode". Banner line: "When kindness fails, the devil gets to work."

Two jobs:

    short next:  preflight -> pick the next Short in shorts.md -> build it from its film's scenes -> sound -> render
                 -> QA (loop) -> upload, scheduled 20:00 IST -> push -> report
    film next:   preflight -> the topic (topics.md, demand check) -> STORY (logline, beat table, critic, lock)
                 -> build the film in code -> score -> stills QA (loop) -> render -> QA (loop) -> thumbnail + title
                 -> upload, scheduled Sunday 19:00 New York -> plan its 7 Shorts -> push -> report

Nobody watches these runs. Never ask a question: decide, act, fix what is weak yourself, and report at the end.

## Where you are (read `reference/cloud.md` before the first command)

- A fresh Linux machine with a full clone of this repo; nothing survives except what you push. The repo is the only
  memory: this skill's `topics.md`, `shorts.md`, `reference/log.md`, and the `films/` folders.
- Code: `anim/` is the Remotion project (Remotion 4.0.529, React 19). Run `bin/preflight.sh` first; then
  `. bin/env.sh` before any manual command. Render only through `bin/render.sh`.
- Paths below are relative to the repo root; `$K` = `.claude/skills/idf`.

## What exists to build with (read `reference/film.md`, "The kit", before building anything)

- **Characters** (`anim/src/rig/`): Bean (`bean.tsx`, `beanPoses.ts`: poses, a procedural `walk`, 12 expressions),
  the Devil (the same rig as a black silhouette with a red rim, horns, slit eyes, grin, smoke), the Angel
  (`angel.tsx`: glowing gold spirit with a halo; `ember`, `reach`). Harshad designed them: never redesign them.
- **Kit** (`anim/src/film/`): `kit.tsx` (Char with props and chair, DevilFig, WallShadow, Paper, FloorNotes, smoke,
  rain, captions `LineView`, `NoticeCard`, `PhonePOV` = a text chat seen on his phone, banners), `desk.tsx` (the desk,
  a 3/4 laptop with screen UIs, the chair, `ScreenInsert`, `DrawerPhone` lock screen), `door.tsx` (floor-perspective
  paper, feet, a reaching hand, a top-down notice).
- **Sets** (`anim/public/poses/set_*.png`, 1920x1080, made with ChatGPT on 19 Oct 2026): bedroom, door, street (rain),
  bench, bench2, table (a restaurant, an empty chair), corridor, mirror, room. The cloud cannot make new images:
  stage every film in these sets, and draw anything else in code.
- **The model film**: `anim/src/Film04.tsx` = film 1, "TOMORROW | He Kept Saying It" (2:32). Scenes are continuous
  functions of time; cuts are camera set-ups over them. Copy its structure. Its score: `anim/scripts/film04_score.py`.
- **The model Short**: `anim/src/ShortTomorrow.tsx` + `anim/scripts/short01_score.py`.

## Rules (the owner's, from making film 1; they hold even if a doc seems to say otherwise)

1. Generic English for a global audience: $ amounts, no Indian-only words ("beta", rupees).
2. Big moments must be highly dramatic and emotionally elevating: letterbox, flashes, a beat of silence, a drop.
3. Characters MOVE: real motion (walks, gestures, reaching, typing), never a still pose that only zooms.
4. Not slow, not zoomed out: close-ups and medium shots, cuts every 1-3 s in montages.
5. Props behave physically: nothing floats or grows toward the camera; paper lies flat; a laptop sits on a desk.
6. Texts state the stake in plain words ("My heart medicine runs out next week. It costs $600."), never shorthand.
7. Messages appear ON the phone when he reads them (`PhonePOV`, `DrawerPhone`), never as floating cards.
8. Story first, held to an award-winning standard: a want, stakes, a cost, a turn, a twist planted with clues,
   a final image that lands. (On the Mac the story was argued with ChatGPT; in the cloud an adversarial critic
   sub-agent plays that part: `reference/film.md`, "The story".)
9. Code-built only, original synthesized score; no stock footage, no AI video, no copyrighted music.

## Job 1: `/idf short next` (daily)  -> `reference/shorts.md`

1. `bin/preflight.sh`; BLOCKED -> report and stop.
2. Take the first `[ ]` line in `$K/shorts.md`. If none is left, plan seven from the newest film first
   (`reference/shorts.md`, "The menu"). Its film must already be PUBLIC (`node $K/bin/yt.mjs latest-film`), because
   the Short points to it; if the newest film is not public yet, use the previous one.
3. Build `anim/src/ShortNN.tsx` from the model (segments of film time + vertical cameras + captions + end card),
   register it in `anim/src/Root.tsx`, write `anim/scripts/shortNN_score.py`, render stills, check them, render.
4. QA (`reference/shorts.md`, "Ship bar"): contact sheet every second, the safe area, captions readable at phone
   size, phone-band loudness, 25-40 s. Fix and repeat until every item passes.
5. `shorts/NN-<slug>/`: `publish.json` (kind short, a title, a description with `#Shorts` and the film's link), the
   small archive copy (`bin/phone-copy.sh`), `README.md`. Upload: `node $K/bin/yt.mjs upload shorts/NN-<slug>/publish.json --schedule=auto`.
6. Mark the line `[x]` with the video id and time; add a line to `reference/log.md`; push with `bin/push.sh`.

## Job 2: `/idf film next` (weekly)  -> `reference/film.md`

1. `bin/preflight.sh`; BLOCKED -> report and stop.
2. Topic: the first `[ ]` in `$K/topics.md` (a one-word struggle plus the hook idea). Check demand once with
   `node $K/bin/yt.mjs demand "<WORD> animated short film"` and note it; a crowded word is fine, a crowded
   EXACT title is not (the hook line must differ from every result).
3. The story (`reference/film.md`, "The story"): three loglines, pick one, beat table with times, the Devil Mode
   turn, the cost, the twist and its clues, every on-screen line. Send it to a critic sub-agent; fix; lock it in
   `films/NN-<slug>/STORY.md`. Push a checkpoint.
4. Build `anim/src/FilmNN.tsx` (copy Film04's structure and the kit), the score `anim/scripts/filmNN_score.py`,
   register the composition. Stills of every cut, contact sheets, fix, repeat. Checkpoint push.
5. Render (background, with a log). QA the video (`reference/film.md`, "Ship bar"): every item 8+ or fix and
   re-render. If it cannot get there, upload nothing: push the work and report.
6. Thumbnail (a composition like `anim/src/Thumb.tsx`: one big face, one object, 1-3 fat words, one glow) and the
   title (`reference/publish.md`). `films/NN-<slug>/publish.json` (kind film), upload with `--schedule=auto`.
7. Plan its seven Shorts in `$K/shorts.md` (they start once the film is public). Update `topics.md`,
   `reference/log.md`, `films/README.md`. Push.

## The report (the last message of every run)

Title, length, the YouTube link and release time (IST), QA rounds, what was hard, where it was pushed, and what is
left for Harshad by hand (only Studio things: a Short's "Related video" link, end screens, pinned comments).
