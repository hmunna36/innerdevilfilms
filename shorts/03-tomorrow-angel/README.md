# Short 03: tomorrow-angel (32.3 s, 1080 x 1920)

The kind voice of film 01 TOMORROW. It opens on the Angel, glowing, close: "Rest." while the rent counter reads 30 DAYS
LEFT. She comforts him ("You don't have to solve everything tonight.", "One step at a time."), he applies once and
is NOT SELECTED, "Again?" / "Tomorrow.", and the nights slip: "Tomorrow." (28), 3:47 (26), asleep at the desk with
the Angel: "Rest." (24), the FINAL WARNING slides under the door, three NOT SELECTED in the inbox, his face (19). On
the floor she tries once more ("You can still take one step." / "I keep taking one… then stopping."), her light burns
down to an ember, the clock says 3:59, and the halo's shadow on the wall grows horns over him: "When kindness
fails…" / "…the devil gets to work." Then the end card ("He kept saying tomorrow." / TOMORROW / Full film on the
channel).

- Source: `anim/src/Short03.tsx` (composition `Short03`; `Short03QA` renders a list of frames for contact sheets),
  sound `anim/scripts/short03_score.py`.
- Rebuild: `python3 anim/scripts/short03_score.py`, then `.claude/skills/idf/bin/render.sh Short03 shorts/03-tomorrow-angel/short03.mp4`.
- Segments (film time of `Film04` -> Short time): the Angel 17.3-18.5 | his face 18.5-20.9 | "One step" 21.2-23.0 |
  he applies 23.65-24.65 | NOT SELECTED 25.95-26.45 (held 1.2 s) | his face falls 26.5-27.3 | "Again?" 27.35-28.75 |
  "Tomorrow." 28.8-30.1 | the nights slip 30.22-31.08 (1.2 s), 31.12-31.98 (1.0), 32.02-32.88 (1.2), the warning
  33.0-33.85 (1.3), the inbox 33.95-34.78 (1.3), his face 34.82-35.68 (1.0) | the floor 41.5-43.9, 44.05-46.95 |
  the ember 47.25-48.75 | 3:59 48.85-49.85 | the horns 51.0-54.4 | card over the red light under the door
  54.4-56.15 stretched to 3.0 s.
- The counter is the film's own rent counter (30 days at the notice, 18 when the Devil comes), with a house and
  "to pay the rent" so it reads without sound. "Rest." is this Short's own line for the Angel (the queue's "Rest.
  Tomorrow." idea): her comfort is what lets the days slip; she never says "tomorrow", he does, as in the film.
- QA, 21 Oct 2026 (cloud): stills (start, middle and end of every shot) with the iPhone safe area drawn on them, then
  contact sheets of the render one frame a second, and the phone-band check of the mix. Stills round 1: the counter sat
  on Bean's head in five shots, faces were cut at the frame edge (the two-shot, asleep, the floor close-up, the horns),
  the counter covered the FINAL WARNING title, the inbox ran off the right edge, the red "devil" line was unreadable on
  the red frame, and the hook's word faded in (no text on frame 0): fixed (new framings, one shot instead of the
  two-shot, white narration with a red glow on a darker plate). Stills round 2: the counter's pop overflowed the right
  edge for a few frames, Bean's head was clipped at the start of the horns shot, the narration touched his head, and
  "…the devil gets to work." broke badly: fixed. Video round 1: the counter crossed the notice while it slid in, and
  "When kindness fails…" sat 5 px left of the safe area: no counter on the notice shot, 72 px narration. Video round 2:
  "step." hung alone on a line and "I keep taking one… then" ended 2 px inside the safe edge: line breaks set by hand.
  Video round 3: every item of the ship bar passes (32.3 s; the first frame has the Angel, "Rest." and the counter;
  key text 70 px+ inside the safe area, held 1 s+; no face cut off, no letterbox; peak -1.0 dBFS; the phone band never
  under -38 dB for more than 0.6 s; a 0.3 s silence before the card). Small diegetic text (the laptop's fine print,
  the inbox's "Re: Your application", the notice's lines) is not needed for the story.
- Archive copy: `short03_phone.mp4` (720p). The upload file `short03.mp4` is git-ignored.
- YouTube: nf6S4VqzhOk (https://youtu.be/nf6S4VqzhOk), uploaded 21 Oct 2026 from the cloud routine, public 22 Oct 2026 20:00 IST.
- By hand in Studio after upload: set the Short's Related video to the film (0GEqZ5t3Ci8).
