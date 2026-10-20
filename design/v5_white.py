#!/usr/bin/env python3
"""Character design v5 (19 Oct 2026): the all-white figure.

The user showed a frame of the kind of figure they mean: a plain white body with thin dark outlines, the far
arm and leg a shade darker for depth, a circle head with dot eyes, simple brows and a line mouth, mitten
hands, round feet, and a greyscale world where colour only marks meaning. That construction is a stock
minimalist style, and it is the cheapest thing to animate, so Owen is now built exactly that way.

What keeps him OURS (none of it costs animation time): the three-stroke dark tuft (their hero is bald),
a bare neck (no scarf, no hood), his own face (short thin brows, no eye bags except when worn out), and the
shadow: black with an AMBER rim, lit eyes and a smile, tied by a thread to whatever feeds it.

Also folds in ChatGPT's five fixes from the v4 review: one fixed glow preset and no decorative embers in
ordinary shots; a silhouette test; four thread states with fixed meanings; (the 5-second rig test is the next
step, in Remotion); and a frame where the set recedes and only Owen, the phone and the shadow are bright.

Run:  python3 -I v5_white.py
"""
import math, subprocess, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import proper as P
import v3_flat as V
from v3_flat import Fig, render_hero, render_shadow, place, text, K

OUT = pathlib.Path(__file__).parent
add, sub, mul, lerp, norm, perp, fmt = P.add, P.sub, P.mul, P.lerp, P.norm, P.perp, P.fmt

WHITE, FAR, LINE = "#f2f1ed", "#babcc4", "#2a2b30"
V.K["line"] = LINE
V.FILL.update(skin=WHITE, far=FAR, hair="#25222a", tail=K["shadow"])

# greyscale world (colour only for meaning: amber = the pull, cool = the work he means to do)
G = dict(wall_top="#1c1d21", wall_bot="#26272c", floor="#1a1b1f", prop="#2c2d33", prop_line="#45474f",
         prop_far="#24252a", prop_far_line="#3a3b42", window="#2f3138", sky_top="#191b22", sky_bot="#2a2d36")

CIRCLE = "M0,-80 C44,-80 80,-44 80,0 C80,44 44,80 0,80 C-44,80 -80,44 -80,0 C-80,-44 -44,-80 0,-80 Z"
EXPR = {
    "neutral": dict(lid=.0, lx=0, ly=0, mc=2, mw=16, mo=0, es=1, bi=0, bo=0),
    "worn":    dict(lid=.42, lx=0, ly=2, mc=0, mw=14, mo=0, es=1, bi=2, bo=4, bags=True),
    "ashamed": dict(lid=.38, lx=-2, ly=6, mc=-5, mw=14, mo=0, es=.95, bi=-7, bo=3),
    "caught":  dict(lid=0, lx=0, ly=-1, mc=0, mw=10, mo=1, es=1.2, bi=-8, bo=-8),
    "tempted": dict(lid=.22, lx=6, ly=3, mc=4, mw=14, mo=0, es=1, bi=-1, bo=-5, asym=True),
    "decided": dict(lid=.3, lx=0, ly=0, mc=0, mw=18, mo=0, es=1, bi=5, bo=-1, firm=True),
    "smile":   dict(lid=.28, lx=0, ly=0, mc=9, mw=26, mo=0, es=1, bi=-3, bo=-1),
}


def head(f, t, expr, tf, tuft=True):
    e = EXPR[expr]
    f.part(CIRCLE, "skin", tf)
    f.detail(V.shade(CIRCLE, 46 + 8 * t, 46, 58, 54, "#cfd0d6", .7), "", tf)
    if tuft:   # one rigid group (ChatGPT's must-fix): same shape at every angle, it only slides back as he turns
        off = -8 * t
        for bx, tx, ty in [(-12, -30, -112), (-2, -12, -122), (8, 6, -114)]:
            f.part(P.tube((bx + off, -78), ((bx + tx) / 2 + 5 + off, -98), (tx + off, ty), lambda u: 11 * (1 - u) + 2), "hair", tf)
    fx = 36 * t
    sp = 25 * (1 - 0.35 * t)
    eyes = [(fx - sp, 6), (fx + sp, 6)] if t <= 0.82 else [(fx + sp, 6)]
    hs, ss = [], []
    for i, (ex, ey) in enumerate(eyes):
        side = -1 if (len(eyes) == 2 and i == 0) else 1
        es = e["es"]; cx, cy = ex + e["lx"], ey + e["ly"]
        hs.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{7*es:.1f}" ry="{8.5*es:.1f}" fill="#141217"/>'
                  f'<circle cx="{cx-2:.1f}" cy="{cy-3:.1f}" r="{2.1*es:.1f}" fill="#fff"/>')
        if e["lid"] > 0.02:
            top = ey - 11 * es; low = top + e["lid"] * 20 * es
            hs.append(f'<path d="M{ex-10:.1f},{top-2:.1f} L{ex+10:.1f},{top-2:.1f} L{ex+10:.1f},{low:.1f} Q{ex:.1f},{low+3:.1f} {ex-10:.1f},{low:.1f} Z" fill="{WHITE}"/>'
                      f'<path d="M{ex-8.5:.1f},{low+0.3:.1f} Q{ex:.1f},{low+3:.1f} {ex+8.5:.1f},{low+0.3:.1f}" fill="none" stroke="#141217" stroke-width="2.4" stroke-linecap="round"/>')
        if e.get("bags"):
            hs.append(f'<path d="M{ex-7:.1f},{ey+13:.1f} Q{ex:.1f},{ey+17:.1f} {ex+7:.1f},{ey+13:.1f}" fill="none" stroke="#9a9ba3" stroke-width="2" stroke-linecap="round"/>')
        bi, bo = e["bi"], e["bo"]
        if e.get("asym") and side == 1:
            bi, bo = -8, -9
        by = ey - 20
        inner = (ex - 7 * side, by + bi * 0.55); outer = (ex + 9 * side, by + bo * 0.55)
        mid = (ex + 1 * side, by - 2 + (bi + bo) * 0.22)
        bw = 5.2 if e.get("firm") else 4.4
        hs.append(f'<path d="{P.tube(inner, mid, outer, lambda u: bw - 1.8 * u)}" fill="#25222a"/>')
        ss.append(f'<path d="M{cx-12:.1f},{cy+1:.1f} Q{cx:.1f},{cy-10:.1f} {cx+12:.1f},{cy+1:.1f} Q{cx:.1f},{cy+6:.1f} {cx-12:.1f},{cy+1:.1f} Z" fill="{K["amber"]}" filter="url(#b3)"/>'
                  f'<path d="M{cx-11:.1f},{cy+1:.1f} Q{cx:.1f},{cy-8.5:.1f} {cx+11:.1f},{cy+1:.1f} Q{cx:.1f},{cy+5:.1f} {cx-11:.1f},{cy+1:.1f} Z" fill="{K["amber_core"]}"/>')
    mx, my, mw = fx + 3 + 6 * t, 36, e["mw"] * (1 - 0.3 * t)
    if e["mo"]:
        hs.append(f'<ellipse cx="{mx:.1f}" cy="{my+2:.1f}" rx="5.5" ry="6.5" fill="#3a2a2a"/>')
    else:
        y1 = my - (3 if e.get("asym") else 0)
        hs.append(f'<path d="M{mx-mw/2:.1f},{my:.1f} Q{mx:.1f},{my+e["mc"]:.1f} {mx+mw/2:.1f},{y1:.1f}" fill="none" '
                  f'stroke="#2a2326" stroke-width="{3.4 if e.get("firm") else 3}" stroke-linecap="round"/>')
    sw = 30 * (1 - 0.3 * t)
    smile = f"M{mx-sw/2:.1f},{my-2:.1f} Q{mx:.1f},{my+13:.1f} {mx+sw/2:.1f},{my-5:.1f}"
    ss.append(f'<path d="{smile}" fill="none" stroke="{K["amber"]}" stroke-width="7" stroke-linecap="round" filter="url(#b3)"/>'
              f'<path d="{smile}" fill="none" stroke="{K["amber_core"]}" stroke-width="3" stroke-linecap="round"/>')
    f.detail("".join(hs), "".join(ss), tf)


def body(f, top, bot, ws, wh):
    """One soft bean from shoulders to hips; no clothes."""
    u = norm(sub(bot, top)); n = perp(u)
    shL, shR = add(add(top, mul(n, ws / 2)), mul(u, 26)), add(sub(top, mul(n, ws / 2)), mul(u, 26))
    cL, cR = add(top, mul(n, ws / 2 - 34)), sub(top, mul(n, ws / 2 - 34))
    hL, hR = add(bot, mul(n, wh / 2)), sub(bot, mul(n, wh / 2))
    kL, kR = add(top, mul(n, ws / 2)), sub(top, mul(n, ws / 2))
    d = (f"M{fmt(cR)} L{fmt(cL)} Q{fmt(kL)} {fmt(shL)} L{fmt(hL)} Q{fmt(add(bot, mul(u, 16)))} {fmt(hR)} "
         f"L{fmt(shR)} Q{fmt(kR)} {fmt(cR)} Z")
    f.part(d, "skin")
    mid = lerp(top, bot, 0.55)
    f.detail(V.shade(d, mid[0] + ws * 0.36, mid[1], ws * 0.24, abs(bot[1] - top[1]) * 0.6, "#c6c7ce", .85))


def limb(f, a, b, c, w0, w2, kind):
    if P.bend(a, b, c) < 28:
        f.part(P.tube(a, b, c, lambda u: w0 + (w2 - w0) * u), kind)
    else:
        w1 = (w0 + w2) / 2
        f.part(P.seg(a, b, w0, w1) + " " + P.seg(b, c, w1, w2), kind + "U")


def arm(f, sh, el, wr, kind):
    d = norm(sub(wr, el))
    limb(f, sh, el, wr, 28, 25, kind)
    hp = add(wr, mul(d, 9))
    ang = math.degrees(math.atan2(d[1], d[0])) - 90
    tf = f"translate({hp[0]:.1f},{hp[1]:.1f}) rotate({ang:.1f})"
    f.part("M6,2 C15,0 18,9 13,15 C10,18 6,14 6,10 Z", kind, tf)                       # thumb
    f.part("M-11,-3 C-12,11 -9,21 0,22 C9,21 12,11 11,-3 Z", kind, tf)                 # mitten


def leg(f, hp, kn, an, view, kind):
    limb(f, hp, kn, an, 32, 28, kind)
    x, y = an
    if view == "front":
        f.part(f"M{x-17},{y+18} C{x-19},{y-2} {x-10},{y-7} {x},{y-7} C{x+10},{y-7} {x+19},{y-2} {x+17},{y+18} Q{x},{y+24} {x-17},{y+18} Z", kind)
    else:
        f.part(f"M{x-15},{y+18} C{x-19},{y} {x-10},{y-7} {x},{y-7} C{x+12},{y-5} {x+30},{y+2} {x+34},{y+11} "
               f"C{x+37},{y+19} {x+32},{y+23} {x+24},{y+23} L{x-10},{y+23} Q{x-15},{y+23} {x-15},{y+18} Z", kind)


def build(pose, expr="neutral", arms=True, legs=True, tuft=True, tail_to=None, contact=True):
    p = V.POSES[pose]; f = Fig(); t = p["t"]; front = p["view"] == "front"
    if legs and contact:
        f.detail(f'<ellipse cx="{0 if front else 8}" cy="1" rx="{80 if front else 70}" ry="10" fill="url(#contact)"/>')
    if not front and arms:
        arm(f, p["shL"], p["elL"], p["wrL"], "far")
    if legs:
        leg(f, p["hpL"], p["knL"], p["anL"], p["view"], "skin" if front else "far")
        leg(f, p["hpR"], p["knR"], p["anR"], p["view"], "skin")
    if tail_to is not None:
        V.tail(f, p["bot"], tail_to, p["wh"])
    body(f, p["top"], p["bot"], p["ws"] * 0.92, p["wh"] * 0.95)
    if front and arms:
        arm(f, p["shL"], p["elL"], p["wrL"], "skin"); arm(f, p["shR"], p["elR"], p["wrR"], "skin")
    hx, hy = p["head"]
    head(f, t, expr, f"translate({hx},{hy + 8}) rotate({p['tilt']})", tuft)
    if not front and arms:
        arm(f, p["shR"], p["elR"], p["wrR"], "skin")
    return f


def owen(pose, x, y, s=1.0, expr="neutral", flip=False, **kw):
    return place(render_hero(build(pose, expr, **kw)), x, y, s, flip)


def pull(pose, x, y, s=1.0, flip=False, lean=0, opacity=1.0, **kw):
    kw.setdefault("legs", False)
    return place(render_shadow(build(pose, "smile", contact=False, **kw)), x, y, s, flip, lean, opacity)


def silhouette(pose, x, y, s=1.0, **kw):
    """Flat black shape, no outline, no face: the silhouette test ChatGPT asked for."""
    f = build(pose, "neutral", contact=False, **kw)
    parts = "".join(V._wrap(f'<path d="{d}" fill="#111"/>', tf) for kind_, d, _, tf in [(e[0], e[1], e[2], e[3]) for e in f.e if e[0] == "part"])
    return place(parts, x, y, s)


def thread(a, b, state):
    """The four thread states and what they mean: slack (he is resisting), neutral, taut (it is winning),
    released (he has walked away: the thread parts and the glow dies)."""
    (x0, y0), (x1, y1) = a, b
    if state == "released":
        mx = (x0 + x1) / 2
        return (f'<path d="M{x0},{y0} Q{x0+20},{y0+40} {mx-26},{y1-6}" fill="none" stroke="{K["amber_dim"]}" stroke-width="2.4" stroke-dasharray="2 7" opacity=".7"/>'
                f'<path d="M{mx+26},{y1-6} Q{x1-10},{y1+4} {x1},{y1}" fill="none" stroke="{K["amber_dim"]}" stroke-width="2.4" opacity=".5"/>')
    sag = {"slack": 90, "neutral": 40, "taut": 0}[state]
    op = {"slack": .45, "neutral": .8, "taut": 1}[state]
    w = {"slack": 2.2, "neutral": 2.8, "taut": 3.6}[state]
    cx, cy = (x0 + x1) / 2, max(y0, y1) + sag
    d = f"M{x0},{y0} Q{cx},{cy} {x1},{y1}"
    glow = f'<path d="{d}" fill="none" stroke="{K["amber"]}" stroke-width="{w*4}" opacity="{op*.45}" filter="url(#b6)"/>' if state == "taut" else ""
    return glow + f'<path d="{d}" fill="none" stroke="{K["amber"]}" stroke-width="{w}" opacity="{op}" stroke-linecap="round"/>'


def phone_flat(x, y, s=1.0, lit=True):
    g = []
    if lit:
        g.append(f'<ellipse cx="{x}" cy="{y}" rx="{120*s}" ry="{20*s}" fill="url(#pool)"/>')
    g.append(f'<rect x="{x-30*s}" y="{y-8*s}" width="{60*s}" height="{8*s}" rx="{3*s}" fill="#18191d" stroke="{G["prop_line"]}" stroke-width="1.5"/>')
    if lit:
        g.append(f'<rect x="{x-26*s}" y="{y-9*s}" width="{52*s}" height="{2.6*s}" rx="1.3" fill="{K["amber_hi"]}"/>')
    return "".join(g)


def floor(x0, x1, y):
    return f'<rect x="{x0}" y="{y}" width="{x1-x0}" height="56" fill="{G["floor"]}"/><path d="M{x0},{y} H{x1}" stroke="{G["prop_far_line"]}" stroke-width="2"/>'


def card_bg(W, H):
    return (f'<linearGradient id="wallG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{G["wall_top"]}"/><stop offset="1" stop-color="{G["wall_bot"]}"/></linearGradient>'
            f'<rect width="{W}" height="{H}" fill="url(#wallG)"/>')


# ------------------------------------------------------------------ sheet 1: Owen
def hero_sheet():
    V.D = V.Defs()
    W, H = 1920, 1560
    b = [card_bg(W, H),
         text(80, 86, "OWEN  —  the hero (working name)", 42, "#ecebe4", "start", 600),
         text(80, 126, "The all-white figure: circle head, dot eyes, brows, a line mouth, one body shape, tube limbs, mitten hands, round feet; "
              "far limbs a shade darker.", 22, "#9a9ea8", "start"),
         text(80, 156, "His own marks: the three-stroke tuft and a bare neck (no scarf, no hood).", 22, "#9a9ea8", "start")]
    FY = 720
    b.append(floor(60, 1100, FY))
    for i, (pn, lab, ex) in enumerate([("front", "front", "neutral"), ("tq", "three-quarter", "neutral"),
                                         ("side", "side", "neutral"), ("phone", "on the phone", "tempted")]):
        x = 190 + i * 250
        b.append(owen(pn, x, FY, 1.0, ex))
        if pn == "phone":
            b.append(f'<g transform="translate({x},{FY})"><g transform="rotate(-16 22 -258)">'
                     f'<rect x="8" y="-288" width="30" height="50" rx="6" fill="#18191d" stroke="{LINE}" stroke-width="2.5"/>'
                     f'<rect x="12" y="-284" width="22" height="42" rx="3" fill="{K["amber"]}"/></g></g>')
            b.append(f'<ellipse cx="{x+30}" cy="{FY-270}" rx="60" ry="50" fill="{K["amber"]}" opacity=".16" filter="url(#b24)"/>')
        b.append(text(x, FY + 40, lab, 22, "#9a9ea8"))
    b.append(text(1200, 220, "FACE", 24, "#ecebe4", "start", 600))
    b.append(text(1200, 250, "short thin brows do the acting; eye bags only when he is worn out", 18, "#9a9ea8", "start"))
    names = [("neutral", "neutral"), ("worn", "worn out"), ("ashamed", "ashamed"), ("caught", "caught"),
             ("tempted", "tempted"), ("decided", "decided")]
    for i, (e, lab) in enumerate(names):
        cx = 1320 + (i % 3) * 220; cy = 400 + (i // 3) * 250
        f = Fig(); head(f, 0.25 if e == "tempted" else 0.0, e, "")
        b.append(f'<g transform="translate({cx},{cy}) scale(.95)">{render_hero(f)}</g>')
        b.append(text(cx, cy + 110, lab, 20, "#9a9ea8"))
    FY2 = 1360
    b.append(floor(60, 1100, FY2))
    sx = 200
    b.append(f'<g opacity=".8">{V.chair_line(sx - 42, FY2)}</g>')
    b.append(owen("seated", sx, FY2, 1.0, "tempted"))
    b.append(f'<g opacity=".8">{V.desk_line(sx + 70, sx + 330, FY2 - 150, 150)}</g>')
    b.append(phone_flat(sx + 150, FY2 - 150, 0.9))
    b.append(text(sx + 110, FY2 + 40, "at the desk, tempted", 22, "#9a9ea8"))
    b.append(owen("losing", 580, FY2, 1.0, "ashamed"))
    b.append(text(630, FY2 + 40, "losing", 22, "#9a9ea8"))
    b.append(owen("decided", 930, FY2, 1.0, "decided"))
    b.append(text(930, FY2 + 40, "the test: he stands up", 22, "#9a9ea8"))
    # silhouette test
    b.append(text(1200, 930, "SILHOUETTE TEST (black on light, no face)", 24, "#ecebe4", "start", 600))
    b.append(f'<rect x="1200" y="955" width="660" height="330" rx="10" fill="#d9dade"/>')
    for i, pn in enumerate(["front", "tq", "side", "decided"]):
        b.append(silhouette(pn, 1290 + i * 160, 1265, 0.62))
    b.append(text(1200, 1320, "the tuft and the bare neck read even as a black shape", 19, "#9a9ea8", "start"))
    b.append(text(1200, 1348, "whole rig: head + tuft, 2 eyes, 2 brows, mouth, body, 4 tubes, 2 mittens, 2 feet", 19, "#9a9ea8", "start"))
    return V.svg(W, H, "".join(b))


# ------------------------------------------------------------------ sheet 2: the Pull
def pull_sheet():
    V.D = V.Defs()
    W, H = 1920, 1440
    b = [card_bg(W, H),
         text(80, 86, "THE PULL  —  the shadow (working name)", 42, K["amber"], "start", 600),
         text(80, 126, "Owen's own rig as a black silhouette: amber rim, lit eyes, a smile. No legs: below the waist it narrows "
              "into one thread tied to whatever feeds it.", 22, "#9a9ea8", "start"),
         text(80, 156, "One glow preset everywhere; embers only at stage 4 and at the moment it wins.", 22, "#9a9ea8", "start")]
    FY = 780
    b.append(floor(60, 1860, FY))
    b.append(phone_flat(320, FY)); b.append(V.wisp(318, FY - 8, 1.0))
    b.append(phone_flat(770, FY))
    s2 = .62
    b.append(pull("front", 640, FY - 140, s2, arms=False, tuft=False, tail_to=((770 - 640) / s2, 136 / s2)))
    b.append(phone_flat(1210, FY))
    s3 = .86
    b.append(pull("tq", 1060, FY - 120, s3, tuft=False, tail_to=((1210 - 1060) / s3, 116 / s3)))
    b.append(phone_flat(1770, FY))
    b.append(pull("side", 1545, FY - 14, 1.0, tuft=True, tail_to=(1770 - 1545, 10)))
    b.append(owen("side", 1600, FY, 1.0, "worn"))
    b.append(V.embers(1570, FY - 400, 100, 8, 4))
    for i, (x, lab) in enumerate([(320, "1 · it wakes up"), (700, "2 · it finds a face"), (1120, "3 · it leans in"), (1600, "4 · it is him")]):
        b.append(text(x, FY + 42, lab, 22, K["amber"] if i == 3 else "#9a9ea8"))
    # thread states
    b.append(text(80, 940, "THE THREAD: FOUR STATES, FIXED MEANINGS", 24, "#ecebe4", "start", 600))
    states = [("slack", "slack: he is resisting"), ("neutral", "neutral: it is waiting"),
              ("taut", "taut: it is winning"), ("released", "released: he walked away")]
    for i, (st, lab) in enumerate(states):
        x0 = 100 + i * 440
        b.append(f'<circle cx="{x0}" cy="1010" r="9" fill="{K["shadow"]}" stroke="{K["amber"]}" stroke-width="2.5"/>')
        b.append(thread((x0 + 8, 1012), (x0 + 330, 1030), st))
        b.append(phone_flat(x0 + 350, 1036, 0.7, lit=(st != "released")))
        b.append(text(x0, 1110, lab, 20, "#9a9ea8", "start"))
    # faces + voice
    b.append(text(80, 1190, "HIM  /  IT", 24, "#ecebe4", "start", 600))
    f = Fig(); head(f, 0, "worn", ""); b.append(f'<g transform="translate(200,1310) scale(.8)">{render_hero(f)}</g>')
    f = Fig(); head(f, 0, "smile", ""); b.append(f'<g transform="translate(400,1310) scale(.8)">{render_shadow(f)}</g>')
    b.append(text(700, 1190, "ITS VOICE", 24, "#ecebe4", "start", 600))
    b.append(text(700, 1240, "just one look.", 34, K["amber"], "start", "Courier New", 700))
    b.append(text(700, 1286, "you've earned a minute.", 34, K["amber"], "start", "Courier New", 700))
    b.append(text(700, 1330, "amber typewriter, lowercase, typed on letter by letter next to it", 19, "#9a9ea8", "start"))
    b.append(text(1250, 1240, "• same rig as Owen: no extra animation work", 20, "#9a9ea8", "start"))
    b.append(text(1250, 1278, "• only at stage 4 does it get his tuft (the reveal)", 20, "#9a9ea8", "start"))
    b.append(text(1250, 1316, "• the thread is a pull, never a tail or a leash", 20, "#9a9ea8", "start"))
    return V.svg(W, H, "".join(b))


# ------------------------------------------------------------------ sheet 3: a frame of JUST ONE MORE
def frame():
    V.D = V.Defs()
    W, H = 1920, 1080
    FY, DT = 860, 700
    b = [card_bg(W, H), f'<rect y="{FY}" width="{W}" height="{H-FY}" fill="{G["floor"]}"/>',
         f'<path d="M0,{FY} H{W}" stroke="{G["prop_far_line"]}" stroke-width="2"/>']
    pf, pl = G["prop_far"], G["prop_far_line"]          # the set recedes: low contrast everywhere
    # window
    wx, wy, ww, wh = 230, 210, 380, 300
    b.append(f'<linearGradient id="skyG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{G["sky_top"]}"/><stop offset="1" stop-color="{G["sky_bot"]}"/></linearGradient>')
    b.append(f'<rect x="{wx}" y="{wy}" width="{ww}" height="{wh}" rx="10" fill="url(#skyG)" stroke="{pl}" stroke-width="3"/>')
    import random
    r = random.Random(5); bx = wx + 6
    while bx < wx + ww - 10:
        bw_ = min(r.randint(34, 64), wx + ww - 6 - bx); bh = r.randint(60, 160)
        b.append(f'<rect x="{bx}" y="{wy+wh-bh}" width="{bw_}" height="{bh-3}" fill="#1b1c22"/>')
        for yy in range(wy + wh - bh + 12, wy + wh - 10, 16):
            for xx in range(bx + 6, bx + bw_ - 6, 12):
                if r.random() < .16:
                    b.append(f'<rect x="{xx}" y="{yy}" width="4" height="6" fill="#8b8f99" opacity=".55"/>')
        bx += bw_ + 4
    b.append(f'<path d="M{wx+ww/2},{wy} v{wh} M{wx},{wy+wh/2} h{ww}" stroke="{pl}" stroke-width="3"/>')
    # clock at 9:00 (the hands are the brightest thing on the wall: it is the test's time)
    b.append(f'<circle cx="1560" cy="250" r="58" fill="{pf}" stroke="{pl}" stroke-width="3"/>')
    for k in range(12):
        a = math.radians(k * 30)
        b.append(f'<path d="M{1560+44*math.sin(a):.1f},{250-44*math.cos(a):.1f} L{1560+50*math.sin(a):.1f},{250-50*math.cos(a):.1f}" stroke="{pl}" stroke-width="2.5"/>')
    b.append(f'<path d="M1560,250 V212 M1560,250 H1530" stroke="#c9ccd3" stroke-width="4" stroke-linecap="round"/>')
    # shelf
    b.append(f'<rect x="1150" y="400" width="300" height="10" rx="3" fill="{pf}" stroke="{pl}" stroke-width="2.5"/>')
    bx = 1168
    for hh, ww_ in [(70, 20), (84, 16), (64, 24), (78, 15), (88, 22)]:
        b.append(f'<rect x="{bx}" y="{400-hh}" width="{ww_}" height="{hh}" rx="2" fill="{pf}" stroke="{pl}" stroke-width="2.2"/>'); bx += ww_ + 4
    # desk + drawers + lamp + laptop (cool: the work)
    b.append(f'<rect x="760" y="{DT}" width="760" height="14" rx="3" fill="{G["prop"]}" stroke="{G["prop_line"]}" stroke-width="2.5"/>'
             f'<path d="M774,{DT+14} V{FY} M1506,{DT+14} V{FY}" stroke="{pl}" stroke-width="2.5"/>'
             f'<rect x="1320" y="{DT+14}" width="186" height="{FY-DT-14}" fill="{pf}" stroke="{pl}" stroke-width="2.5"/>'
             f'<path d="M1320,{DT+82} h186" stroke="{pl}" stroke-width="2.5"/>')
    b.append(f'<path d="M1470,{DT} h-46 M1447,{DT} L1470,570 L1424,478" fill="none" stroke="{pl}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
             f'<path d="M1402,462 L1464,462 L1480,500 L1398,500 Z" fill="{pf}" stroke="{pl}" stroke-width="2.5" transform="rotate(-24 1438 480)"/>')
    b.append(f'<rect x="1080" y="{DT-10}" width="200" height="10" rx="3" fill="{G["prop"]}" stroke="{G["prop_line"]}" stroke-width="2.2"/>'
             f'<path d="M1090,{DT-10} L1054,{DT-160} L1110,{DT-168} L1144,{DT-12} Z" fill="#aebbd2" stroke="{G["prop_line"]}" stroke-width="2.2"/>'
             f'<path d="M1064,{DT-150} h36 M1068,{DT-138} h40 M1072,{DT-126} h26" stroke="#7f8da6" stroke-width="3"/>'
             f'<ellipse cx="1040" cy="{DT-96}" rx="110" ry="84" fill="{K["cool"]}" opacity=".05" filter="url(#b24)"/>')
    # chair, Owen, phone, the Pull (stage 3), its words
    b.append(f'<g opacity=".85">{V.chair_line(560, FY, seat=90, back=170, w=84)}</g>')
    px = 900
    b.append(phone_flat(px, DT, 1.1))
    b.append(owen("seated", 604, FY, 1.12, "tempted"))
    b.append(f'<ellipse cx="760" cy="520" rx="70" ry="80" fill="{K["amber"]}" opacity=".08" filter="url(#b24)"/>')
    ox, oy, s3 = 846, 812, 0.86
    b.append(pull("tq", ox, oy, s3, flip=True, lean=-10, tuft=False, tail_to=(-(px - ox) / s3, (DT - 4 - oy) / s3)))
    b.append(text(940, 372, "it could be important.", 38, K["amber"], "start", "Courier New", 700))
    # the counter (top right) and the narrator line
    b.append(text(1830, 84, "MINUTES LOST", 20, "#8d919b", "end", "Menlo", 400))
    b.append(text(1830, 140, "07", 54, K["amber"], "end", "Menlo", 700))
    b.append("".join(f'<rect x="{1590 + k*4}" y="160" width="2.6" height="12" fill="{K["amber"] if k < 7 else "#34363d"}"/>' for k in range(60)))
    b.append(text(W / 2, 1000, "He gave himself one hour.", 32, "#ecebe4"))
    b.append(f'<rect width="{W}" height="{H}" fill="url(#vig)"/>')
    return V.svg(W, H, "".join(b))


if __name__ == "__main__":
    for name, fn in [("v5_01_hero", hero_sheet), ("v5_02_pull", pull_sheet), ("v5_03_frame", frame)]:
        f = OUT / f"{name}.svg"
        f.write_text(fn())
        subprocess.run(["rsvg-convert", "-o", str(OUT / f"{name}.png"), str(f)], check=True)
        print("wrote", name)
