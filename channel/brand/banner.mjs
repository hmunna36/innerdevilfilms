// Puts ONLY the banner live through the YouTube Data API (description and keywords are sent back unchanged).
// usage: node banner.mjs <banner.png>   (2560x1440, under 6 MB). Same credentials as yt.mjs; prints no secret.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const ID = 'UCMWgThNed--oMhcPwyDKceA', file = process.argv[2];
if (!file || !fs.existsSync(file)) { console.log('usage: node banner.mjs <banner.png>'); process.exit(1); }
const cj = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/va/youtube-client.json'), 'utf8')), c = cj.installed ?? cj.web ?? cj;
const { refresh_token } = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/idf/youtube-token.json'), 'utf8'));
const tok = await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ client_id: c.client_id, client_secret: c.client_secret, refresh_token, grant_type: 'refresh_token' }) })).json();
if (!tok.access_token) { console.log('token refresh failed:', tok.error); process.exit(1); }
const H = { Authorization: `Bearer ${tok.access_token}` }, API = 'https://www.googleapis.com/youtube/v3';
const get = async () => (await (await fetch(`${API}/channels?part=snippet,brandingSettings&mine=true`, { headers: H })).json()).items?.[0];
const cur = await get();
if (cur?.id !== ID) { console.log(`refusing: the token is for ${cur?.id ?? 'no channel'}, not ${ID}`); process.exit(1); }
const up = await fetch('https://www.googleapis.com/upload/youtube/v3/channelBanners/insert?uploadType=media', { method: 'POST', headers: { ...H, 'Content-Type': 'image/png' }, body: fs.readFileSync(file) });
const bj = await up.json();
if (!up.ok) { console.log(`banner upload failed ${up.status}: ${JSON.stringify(bj).slice(0, 300)}`); process.exit(1); }
const channel = { ...cur.brandingSettings.channel }; delete channel.title;
const r = await fetch(`${API}/channels?part=brandingSettings`, { method: 'PUT', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify({ id: ID, brandingSettings: { channel, image: { bannerExternalUrl: bj.url } } }) });
const rj = await r.json();
if (!r.ok) { console.log(`update failed ${r.status}: ${JSON.stringify(rj).slice(0, 400)}`); process.exit(1); }
const now = await get(), same = k => now.brandingSettings.channel[k] === cur.brandingSettings.channel[k];
console.log(`"${now.snippet.title}": banner ${now.brandingSettings.image?.bannerExternalUrl !== cur.brandingSettings.image?.bannerExternalUrl ? 'CHANGED' : 'unchanged?'}, description ${same('description') ? 'kept' : 'DIFFERENT'}, keywords ${same('keywords') ? 'kept' : 'DIFFERENT'}, trailer ${same('unsubscribedTrailer') ? 'kept' : 'DIFFERENT'}`);
console.log(now.brandingSettings.image?.bannerExternalUrl);
