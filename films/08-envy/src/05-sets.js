// ---- the sets: his desk (one boy, or a half of the split), drawn with M()/fig() so the right half is the left's mirror ----
// deskHalf(t, o): the desk seen from the front, the boy behind it at x 480 (the middle of the left half). Everything is
// given in left-half coordinates. o: green (the window's light instead of the lamp's), lamp 0..1, pinned (drawings on the
// board), q (how good), letter (NO, THANK YOU. pinned), pile (pages on the desk), bin (balls in the bin), pencil (behind
// his ear: false when it has been eaten), boy: figure options (expr, look, turn, tilt, lean, armL, armR, ...), before(f)
// and after(f): drawn behind the desk / in front of it, X: where the boy sits.
const DESK_Y = 690;
function deskHalf(t, o = {}) {
  const X = o.X ?? 480, green = o.green ? 1 : 0, lamp = o.lamp ?? 1;
  stageD(900, { pool: [M(X), 560, 560, green ? GREEN : LAMP, green ? .1 + .08 * (o.glowK ?? 1) : .18 * Math.max(.4, lamp)] });
  const bx = X - 220; boardD(SIDE > 0 ? bx : M(bx + 440), 140, 440, 280, o.pinned ?? 4, o.q ?? .5, { bare: o.pinned === 0, letter: o.letter });
  if (o.back) o.back();
  deskLampD(M(X - 340), DESK_Y, 210, lamp, SIDE);
  const f = fig({ kind: 'sam', x: X, y: 880, h: 470, expr: 'calm', look: [0, .3], noLegs: true, bendL: -.3, bendR: .3, stretch: true, t, glowSide: 1,
    glowOn: green ? [GREEN, .3 * (o.glowK ?? 1)] : lamp > .3 ? [LAMP, .18] : undefined, ...(o.boy || {}) });
  if (o.pencil !== false) earPencil(f, SIDE);
  if (o.before) o.before(f);
  if (o.pile) pileD(M(X + 270), DESK_Y, 120, o.pile);
  deskD(SIDE > 0 ? X - 400 : M(X + 400), SIDE > 0 ? X + 400 : M(X - 400), DESK_Y);
  if (o.bin != null) binD(M(X + 330), 900, 110, o.bin);
  if (o.after) o.after(f);
  return f;
}
// the window lying face down on the desk, green light leaking from under it (k: how much)
function windowDown(x, k = 1) { additive(() => { ctx.save(); ctx.translate(x, DESK_Y - 4); ctx.scale(1, .16); glow(GREEN, 0, 0, 230, .45 * k); ctx.restore(); });
  outlined(() => { ctx.beginPath(); ctx.rect(x - 118, DESK_Y - 13, 236, 11); }, rgba([22, 30, 26]), 3); stroke([[x - 112, DESK_Y - 2], [x + 112, DESK_Y - 2]], 3, rgba(GREEN_L, .7 * k)); }
// a page lying on the desk in front of him (seen from the front: a flat sliver) with the pencil working on it
function deskPage(x, k = 1) { outlined(() => { ctx.beginPath(); ctx.rect(x - 90, DESK_Y - 8, 180, 8); }, rgba(PAPER), 2); }
