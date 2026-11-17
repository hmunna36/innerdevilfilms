# Titles, descriptions, thumbnails, release times

## Release times (decided 20 Oct 2026, kept for the new style on 27 Oct)

- **Shorts: every day at 20:00 IST**: evening in India, morning in the US.
- **Films: every Sunday at 19:00 New York time** (Monday 05:30 IST from November): the two biggest recent films in this
  genre went out on a Sunday about 7 PM US Eastern. The weekly film routine runs on Thursday, so a film has three days of
  slack, and the Mac has time to swap in the ChatGPT thumbnail.
- `yt.mjs --schedule=auto` picks the slot; never schedule by hand unless a slot is taken. (One-offs chosen for the
  owner: LUST on Tuesday 27 Oct 22:30 IST; THE BOTTLE on Tuesday 17 Nov 21:00 IST, the day he approved it.)

## Film titles

`WORD | Hook line`: the vice in capitals, then a short line about IT (THE BOTTLE | It Was So Small; LUST | It Watches
Back). Under 50 characters. The hook never names the devil (if it must, "THE DEVIL …" with "the"), and is never "Devil
Mode". No sexual wording beyond the topic word, in titles, descriptions or tags.

## Film description

Two short lines of story that set up the idea without spoiling the turn ("He was fifteen and it was small enough to
fit in his glass. Every drink, it grew."), one line saying what the film is ("WORD | Hook is an animated short film
about the habit you feed, and the day he stopped feeding it."), a question for the comments, then `#shortfilm
#animation #selfimprovement #<topic> #thedevilyoufeed`. Tags: 10-13 (`films/07-it-was-so-small/publish.json` is the
model): the topic, the title, "the devil you feed", "animated short film", "addiction", "self improvement",
"discipline", "animation".

## YouTube settings (in publish.json)

`categoryId "1"` (Film & Animation), `language "en"`, `madeForKids false`, `syntheticMedia false` (hand-built animation
in code, not AI-generated realistic footage), `notifySubscribers true`, `privacy "private"` with `publishAt` (the slot).
After every upload: `node $K/bin/yt.mjs status <id>` until it has processed (an upload can print "upload failed
(network error)", exit 0 and leave a stuck video).

## Thumbnails

The owner wants thumbnails drawn by ChatGPT from film frames (17 Nov 2026: "Create a thumbnail from ChatGPT"), and the
cloud cannot reach ChatGPT. So:

1. **The cloud film run** uploads with a code-drawn thumbnail: the film's strongest frame without its words, the topic
   word huge in fat white letters with a red edge, the hook small under it:

       node stage/render.mjs films/NN-slug thumb <t> "THE WORD" "IT …" --pos=left --cam=1.25,1100,500

   (`<t>` seconds in the edit; `--cam=zoom,x,y` frames it; `--pos=top|bottom|left`). It writes `thumb_code.jpg`
   (1280 x 720): look at it at 320 px wide, copy it to `thumb.jpg` (the cover in `publish.json`). It is a stand-in until
   the Mac swaps in the ChatGPT one. The film never goes out with a random frame.
2. **The Mac** (`/idf thumb NN`, the owner's Chrome, any day before the release) makes the real one and swaps it in. The
   report of every film run says so.

What the genre's thumbnails share (measured on Day One Films, 7 Oct 2026), and ours follow: a near-black field; ONE
face filling about half the height in ONE hard emotion (fear, exhaustion, rage); ONE everyday object (a bottle, a phone,
a door); 1 to 3 fat white words; one glow. Ours add the channel's rule: the topic word is the biggest thing, with a red
edge, and the hook is small and always "IT …".

### `/idf thumb NN` on the Mac

1. `git -C ~/Desktop/innerdevilfilms pull`, `git sparse-checkout add films/NN-slug stage`, `. .claude/skills/idf/bin/env.sh`.
2. Three reference frames from the film (`node stage/render.mjs films/NN-slug still <t> ref_a` …): the devil at its
   biggest or most telling, his (or her) face in its hardest emotion, and the object of the vice. Keep them in
   `films/NN-slug/thumb/`.
3. ChatGPT in the owner's Chrome, a new chat, the method in `~/.claude/skills/be/reference/chatgpt.md` (load the Chrome
   tools in one ToolSearch call, work in a tab you create, click "Add files and more" before attaching, wait for the
   image, wait about 2.5 s, download it). Attach the three frames ONLY (no finish reference: for film 07 the first try
   was accepted), then write the prompt:

   "Make a YouTube thumbnail, 16:9, for my animated short film. Keep the attached frames' exact style: a flat,
   hand-drawn 2D cartoon on a near-black stage, NOT 3D, NOT realistic, NOT painted. Keep each character's design
   exactly: the people are simple cream-coloured cartoon figures, a round head on a small bean-shaped body with soft
   tube arms and legs, no hair, no hands, no clothes, faces drawn with a black marker (dot eyes with a white glint, a
   brow line, a simple mouth); <name the one thing that marks each: a blue tie, a yellow bow>. The devil is the same
   simple figure in solid black with a bright red-orange glowing edge, two curved horns, a pointed tail, slanted eyes
   and a jagged grin that glow like fire, a small flame in its belly. Scene: <ONE extreme picture from the film's
   strongest idea: one face in one hard emotion, one object>. Palette: black and the devil's red glow, plus <the film's
   one accent colour>. The word "<WORD>" huge in fat white letters with a thick glowing red edge <where>, and "<IT …>"
   small under it. Spell both exactly. Readable at small size. No real logos or brands, no blood, nothing sexual."

   Ask for a fix if a character is off-model (a nose, hair, fingers, a realistic bottle label), a word is misspelled, or
   it fails the 320 px test.

   **The composition is the film's own** (the owner, 30 Oct 2026): one image from its strongest idea, never a layout
   the last three films used. Used so far:

   | Film | Composition | Palette | Word |
   |---|---|---|---|
   | 03 LUST (old look) | the man on the left lit by his phone, the devil over his shoulder with its claws on him | red | top |
   | 04 GAMBLING (old look) | the devil as the dealer across a green table, holding up a card with his face on it | casino green, gold lamp | bottom |
   | 05 DOOMSCROLLING (old look) | one giant phone; in its black glass his face split young/old, the devil grinning behind | icy blue | bottom |
   | 06 RAGE (old look; the code stand-in stayed) | the devil bent double under the kitchen ceiling, its claws round his fists | ember orange | top |
   | 07 THE BOTTLE | the bottle huge in the middle with him trapped inside, palms on the glass, the giant devil behind it with both claws round the bottle | black and red, pale teal glass | on the left, stacked (THE / BOTTLE), the hook "IT WAS SO SMALL" under it |

   Add each new film's row. Ideas not used yet: its point of view looking down on him tiny; a split frame of the two
   of him; her face huge with the devil reflected in her eye; his hand reaching for the object with its hand on top.
4. Check it at 320 px wide (the word must read at a glance), convert to JPEG under 2 MB, save `films/NN-slug/thumb.jpg`
   (the code one stays as `thumb_code.jpg`), then `node .claude/skills/idf/bin/yt.mjs thumb <videoId> films/NN-slug/thumb.jpg`.
5. Note it in the film's README and `reference/log.md`, push with `bin/push.sh`, and leave the clone light again.

## The channel picture and banner

Since 17 Nov 2026 the channel picture is the new devil (`channel/logo.png`, source in `channel/brand/2026-11-17/`; a banner draft in the new look is there too, not published). The picture, name and
handle can only be changed in Studio (Customisation -> Profile), by the Mac; a routine never changes them.

## Studio-only work (the API cannot do it; list it in the report)

- A Short's "Related video" = its film.
- A film's end screen (the next film or the channel) and the pinned comment (the owner writes it).
