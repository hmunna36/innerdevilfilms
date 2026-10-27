# The Devil You Feed (was Inner Devil Films)

Animated horror short films about the habits that feed on us in the dark: youtube.com/@TheDevilYouFeed
(channel id UCMWgThNed--oMhcPwyDKceA). Every bad habit has a devil; every night you feed it, it gets closer; in every
film someone finally stops feeding it. No narration: an extreme score, the devil's words on screen, a story told in
pictures. The model film is LUST | It Watches Back (`films/03-lust`).

Everything is drawn in code on the channel's canvas engine and made by two Claude cloud routines (PAUSED since
27 Oct 2026 until the owner switches them back on):

| Routine | When (IST) | Does |
|---|---|---|
| Daily Short | every day ~10:00 | `/idf short next`: one vertical Short cut from the latest public film, released 20:00 IST |
| Weekly film | Thursday ~10:00 | `/idf film next`: one 1:40-2:20 film on the next topic, released Sunday 19:00 New York |

- How it works: `.claude/skills/idf/SKILL.md` (and `reference/`; the engine in `reference/engine.md`).
- What comes next: `.claude/skills/idf/topics.md` (films) and `shorts.md` (Shorts). Edit them to steer.
- Run log: `.claude/skills/idf/reference/log.md`.

## Layout

- `engine/`: the canvas engine (the man, the devil, the bedroom, the phone, the shot library, the 9:16 Short mode), its
  renderer and QA (`render.mjs`, `qa.mjs`), the sound tools (`audio/`) and fonts. Open
  `engine/player.html?film=films/03-lust` in a browser to play a film.
- `films/NN-slug/`: one folder per film (`film.js`, `music.json` and the ElevenLabs mp3s, `mix.py`, story, upload sheet,
  thumbnail, small phone copy).
- `shorts/NN-slug/`: one folder per Short (`short.js`, upload sheet, small phone copy).
- `channel/`: logo, banner, the channel's text; `channel/brand/` draws them.
- Before 27 Oct 2026 (the Devil Mode films, now private): `anim/` (Remotion), `design/`, `scripts/`, `FORMAT.md`.
