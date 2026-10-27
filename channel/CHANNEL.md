# The Devil You Feed (was Inner Devil Films)

- **Name:** The Devil You Feed. Renamed on 27 Oct 2026 from Inner Devil Films; Harshad chose the name.
- **Handle:** @TheDevilYouFeed (was @InnerDevilFilms; YouTube holds the old handle for 14 days in case we switch back).
- **Channel ID:** UCMWgThNed--oMhcPwyDKceA. It never changes, so tools check the ID, not the name.
- **Address:** https://www.youtube.com/@TheDevilYouFeed
- **Created 19 Oct 2026** as a Brand Account channel on hmunna36@gmail.com. Name and handle changes count against YouTube's limit of two in 14 days.
- **The idea (since 27 Oct 2026):** every bad habit has a devil. It whispers that it's fine, and every night you feed it, it gets closer. In every film, someone finally stops feeding it.
  - The films are animated horror shorts with no narration: extreme music and the devil's words on screen.
  - The first one is LUST | It Watches Back (aqiuimf3dCg, public 27 Oct 2026 22:30 IST), which is also the channel trailer for visitors who haven't subscribed.
  - The earlier Devil Mode films and Shorts are private.

## Banner and profile picture (27 Oct 2026)
- `banner.png` (2560 x 1440): the LUST devil's face on the right, and THE DEVIL / YOU FEED in fat white letters with a red edge, like the thumbnails. Under the name, the devil's whisper "shh… just one more." is in the film's pink italics.
  - Everything that matters sits in the part every device shows (x 507-2053, y 508-931).
  - Wide screens also show a second pair of eyes far off in the dark on the left.
  - `brand/preview_phone.png` is what a phone shows.
- `logo.png` (800 x 800): the devil's face close up, with its eyes and grin readable down to 48 px (`brand/preview_logo.png`).
- **Drawn in code with the LUST film engine:** `brand/brand.js` holds the drawings. `LUST_HTML=<the LUST film page> node brand/brand.mjs` loads the film page and writes both images.
- **Put live:** `brand/channel.mjs` uploads the banner, description and keywords through the API. The picture, name and handle can only be changed in Studio (Customisation, Profile).
- `brand/trailer.mjs <videoId> [time]` waits until a video is public, then makes it the trailer for new visitors.

## Description
Every bad habit has a devil. It whispers that it's fine. Just one more. And every night you listen, it gets a little closer.

The Devil You Feed makes animated horror short films about the things that feed on us in the dark: lust, gambling, doomscrolling, rage, the bottle. No narration, just the music and the devil's words. And in every film, someone finally stops feeding it.

Subscribe. It's already watching.

## Channel keywords
"the devil you feed" "animated short film" "horror short film" "horror animation" "bad habits" addiction lust "gambling addiction" doomscrolling "self improvement" motivation discipline dopamine "dark motivation" "inner demons" "short film" animation devil

## Thumbnails
- The film's topic word is the biggest thing, in huge fat white letters with a red edge. The hook sits small under it.
- The hook never names the devil: it is always "IT …" (LUST: "IT WATCHES"). If one ever has to name it, it is "THE DEVIL …", never a bare "Devil …".

## Before 27 Oct 2026
The channel was Inner Devil Films, built around Devil Mode (when the Angel's kind motivation fails, the Devil makes him act). Its Remotion logo and banner are in `anim/src/Brand.tsx` and in this folder's git history.
