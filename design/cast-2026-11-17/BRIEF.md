# New cast for The Devil You Feed: design boards (17 Nov 2026)

The channel makes animated horror shorts with no narration: every bad habit has a devil; you feed it and it grows.
Everything is drawn in code on an HTML canvas (no AI images, no stock). The owner watched the last film and said:
**"redesign the characters completely and make a fantastic storyline; the devil should be really good."**

The old cast is in `old/*.jpg`: black ball heads with thin white line faces, stick limbs, and a devil that is a black
stick figure with horns and a zig-zag grin. All of that is rejected. Nothing of it may survive: no ball heads, no
line faces, no stick limbs, no flat black people.

We show the owner **three complete looks** as finished stills of the same four pictures, they pick one, and that look
becomes the film's cast. You draw ONE look (your direction is in the message that sent you here).

## The new story (so the pictures make sense)

**THE BOTTLE | It Was So Small.** A man feeds a devil for seventeen years. It starts thumb-sized and adorable.

- **AGE 21, his first drink.** A thumb-sized newborn devil climbs out of the foam onto the rim of his glass, shakes
  itself dry like a puppy. He laughs. It whispers (pink): *"You're funnier with me."* He lets it drink a drop: it grows.
- **AGE 26, his wedding.** It is cat-sized, on his shoulder in a tiny bow tie, raising the toast. Everyone laughs.
- **AGE 31, the nursery.** He holds his newborn daughter. It is child-sized, standing on a chair behind him, holding out
  a flask: *"You earned it."*
- **AGE 34.** It is exactly his size, wears the same shirt and tie as him, arm round his shoulders, pours for him,
  answers for him, sits between him and his family at dinner.
- **AGE 38, his daughter Lily's 6th birthday.** It is a giant, bent under the ceiling, in his chair at the table. He is
  tiny, shut inside the bottle on the table, hands on the glass. Lily's drawing "MY FAMILY" on the fridge shows Daddy
  drawn in red, with horns. The devil's real voice (red): **"THEY CAN'T SEE ME. THEY ONLY SEE YOU."**
- He breaks out, pours the bottle away, and starves it: DAY 1, DAY 14, DAY 40, DAY 90. Each morning he trains at
  dawn and it is a size smaller, begging, then sulking, then furious and tiny. On DAY 90 he corks the thumb-sized
  devil in the empty bottle and puts it on a high shelf. Lily's new drawing has no horns. She hugs him.
- Last picture: night, the shelf, two small eyes open inside the bottle. It taps the glass, politely. *"I can wait."*

So the devil is one character at **five sizes** (thumb, cat, child, man, giant), and it has to act: adorable, charming,
your best friend, the usurper, pleading, furious, patient. It is the star. The people: **Dad** (Sam; 21 in the first
picture, 38 and worn out later), **Lily** (6; the only yellow in the film is hers: a yellow dress or raincoat).

## What you deliver

`<letter>.js` in this folder (your letter is in your message), defining

    const STILLS = { cast: t => {…}, m1: t => {…}, m2: t => {…}, m3: t => {…} };

drawn on the global `ctx`, 1920 x 1080, with the helpers in `lib.js` (read it first; add your own helpers inside your
own file, never edit `lib.js`, `page.html`, `render.mjs` or another letter's files). And `<letter>.md`: half a page of
design notes (proportions, colours as RGB, what changes with the devil's size, what should move when it is animated).

The four pictures, the same for all three looks:

1. **`cast`: the character sheet.** A simple lit backdrop. Dad at 38 full figure; Lily full figure next to him (her
   height to his); the devil full figure at man size next to them; the devil's other sizes beside it to scale (thumb
   size also drawn enlarged in a round inset, because it is the first thing the audience meets); the giant may be cut
   by the frame. Under or beside them: a row of **four devil faces** (charming smile, sly, pleading, rage) and **three
   Dad faces** (laughing, tired and tempted, horror). Small plain labels (`label()`).
2. **`m1`: AGE 21, the first one.** Warm kitchen party at night, out of focus. Close shot: young Dad's head and
   shoulders on the left two thirds, delighted, looking at the glass he holds up at the right: the thumb-sized devil
   sits on the rim, adorable, looking back at him. `stamp('AGE 21', 'his first')` and
   `words('kind', 'You’re funnier with me.')`.
3. **`m2`: AGE 34, the best friend.** A bar, amber light. Medium two-shot from the front: Dad (tired, tempted, tie
   loose) and the devil, his size, in the same shirt and tie, its arm round his shoulders, its mouth near his ear,
   its other hand tipping a bottle over his glass. `stamp('AGE 34')`, `words('kind', 'One more. You earned it.')`.
4. **`m3`: AGE 38, his chair.** Wide shot, the dining room, a birthday. The giant devil sits in Dad's chair, so big it
   bends under the ceiling, a paper party hat on one horn, leaning over the cake with six candles. Lily, in yellow,
   small, across the table, looking up at it, afraid. On the table a bottle with Dad inside, tiny, palms on the
   glass. `stamp('AGE 38', 'her 6th birthday')`, `words('real', 'THEY ONLY SEE YOU.')`.

Structure the code as reusable figure functions with options (position, scale, pose, expression, the devil's size
stage), for example `dad(o)`, `lily(o)`, `devil(o)`, `devilHead(o)`: the look that wins becomes the film's rig, so a
figure must not be a one-off list of coordinates per picture. Faces take an expression parameter.

## The bar (what "really good" means here)

- **Solid, shaded forms.** Every figure has a light side, a shadow side and a rim of the scene's light; bodies have
  volume, clothes, hair, necks, hands with fingers when a hand is in view. Use gradients, `inside()` clipping for
  shadow shapes, `blob()`/`taper()` for organic shapes.
- **Faces that act.** Eyes with whites, iris, pupil, a highlight, lids and brows that change with the expression; a
  mouth with shapes (closed smile, open laugh with teeth, grimace); a nose. A viewer must name the emotion from a
  thumbnail-sized picture.
- **The devil is the best-looking thing in every frame** and reads as a devil at a glance (horns, eyes, grin, tail or
  claws, its own light), without being a cliché clip-art devil and without being a stick. It must be appealing when it
  is small and frightening when it is big, and recognisably the same character.
- **Original.** It must not resemble any existing character (no Hazbin Hotel, Cuphead, Bendy, Slender Man, Bill
  Cipher, Chernabog, HIM, Hellboy, the old Shadow Twin). No brands, no labels on the bottle. Nothing graphic.
- **Lit pictures.** Never a dark figure on a dark background: a mid-tone background, a light source in frame or
  implied, a pool of light behind each figure, `finish()` at the end. Backgrounds stay simple (big soft shapes,
  bokeh, one or two props): the characters are what is judged.
- **Phone test.** It will be watched on a phone: big shapes, strong silhouettes, high contrast between figure and
  background. Check each still shrunk to 480 px wide (`sips -Z 480 out/x.jpg --out out/x_small.jpg`).

## How to work

    cd ~/Desktop/nightly routines/innerdevilfilms/design/cast-2026-11-17
    node render.mjs <letter>            # all four stills -> out/<letter>_<still>.jpg
    node render.mjs <letter> m2         # one still

Look at every render with the Read tool, judge it hard against the bar and the old frames, and redraw. Plan on at
least five rounds per picture; the first two rounds of any figure look amateur, and the faces need the most rounds.
Start with the devil's head and Dad's head large on a blank canvas until both are genuinely good, then build bodies,
then the pictures. Run one render at a time (the Mac has 8 GB). No git commands. Stay inside this folder.

Hand back: the files, what is strong, what is still weak (honestly), and anything you would change with more time.
