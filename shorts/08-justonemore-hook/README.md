# Short 08: justonemore-hook (34.4 s, 1080 x 1920)

The hook cut of film 02 JUST ONE MORE: the whole story fast. It opens on the climax as the film does: "EXAM IN 3 DAYS",
4:12 AM, his phone at 1%; the screen dies and his reflection in the black glass becomes the Devil, eyes igniting; the
Devil over him in bed: "Put it down." A red flash, 4 DAYS EARLIER (the counter rewinds to 7). Dad's texts: "Night shift
again." / "Pass the exam. I can't do one more year of night shifts." and his answer "I'll pass it. I promise." The
Angel at his shoulder: "Just one more." The nights slip (12:41, the slump, 2:52). EXAM IN 3 DAYS: "Just one more." in
his own voice. The Devil again: "Put it down." The plug touches the port, his eyes turn red, it drops; a beat of
silence; DEVIL MODE (the Devil laughs, he stands); the phone into the drawer, the Devil's hand slams it. EXAM IN 1 DAY:
KNOCK. KNOCK. KNOCK. A note slides under the door: "It's my birthday. I just wanted to see you. - Dad", the Devil
grinning in the dark behind it. End card ("The phone ate his nights." / JUST ONE MORE / Full film on the channel).

- Source: `anim/src/Short08.tsx` (composition `Short08`; `Short08QA` renders a list of frames for contact sheets),
  sound `anim/scripts/short08_score.py`. `Film05.tsx` now exports `Phones` and `NoteBirthday`, and `film/phone.tsx`
  exports `VestIcon`, so the Short can reuse them (the film itself is unchanged).
- Rebuild: `python3 anim/scripts/short08_score.py`, then `.claude/skills/idf/bin/render.sh Short08 shorts/08-justonemore-hook/short08.mp4`.
- Segments (film time of `Film05` -> Short time; each plays one stretch of the film through its own vertical camera):
  the phone at 1% 0.0-1.0 (stretched to 1.2 s) -> 0.0 | the black glass, the Devil's eyes 1.0-1.9 -> 1.2 | the Devil
  over him, "Put it down." 1.9-3.2 -> 2.1 | the red flash, 4 DAYS EARLIER 3.2-4.6 -> 3.4 | Dad's chat (drawn for the
  tall frame, over the film's blurred room 7.6-11.2, 5.6 s) -> 4.8 | the Angel, "Just one more." 28.4-29.8 -> 10.4 |
  12:41 32.6-33.3 -> 11.8 | the slump 34.6-35.3 -> 12.5 | 2:52 35.3-36.0 -> 13.2 | his own "Just one more." 66.7-68.1
  -> 13.9 | "Put it down." 80.1-81.7 -> 15.3 | the plug 81.7-83.5 -> 16.9 | the freeze 83.5-84.1 -> 18.7 | DEVIL MODE
  84.1-87.5 -> 19.3 | the drawer 87.5-88.9 -> 22.7 | the knocks 99.9-101.4 -> 24.1 | the note under the door
  106.2-107.8 -> 25.6 | Dad's note 126.9-131.1 -> 27.2 | card over the dark room behind the note 129.0-131.0
  (stretched to 3.0 s) -> 31.4.
- The Short's own: the exam counter as one line ("EXAM IN 3 DAYS", 76 px, top left of the safe area, red in the cold
  open and in Devil mode, popping when it changes), Dad's chat at 70 px bubbles, "4 DAYS / EARLIER", the KNOCK words
  (so the knock reads without sound), DEVIL MODE in two lines under his face, and the card. The captions are the
  film's lines in the film's lettering, 96-112 px.
- Sound: the film's cues re-timed to the Short's cuts: the tinny video and the low-battery beeps, a deep hit, braam and
  choir as the screen dies, a breath and a reverse swell into "Put it down.", the hit and the counter rewinding, pings
  and Dad's warm piano phrase under his texts, the typing and "sent", the Angel's bells and soft minor piano, the
  nights on whooshes and ticks that speed up, the braam and the heartbeat under the Devil, the plug's scrape and drop,
  0.6 s of silence, the drop into the Devil-mode beat (128 BPM) and the drawer slam, the beat cut for three knocks,
  the note sliding in and his father's steps walking away, Dad's theme broken under the note, and the card (a deep hit,
  the Angel's notes in minor).
- QA, 26 Oct 2026 (cloud): stills (start, middle and end of every shot) with the iPhone safe area drawn on them, then a
  contact sheet of the render one frame a second, and the phone-band check of the mix and of the MP4's own audio.
  Stills round 1: the Devil's face sat under the app's top bar in both bed shots (camera lowered), DEVIL MODE crossed
  his face (moved under it, 170 px, inside x 100-870), the counter sat over the phone's bright screen (phone moved
  down), the clocks were small (closer), the note under the door was tiny (closer), Dad's thread hung at the bottom
  (starts under the header now). Stills round 2: the plug shot showed more blanket than face (closer, on his face, the
  phone and the plug), the note hid the Devil's grin (moved down), the last KNOCK too short to read (the words stay
  into the next shot). Stills round 3: the counter touched his head in the plug close-up (framed lower). Video
  round 1: every item of the ship bar passes (34.4 s; the first frame has "EXAM IN 3 DAYS" and the 1% screen; key
  text 70 px+ inside the safe area, held 1 s+; no face cut off, no letterbox; peak -0.9 dBFS; the phone band under
  -38 dB for at most 0.8 s, the silence before the drop).
- Archive copy: `short08_phone.mp4` (720p). The upload file `short08.mp4` is git-ignored.
- YouTube: 3ypMOEbWDmY (https://youtu.be/3ypMOEbWDmY), uploaded 26 Oct 2026 from the cloud routine, public 27 Oct 2026 20:00 IST.
- By hand in Studio after upload: set the Short's Related video to the film (GVoVv5A5kOE).
