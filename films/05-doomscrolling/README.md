# Film 05: DOOMSCROLLING | It Eats Your Hours

- **YouTube:** https://youtu.be/3Kdysv-5uwA, uploaded 29 Oct 2026 by the cloud routine, private until it goes public on
  9 Nov 2026 at 05:30 IST (Sunday 8 Nov 19:00 New York), with the code-drawn thumbnail (`thumb.jpg` = `thumb_code.jpg`).
- **What it is:** 1:58 (117.6 s), 16:9, 1920 x 1080, 30 fps, in the house style of LUST (`films/03-lust`). There is no
  narration; an ElevenLabs score carries the film, and the devil's words are on screen (pink whispers, then red slammed
  capitals). 76 shots, average 1.55 s.
- **The story** (`STORY.md`, locked after two critic rounds):
  - Every night he scrolls FEED, an invented app whose time chip climbs night by night (2h 14m, 4h 51m, 7h 08m, 11h 26m
    "tonight"). A devil that eats his hours comes closer every night: outside the window, the foot of the bed, beside
    him, behind him with its hands on his shoulders. Glowing clock faces float out of his phone into its grin.
  - Months pass between nights (OCTOBER 14, DECEMBER 25, MARCH 3, JUNE 15). Grandpa asks him fishing on Saturday; the
    calendar's SATURDAY 17 is the first page its grin snaps through the glass. Grandpa waits on Christmas, goes into the
    hospital, calls (his thumb declines), and writes "Haven't seen you in months, kid." His face is a notch older each
    night.
  - The chip races to an endless loop and the phone dies. In the black glass: "YOU WEREN'T KILLING TIME.", "I WAS EATING
    YOU." while his reflection grows old, "LOOK WHAT'S LEFT OF YOU." It eats Grandpa's photo: "HE DOESN'T HAVE YEARS."
  - He throws the phone into the nightstand drawer and slams it on its claws; the hours stream back into him.
  - At 6:00 AM the music turns: push-ups, the run, the gym, a book instead of the feed, Grandpa's photo stood back up. At
    9:40 PM the shut drawer buzzes and slides open, it attacks, and he deletes FEED. "Is that offer still open?" "Always.
    6 AM."
  - Weeks later they fish on the dock from the photo. In the mirror its claw holds out a glowing phone from the dark
    doorway: "JUST SCROLL." Then "HOW MANY HOURS DID IT EAT?" … "NOT ENOUGH."

## New in this film (each film is its own piece)

All in `film.js`, drawn in the engine's style:
- **FEED** (`feedScreen`, `feedHand`): an invented logo (three white chevrons stacked downward on a blue tile; no loop,
  no letter), an endless column of abstract posts (shapes and colours only, heart counts, grey bars for text), the time
  chip that turns red from 7 hours and races to an endless loop when the phone dies.
- **The hours it eats** (`hourClock`, `hourStream`): small glowing clock faces drifting from his phone into its grin, a
  few, a stream, a torrent; back into his chest when he breaks free.
- **His wall** (`scrollProps`): a paper calendar and a wall clock whose hands spin faster each night and tick honestly
  after the drawer; a nightstand with its drawer and Grandpa's photo.
- **New shots:** `dclock` (each night's date big, the time small), `calendar` (Wednesday to Saturday, then months, into its
  mouth through the window glass), `wallclock` (its claw spins the hands), `photo` (Grandpa's photo at night; stood back
  up in lamp light), `incall` (Grandpa's call, declined by his thumb), `photoeat` (its teeth on the photo), `drawer` (the
  nightstand drawer slammed on its claws; buzzing at night with its fingers curling over the edge), `read` (a book under
  the lamp), `lake` (dawn on the dock from the photo, Grandpa holding up the fish), `dmirror` (its claw holds out a
  glowing phone; the mirror blinks to his old face).
- **His face ageing** (`ageMarks`, `agedLines`): bags, a grey streak at the temple, grey temples and a forehead line, night
  by night; in the black glass, grey hair, a receding hairline and deep lines. Young again from the moment the hours
  stream back.
- At the window the devil stands outside: it is drawn inside the glass, with the window's bars over it.

## Sound

- **Made by ElevenLabs** (`music.json`, through `engine/audio/music.mjs`, 29 Oct 2026), planned about 1,974 credits (the
  shared account read 8,153 at preflight and 7,783 just before the music, as the daily channels use it too; its counter
  lags, so the exact spend shows only later):
  - SCORE: 67.2 s, three chunks: the intro, the nights (a ticking clock and a looping glitch arpeggio), the reveal;
  - RISE: the comeback anthem, 35 s;
  - ENDING: a calm piano, 16 s;
  - one new sound: the drawer slam. The clock ticks are mixlib's own `tick()` (free); the shared hits (scream, shriek,
    scare, stinger, swell) come from `engine/audio/sfx`.
- **The mix** (`mix.py`, which writes `audio/mix.wav`), on times measured in the mp3s (the intro's hit at 0.04 s, the
  nights' pulse at 6.02 s, RISE's impact at 0.02 s, the piano at 1.67 s):
  - a clock ticks under the cold line; the score's own hit, moved onto the title (3.35);
  - the nights' pulse from night 1 to the end of the montage; dead silence as the phone dies (48.4-49.35), then the
    score again (it never fell silent on its own) under the black glass; silence before the drawer (59.9-61.5);
  - the drawer slam, the scream, two honest clock ticks in the quiet room, then RISE's impact on 6:00 AM;
  - RISE thins while the drawer buzzes, drops out for the jump scare (91.3-93.0), and fades as he sleeps;
  - weeks later the piano, the feed's arpeggio detuned as its eyes open in the doorway, the title's hit again on
    "NOT ENOUGH.".

## QA

**Story:** two critic rounds.
- Round 1: cold line 7, stake 6, devil 9, banners 7, reveal 5, comeback 7, last line 6, safety 7, pace 9. Changed:
  Grandpa's photo from 0:08, SATURDAY 17 eaten, "I WAS EATING YOU." with his face ageing night by night, "HE DOESN'T
  HAVE YEARS.", "JUST SCROLL." kept for the end, a logo no brand owns (chevrons), the call declined by his thumb, the
  whole cut retimed to its own rhythm.
- Round 2: 8, 9, 9, 9, 8, 8, 8, 10, 9; its polish applied (the photo's own close-up into its teeth, the blink after the
  line, the photo face down, SATURDAY held 0.7 s).

**Sheets:** three rounds of stills and contact sheets. Fixed: the banner heart overflowing its tile, the aged hair (a
cap with a receding hairline, then strands along the skull), the devil over his shoulder clear of the words, the
reading arm, the drawer's fingers over the edge, the clock face kept off the photo's faces, the hand that stands the
photo up, the fish held between them, the claw's arm in the doorway, the last mirror framed with his whole face.

**Video v1:** `qa.mjs` all ok (117.60 s, H.264/AAC, -14.19 LUFS, -1.33 dBTP; the one black stretch, 110.13-110.43 s, is
the planned glitch to black). The sound measured in the MP4 at every turn (title hit -7.8 dB, the dead phone -150 dB,
the hush before the drawer -38 dB, the attack gap -53 dB). Every phone text checked at 1080p. A blind sound-off viewer,
given only 2-fps sheets, told the story back: FEED and its timer, the months, the devil closer each night eating his
time, Grandpa's photo and the declined call, the ageing reflection, "HE DOESN'T HAVE YEARS.", the drawer, the training,
the deleted app, fishing with Grandpa, the ending as a lingering threat. Its gaps were banner text too small on the
sheets (readable in the MP4). Shipped.

**Ship bar (v1):**

| # | Item | Score | Why |
|---|---|---|---|
| 1 | Cold open | 8 | the cold line from 0.1 s; its eyes open outside the window at 2.4 s and its grin snaps a calendar page; DOOMSCROLLING on the score's hit at 3.35 s |
| 2 | Story with the sound off | 8 | a blind viewer told it back; Grandpa in the photo, the call and the chat; the date cards make the months read |
| 3 | Pace | 9 | 76 shots, 1.55 s average, none over 2.6 s but the text cards; flashes on the cards, its face, the calendar, the clock, the bite; glitches on every turn; the montage every .375 s |
| 4 | The devil | 9 | red rim, smoke, burning eyes and grin; outside the window, the foot of the bed, beside him, behind him; kind pink whispers, then red capitals |
| 5 | His face | 8 | glazed, tired, empty with a tear, ashamed, fear, shock, resolve, strain, focus, calm, smile; a notch older each night, young again; never cut off |
| 6 | The phone | 9 | an invented app and logo, abstract posts; banners push the page down; every text readable at 1080p |
| 7 | The comeback | 9 | 6:00, 6:20, 7:05 AM, 7:50, 9:40, 10:45 PM; push-ups, a run, pull-ups, squats, curls, a book; RISE's impact on 6:00 AM |
| 8 | The ending | 9 | "JUST SCROLL." over the phone in its claw and the blink to his old face; "HOW MANY HOURS DID IT EAT?" "NOT ENOUGH."; the title spelled right |
| 9 | Sound | 8 | the sections change on the turns, the anthem clearly different, silences only where planned (measured, not heard) |
| 10 | Mechanics | 10 | `qa.mjs` all ok |

## Files

- `film.js`: the film.
- `STORY.md`: the beat table and both critiques.
- `music.json`: what ElevenLabs made; the mp3s and their prompts are in `audio/music` and `audio/sfx`.
- `mix.py`: the sound.
- `publish.json`: the upload sheet with the video id.
- `thumb.jpg` / `thumb_code.jpg`: the code-drawn thumbnail.
- `film05_phone.mp4`: the 720p archive copy.

**Rebuild:** `python films/05-doomscrolling/mix.py`, then `.claude/skills/idf/bin/render.sh film films/05-doomscrolling`
(writes `film05.mp4`, git-ignored).

**Shorts:** 29-35 in `.claude/skills/idf/shorts.md`. They wait until the film is public.

## Left for the owner

- The ChatGPT thumbnail: `/idf thumb 05` on the Mac, before the release. Word "DOOMSCROLLING", hook "IT EATS YOUR HOURS".
- In Studio: the end screen (the next film or the channel) and the pinned comment.
