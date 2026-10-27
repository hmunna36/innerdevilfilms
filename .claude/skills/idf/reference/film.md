# Making a film (`/idf film next`)

Target: 1:40-2:20, 1920x1080, 30 fps, no narration, an extreme ElevenLabs score, the devil's words on screen, code-drawn
on the engine. The model is LUST (`films/03-lust`: `film.js`, `SCREENPLAY.md`, `music.json`, `mix.py`): read all four
before writing a line, and keep what works. Each film keeps the spine below and brings ONE new device of its own (a
way the vice shows on his phone, a place, a twist in how it feeds), so the channel never repeats itself.

## The spine (every film; this IS the channel)

| Part | LUST | What happens | Music |
|---|---|---|---|
| Cold open | 0:00-0:04 | A very cold line to the viewer about the vice, typed in thin capitals ("YOU THINK YOU'RE ALONE WHEN YOU WATCH IT… DON'T YOU?"); its eyes open in the dark; the title slams on a hit | drone, a riser, one huge hit on the title |
| Night 1 | 0:04-0:14 | the clock (late), the vice on his phone, his glazed face, it watching from far (the window); a banner from someone who loves him, swiped away; its first kind whispers | the horror pulse starts, a creepy music-box line on top |
| Nights 2-4 | 0:14-0:40 | each night the clock is later, a new banner (Mom's missed calls, work's final warning, the one who waited an hour), his face emptier, it closer: the foot of the bed, beside him, behind him with its hands on his shoulders; black smoke runs from his back into it; kind whispers | the pulse hits harder each night |
| The montage | 0:40-0:43 | cuts every .375 s: the banners, his empty face, the clock racing, its grin; one word ("one more") | its peak |
| It shows itself | 0:43-1:00 | the phone dies, total silence; the black glass shows his face and it right behind him; its real voice in red: the reveal ("I WAS NEVER IN THE PHONE." / "I WAS ALWAYS… IN YOU.", "EVERY NIGHT… YOU FED ME.", "NOW YOU'RE MINE."); his shock; he breaks the vice's hold (throws the phone, it shatters); it screams and shrinks back to the window | a second of dead silence, the reveal explosion, silence before the throw, the scream |
| He fights back | 1:00-1:35 | 6:00 AM, the music turns: push-ups, the cold shower (its eyes in the steam), the run at dawn (it chases and falls behind), the gym (pull-ups, squats, curls), strain turning to calm on his face; he calls someone he loves; 9:30 PM it attacks (a jump scare and the vice's banner); he deletes the app, it shrieks; he texts the one he let down, a reply and a heart; 11:00 PM asleep without the phone, its eyes small in the window | a clearly different heroic training anthem, dropping out only for the attack |
| Weeks later | 1:35-1:50 | calm; the mirror; he is fine; in the dark doorway behind him its eyes open: its last line ("I'LL WAIT."); the cold line comes back with its answer ("…YOU'RE NOT."); the title | a calm piano, the lullaby's first notes detuned, the score's biggest hit again |

Every topic in `topics.md` says its own vice, its device, the cost and its last line. Translate the spine, not LUST's
props: GAMBLING's phone shows a betting app and the balance; its banners are the landlord and his sister's fees; its
reveal is in a dark screen full of zeros; he deletes the app and works double shifts. Keep the bedroom, the clock, the
phone, the devil's approach, the reveal in black glass (or the film's own dark mirror), the training comeback, the
ending in the mirror: the audience learns the channel by them.

## The story (before any code)

1. Three loglines ("Every night ___ feeds ___, until ___"). Pick the one with the cruelest cost and the coldest line.
2. The beat table, on the spine, with times to a tenth of a second: what we see, every word on screen (the devil's lines
   with `real` marked, the clocks, the banners, the cards), his expression, the devil's spot, the music section, the hits.
   Count the words: one line at a time, about 8 words a line at most, each held at least 1.6 s.
3. **The critic.** A sub-agent (Agent tool, general-purpose) gets the beat table and this brief: "You are a jury member
   at an animation festival and a YouTube strategist who runs a horror-motivation channel. Attack this 2-minute short
   film with no narration: does the cold line chill in under 3 seconds; is the stake felt by 0:15 with the sound off;
   does the devil get closer every night, visibly; are the banners (the people he is losing) clear without sound; is
   the reveal line earned and surprising; does the comeback feel like real training at real hours; does the last line
   land; is anything graphic, explicit, a real brand, or local slang; is any shot longer than 3 s. Score each 1-10 and
   give the three changes that matter most." Make the changes; send it again until no score is below 8 (three rounds at
   most). Keep the last critique.
4. Lock `films/NN-slug/STORY.md`: the logline, the title (`publish.md`), the beat table, the critique. Push.

## The music (ElevenLabs; `engine/audio/music.mjs`)

Write `films/NN-slug/music.json` from the beat table's times (copy `films/03-lust/music.json`):

- `score`: a composition plan (`music_v2_5`) with three chunks timed to the film: `[Intro]` the cold open (about 4 s:
  drone, riser, one massive hit on the title), `[Nights]` to the montage's end (about 39 s: a relentless dark pulse,
  distorted sub bass, pounding toms, half-time hats, a creepy detuned music-box melody, harder every 8 bars),
  `[Reveal]` to the turn (about 17 s: one second of dead silence, then a colossal hit, a wordless dark choir, screeching
  strings, the hits at the reveal's beats). `negative_styles`: vocals with words, lyrics, singing, rap, spoken word,
  narration. Give the film's vice a colour in the styles (GAMBLING: casino chimes turned sour; THE BOTTLE: glass).
- `cues.RISE`: the comeback anthem, one prompt, the length of the comeback (about 35 s): a huge impact, hard-hitting
  drums at about 128 BPM, driving bass, heroic strings and brass in a bright major key, rising, triumphant. Clearly
  different from the score: this is the turn the owner asked for.
- `cues.ENDING`: about 15 s, a calm, sparse piano with an unsettling undertone.
- `shared_sfx`: scream, shriek, smash, scare, stinger, swell (free, made for LUST). `sfx`: at most two new ones for the
  vice (a dice roll, a bottle cap), about 200 credits each.
- Rules: every line of a chunk under 200 characters; no artist, film or franchise names; avoid trademark-like sound
  words ("braam" got a plan refused as "copyrighted"; "deep brass blasts" passed).
- `node engine/audio/music.mjs films/NN-slug --dry-run`, then without it. About 1,700-2,100 credits a film. The
  account is shared with the daily channels: the tool refuses below its reserve; then report, and make nothing more.
- Listen-free checks: the files' lengths match the plan; `mix.py`'s report shows the sections where they should be.

## Building `film.js`

- Copy `films/03-lust/film.js`. Change: `title`, `subtitle`, `app` (the vice's app: an original name and logo, never a
  real brand), `viceScreen` (draw the vice's screen with the phone pieces: mosaic, a feed, a progress bar, a balance…;
  never explicit, always abstract), `handScreen`, `thumb`, the `words`, `expr`, `slams`, `glitch`, `vignette`,
  `heartbeat` and the `shots` table. New props or places: new shots with `defShot` in the film, in the same style.
- Cut rules: shots of 0.8-2.6 s (LUST averages 1.7 s); none over 3 s but the cards and the title; every shot already
  pushes in; flash frames on the clock, the devil's face and the title (`flash`); a slam (shake) on each big hit; a
  glitch on each turn; the montage at the end of the nights.
- Look at it: `render.sh sheet film films/NN-slug --every 1 --cols 6 --width 320 --out /tmp/s.jpg` and LOOK; then
  `--at` the cuts ±0.1 s. Fix, repeat. The player (`engine/player.html?film=films/NN-slug`) plays it in a browser.
- `mix.py` (copy LUST's): the score from 0 to the turn with its dead silences muted, RISE from the turn (muted during
  the attack), the ending, the hits on top, `master()` to -14 LUFS / -2 dBTP. It writes `audio/mix.wav` (git-ignored).

## Ship bar (score each 1-10 from the sheets, spot frames and the MP4; every item 8+)

1. The cold open stops a thumb: the cold line from the first frame, its eyes, the title on a hit.
2. The story reads with the sound off: who he is losing (the banners), it getting closer, the reveal, the comeback, the
   ending. Show the sheet to a sub-agent with no context and ask it to tell the story back.
3. Pace: no shot over 3 s (cards, title excepted), flashes and glitches on the turns, the montage lands.
4. The devil: visible, scary (rim, smoke, eyes, grin), closer every night, its words kind then red.
5. His face: a clear expression in every face shot, changing with the story; never cut off by the frame.
6. The phone: the vice shown safely (abstract, an original logo, no real brand), banners never hide the screen, every
   text readable.
7. The comeback: waking hours on the clocks; push-ups, a run, pull-ups, squats, curls; the music turns on its first frame.
8. The ending: its last line, the cold line called back with its answer, the title spelled right.
9. Sound: the score's sections change on the turns, the anthem clearly different, silences only where planned.
10. Mechanics (`node engine/qa.mjs films/NN-slug/filmNN.mp4`): 1:30-2:30, H.264/AAC, -14 LUFS ±1, true peak at most
    -1 dBTP, every black stretch planned.

Record the scores and rounds in `films/NN-slug/README.md`.
