---
name: idf
description: Produce The Devil You Feed videos (the channel was Inner Devil Films; id UCMWgThNed--oMhcPwyDKceA) end to end in the house style of the film LUST | It Watches Back (27 Oct 2026) - animated horror shorts about a bad habit's devil, code-drawn on the channel's canvas engine, with no narration (an extreme ElevenLabs score, the devil's words on screen, a story that reads from the pictures alone). `/idf short next` (daily, cloud) cuts a 25-40 s vertical Short from the latest public film, QA's it, uploads it for 20:00 IST and pushes. `/idf film next` (weekly, cloud) makes a 1:40-2:20 film on the next topic in topics.md (story locked by a critic, ElevenLabs music, the engine, QA to the ship bar), uploads it with a code-drawn thumbnail for Sunday 19:00 New York, plans its seven Shorts and pushes to github.com/hmunna36/innerdevilfilms. `/idf thumb NN` (the Mac only) draws the film's extreme thumbnail with ChatGPT in the owner's Chrome and swaps it in.
argument-hint: short next | film next | thumb <NN> | short <NN> | film <topic>
effort: max
---

# /idf: The Devil You Feed, from idea to scheduled release

**The channel** (youtube.com/@TheDevilYouFeed, id UCMWgThNed--oMhcPwyDKceA; it was Inner Devil Films until 27 Oct
2026): every bad habit has a devil. It whispers that it's fine, and every night you feed it, it gets closer. In every
film someone finally stops feeding it. Animated horror short films, no narration. The model film is **LUST | It Watches
Back** (`films/03-lust`, https://youtu.be/aqiuimf3dCg, 1:50), approved by the owner (Harshad) after many rounds.

Three jobs:

    short next:  preflight -> the next Short in shorts.md -> short.js (segments of the film, framed for 9:16) -> sound
                 -> sheets with the safe area -> render -> QA (loop) -> upload, 20:00 IST -> push -> report
    film next:   preflight film -> the topic (topics.md) -> STORY (its own structure and look, beat table, critic, lock) -> music.json
                 -> ElevenLabs -> film.js on the engine -> sheets (loop) -> mix -> render -> QA (loop) -> code thumbnail
                 + title -> upload, Sunday 19:00 New York -> plan its 7 Shorts -> push -> report
    thumb NN:    (the Mac, with the owner's Chrome) film frames -> ChatGPT draws the thumbnail -> check -> swap it in -> push

Unattended runs (the cloud routines) never ask a question: decide, act, fix what is weak, and report at the end.

## The owner's rules (from making LUST, 27 Oct 2026; they win over anything else here)

1. **No narration.** Extreme music carries everything: a horror score whose sections change on the film's turns, then a
   clearly different heroic training anthem from the moment he starts to improve.
2. **The devil's lines are words on screen.** Kind lines are pink italic whispers; its real lines are red, slammed,
   glitching capitals.
3. **The story reads from the pictures alone**: the clock, the banners from the people he is losing, where the devil
   stands, his face. Test it with the sound off.
4. **Pace beats length.** Cuts every 1-3 s, a push-in on every shot, flash frames and glitches on the turns. LUST is 1:50;
   films are 1:40-2:20. Never hold a shot for a line: cut on it.
5. **The opening line is very cold** (it speaks to the viewer about the vice), and the ending calls it back with its answer.
6. **The devil is properly visible**, with a highly scary aura (red rim, smoke, burning eyes, the grin), and visibly
   closes in on him (in LUST every night: the window, the foot of the bed, beside him, behind him; each film its own
   way, `reference/film.md`).
7. **The hero shows clear facial expressions**, changing with the story.
8. **The phone shows the vice safely**: never explicit, an original logo, no real brands or logos, and a notification
   never hides the screen (it pushes the page down).
9. **Times on screen are normal waking hours** for the comeback (6:00 AM, 6:30 AM, 7:15 AM…), and the comeback shows
   real training (LUST: push-ups, a run, pull-ups, squats and curls), in the film's own place.
10. **Generic English, YouTube-safe, never graphic**: no gore, no blood, no self-harm, nothing sexual drawn, and no sexual
    wording in titles, descriptions, tags or thumbnails beyond the topic word itself. Gambling, drinking and vaping are
    shown as harm, never glamorised, and never with a real brand (an app, a casino, a bottle label, a vape).
11. **Code-drawn animation only** (the engine). No AI video, no stock footage, no copyrighted music. ChatGPT images are
    for thumbnails only.
12. **Thumbnails are extreme**: the topic word huge in fat white letters with a red edge, the hook small next to it (above
    or under), and each film its own composition and colours (never the last three films' layouts). The
    hook never names the devil: it is always "IT …" (LUST: "IT WATCHES"); if one ever has to name it, "THE DEVIL …" with
    "the", never a bare "Devil …". Drawn by ChatGPT from film frames on the Mac; the cloud uploads a code-drawn one first.
13. **Every video is its own piece** (the owner, 30 Oct 2026: "all 3 videos are same style"). Each film has its own
    structure, main place, palette, reveal, comeback setting and thumbnail composition, different from the last three
    films (`reference/film.md`, "Every film is its own film"). YouTube's partner review rejects mass-produced, repetitive channels: each film
    brings a new vice device, new places and props, a new cold line and last line; each Short its own cut, framing,
    words and title. Never the same Short or film with the words swapped.

## Where you are

- **The cloud** (a routine): a fresh Linux machine with a full clone; nothing survives but what you push. Read
  `reference/cloud.md` before the first command. The repo is the only memory: `topics.md`, `shorts.md`,
  `reference/log.md`, `films/`, `shorts/`.
- **The Mac**: a light sparse clone at `~/Desktop/innerdevilfilms` (`git sparse-checkout add <path>` for more). The
  toolchain is in `~/.cache/cp`; `. .claude/skills/idf/bin/env.sh` finds it. Push, then leave the clone light.
- `$K` = `.claude/skills/idf`. Paths are from the repo root. Commit and push only with `$K/bin/push.sh <msg-file> <paths>`.

## What to build with: the engine (read `reference/engine.md` before building anything)

`engine/` is LUST's own code made reusable: the man and his face, the devil, the bedroom, the phone and its screens,
the gym, the road, the shot library, the words, and a vertical mode for Shorts. A film is `films/NN-slug/film.js`:
a `defineFilm({...})` with a cut table, the devil's words, his expressions and the film's own drawings (its vice screen).
A Short is `shorts/NN-slug/short.js`: segments of the film, framed for 9:16. `$K/bin/render.sh` renders both.

## Job 1: `/idf short next` (daily) -> `reference/shorts.md`

1. `$K/bin/preflight.sh short`; BLOCKED -> report and stop.
2. The first line in `$K/shorts.md` that is `[ ]` or `built`. Its film must be PUBLIC (`node $K/bin/yt.mjs latest-film`),
   because the Short sends people to it; if it is not yet, report and stop (nothing to do today). If no line is left,
   plan seven from the newest public film first (`reference/shorts.md`, "The menu").
3. `built`: the Short exists and passed QA: re-render it if its MP4 is missing, run `engine/qa.mjs`, and upload.
   Otherwise write `shorts/NN-slug/short.js` (copy `shorts/15-lust-hook/short.js`), look at a safe-area sheet, fix,
   build the sound (`short_mix.py`), render, QA (`reference/shorts.md`, "Ship bar"); loop until every item passes.
4. `publish.json`, `README.md`, the archive copy (`$K/bin/phone-copy.sh`); upload with
   `node $K/bin/yt.mjs upload shorts/NN-slug/publish.json --schedule=auto`.
5. Mark the line `[x]` with the video id and time, add a line to `reference/log.md`, push.

## Job 2: `/idf film next` (weekly) -> `reference/film.md`

1. `$K/bin/preflight.sh film` (it also checks ElevenLabs); BLOCKED -> report and stop.
2. The topic: the first `[ ]` in `$K/topics.md`. If `films/NN-slug/` already exists, a run was cut off: continue from
   its last checkpoint (STORY.md locked -> the music; music.json and mp3s -> the build; film.js -> the render), never
   from scratch. Check demand once (`node $K/bin/yt.mjs demand "<WORD> animated short film"`): it informs the title;
   the hook line must differ from every exact title found.
3. The story (`reference/film.md`, "The story"): a structure and look the last three films did not use (`reference/film.md`), the beat table on it with times, every word on screen, the
   cold line and its callback, the vice's screen, the banners, the reveal lines, the comeback, the last line. The critic
   sub-agent until every score is 8+ (three rounds at most). Lock `films/NN-slug/STORY.md`. Checkpoint push.
4. The music (`reference/film.md`, "The music"): `music.json` timed to the beat table, `music.mjs --dry-run`, then make
   it. Checkpoint push (the mp3s are committed: they cost credits).
5. Build `films/NN-slug/film.js` on the engine; contact sheets of every cut, fix, repeat; `mix.py`. Checkpoint push.
6. Render (background, with a log). QA (`reference/film.md`, "Ship bar"): every item 8+, or fix and re-render. If it
   cannot get there, upload nothing: push the work and report.
7. The code thumbnail (`render.sh thumb films/NN-slug`, then copy to `thumb.jpg`), the title and description
   (`reference/publish.md`), `publish.json` (kind film, cover thumb.jpg), upload with `--schedule=auto`.
8. Plan its seven Shorts in `$K/shorts.md`, after the ones still waiting. Update `topics.md`, `reference/log.md`,
   `films/README.md`. Push.

## Job 3: `/idf thumb NN` (the Mac only) -> `reference/publish.md`, "Thumbnails"

The extreme thumbnail, drawn by ChatGPT in the owner's Chrome from three film frames, checked at 320 px, saved as
`films/NN-slug/thumb.jpg` (under 2 MB), swapped in with `node $K/bin/yt.mjs thumb <videoId> films/NN-slug/thumb.jpg`,
pushed. Do it before the film goes public (films go out Sunday 19:00 New York).

## The report (the last message of every run)

Title, length, the YouTube link and release time (IST), QA rounds and what they fixed, ElevenLabs credits spent (films),
where it was pushed, and what is left for the owner by hand: the ChatGPT thumbnail (`/idf thumb NN` on the Mac) for a
film; in Studio, a Short's Related video (the film), a film's end screen and pinned comment.
