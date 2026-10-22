# Film 02: JUST ONE MORE | The Phone Ate His Nights

- **Length:** 2:54 (174 s), 1920 x 1080, 30 fps. Composition `Film05` (`anim/src/Film05.tsx`), score
  `anim/scripts/film05_score.py` (writes `anim/public/audio/film05_mix.wav`), thumbnail `Thumb05A` (`anim/src/Thumb05.tsx`).
- **YouTube:** https://youtu.be/GVoVv5A5kOE, public 26 Oct 2026 04:30 IST (Sun 25 Oct 19:00 New York).
- **Story:** `STORY.md` (locked after three critic rounds; the beat table, the clues and the final critique).
- **Files here:** `publish.json` (the upload sheet), `thumb.jpg` (the cover), `film02_phone.mp4` (the small archive copy;
  the full-size `film02.mp4` stays on YouTube and is rebuilt from source with `bin/render.sh Film05`).

## What is new in this film

- The bed seen from the ceiling (`anim/src/film/bed.tsx`): the 3 AM nights in the phone's glow, and the same shot
  at the end with the phone face down and him asleep.
- His phone seen from his eyes (`anim/src/film/phone.tsx`): a feed of code-drawn short videos with the autoplay ring,
  Dad's chats (typing, deleting), the alarm, the lock screen, the call, and the dead black screen in which the Devil
  is born from his own reflection.
- The textbook, the wall calendar (Dad's birthday cake, the cross-outs), the exam paper, Dad's photo
  (`anim/src/film/study.tsx`); a handwritten-note variant of the floor letter (`door.tsx`); new laptop screens
  (practice test, results) in `desk.tsx`.
- The reveal as a memory replay: the Angel and the Devil dissolve on screen and leave only him.

## QA

- **Story:** three critic rounds (scores in `STORY.md`), locked at round 3 (8, 8, 8, 7, 8, 7, 8, 9) after the critic's
  own smallest fixes for the two 7s (the twist and the cliché items).
- **Stills:** three rounds of one frame per cut (`Film05Sheet`, 95 set-ups) plus spot frames: heads cut by the letterbox,
  the Devil's arm across his face, the wrist shot's crossed arms, the corridor shadows hidden under the letterbox, the
  counter counting the wrong days, the calendar note clipped.
- **Video:** three rounds, each a 1 fps contact sheet, a per-frame glitch scan, the frames either side of all 94 cuts
  and the audio check. v1: fixed the calendar's "9 AM" and the cake over the 14, the study video's title, the hold on
  "Dad?", the Devil's hand under his chin, five captions under 70 px, and his face in the memory of the knock (worried
  for "Dad?", hard only for his own "One more page."). v2: fixed the rewind counter showing "EXAM IN 4 DAYS" over
  "4 DAYS EARLIER" (and its ticks in the score), the 3:30 clock half out of frame, the horned shadow's small horns.
  v3: the rewind counter lands on 7 before "4 DAYS EARLIER" fades in, the clock is in frame; no glitch, black only where the story asks, clean cuts, peak -0.94 dBFS in the final file, no quiet run in the phone band. Shipped.

Ship bar (v3, the upload):

| # | Item | Score | Why |
|---|---|---|---|
| 1 | The stake by 15 s, without sound | 8 | the circled FINAL EXAM 9 AM (5 s), Dad's "Pass the exam. I can't do one more year of night shifts." on the phone (8.6 s), his promise (13 s) |
| 2 | Words readable, plain English | 8 | every caption 70 px+ and held 1.2 s+; chats and notices on the phone; generic English |
| 3 | Motion | 8 | he types, reads, rubs his eyes, scrolls, catches the falling phone, stands, half-rises, walks; the Angel's wing and ember push things; the Devil leans in and presses |
| 4 | Physics | 8 | the plug slides on the sheet, scrapes the port, drops and bounces; the phone lies face down; the note slides under the door and lies flat |
| 5 | Faces and hands | 8 | no face under the letterbox or the frame edge; the Devil's hands never cross his face; the expressions follow the beats |
| 6 | Cuts | 8 | no blank or wrong frame either side of any of the 94 cuts; no single-frame glitch |
| 7 | The Devil Mode sequence | 9 | his own "Just one more.", the dead screen, the horns in his reflection, the plug's scrape and drop, 0.6 s of total silence, the white flash, DEVIL MODE, the 128 BPM montage |
| 8 | The ending | 8 | the light erases the Devil and leaves his own hornless shadow; the memories lose the Angel and the Devil to his own hands and his own mouth; the call; the last overhead holds 5 s; the title spelled right |
| 9 | Sound | 8 | every hit, knock, ping and slam has a sound; peak -1.01 dBFS; no quiet run of 1 s+ in the phone band |
| 10 | Length and the first 3 s | 9 | 2:54; the phone at 1% dies, red eyes ignite in his reflection, "Put it down." |
