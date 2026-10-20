# Short 02: tomorrow-mom (30.9 s, 1080 x 1920)

The stake of film 01 TOMORROW: Mom's heart medicine. It opens on her text on his phone ("My heart medicine runs out
next week. It costs $600."), she tells him to pay his rent first, he answers "I'll figure it out, Mom." A counter
starts: 7 DAYS LEFT. The Angel comforts him ("You don't have to solve everything tonight."), he applies once and is
NOT SELECTED, "Again?" / "Tomorrow.", and the days slip (6, 5, 4, 3, 2, 1) until his phone buzzes on the floor:
"The pharmacy won't give me my medicine until it's paid." / "I ran out today." His tear at 0 DAYS LEFT, then the
end card ("He kept saying tomorrow." / TOMORROW / Full film on the channel).

- Source: `anim/src/Short02.tsx` (composition `Short02`; `Short02QA` renders a list of frames for contact sheets),
  sound `anim/scripts/short02_score.py`.
- Rebuild: `python3 anim/scripts/short02_score.py`, then `.claude/skills/idf/bin/render.sh Short02 shorts/02-tomorrow-mom/short02.mp4`.
- Segments (film time of `Film04` -> Short time): chat 11.4-14.3 stretched to 4.8 s (the phone is drawn for the tall
  frame: `BigPhone`, 70 px bubbles, his reply typed and sent) | face 14.4-15.3 | the Angel 16.75-17.85, 18.15-19.55 |
  his face 19.55-20.9 | he applies 23.65-24.8 | the screen 24.9-25.9, NOT SELECTED 25.95-26.45 (held 1.2 s) |
  "Again?" 27.35-28.75 | "Tomorrow." 28.8-30.1 | the days slip 30.22-31.08, 31.12-31.98, 32.02-32.88, 32.95-33.85,
  34.82-35.68 (each held 1.0 s) | the floor 35.75-36.75 | chat 36.85-39.85 stretched to 4.6 s | the tear 39.9-41.6 |
  card 41.6-44.6.
- The medicine counter (a capsule and "N DAYS LEFT") is this Short's own: Mom said "next week", so it counts 7 -> 0
  and reaches 0 on "I ran out today." (The film's counter is the rent's 30 days.)
- QA, 20 Oct 2026 (cloud): stills of every shot, then contact sheets one frame a second with the iPhone safe area
  drawn on them, and the phone-band check of the mix. Stills round 1: the Angel's line ran into the next shot (timing
  bug), "Tomorrow." (white) sat on Bean's cream body, NOT SELECTED was cropped, Bean was cut off asleep, the counter
  covered the warning notice: fixed (a dark plate behind captions, new framings). Video round 1: "Application sent"
  and the NOT SELECTED banner sat below y 1000 into the buttons' column: moved up, no counter over the screen.
  Video round 2: each number of the countdown was on screen 0.8 s: the five montage shots held 1.0 s. Video round 3:
  every item of the ship bar passes (30.9 s; key text 70 px+ inside the safe area, held 1 s+; peak -1.0 dBFS; the
  phone band never under -38 dB for 2 s). Small secondary text (chat timestamps 48 px, the fine print on the laptop
  screen and the warning notice) is diegetic and not needed for the story.
- Archive copy: `short02_phone.mp4` (720p). The upload file `short02.mp4` is git-ignored.
- YouTube: yoFCfTP_k4g (https://youtu.be/yoFCfTP_k4g), uploaded 20 Oct 2026 from the cloud routine, public 21 Oct 2026 20:00 IST.
- By hand in Studio after upload: set the Short's Related video to the film (0GEqZ5t3Ci8).
