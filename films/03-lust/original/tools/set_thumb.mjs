// Swap the thumbnail of a video on The Devil You Feed (was Inner Devil Films):  node set_thumb.mjs <videoId> <image.jpg|png>
// Uses the same credentials as the repo's yt.mjs (~/.config/va/youtube-client.json + ~/.config/idf/youtube-token.json); prints no secret.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const [id, file] = process.argv.slice(2);
if (!id || !file) { console.log('usage: node set_thumb.mjs <videoId> <image>'); process.exit(2); }
const cj = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/va/youtube-client.json'), 'utf8')), c = cj.installed ?? cj.web ?? cj;
const { refresh_token } = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/idf/youtube-token.json'), 'utf8'));
const t = await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: new URLSearchParams({ client_id: c.client_id, client_secret: c.client_secret, refresh_token, grant_type: 'refresh_token' }) })).json();
if (!t.access_token) { console.log('token refresh failed:', t.error); process.exit(1); }
const ch = await (await fetch('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true', { headers: { Authorization: `Bearer ${t.access_token}` } })).json();
if (ch.items?.[0]?.id !== 'UCMWgThNed--oMhcPwyDKceA') { console.log('refusing: the token is not for The Devil You Feed'); process.exit(1); }   // by ID: names change
const img = fs.readFileSync(file);
if (img.length > 2e6) { console.log('refusing: over 2 MB'); process.exit(1); }
const r = await fetch(`https://www.googleapis.com/upload/youtube/v3/thumbnails/set?videoId=${id}&uploadType=media`, {
  method: 'POST', headers: { Authorization: `Bearer ${t.access_token}`, 'Content-Type': file.endsWith('.png') ? 'image/png' : 'image/jpeg' }, body: img });
const j = await r.json();
console.log(r.ok ? `thumbnail set on ${id}: ${j.items?.[0]?.maxres?.url ?? j.items?.[0]?.high?.url ?? 'ok'}` : `failed ${r.status}: ${JSON.stringify(j).slice(0, 200)}`);
