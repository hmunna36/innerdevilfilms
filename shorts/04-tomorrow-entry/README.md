# Short 04: tomorrow-entry (27.8 s, 1080 x 1920)

The Devil's entry in film 01 TOMORROW, beat by beat, in the film's own order and time. It opens on his tears on the
floor beside the Angel: "Mom ran out of her medicine." The Angel's light burns down to an ember ("Kindness stopped
working."), the clock says 3:59, the room goes cold and the halo's shadow on the wall swells into horns over him ("Then
something else woke up."). Red light and smoke pour in under the door, the smoke crawls across the floor to him, the
lights flicker on his face, a column of smoke rises, the eyes ignite, the Devil takes shape, reaches for him and leans
in: "Then move." A beat of silence, then THE DROP: DEVIL MODE, he stands up with red eyes while the Devil laughs. Then
the end card ("He kept saying tomorrow." / TOMORROW / Full film on the channel).

- Source: `anim/src/Short04.tsx` (composition `Short04`; `Short04QA` renders a list of frames for contact sheets),
  sound `anim/scripts/short04_score.py`.
- Rebuild: `python3 anim/scripts/short04_score.py`, then `.claude/skills/idf/bin/render.sh Short04 shorts/04-tomorrow-entry/short04.mp4`.
- Segments (film time of `Film04` -> Short time): his tears 39.9-41.4 | then the film without a cut in time from the
  ember 47.3 to the horns 53.4 (3:59 48.8, the cold room and the horns 50.2-53.4 in one push) | the door 54.4 to the
  drop's end 71.6 (the smoke 56.2, his face 57.8, the column 59.2, the eyes 60.4, the Devil rises 61.8, reaches 64.4,
  "Then move." 65.8, silence 68.4, the drop 69.0) | card over the rest of the drop scene 71.6-73.0 stretched to 3.0 s.
  The one jump (53.4 -> 54.4) is there because the horns leave the top of the film's frame after 53.4.
- Sound: the film's own mix of the same spans (the score script runs `film04_score.py` up to its master and cuts it
  to the Short's segments), plus a new hit on the first frame, a whoosh on the jump, a quiet chord and high string
  under 3:59 so the phone band holds, and the card (a hit and the Angel's notes over the Devil Mode beat, without the
  film's drawer sounds).
- QA, 22 Oct 2026 (cloud): stills (start, middle and end of every shot) with the iPhone safe area drawn on them, then
  contact sheets of the render one frame a second, and the phone-band check of the mix. Stills round 1: the rent
  counter ran into Bean's head, the Angel was cut at the frame edge in the hook, the captions covered the Angel and
  Bean's head, Bean was cut at the right edge in the smoke-column shot, the Devil's face sat under the app's top bar
  when he rises and reaches, the horns had already left the frame, and DEVIL MODE covered Bean's face: fixed (no
  counter, captions at the top of the safe area, new framings with both faces whole, the horns shot moved earlier in
  the film, DEVIL MODE in the lower safe area under Bean's face). Stills round 2: "Then move." covered the Devil's eyes
  and grin when he leans in: a wider framing and the line under Bean's head. Mix: 3:59 and the cold room were too thin
  for a phone speaker (the phone band near -38 dB for 2 s): a quiet chord and a high string under them. Video round 1:
  "Kindness stopped working." and "Then something else woke up." were fully typed for under 1 s: faster typing.
  Video round 2: every item of the ship bar passes (27.8 s; the first frame has his face, the Angel and "Mom ran out
  of her medicine."; key text 74 px+ inside the safe area, fully shown 1 s+; no face cut off, no letterbox; peak
  -1.0 dBFS; the phone band under -38 dB for at most 1.4 s, the planned hush before the drop; 0.6 s of silence before
  DEVIL MODE). The dark first frames of the door shot (the line of light under it, then red) are meant.
- Archive copy: `short04_phone.mp4` (720p). The upload file `short04.mp4` is git-ignored.
- YouTube: v6ZoBWR4Mnc (https://youtu.be/v6ZoBWR4Mnc), uploaded 22 Oct 2026 from the cloud routine, public 23 Oct 2026 20:00 IST.
- By hand in Studio after upload: set the Short's Related video to the film (0GEqZ5t3Ci8).
