#!/usr/bin/env python3
"""Character design v4 (19 Oct 2026): the reference channel's CONSTRUCTION, for cheap animation.

The user: "same as the reference channel. That kind of figure is easier to animate."
So every character is a handful of flat parts with no clothing detail:
  head   = one circle, dot eyes, a line mouth, eyelids for mood (no brows, nose or ears)
  body   = one rounded shape
  limbs  = plain tubes, round mitten hands, rounded shoes
Each part is a single shape on a two-bone rig, so a pose is a few angles and a head turn just slides
the face across the circle.

What stays ours (it costs nothing to animate): a three-stroke tuft of dark hair and a plain slate-blue
jumper (their hero is bald in a grey hoodie), and the shadow's AMBER rim, eyes and smile with a thread
tying it to the phone (theirs is pink, on a floor ring).

Run:  python3 -I v4_simple.py
"""
import math, subprocess, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import proper as P
import v3_flat as V
from v3_flat import Fig, render_hero, render_shadow, place, text, floor, swatch, desk_line, chair_line, phone_flat, embers, K

OUT = pathlib.Path(__file__).parent
V.FILL.update(skin="#f2e8da", knit="#5f7797", pants="#2c323d", shoe="#ececef", hair="#2a2430")
add, sub, mul, lerp, norm, perp, fmt = P.add, P.sub, P.mul, P.lerp, P.norm, P.perp, P.fmt

CIRCLE = "M0,-80 C44,-80 80,-44 80,0 C80,44 44,80 0,80 C-44,80 -80,44 -80,0 C-80,-44 -44,-80 0,-80 Z"
EXPR = {
    "neutral": dict(lid=.08, lx=0, ly=0, mc=3, mw=18, mo=0, es=1),
    "worn":    dict(lid=.55, lx=0, ly=2, mc=0, mw=14, mo=0, es=1, droop=True),
    "ashamed": dict(lid=.45, lx=-2, ly=6, mc=-5, mw=14, mo=0, es=.95, droop=True),
    "caught":  dict(lid=0, lx=0, ly=-1, mc=0, mw=10, mo=1, es=1.2),
    "tempted": dict(lid=.28, lx=6, ly=3, mc=4, mw=14, mo=0, es=1, asym=True),
    "decided": dict(lid=.36, lx=0, ly=0, mc=0, mw=18, mo=0, es=1, firm=True),
    "smile":   dict(lid=.3, lx=0, ly=0, mc=9, mw=26, mo=0, es=1),
}


def head(f, t, expr, tf, tuft=True):
    e = EXPR[expr]
    f.part(CIRCLE, "skin", tf)
    f.detail(V.shade(CIRCLE, 44 + 8 * t, 44, 60, 56, "#d9c9b3", .55), "", tf)
    if tuft:   # three strokes of dark hair at the crown, leaning back as he turns
        for bx, tx, ty in [(-12, -30 - 10 * t, -112), (-2, -12 - 10 * t, -122), (8, 6 - 8 * t, -114)]:
            f.part(P.tube((bx, -78), ((bx + tx) / 2 + 5, -98), (tx, ty), lambda u: 11 * (1 - u) + 2), "hair", tf)
    fx = 36 * t
    sp = 24 * (1 - 0.35 * t)
    eyes = [(fx - sp, 6), (fx + sp, 6)] if t <= 0.82 else [(fx + sp, 6)]
    hs, ss = [], []
    for ex, ey in eyes:
        es = e["es"]; cx, cy = ex + e["lx"], ey + e["ly"]
        hs.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{7.5*es:.1f}" ry="{9.5*es:.1f}" fill="{K["eye"]}"/>'
                  f'<circle cx="{cx-2.2:.1f}" cy="{cy-3.5:.1f}" r="{2.3*es:.1f}" fill="#fff"/>')
        lid = e["lid"]
        if lid > 0.02:
            top = ey - 12.5 * es; low = top + lid * 22 * es
            curve = 5 if e.get("droop") else 1.5
            hs.append(f'<path d="M{ex-11:.1f},{top-2:.1f} L{ex+11:.1f},{top-2:.1f} L{ex+11:.1f},{low:.1f} Q{ex:.1f},{low+curve:.1f} {ex-11:.1f},{low:.1f} Z" fill="#f2e8da"/>'
                      f'<path d="M{ex-9.5:.1f},{low+0.4:.1f} Q{ex:.1f},{low+curve:.1f} {ex+9.5:.1f},{low+0.4:.1f}" fill="none" stroke="{K["eye"]}" stroke-width="2.6" stroke-linecap="round"/>')
        ss.append(f'<path d="M{cx-12:.1f},{cy+1:.1f} Q{cx:.1f},{cy-10:.1f} {cx+12:.1f},{cy+1:.1f} Q{cx:.1f},{cy+6:.1f} {cx-12:.1f},{cy+1:.1f} Z" fill="{K["amber"]}" filter="url(#b3)"/>'
                  f'<path d="M{cx-11:.1f},{cy+1:.1f} Q{cx:.1f},{cy-8.5:.1f} {cx+11:.1f},{cy+1:.1f} Q{cx:.1f},{cy+5:.1f} {cx-11:.1f},{cy+1:.1f} Z" fill="{K["amber_core"]}"/>')
    mx, my, mw = fx + 3 + 6 * t, 36, e["mw"] * (1 - 0.3 * t)
    if e["mo"]:
        hs.append(f'<ellipse cx="{mx:.1f}" cy="{my+2:.1f}" rx="6" ry="7" fill="{K["mouth"]}"/>')
    else:
        y1 = my - (3 if e.get("asym") else 0)
        hs.append(f'<path d="M{mx-mw/2:.1f},{my:.1f} Q{mx:.1f},{my+e["mc"]:.1f} {mx+mw/2:.1f},{y1:.1f}" fill="none" '
                  f'stroke="{K["mouth"]}" stroke-width="{3.6 if e.get("firm") else 3.1}" stroke-linecap="round"/>')
    sw = 30 * (1 - 0.3 * t)
    smile = f"M{mx-sw/2:.1f},{my-2:.1f} Q{mx:.1f},{my+13:.1f} {mx+sw/2:.1f},{my-5:.1f}"
    ss.append(f'<path d="{smile}" fill="none" stroke="{K["amber"]}" stroke-width="7" stroke-linecap="round" filter="url(#b3)"/>'
              f'<path d="{smile}" fill="none" stroke="{K["amber_core"]}" stroke-width="3" stroke-linecap="round"/>')
    f.detail("".join(hs), "".join(ss), tf)


def body(f, top, bot, ws, wh):
    """One rounded shape: shoulders to hem. A single neckline stroke is the only detail."""
    u = norm(sub(bot, top)); n = perp(u)
    shL, shR = add(add(top, mul(n, ws / 2)), mul(u, 22)), add(sub(top, mul(n, ws / 2)), mul(u, 22))
    cL, cR = add(top, mul(n, ws / 2 - 30)), sub(top, mul(n, ws / 2 - 30))
    hL, hR = add(bot, mul(n, wh / 2)), sub(bot, mul(n, wh / 2))
    kL, kR = add(top, mul(n, ws / 2)), sub(top, mul(n, ws / 2))
    d = (f"M{fmt(cR)} L{fmt(cL)} Q{fmt(kL)} {fmt(shL)} L{fmt(hL)} Q{fmt(add(bot, mul(u, 8)))} {fmt(hR)} "
         f"L{fmt(shR)} Q{fmt(kR)} {fmt(cR)} Z")
    f.part(d, "knit")
    mid = lerp(top, bot, 0.55)
    f.detail(V.shade(d, mid[0] + ws * 0.34, mid[1], ws * 0.26, abs(bot[1] - top[1]) * 0.6, "#4a5f7c", .8))
    a, b = add(top, mul(n, 20)), sub(top, mul(n, 20))
    f.detail(f'<path d="M{fmt(a)} Q{fmt(add(top, mul(u, 14)))} {fmt(b)}" fill="none" stroke="{K["line"]}" stroke-width="2.4" stroke-linecap="round" opacity=".7"/>')


def limb(f, a, b, c, w0, w2, kind):
    if P.bend(a, b, c) < 28:
        f.part(P.tube(a, b, c, lambda u: w0 + (w2 - w0) * u), kind)
    else:
        w1 = (w0 + w2) / 2
        f.part(P.seg(a, b, w0, w1) + " " + P.seg(b, c, w1, w2), kind + "U")


def arm(f, sh, el, wr):
    d = norm(sub(wr, el))
    limb(f, sh, el, wr, 34, 30, "knit")
    hp = add(wr, mul(d, 8))
    ang = math.degrees(math.atan2(d[1], d[0]))
    f.part("M-13,0 C-13,-9 -7,-14 0,-14 C9,-14 15,-8 15,0 C15,9 8,14 0,14 C-8,14 -13,9 -13,0 Z", "skin",
           f"translate({hp[0]:.1f},{hp[1]:.1f}) rotate({ang:.1f})")


def leg(f, hp, kn, an, view):
    limb(f, hp, kn, an, 38, 33, "pants")
    x, y = an
    if view == "front":
        f.part(f"M{x-20},{y+20} C{x-22},{y-2} {x-12},{y-8} {x},{y-8} C{x+12},{y-8} {x+22},{y-2} {x+20},{y+20} Q{x},{y+26} {x-20},{y+20} Z", "shoe")
    else:
        f.part(f"M{x-18},{y+20} C{x-22},{y} {x-12},{y-8} {x},{y-8} C{x+14},{y-6} {x+38},{y+2} {x+42},{y+12} "
               f"C{x+45},{y+20} {x+40},{y+24} {x+30},{y+24} L{x-12},{y+24} Q{x-18},{y+24} {x-18},{y+20} Z", "shoe")


def build(pose, expr="neutral", arms=True, legs=True, tuft=True, tail_to=None, contact=True):
    p = V.POSES[pose]; f = Fig(); t = p["t"]; front = p["view"] == "front"
    if legs and contact:
        f.detail(f'<ellipse cx="{0 if front else 8}" cy="1" rx="{86 if front else 74}" ry="11" fill="url(#contact)"/>')
    if not front and arms:
        arm(f, p["shL"], p["elL"], p["wrL"])
    if legs:
        leg(f, p["hpL"], p["knL"], p["anL"], p["view"])
        leg(f, p["hpR"], p["knR"], p["anR"], p["view"])
    if tail_to is not None:
        V.tail(f, p["bot"], tail_to, p["wh"])
    body(f, p["top"], p["bot"], p["ws"], p["wh"])
    if front and arms:
        arm(f, p["shL"], p["elL"], p["wrL"]); arm(f, p["shR"], p["elR"], p["wrR"])
    hx, hy = p["head"]
    head(f, t, expr, f"translate({hx},{hy + 6}) rotate({p['tilt']})", tuft)
    if not front and arms:
        arm(f, p["shR"], p["elR"], p["wrR"])
    return f


def hero(pose, x, y, s=1.0, expr="neutral", flip=False, **kw):
    return place(render_hero(build(pose, expr, **kw)), x, y, s, flip)


def shadow(pose, x, y, s=1.0, flip=False, lean=0, opacity=1.0, **kw):
    kw.setdefault("legs", False)
    return place(render_shadow(build(pose, "smile", contact=False, **kw)), x, y, s, flip, lean, opacity)


# ------------------------------------------------------------------ sheets
def hero_sheet():
    V.D = V.Defs()
    W, H = 1920, 1500
    b = [text(80, 86, "OWEN  —  the hero (working name)", 42, "#ecebe4", "start", 600),
         text(80, 126, "Built like the reference's figure: a circle head, dot eyes, a line mouth, one body shape, tube limbs, "
              "mitten hands. Ours: a three-stroke tuft and a plain slate-blue jumper.", 22, "#8a8e98", "start")]
    FY = 690
    b.append(floor(60, 1100, FY))
    for i, (pn, lab, ex) in enumerate([("front", "front", "neutral"), ("tq", "three-quarter", "neutral"),
                                         ("side", "side", "neutral"), ("phone", "on the phone", "tempted")]):
        x = 190 + i * 250
        b.append(hero(pn, x, FY, 1.0, ex))
        if pn == "phone":
            b.append(f'<g transform="translate({x},{FY})"><g transform="rotate(-16 22 -258)">'
                     f'<rect x="8" y="-288" width="30" height="50" rx="6" fill="#141519" stroke="{K["line"]}" stroke-width="2.5"/>'
                     f'<rect x="12" y="-284" width="22" height="42" rx="3" fill="{K["amber"]}"/></g></g>')
            b.append(f'<ellipse cx="{x+30}" cy="{FY-270}" rx="60" ry="50" fill="{K["amber"]}" opacity=".16" filter="url(#b24)"/>')
        b.append(text(x, FY + 40, lab))
    b.append(text(1200, 196, "FACE", 24, "#ecebe4", "start", 600))
    b.append(text(1200, 226, "dot eyes and eyelids carry the mood; a line mouth; nothing else", 18, "#8a8e98", "start"))
    names = [("neutral", "neutral"), ("worn", "worn out"), ("ashamed", "ashamed"), ("caught", "caught"),
             ("tempted", "tempted"), ("decided", "decided")]
    for i, (e, lab) in enumerate(names):
        cx = 1320 + (i % 3) * 220; cy = 380 + (i // 3) * 250
        f = Fig(); head(f, 0.25 if e == "tempted" else 0.0, e, "")
        b.append(f'<g transform="translate({cx},{cy}) scale(.95)">{render_hero(f)}</g>')
        b.append(text(cx, cy + 112, lab, 20))
    FY2 = 1340
    b.append(floor(60, 1100, FY2))
    sx = 200
    b.append(chair_line(sx - 42, FY2))
    b.append(hero("seated", sx, FY2, 1.0, "tempted"))
    b.append(desk_line(sx + 70, sx + 330, FY2 - 150, 150))
    b.append(phone_flat(sx + 150, FY2 - 150, 0.9))
    b.append(text(sx + 110, FY2 + 40, "at the desk, tempted"))
    b.append(hero("losing", 580, FY2, 1.0, "ashamed"))
    b.append(text(630, FY2 + 40, "losing"))
    b.append(hero("decided", 930, FY2, 1.0, "decided"))
    b.append(text(930, FY2 + 40, "the test: he stands up"))
    b.append(text(1200, 930, "PARTS (the whole rig)", 24, "#ecebe4", "start", 600))
    parts = ["head circle + tuft (one group)  ·  2 eyes, 2 lids, 1 mouth",
             "body: one shape  ·  arms: 2 tubes + 2 mittens  ·  legs: 2 tubes + 2 shoes",
             "a pose = 8 joint angles; a head turn = the face slides across the circle",
             "flat fills, one soft shade, thin dark outlines"]
    for i, r in enumerate(parts):
        b.append(text(1200, 975 + i * 36, r, 20, "#8a8e98", "start"))
    sw = [(V.FILL["skin"], "skin  #f2e8da"), (V.FILL["knit"], "jumper  #5f7797"), (V.FILL["pants"], "trousers  #2c323d"),
          (V.FILL["shoe"], "shoes  #ececef"), (V.FILL["hair"], "tuft  #2a2430"), (K["amber"], "amber (only the shadow)")]
    for i, (col, nm) in enumerate(sw):
        b.append(swatch(1220 + (i % 2) * 330, 1150 + (i // 2) * 54, col, nm))
    return V.svg(W, H, "".join(b))


def shadow_sheet():
    V.D = V.Defs()
    W, H = 1920, 1380
    b = [text(80, 86, "THE PULL  —  the shadow (working name)", 42, K["amber"], "start", 600),
         text(80, 126, "The same simple figure as a black silhouette with an amber rim, lit eyes and a smile. "
              "No legs: below the waist it narrows into one thread tied to whatever feeds it.", 22, "#8a8e98", "start")]
    FY = 780
    b.append(floor(60, 1860, FY))
    b.append(phone_flat(320, FY)); b.append(V.wisp(318, FY - 8, 1.0)); b.append(embers(310, FY - 120, 50, 6, 1))
    b.append(phone_flat(770, FY))
    s2 = .62
    b.append(shadow("front", 640, FY - 140, s2, arms=False, tuft=False, tail_to=((770 - 640) / s2, 136 / s2)))
    b.append(embers(650, FY - 300, 70, 7, 2))
    b.append(phone_flat(1210, FY))
    s3 = .86
    b.append(shadow("tq", 1060, FY - 120, s3, tuft=False, tail_to=((1210 - 1060) / s3, 116 / s3)))
    b.append(embers(1080, FY - 380, 90, 9, 3))
    b.append(phone_flat(1770, FY))
    b.append(shadow("side", 1545, FY - 14, 1.0, tuft=True, tail_to=(1770 - 1545, 10)))
    b.append(hero("side", 1600, FY, 1.0, "worn"))
    b.append(embers(1570, FY - 400, 100, 10, 4))
    for i, (x, lab) in enumerate([(320, "1 · it wakes up"), (700, "2 · it finds a face"), (1120, "3 · it leans in"), (1600, "4 · it is him")]):
        b.append(text(x, FY + 42, lab, 22, K["amber"] if i == 3 else "#8a8e98"))
    b.append(text(80, 930, "HIM  /  IT", 24, "#ecebe4", "start", 600))
    f = Fig(); head(f, 0, "worn", ""); b.append(f'<g transform="translate(200,1080)">{render_hero(f)}</g>')
    f = Fig(); head(f, 0, "smile", ""); b.append(f'<g transform="translate(440,1080)">{render_shadow(f)}</g>')
    b.append(text(200, 1210, "him: dark eyes, tired")); b.append(text(440, 1210, "it: lit eyes, a smile", 22, K["amber"]))
    b.append(text(700, 930, "ITS VOICE", 24, "#ecebe4", "start", 600))
    b.append(text(700, 982, "just one look.", 34, K["amber"], "start", "Courier New", 700))
    b.append(text(700, 1028, "you've earned a minute.", 34, K["amber"], "start", "Courier New", 700))
    b.append(text(700, 1072, "amber typewriter, lowercase, typed on letter by letter next to it", 19, "#8a8e98", "start"))
    b.append(text(700, 1100, "the narrator is the opposite: white, sentence case, at the bottom", 19, "#8a8e98", "start"))
    rules = ["• same rig as Owen, drawn as a silhouette: no extra animation work",
             "• amber rim, eyes and smile; tied by a thread, no floor ring",
             "• it grows 1 → 4 as it wins; only at 4 does it get his tuft",
             "• when it loses, the thread goes slack and the glow dies"]
    for i, r in enumerate(rules):
        b.append(text(1250, 975 + i * 38, r, 20, "#8a8e98", "start"))
    return V.svg(W, H, "".join(b))


def frame():
    """Reuses the v3 room and swaps in the simple figures."""
    V.D = V.Defs()
    real_owen, real_pull = V.owen, V.pull
    V.owen = lambda pose, x, y, s=1.0, expr="neutral", flip=False, **kw: hero(pose, x, y, s, expr, flip, **kw)
    def _pull(pose, x, y, s=1.0, flip=False, lean=0, opacity=1.0, **kw):
        kw["tuft"] = kw.pop("cowlick", False)
        return shadow(pose, x, y, s, flip, lean, opacity, **kw)
    V.pull = _pull
    try:
        return V.frame()
    finally:
        V.owen, V.pull = real_owen, real_pull


if __name__ == "__main__":
    for name, fn in [("v4_01_hero", hero_sheet), ("v4_02_shadow", shadow_sheet), ("v4_03_frame", frame)]:
        f = OUT / f"{name}.svg"
        f.write_text(fn())
        subprocess.run(["rsvg-convert", "-o", str(OUT / f"{name}.png"), str(f)], check=True)
        print("wrote", name)
