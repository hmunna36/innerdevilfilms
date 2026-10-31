# Titles, descriptions, thumbnails, release times

## Release times (decided 20 Oct 2026, kept for the new style on 27 Oct)

- **Shorts: every day at 20:00 IST**: evening in India, morning in the US.
- **Films: every Sunday at 19:00 New York time** (Monday 05:30 IST from November): the two biggest recent films in this
  genre went out on a Sunday about 7 PM US Eastern. The weekly film routine runs on Thursday, so a film has three days of
  slack, and the Mac has time to swap in the ChatGPT thumbnail.
- `yt.mjs --schedule=auto` picks the slot; never schedule by hand unless a slot is taken. (LUST itself went out on
  Tuesday 27 Oct 22:30 IST, a one-off chosen by the owner.)

## Film titles

`WORD | Hook line`: the vice in capitals, then a short ominous line (LUST | It Watches Back; GAMBLING | The House Always
Wins). Under 50 characters. The hook is about IT or what it does, never names the devil (if it must, "THE DEVIL …"
with "the"), and is never "Devil Mode". No sexual wording beyond the topic word, in titles, descriptions or tags.

## Film description

Two short lines of story that set up the dread without spoiling the reveal ("Every night, a kind voice told him it was
fine. Every night, the thing behind him got a little closer."), one line saying what the film is ("WORD | Hook is an
animated short film about the habit that feeds on you in the dark, and the morning he finally fought back."), a question
for the comments, then `#shortfilm #animation #horror #selfimprovement #<topic>`. Tags: 10-13 (LUST's
`films/03-lust/publish.json` is the model): the topic, the title, "the devil you feed", "horror short film", "animated
short film", "addiction", "self improvement", "discipline", "dopamine", "animation".

## YouTube settings (in publish.json)

`categoryId "1"` (Film & Animation), `language "en"`, `madeForKids false`, `syntheticMedia false` (hand-built animation
in code, not AI-generated realistic footage), `notifySubscribers true`, `privacy "private"` with `publishAt` (the slot).

## Thumbnails (decided 27 Oct 2026)

The owner wants extreme thumbnails drawn by ChatGPT from film frames, and the cloud cannot reach ChatGPT. So:

1. **The cloud film run** uploads with the code-drawn thumbnail: `render.sh thumb films/NN-slug` draws the film's
   `thumb` settings (`{ word, hook, expr }`): the topic word huge in fat white letters with a red edge, the hook small
   under it, its face huge with the grin, his terrified face lit red. It is only a stand-in until the Mac swaps in the
   ChatGPT one; set the film's own palette in it where the engine allows. Copy it to `films/NN-slug/thumb.jpg` (the cover in
   `publish.json`) and keep `thumb_code.jpg`. The film never goes out with a random frame.
2. **The Mac** (`/idf thumb NN`, the owner's Chrome, any day before the Sunday release) makes the real one and swaps it
   in. The report of every film run says so.

### `/idf thumb NN` on the Mac

1. `git -C ~/Desktop/innerdevilfilms pull` and `git sparse-checkout add films/NN-slug engine`; `. .claude/skills/idf/bin/env.sh`.
2. Three reference frames from the film: its face closest (a `devilface` shot), his most frightened face (a `face`
   shot), and the vice on the phone or its claws on his shoulders: `render.sh stills film films/NN-slug --at a,b,c --out
   films/NN-slug/thumb` (they are committed as `ref_*.jpg`, as LUST's are).
3. ChatGPT in the owner's Chrome, a new chat, the method in `~/.claude/skills/be/reference/chatgpt.md` (load the Chrome
   tools in one ToolSearch call, work in a tab you create, attach the three frames, wait for the image, download it).
   Attach the three frames and LUST's `films/03-lust/thumb.jpg` as the finish to match (glossy, high contrast, rim
   light), then write the prompt: "Make a YouTube thumbnail, 16:9, for my animated horror short film. Use the attached
   frames for the characters and keep their exact design: the devil, the Shadow Twin (a much taller black copy of the
   man: the same round head and stick body stretched thin, two short sharp horns, burning slanted red eyes, a grin far
   too wide full of white teeth, long clawed fingers, a hot red rim light) and the man (a dark round head with simple
   cream eyes, brows and mouth). Match the fourth image's finish and intensity but NOT its layout. Scene: <the
   film's own composition>. Palette: <the film's palette>, with only the devil's eyes and grin red. The word "<WORD>"
   huge in fat white letters with a thick glowing red edge <top or bottom>, and "<HOOK>" small next to it. Spell both
   exactly. Readable at small size. Nothing explicit, no real logos or brands, no blood, nothing sexual." Ask for a fix
   if a face is off-model, a word is misspelled, or it fails the 320 px test. The hook is always "IT …" (never naming
   the devil; if it must, "THE DEVIL …").

   **The composition is the film's own** (the owner, 30 Oct 2026): a single image from its strongest idea, never a layout
   the last three films used. Used so far:

   | Film | Composition | Palette | Word |
   |---|---|---|---|
   | 03 LUST | the man on the left lit by his phone, the devil over his shoulder with its claws on him | red | top |
   | 04 GAMBLING | the devil as the dealer across a green table, holding up a card with his face on it | casino green, gold lamp | bottom |
   | 05 DOOMSCROLLING | one giant phone; in its black glass his face split young/old, the devil grinning behind | icy blue | bottom |

   Add each new film's row. Ideas not used yet: its giant hand holding him tiny; its point of view looking down on
   him; the object of the vice huge in the foreground with him trapped inside it; a split frame of the two of him.
4. Check it at 320 px wide (the word must read at a glance), convert to JPEG under 2 MB, save `films/NN-slug/thumb.jpg`
   (the code one stays as `thumb_code.jpg`), then `node .claude/skills/idf/bin/yt.mjs thumb <videoId> films/NN-slug/thumb.jpg`.
5. Note it in the film's README and `reference/log.md`, push with `bin/push.sh`, and leave the clone light again.

## Studio-only work (the API cannot do it; list it in the report)

- A Short's "Related video" = its film.
- A film's end screen (the next film or the channel) and the pinned comment (the owner writes it).
