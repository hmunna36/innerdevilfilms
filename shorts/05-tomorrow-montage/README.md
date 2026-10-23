# Short 05: tomorrow-montage (33.2 s, 1080 x 1920)

Devil Mode at full speed in film 01 TOMORROW, with the money counter rising. It opens on THE DROP: DEVIL MODE, he is up
with red eyes, the Devil laughs behind him, and the counter reads "$0 / $2,400, 18 DAYS LEFT" (the rent and Mom's
heart medicine). His phone goes into the drawer, the Devil says "Again.", the laptop opens, and the money montage runs
in the film's own cuts and beat: the bench, the rain, the box, 9:31, an application NOT SELECTED, "Again.", 12:40, the
second bench, the street with the Devil at his heels, 2:40, rubbing his eyes, his red eyes, the huge Devil, the final
job. Every payment pops up (+$1,200 Repair contract, +$150 Delivery, +$375 Repairs, +$300 Delivery, +$375 Final job)
while the counter climbs and the days run down, to EARNED $2,400 with 1 day left. Then day zero: PAID $1,800 Rent,
PAID $600 Mom's medicine. Then the end card ("He kept saying tomorrow." / TOMORROW / Full film on the channel).

- Source: `anim/src/Short05.tsx` (composition `Short05`; `Short05QA` renders a list of frames for contact sheets),
  sound `anim/scripts/short05_score.py`.
- Rebuild: `python3 anim/scripts/short05_score.py`, then `.claude/skills/idf/bin/render.sh Short05 shorts/05-tomorrow-montage/short05.mp4`.
- Segments (film time of `Film04` -> Short time): the drop 69.4-71.125 -> 0.0 | one bar later in the film, without a
  cut in time from the drawer 73.0 to EARNED 97.6 -> 1.725 (every film cut keeps its place in the beat; each shot has
  its own vertical camera) | EARNED $2,400 97.6-98.8 held 1.4 s, to the next downbeat -> 26.325 | day zero 107.6-110.1
  -> 27.725 | card over the rest of day zero 108.9-110.15 stretched to 3.0 s -> 30.225.
  The one jump inside the montage (71.125 -> 73.0) is exactly one bar (1.875 s at 128 BPM), so the beat runs on.
- The counter is this Short's own (the film's EARNED counter and DAYS LEFT, re-drawn for the tall frame at 72-124 px):
  what he has earned against the $2,400 he owes, a progress bar, and the days left; it pops when a payment lands.
- Sound: the film's own mix of the same spans (the score script runs `film04_score.py` up to its master and cuts it to
  the Short's segments), with the drop's hit moved to the Short's first frame (film 69.4), a whoosh on the jump, a soft
  hit and a warm chord where the beat stops on the bar line into day zero, and the card (a deep hit and the Angel's
  notes).
- QA, 23 Oct 2026 (cloud): stills (start, middle and end of every shot) with the iPhone safe area drawn on them, then
  contact sheets of the render one frame a second, and the phone-band check of the mix (and of the MP4's own audio).
  Stills round 1: the counter sat over Bean's head in most shots, and his face was under DEVIL MODE in the first
  frames: new framings with every head below the counter, the hook starts at film 69.4 (he is up) with the drop's hit
  moved there. Stills round 2: heads still grazed the counter (the rig's head is 84 x scale) and the second "Again."
  cut his face at the frame edge: framings from the rig's geometry, the second "Again." widened. Stills round 3: the
  Devil's eyes touched the counter in the second "Again." and the eye close-up grew into it: lowered. Video round 1:
  the Devil's face was cut at the left edge in the laptop shot and on day zero (both now leave him out of
  frame), the second "Again." was fully readable for under 1 s (faster typing, held 0.35 s into the
  next shot), and DEVIL MODE scaled up into his chin on the first frames (a smaller pop). Video round 2: every item of
  the ship bar passes (33.2 s; the first frame has both faces, DEVIL MODE and "$0 / $2,400, 18 DAYS LEFT"; key text
  70 px+ inside the safe area, held 1 s+; no face cut off, no letterbox; peak -1.0 dBFS; the phone band under -38 dB
  for at most 0.25 s, in the final fade). The screen's fine print (NOT SELECTED's small lines) and the clocks are
  diegetic and not needed for the story.
- Archive copy: `short05_phone.mp4` (720p). The upload file `short05.mp4` is git-ignored.
- YouTube: JKkwepT_5LI (https://youtu.be/JKkwepT_5LI), uploaded 23 Oct 2026 from the cloud routine, public 24 Oct 2026 20:00 IST.
- By hand in Studio after upload: set the Short's Related video to the film (0GEqZ5t3Ci8).
