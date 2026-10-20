# Inner Devil Films

Animated short films about the fights we have with ourselves: youtube.com/@InnerDevilFilms.
When kindness fails, the devil gets to work.

Everything is built in code (Remotion + a synthesized score) and made by two Claude cloud routines:

| Routine | When (IST) | Does |
|---|---|---|
| Daily Short | every day ~10:00 | `/idf short next`: one vertical Short cut from the latest film, released 20:00 IST |
| Weekly film | Thursday ~10:00 | `/idf film next`: one 2:20-3:30 film on the next topic, released Sunday 19:00 New York |

- How it works: `.claude/skills/idf/SKILL.md` (and `reference/`).
- What comes next: `.claude/skills/idf/topics.md` (films) and `shorts.md` (Shorts). Edit them to steer.
- Run log: `.claude/skills/idf/reference/log.md`.

## Layout

- `anim/`: the Remotion project (`npm ci`, then `npx remotion studio`). `src/Film04.tsx` is film 1.
- `films/NN-slug/`: one folder per film (story, upload sheet, small phone copy; film 1 also keeps its master).
- `shorts/NN-slug/`: one folder per Short.
- `channel/`: logo, banner, thumbnails, the channel's text.
- `design/`, `scripts/`, `FORMAT.md`: how the format and the characters were designed (19 Oct 2026).
