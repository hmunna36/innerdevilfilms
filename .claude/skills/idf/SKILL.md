---
name: idf
description: Produce The Devil You Feed videos (the channel was Inner Devil Films; id UCMWgThNed--oMhcPwyDKceA) end to end in the house look of the film THE BOTTLE | It Was So Small (17 Nov 2026) - animated short films about a bad habit's devil, code-drawn on the channel's stage (a near-black stage, cream cartoon people with marker faces, a black devil with a red glowing edge, handwritten words), with no narration (music, a sound effect on everything, a story that reads from the pictures alone), a hook in the first four seconds and a cut about every 1.3 s. `/idf short next` (daily, cloud) cuts a 25-35 s vertical Short from the latest public film in that look, QA's it, uploads it for 20:00 IST and pushes. `/idf film next` (weekly, cloud) makes a 1:20-2:00 film on the next topic in topics.md (story locked by a critic, ElevenLabs music, the stage, QA to the ship bar), uploads it with a code-drawn thumbnail for Sunday 19:00 New York, plans its seven Shorts and pushes to github.com/hmunna36/innerdevilfilms. `/idf thumb NN` (the Mac only) draws the film's thumbnail with ChatGPT in the owner's Chrome and swaps it in.
argument-hint: short next | film next | thumb <NN> | thumb next | short <NN> | film <topic>
effort: max
---

# /idf: The Devil You Feed, from idea to scheduled release

**The channel** (youtube.com/@TheDevilYouFeed, id UCMWgThNed--oMhcPwyDKceA; it was Inner Devil Films until 27 Oct
2026): every bad habit has a devil, and you are the one who feeds it. In every film someone finally stops feeding it.
Animated short films, no narration.

**The model film is THE BOTTLE | It Was So Small** (`films/07-it-was-so-small`, https://youtu.be/ivH0FQPHEVo, 1:26,
public 17 Nov 2026), approved by the owner (Harshad) step by step: four stills, a 13 s moving test, the full film, then
a re-cut with a hook, twice the cut rate and dense sound. On 17 Nov 2026 he said: **"every video/short should follow
this direction and character design."** Everything before it (LUST and films 04-06, the Shadow Twin, the bedroom, the
`engine/` folder) is the OLD look: those films stay public, but nothing new is made that way.

Three jobs:

    short next:  preflight -> the next Short in shorts.md -> short.js (its own cut of the film, framed for 9:16, its own
                 words) -> sound -> the safe-area sheet -> render -> QA (loop) -> upload, 20:00 IST -> push -> report
    film next:   preflight film -> the topic (topics.md) -> STORY (its own structure and place, beat table, critic, lock)
                 -> music.json -> ElevenLabs -> the source shots on the stage -> sheets (loop) -> THE EDIT (hook, cut
                 rate) -> mix.py (a sound on everything) -> render -> QA (loop) -> code thumbnail + title -> upload,
                 Sunday 19:00 New York -> plan its 7 Shorts -> push -> report
    thumb NN:    (the Mac, with the owner's Chrome) film frames -> ChatGPT draws the thumbnail -> check -> swap it in -> push

Unattended runs (the cloud routines) never ask a question: decide, act, fix what is weak, and report at the end.

## The owner's rules (they win over anything else here)

**The look (17 Nov 2026).** The owner rejected the old cast ("i want you to redesign the characters completely and make
a fantastic storyline the devil should be really good"), then pointed at the channel Day One Films ("It should be like
this channel") and approved ours in that genre look:

1. **The stage**: near-black, a thin floor line, one pool of warm light per scene, a few flat props with dark outlines.
   **The people**: simple cream cartoon figures (a round head on a bean body, four soft tubes; no hair, hands or
   clothes), all the acting in marker faces; one small thing tells them apart (a tie, a bow, a bun, a colour).
   **The devil**: the same construction in black with a red glowing edge, horns, a tail, a face of fire and a furnace
   in its belly; it comes in sizes 0 (thumb) to 4 (giant) and has its own faces (sweet, charm, sly, plead, grin, rage).
   **Words**: handwritten; white is the story's voice, red is the devil; its real lines are slammed red capitals. A
   counter top right (AGE: 15, DAY 60).
2. **The cast is locked: `stage/rig.js`.** Pose it, size it, dress it with a prop; never redraw the people or the
   devil, never bring back the Shadow Twin, the phone-lit bedroom or anything from `engine/`. The genre's stock
   construction is fine; never trace another channel's particular character. Identity is in the faces, the devil and
   the story.
3. **A hook first** (17 Nov 2026: "It should have a very engaging hook and also it should fast paced like day one films
   and also sound effects like that"): the first 4 seconds are three shots that sell the whole film (in THE BOTTLE: the
   lie "it was just one drink.", the monster it became "23 YEARS LATER", the size it started at "it started this
   small."). The story's first scene starts after it. A Short's hook is in its first 2 seconds.
4. **Fast**: a cut about every 1.3 s (THE BOTTLE: 68 cuts in 86 s), punch-ins inside scenes, a beat of black between
   chapters, something new every 1-2 seconds. Build the scenes as source shots, then cut them in THE EDIT
   (`reference/engine.md`): never ship the uncut scenes.
5. **A sound on everything**: every cut, every written line, every action; and the sound never drops out on a phone
   (300 Hz to 6 kHz). The phone-band silence check must find 0 seconds (`reference/film.md`, "The sound").
6. **True to life** (17 Nov 2026: "Let's be realistic, most people start first drink at 14,15 years not 21"): when a
   detail has a safe version and a true one, use the true one (ages, hours, how habits start), still never graphic.

**Kept from LUST and the films after it (27 Oct to 31 Oct 2026):**

7. **No narration.** Music and effects carry everything. The music turns when he starts to fight back.
8. **The story reads from the pictures alone**: who he is losing, the devil getting bigger or closer, his face. Test it
   with the sound off.
9. **The devil is the star and is always clearly visible**: its red edge, its eyes and mouth reading at phone size. It
   has a character (in THE BOTTLE: it never lies, it never takes, it adores him, it wants his place).
10. **Faces act**: a clear expression in every face shot, changing with the story (`FX`, `DX` in the rig).
11. **Generic English, YouTube-safe, never graphic**: no gore, no blood, no self-harm, nothing sexual drawn, no sexual
    wording in titles, descriptions, tags or thumbnails beyond the topic word. Drinking, gambling, vaping are shown as
    harm, never glamorised, never with a real brand, logo or label. If a phone shows the vice: abstract, an original
    logo, never explicit.
12. **Code-drawn animation only** (the stage). No AI video, no stock footage, no copyrighted music. ChatGPT images are
    for thumbnails only.
13. **Thumbnails are extreme**: the topic word huge in fat white letters with a red edge, the hook small next to it; the
    hook never names the devil, it is always "IT …" (THE BOTTLE: "IT WAS SO SMALL"; if it must, "THE DEVIL …"). Each
    film its own composition. Drawn by ChatGPT from film frames on the Mac; the cloud uploads a code-drawn one first.
14. **Every video is its own piece** (30 Oct 2026: "all 3 videos are same style"). The cast and the look are constant;
    everything else is new each time: the structure, the place, the props, the devil's trick and manner, the hook, the
    tune, the last line; each Short its own cut, framing, words and title. YouTube's partner review rejects
    mass-produced, repetitive channels.
15. **The sound is never too loud** (31 Oct 2026): films -18 LUFS, Shorts -16, true peak under -2 dBTP, the rumble under
    60 Hz held down (`master()` does it). The hits still hit; they never hurt.
16. **Every figure reads against the black**: people stand in the pool of light with their outline; the devil has its
    red edge. Never dim a figure into the stage (31 Oct 2026: "black figure on black background is a bad idea").

## Where you are

- **The cloud** (a routine): a fresh Linux machine with a full clone; nothing survives but what you push. Read
  `reference/cloud.md` before the first command. The repo is the only memory: `topics.md`, `shorts.md`,
  `reference/log.md`, `films/`, `shorts/`.
- **The Mac**: a light sparse clone at `~/Desktop/nightly routines/innerdevilfilms`. Before touching a folder, `git sparse-checkout add
  <path>` (`stage`, the film, the Short): `push.sh` rebases, and a rebase removes tracked files outside the sparse set
  from the folder. The toolchain is in `~/.cache/cp`; `. .claude/skills/idf/bin/env.sh` finds it. Push, then leave the
  clone light. The Mac has 8 GB: two browsers at most.
- `$K` = `.claude/skills/idf`. Paths are from the repo root. Commit and push only with `$K/bin/push.sh <msg-file> <paths>`.

## What to build with: the stage (read `reference/engine.md` before building anything)

`stage/` is THE BOTTLE's own code made shared: `lib.js` (drawing), `rig.js` (the look and the cast: LOCKED), `kit.js`
(shots, the edit, words, effects, small props), `vertical.js` (Shorts), `page.html`, `render.mjs`, `build.sh`,
`make.sh`, `fonts/` (the bundled handwriting), `audio/sound.py` (the sound kit) and `audio/short_mix.py`.
A film is `films/NN-slug/`: `cues.js` (one time table for picture and sound), `src/*.js` (its scenes and its edit list),
`music.json`, `mix.py`, `audio/`. A Short is `shorts/NN-slug/short.js`: its own edit of one film, framed for 9:16.

## Job 1: `/idf short next` (daily) -> `reference/shorts.md`

1. `$K/bin/preflight.sh short`; BLOCKED -> report and stop.
2. The first line in `$K/shorts.md` that is `[ ]` or `[built]` (never a `[dropped]` one). Its film must be PUBLIC (`node $K/bin/yt.mjs latest-film`),
   because the Short sends people to it; if it is not yet, report and stop (nothing to do today). If no line is left,
   plan seven from the newest public film in the new look first (`reference/shorts.md`, "The menu"). Never cut a Short
   from a film older than 07: they are the old look.
3. `[built]`: the Short exists and passed QA: render it from source (`stage/make.sh shorts/NN-slug` after its sound),
   run `engine/qa.mjs`, and upload. Otherwise write `shorts/NN-slug/short.js` (the model: `shorts/43-bottle-hook`), look
   at the safe-area sheet, fix, build the sound (`stage/audio/short_mix.py`), render, QA (`reference/shorts.md`, "Ship
   bar"); loop until every item passes.
4. `publish.json`, `README.md`, the archive copy (`$K/bin/phone-copy.sh`); upload with
   `node $K/bin/yt.mjs upload shorts/NN-slug/publish.json --schedule=auto`.
5. Mark the line `[x]` with the video id and time, add a line to `reference/log.md`, push.

## Job 2: `/idf film next` (weekly) -> `reference/film.md`

1. `$K/bin/preflight.sh film` (it also checks ElevenLabs and renders a still through the stage); BLOCKED -> report and stop.
2. The topic: the first `[ ]` in `$K/topics.md`. If `films/NN-slug/` already exists, a run was cut off: continue from
   its last checkpoint (STORY.md locked -> the music; music.json and mp3s -> the scenes; `src/` -> the edit, the mix,
   the render), never from scratch. Check demand once (`node $K/bin/yt.mjs demand "<WORD> animated short film"`): it
   informs the title; the hook line must differ from every exact title found.
3. The story (`reference/film.md`, "The story"): the devil's character and trick, a structure and place the last three
   films did not use, the hook's three shots, the beat table with times, every word on screen, the last line. The
   critic sub-agent until every score is 8+ (three rounds at most). Lock `films/NN-slug/STORY.md`. Checkpoint push.
4. The music (`reference/film.md`, "The sound"): `music.json`, `music.mjs --dry-run`, then make it; measure every
   recording before using it. Checkpoint push (the mp3s are committed: they cost credits).
5. Build the source shots (`cues.js`, `src/NN-*.js`) on the stage; contact sheets of every scene, fix, repeat. Then THE
   EDIT (`src/95-edit.js`): the hook, the cuts, the punch-ins, the blacks; sheets again. Checkpoint push.
6. `mix.py` on `cues_edit.json`: music on the cues, every action, `cut_sounds()`, `captions()`, `finish()`; read the
   report (silence 0 s). Render (`stage/make.sh`, background, with a log). QA (`reference/film.md`, "Ship bar"): every
   item 8+, or fix and re-render. If it cannot get there, upload nothing: push the work and report.
7. The code thumbnail (a strong film frame with the word and the hook lettered on it, `reference/publish.md`), the
   title and description, `publish.json` (kind film, cover thumb.jpg), upload with `--schedule=auto`.
   Also write `films/NN-slug/PAIRS.md`: THREE thumbnail-and-title pairs for the test the Mac sets afterwards (the
   owner, 22 Nov 2026: "create 3 thumbnails from chatgpt and always A/B test"; `reference/thumbnail-test.md`, step 1,
   and `reference/publish.md`, "Three thumbnails and the test"). Pair 1 = the uploaded title with the film's
   strongest picture; pairs 2 and 3 = two other pictures of this film, each with its own title. For each pair: the
   scene in one sentence, the time in the edit of its best reference frame, the word and the hook, the title.
8. Plan its seven Shorts in `$K/shorts.md`, after the ones still waiting. Update `topics.md`, `reference/log.md`,
   `films/README.md`. Push.

## Job 3: `/idf thumb NN` and `/idf thumb next` (the Mac only) -> `reference/publish.md`, "Thumbnails"

THREE thumbnails drawn by ChatGPT in the owner's Chrome and THREE titles, set as YouTube's "Title and thumbnail"
A/B test on every film (the owner, 22 Nov 2026: "create 3 thumbnails from chatgpt and always A/B test";
`reference/thumbnail-test.md` is the shared procedure, `reference/publish.md`, "Three thumbnails and the test", this
channel's details). Each is drawn from film frames, checked at 320 px, saved as `films/NN-slug/thumb.jpg`,
`thumb-b.jpg`, `thumb-c.jpg` (under 2 MB each). The first is swapped in with
`node $K/bin/yt.mjs thumb <videoId> films/NN-slug/thumb.jpg`; then the test is set in Studio with all three pairs;
then everything is pushed. Do it before the film goes public (films go out Sunday 19:00 New York): the test can be
set on a scheduled film and starts at release. `thumb next` (the Mac's weekly routine, Thursday afternoon IST, after
the cloud film run) = the newest uploaded film that has no test yet; it also reads the earlier films' test reports
into `reference/log.md`.

## The report (the last message of every run)

Title, length, the YouTube link and release time (IST), QA rounds and what they fixed, the sound report's numbers
(loudness, silence), ElevenLabs credits spent (films), where it was pushed, and what is left for the owner by hand: the
three ChatGPT thumbnails and the A/B test for a film (the Mac's Thursday routine does `/idf thumb next`; say whether PAIRS.md is written); in Studio, a Short's Related video (the film), a film's end
screen and pinned comment. Say plainly that nobody has listened to the sound: it is judged from measurements.
