# Film 04: GAMBLING | The House Always Wins

- **YouTube:** https://youtu.be/-Hvb4y2juGk, uploaded 28 Oct 2026 by the cloud routine, private until it goes public on
  2 Nov 2026 at 05:30 IST (Sunday 1 Nov 19:00 New York), first with the code-drawn thumbnail; since 30 Oct 2026 the ChatGPT one (`thumb.jpg`).
- **What it is:** 1:57 (117 s), 16:9, 1920 x 1080, 30 fps, in the house style of LUST (`films/03-lust`). There is no
  narration; an ElevenLabs score carries the film, and the devil's words are on screen (pink whispers, then red slammed
  capitals). 75 shots, average 1.56 s.
- **The story** (`STORY.md`, locked after two critic rounds):
  - Every night he bets on HOUSE, an invented betting app. A devil that deals the cards comes closer every night: the
    window, the foot of the bed, beside him, then behind him with its hands on his shoulders.
  - It takes his sister's college fees, the rent and his grandmother's gold chain; DOUBLE OR NOTHING takes the rest.
  - The phone fills with zeros. In the black glass: "I LET YOU WIN.", "I AM THE HOUSE.", "YOU HAVE ONE THING LEFT TO
    BET." It deals him a last card with his own face: "YOU."
  - He snaps his bank card in half and every card burns.
  - At 6:00 AM the music turns: push-ups, the run, a double shift at a warehouse, the gym. On payday it attacks, and he
    deletes the app.
  - Weeks later, in the mirror, a coin flips in the dark doorway: "DOUBLE OR NOTHING?" Then "WHO DO YOU THINK IS
    DEALING?" … "STILL ME."

## New in this film (each film is its own piece)

All in `film.js`, drawn in the engine's style:
- **The HOUSE app** (`houseScreen`):
  - an invented logo, a gold roof with one red eye;
  - green felt, the BALANCE counting up and down, cards dealt and turned;
  - "BET" and "DOUBLE OR NOTHING" buttons, with his thumb on the one he presses;
  - every loss stamped HOUSE WINS; the one win a sour dead green, with its grin faint in the glass;
  - the gold DEPOSIT toast, CARD DECLINED, and the zeros pouring down.
- **The cards it deals** (`DEALS`, `roomCards`, in its own room shot `groom`):
  - they fly from its claws and pile up on his floor night by night;
  - the first one turns to its grin;
  - in the reveal they all flip and rise, then burn to embers when he snaps the card.
- **New close-ups:**
  - `chain`: its claw takes Grandma's chain out of his hand;
  - `lastcard`: a card with his own face;
  - `snap`: his bank card snapped in two.
- **New places and things:**
  - `work`: a warehouse with a DOUBLE SHIFT board, ticked day by day;
  - `gmirror`: the mirror, with the snapped card tucked in its frame and a coin with the HOUSE roof on one face and its
    grin on the other;
  - `momchat`: the photo of the chain he bought back;
  - his desk's unpaid letters and family photo (`gamblingProps`).
- **Phone push-in** (`gphone`): the engine's phone pushed in toward the banner, the table or the delete dialog, so the
  text reads on small screens.

## Sound

- **Made by ElevenLabs** (`music.json`, through `engine/audio/music.mjs`, 28 Oct 2026). The plan was about 2,160
  credits. The shared account read 16,867 before, 14,584 right after, and 13,680 at the end of the run; its counter lags
  and the daily channels use it too, so the spend was between about 2,300 and 3,200:
  - SCORE: 66.2 s, three chunks: intro, nights with a sour detuned casino chime, and reveal;
  - RISE: the comeback anthem, 35 s;
  - ENDING: a calm piano, 16 s;
  - two new sounds: the card snap and the coin.
  - The shared hits (scream, shriek, scare, stinger, swell) come from `engine/audio/sfx`.
- **The mix** (`mix.py`, which writes `audio/mix.wav`):
  - The score's own riser and hit are moved so the hit lands on the title (3.2 s).
  - The nights' pulse runs into dead silence when the phone fills with zeros (47.9-48.85).
  - The reveal follows, then silence before the snap (59.0-60.6), then the snap, the scream and the aftermath.
  - RISE starts 0.95 s early, so its opening impact lands on 6:00 AM (66.2). It drops out for the payday jump scare
    (90.6-92.3).
  - Weeks later: the piano, then the casino chime detuned as its eyes open (106.8), the coin (107.2), and the title's hit
    again on "STILL ME." (111.2).
  - Final level: -14.0 LUFS, -2.0 dBTP.

## QA

**Story:** two critic rounds.
- Round 1: cold line 7, stake 6, devil 9, banners 6, reveal 7, comeback 8, last line 7, safety 8, pace 9. Changed: Sis's
  fees in night 1; every banner alone on the phone; DOUBLE OR NOTHING takes Mom's chain on screen; "I LET YOU WIN.";
  the card with his face; a faster cold open; the payback over weeks.
- Round 2: 8, 9, 9, 9, 8, 9, 9, 10, 9, with no changes left.

**Sheets:** four rounds of contact sheets every half second, plus the first frame after every cut. Fixed: the chain
close-up (a real hand and a bigger chain clear of the whisper), the snap's hands, the cold-open card flying across his
face, the night-1 card flip framed higher and given a red glow, the deposit tag overlapping the balance, the spade pip,
and the warehouse box now going onto the shelf.

**Video:**
- **v1:** `qa.mjs` all ok (117.00 s, H.264/AAC, -14.18 LUFS, -1.57 dBTP; the one black stretch, 109.43-109.73 s, is the
  planned glitch to black). The sound was checked by measurement at every turn. A blind sound-off viewer, given only
  1-fps sheets, told the story back: the betting app, the win then the loss, Mom's necklace, the devil as the house, the
  card with his face, the snap, the training, the double shifts, the deleted app, the necklace back, and the ending as
  an open warning. Its gaps were mostly text too small on the sheets.
- **v2** fixed those for small screens: the banner, table and delete-dialog shots push in on the phone; the necklace's
  money lands as a big gold DEPOSIT toast; the lap in the last-card shot reads as legs; the coin is bigger and its claw
  clear. `qa.mjs` all ok again (same numbers). Shipped.

**Ship bar (v2):**

| # | Item | Score | Why |
|---|---|---|---|
| 1 | Cold open | 8 | the cold line types from 0.1 s; at 1.9 s a card spins out of the dark window; its eyes open at 2.2 s; GAMBLING slams on the score's own hit at 3.2 s |
| 2 | Story with the sound off | 8 | a blind viewer told it back; the banners (Sis, Landlord, Mom) are alone on the phone, pushed in; one gap: the four clocks can read as one long night |
| 3 | Pace | 9 | 75 shots, 1.56 s average, none over 2.6 s but the text cards; flashes on the clocks, its face, the snap and the last card; glitches on every turn; the montage cuts every .375 s |
| 4 | The devil | 9 | red rim, smoke, burning eyes and grin; window, foot of the bed, beside him, behind him; kind pink whispers, then red capitals |
| 5 | His face | 8 | hungry, tired, empty with a tear, ashamed, shock, resolve, strain, focus, calm, smile; never cut off |
| 6 | The phone | 9 | an invented app and logo, no real brand; banners push the page down; every text readable at 1080p (checked in the MP4) |
| 7 | The comeback | 9 | 6:00 AM, 6:30 AM, 8:00 AM, 2:00 PM, 8:30 PM, 9:45 PM, 11:00 PM; push-ups, a run, pull-ups, squats, curls and a double shift; the anthem's impact lands on 6:00 AM |
| 8 | The ending | 9 | "DOUBLE OR NOTHING?" over the coin; the cold line comes back, "STILL ME."; GAMBLING / THE HOUSE ALWAYS WINS |
| 9 | Sound | 8 | the sections change on the turns, the anthem is clearly different, silences only where planned (measured, not heard) |
| 10 | Mechanics | 10 | `qa.mjs` all ok |

## Files

- `film.js`: the film.
- `STORY.md`: the beat table and both critiques.
- `music.json`: what ElevenLabs made; the mp3s and their prompts are in `audio/music` and `audio/sfx`.
- `mix.py`: the sound.
- `publish.json`: the upload sheet with the video id.
- `thumb.jpg`: the ChatGPT thumbnail (30 Oct 2026, from `thumb/chatgpt_v2.png`, its own layout so it does not repeat LUST; v1 was LUST's layout); `thumb_code.jpg`: the code-drawn one.
- `film04_phone.mp4`: the 720p archive copy.

**Rebuild:** `python films/04-gambling/mix.py`, then `.claude/skills/idf/bin/render.sh film films/04-gambling` (writes
`film04.mp4`, git-ignored).

**Shorts:** 22-28 in `.claude/skills/idf/shorts.md`. They wait until the film is public.

## Left for the owner

- In Studio: the end screen (the next film or the channel) and the pinned comment.

**Re-made and replaced, 31 Oct 2026** (the owner: the sound was "very loud", "black figure on black background is a bad idea", the devil was "not looking good"; then "Replace all three"): rendered again with the Shadow Twin devil, the lit sets and the -18 LUFS mix, uploaded as kfhGpirPNsk (https://youtu.be/kfhGpirPNsk); the old upload -Hvb4y2juGk is private, not deleted.
