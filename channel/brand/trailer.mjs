// Waits until a video is public, then makes it the channel trailer for people who haven't subscribed.
// usage: node trailer.mjs <videoId> [notBefore ISO time]   (polls once a minute for up to 40 minutes after notBefore)
// Uses the same credentials as the repo's yt.mjs; prints no secret; resends every brandingSettings field it had.
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
const ID = 'UCMWgThNed--oMhcPwyDKceA', API = 'https://www.googleapis.com/youtube/v3';
const [vid, notBefore] = process.argv.slice(2);
if (!vid) { console.log('usage: node trailer.mjs <videoId> [notBefore]'); process.exit(2); }
const sleep = ms => new Promise(r => setTimeout(r, ms)), ist = d => new Date(d).toLocaleString('en-GB', { timeZone: 'Asia/Kolkata' });
const cj = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/va/youtube-client.json'), 'utf8')), c = cj.installed ?? cj.web ?? cj;
const { refresh_token } = JSON.parse(fs.readFileSync(path.join(os.homedir(), '.config/idf/youtube-token.json'), 'utf8'));
async function headers() {
  const t = await (await fetch('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ client_id: c.client_id, client_secret: c.client_secret, refresh_token, grant_type: 'refresh_token' }) })).json();
  if (!t.access_token) { console.log('token refresh failed:', t.error); process.exit(1); }
  return { Authorization: `Bearer ${t.access_token}` };
}
if (notBefore && Date.parse(notBefore) > Date.now()) { console.log(`waiting until ${ist(notBefore)} IST`); await sleep(Date.parse(notBefore) - Date.now()); }
let v;
for (let i = 0; i < 40; i++) {
  v = (await (await fetch(`${API}/videos?part=status,snippet&id=${vid}`, { headers: await headers() })).json()).items?.[0];
  if (v?.status?.privacyStatus === 'public') break;
  await sleep(60000);
}
if (v?.status?.privacyStatus !== 'public') { console.log(`${vid} is still ${v?.status?.privacyStatus ?? 'missing'}; trailer not set`); process.exit(1); }
console.log(`${vid} "${v.snippet.title}" is public (${ist(v.snippet.publishedAt)} IST)`);
const H = await headers();
const cur = (await (await fetch(`${API}/channels?part=brandingSettings&mine=true`, { headers: H })).json()).items?.[0];
if (cur?.id !== ID) { console.log('refusing: wrong channel'); process.exit(1); }
const channel = { ...cur.brandingSettings.channel, unsubscribedTrailer: vid }; delete channel.title;
const body = { id: ID, brandingSettings: { channel, ...(cur.brandingSettings.image?.bannerExternalUrl ? { image: { bannerExternalUrl: cur.brandingSettings.image.bannerExternalUrl } } : {}) } };
const r = await fetch(`${API}/channels?part=brandingSettings`, { method: 'PUT', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
if (!r.ok) { console.log(`trailer update failed ${r.status}: ${(await r.text()).slice(0, 300)}`); process.exit(1); }
const now = (await (await fetch(`${API}/channels?part=brandingSettings&mine=true`, { headers: H })).json()).items[0].brandingSettings;
console.log(`trailer for new visitors: ${now.channel.unsubscribedTrailer ?? 'NOT set'}; banner ${now.image?.bannerExternalUrl ? 'still set' : 'MISSING'}; description ${now.channel.description?.startsWith('Every bad habit') ? 'still set' : 'CHANGED'}`);
