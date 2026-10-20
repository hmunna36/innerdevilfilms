# Titles, descriptions, release times

## Release times (decided 20 Oct 2026, my call; Harshad said "you decide")

- **Shorts: every day at 20:00 IST.** Harshad chose 8 PM for film 1; it is evening in India and morning in the US.
- **Films: every Sunday at 19:00 New York time** (Monday 04:30 IST until 1 Nov, 05:30 IST after US clocks change).
  The two biggest recent films in this genre went out on a Sunday about 7 PM US Eastern: Day One Films'
  DISCIPLINE (Sun 27 Sep, now 4M+ views) and Monk Mode Films' LUST VS LOVE (Sun 18 Oct, 184K in its first day).
- The weekly film routine runs on Thursday, so a film has three days of slack; if the run fails, a re-run on
  Friday or Saturday still makes Sunday.
- `yt.mjs --schedule=auto` picks the slot; never schedule by hand unless a slot is taken.

## Film titles

`WORD | Hook line`: the topic word in capitals, then a short line in the past tense about him
(film 1: "TOMORROW | He Kept Saying It"). Under 50 characters. The word is the struggle as he says it to himself
("TOMORROW", "JUST ONE MORE", "LATER", "I'M FINE"), not the abstract noun ("Procrastination"). Never "Devil Mode".

## Film description

Two short lines of story (the stake and the turn, no spoilers of the cost or the twist), "When kindness stops
working, something else takes over.", "Subscribe for the next film.", then 5 hashtags
(`#animation #shortfilm #<topic> #motivation #innerdevil`). Tags: 10-12, as in `channel/UPLOAD.md`.

## YouTube settings (in publish.json)

`categoryId "1"` (Film & Animation), `language "en"`, `madeForKids false`, `syntheticMedia false` (the films are
hand-built animation, not AI-generated realistic footage), `notifySubscribers true`.
