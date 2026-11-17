# Look A: EMBER

Storybook-solid people with big acting faces; the devil is a small red creature with a furnace in its belly.

**Code:** `a_src/1-heads.js` (`devilHead`, `humanHead`, the expression tables `DEV_EX`, `HUM_EX`), `a_src/2-bodies.js`
(`person`, `devil`, `hand`, `bottleA`, `glassA`), `a_src/3-scenes.js` (the four pictures). `./build_a.sh` joins them into `a.js`.

**People.** Dad is about 4 heads tall, Lily 2.7: big heads so the faces read on a phone. Skin 226/160/118 (light
247/196/152, shadow 156/92/78), hair 38/28/34. Dad: white shirt 238/234/226, teal tie 34/70/96, charcoal trousers;
at 38 stubble, bags under the eyes, grey at the temples, the tie loose and the sleeves rolled. Lily: two bunches with
yellow ties, a yellow dress 255/206/46 with a white collar (the only yellow), red shoes. Faces are built from lids,
brows, pupils and nine mouth shapes; `HUM_EX` has laugh, smile, soft, tired, tempted, horror, fear, sad, resolve, strain.

**The devil.** One figure, `devil({ stage })`, stage 0 to 4 (thumb, cat, child, his size, giant; fractions work).
What changes with size: the head goes from 56 % of its height to 20 %; the skull from a round baby head to a long jaw;
the eyes from round and wide to slanted; horns from nubs to long lyres with ridges; ears shrink; claws lengthen; the
giant gets spines on its shoulders. Crimson 196/34/38 (light 244/84/58, shadow 92/10/34), eyes 255/214/84 with slit
pupils, horn tips and tail flame 255/150/60. `fed` (0 to 1) turns up the heat: horn tips, eyes, the furnace in its
belly and the fire in its throat. At his size it wears his shirt and tie (`cloth: 'shirt'`). Expressions in `DEV_EX`:
sweet, happy, charm, sly, plead, rage, grin, sulk.

**To animate:** the tail and its flame never stop; the furnace pulses and jumps when it is fed; ears flick; blinks;
the pupils widen when it wants something and thin to a line when it is angry; when it grows, the horns push out first.

**Weak spots:** the man-sized devil's bare body (arms and legs are still tube-like); the giant's body is drawn by
hand for the birthday picture and is not yet part of `devil()`; Dad's hands in extreme close-up.
