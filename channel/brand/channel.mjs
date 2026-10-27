// Puts the channel's banner, description and keywords live through the YouTube Data API (the profile picture,
// name and handle can only be changed in Studio).   usage: node channel.mjs [--title]   (--title also tries the name)
// Uses the same credentials as the repo's yt.mjs; prints no secret; checks the channel by ID, which survives renames.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const ID = 'UCMWgThNed--oMhcPwyDKceA', NAME = 'The Devil You Feed', here = path.dirname(new URL(import.meta.url).pathname);
const DESCRIPTION = `Every bad habit has a devil. It whispers that it's fine. Just one more. And every night you listen, it gets a little closer.

The Devil You Feed makes animated horror short films about the things that feed on us in the dark: lust, gambling, doomscrolling, rage, the bottle. No narration, just the music and the devil's words. And in every film, someone finally stops feeding it.

Subscribe. It's already watching.`;
const KEYWORDS = '"the devil you feed" "animated short film" "horror short film" "horror animation" "bad habits" addiction lust "gambling addiction" doomscrolling "self improvement" motivation discipline dopamine "dark motivation" "inner demons" "short film" animation devil';
const cj = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/va/youtube-client.json'), 'utf8')), c = cj.installed ?? cj.web ?? cj;
const { refresh_token } = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/idf/youtube-token.json'), 'utf8'));
const tok = await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ client_id: c.client_id, client_secret: c.client_secret, refresh_token, grant_type: 'refresh_token' }) })).json();
if (!tok.access_token) { console.log('token refresh failed:', tok.error); process.exit(1); }
const H = { Authorization: `Bearer ${tok.access_token}` }, API = 'https://www.googleapis.com/youtube/v3';
const get = async () => (await (await fetch(`${API}/channels?part=snippet,brandingSettings&mine=true`, { headers: H })).json()).items?.[0];
const cur = await get();
if (cur?.id !== ID) { console.log(`refusing: the token is for ${cur?.id ?? 'no channel'}, not ${ID}`); process.exit(1); }
console.log(`before: "${cur.snippet.title}", keywords ${JSON.stringify(cur.brandingSettings.channel.keywords ?? '')}`);
if (DESCRIPTION.length > 1000 || KEYWORDS.length > 500) { console.log('refusing: description or keywords too long'); process.exit(1); }
// 1. the banner: upload it, then point the channel at it
const img = fs.readFileSync(path.join(here, 'banner.png'));
const up = await fetch('https://www.googleapis.com/upload/youtube/v3/channelBanners/insert?uploadType=media', { method: 'POST', headers: { ...H, 'Content-Type': 'image/png' }, body: img });
const bj = await up.json();
if (!up.ok) { console.log(`banner upload failed ${up.status}: ${JSON.stringify(bj).slice(0, 300)}`); process.exit(1); }
// channels.update replaces the whole brandingSettings part, so everything it had is sent back
const channel = { ...cur.brandingSettings.channel, description: DESCRIPTION, keywords: KEYWORDS };
if (process.argv.includes('--title')) channel.title = NAME; else delete channel.title;
const body = { id: ID, brandingSettings: { channel, image: { bannerExternalUrl: bj.url } } };
const r = await fetch(`${API}/channels?part=brandingSettings`, { method: 'PUT', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const rj = await r.json();
if (!r.ok) { console.log(`update failed ${r.status}: ${JSON.stringify(rj).slice(0, 400)}`); process.exit(1); }
const now = await get();
console.log(`after: "${now.snippet.title}", banner ${now.brandingSettings.image?.bannerExternalUrl ? 'set' : 'missing'}, description ${now.brandingSettings.channel.description === DESCRIPTION ? 'set' : 'NOT set'}, keywords ${now.brandingSettings.channel.keywords === KEYWORDS ? 'set' : JSON.stringify(now.brandingSettings.channel.keywords)}`);
