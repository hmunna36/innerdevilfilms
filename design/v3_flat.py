#!/usr/bin/env python3
"""Character design v3 (19 Oct 2026): the reference channel's LOOK, with our own characters.

The user, after v1 (outline only, "it should be proper") and v2 (shaded, "it should be similiar to the
reference channel"): flat minimal 2D, a big round head on a small body, thin dark outlines, a near-black
stage with thin line-art furniture, and a dark shadow double with a glowing rim.

What stays ours, so it is the same genre and not a copy of their two characters:
  - Owen has hair (a dark mop with a three-strand cowlick) and a slate-blue roll-neck jumper;
    their hero is a bald cream head in a grey hoodie.
  - the Pull's rim, eyes and smile are AMBER (theirs are pink), and it has no floor ring: below the waist
    it tapers into one thread tied to the thing that feeds it (the phone in film 1).

Run:  python3 -I v3_flat.py
"""
import math, random, subprocess, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))   # -I drops the script's folder from the path
import proper as P          # geometry helpers: tube, seg, vector maths, the hair outline

OUT = pathlib.Path(__file__).parent
K = dict(bg="#0b0b0d", line="#131317",
         skin="#f3e3ce", skin_sh="#d6bfa2", lid="#e9d4ba", hair="#29232d", knit="#657d9c", knit_sh="#4b5f7c", rib="#566c8a",
         pants="#2e3440", pants_sh="#1f242d", shoe="#e7e7ea", sole="#c9c9cf", eye="#121014", mouth="#5d3d37",
         amber="#f2a33a", amber_hi="#ffd690", amber_core="#fff1cf", amber_dim="#8a5216", shadow="#070709",
         cool="#cfe0ff", set_fill="#111217", set_line="#3b3e47", set_line2="#2a2d35")
FILL = dict(skin=K["skin"], hair=K["hair"], knit=K["knit"], rib=K["rib"], pants=K["pants"], shoe=K["shoe"],
            sole=K["sole"], tail=K["shadow"])

STATIC = f"""
<radialGradient id="pool" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="{K['amber']}" stop-opacity=".55"/><stop offset=".5" stop-color="{K['amber']}" stop-opacity=".15"/><stop offset="1" stop-color="{K['amber']}" stop-opacity="0"/></radialGradient>
<radialGradient id="poolCool" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="{K['cool']}" stop-opacity=".3"/><stop offset="1" stop-color="{K['cool']}" stop-opacity="0"/></radialGradient>
<radialGradient id="contact" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#000" stop-opacity=".7"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx="50%" cy="46%" r="72%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".7"/></radialGradient>
<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1222"/><stop offset="1" stop-color="#1e2d4a"/></linearGradient>
<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e0f13"/><stop offset="1" stop-color="#15161b"/></linearGradient>
<filter id="b3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="b6" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="b10" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10"/></filter>
<filter id="b24" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="24"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .045 0"/></filter>
"""


class Defs:
    def __init__(self):
        self.items, self.n = [], 0

    def clip(self, d):
        self.n += 1
        self.items.append(f'<clipPath id="k{self.n}"><path d="{d}"/></clipPath>')
        return f"url(#k{self.n})"

    def svg(self):
        return "<defs>" + STATIC + "".join(self.items) + "</defs>"


D = Defs()
add, sub, mul, lerp, norm, perp, fmt = P.add, P.sub, P.mul, P.lerp, P.norm, P.perp, P.fmt


# ------------------------------------------------------------------ a figure is an ordered list of parts
class Fig:
    """Parts (closed paths with a material) and details (face, rib lines, shading) in draw order.
    The same list renders as Owen (flat fills, thin dark outlines) or as the Pull (one black silhouette
    with an amber rim: outline pass, then fill pass, so inner edges disappear)."""
    def __init__(self):
        self.e = []

    def part(self, d, kind, tf=""):
        self.e.append(("part", d, kind, tf))

    def detail(self, hero_svg, shadow_svg="", tf=""):
        self.e.append(("detail", hero_svg, shadow_svg, tf))


def _wrap(s, tf):
    return f'<g transform="{tf}">{s}</g>' if tf else s


def render_hero(f):
    out = []
    for e in f.e:
        if e[0] == "part":
            _, d, kind, tf = e
            if kind.endswith("U"):      # a limb made of two tubes: outline pass + fill pass = no seam
                k = kind[:-1]
                s = (f'<path d="{d}" fill="{K["line"]}" stroke="{K["line"]}" stroke-width="6" stroke-linejoin="round"/>'
                     f'<path d="{d}" fill="{FILL[k]}"/>')
            else:
                s = f'<path d="{d}" fill="{FILL[kind]}" stroke="{K["line"]}" stroke-width="3" stroke-linejoin="round"/>'
            out.append(_wrap(s, tf))
        else:
            out.append(_wrap(e[1], e[3]))
    return "".join(out)


def render_shadow(f, rim=3.0, glow=True):
    parts = [e for e in f.e if e[0] == "part"]
    out = []
    if glow:
        out.append('<g filter="url(#b10)" opacity=".8">' + "".join(
            _wrap(f'<path d="{d}" fill="none" stroke="{K["amber"]}" stroke-width="16" stroke-linejoin="round"/>', tf)
            for _, d, _, tf in parts) + "</g>")
    out.append("".join(_wrap(f'<path d="{d}" fill="{K["amber"]}" stroke="{K["amber"]}" stroke-width="{rim*2}" stroke-linejoin="round"/>', tf)
                       for _, d, _, tf in parts))
    out.append("".join(_wrap(f'<path d="{d}" fill="{K["shadow"]}"/>', tf) for _, d, _, tf in parts))
    for e in f.e:
        if e[0] == "detail" and e[2]:
            out.append(_wrap(e[2], e[3]))
    return "".join(out)


def shade(d, cx, cy, rx, ry, col, op, blur="b10"):
    cp = D.clip(d)
    return (f'<g clip-path="{cp}"><ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" fill="{col}" '
            f'opacity="{op}" filter="url(#{blur})"/></g>')


# ------------------------------------------------------------------ head
SKULL = "M0,-77 C45,-77 80,-44 80,0 C80,45 45,77 0,77 C-45,77 -80,45 -80,0 C-80,-44 -45,-77 0,-77 Z"
EXPR = {
    "neutral": dict(bi=0, bo=0, by=0, lid=.1, lx=0, ly=0, mc=2, mw=18, mo=0, es=1),
    "worn":    dict(bi=2, bo=4, by=4, lid=.5, lx=0, ly=2, mc=-1, mw=14, mo=0, es=1),
    "ashamed": dict(bi=-8, bo=3, by=2, lid=.42, lx=-1, ly=5, mc=-5, mw=16, mo=0, es=.95),
    "caught":  dict(bi=-9, bo=-9, by=-4, lid=0, lx=0, ly=-1, mc=0, mw=10, mo=1, es=1.18),
    "tempted": dict(bi=-2, bo=-6, by=0, lid=.24, lx=5, ly=3, mc=3, mw=16, mo=0, es=1, asym=True),
    "decided": dict(bi=6, bo=-1, by=2, lid=.32, lx=0, ly=0, mc=0, mw=18, mo=0, es=1, firm=True),
    "smile":   dict(bi=-3, bo=-1, by=-1, lid=.3, lx=0, ly=0, mc=9, mw=26, mo=0, es=1),
}


def head(f, t, expr, tf, cowlick=True, hair=True):
    e = EXPR[expr]
    f.part(SKULL, "skin", tf)
    f.detail(shade(SKULL, 42 + 8 * t, 42, 62, 58, K["skin_sh"], .6), "", tf)
    htf = (tf + " " if tf else "") + "scale(1.04,.9)"     # the v2 hair outline, fitted to the round head
    if hair:
        if t >= 0.2:
            k = 18 * t
            back = (f"M-6,-97 C-62,-97 -90,-60 -88,-20 C-87,-4 -84,8 -74,18 "
                    f"C{-66+k:.1f},4 {-58+k:.1f},-10 {-50+k:.1f},-24 C{-40+k:.1f},-52 {-24+k:.1f},-70 -6,-78 Z")
            f.part(back, "hair", htf)
        f.part(P.hair_path(t), "hair", htf)
        if cowlick:
            for bx, by_, tx, ty in [(-16, -103, -38 - 8 * t, -136), (-4, -108, -18 - 8 * t, -150), (8, -106, 4 - 6 * t, -142)]:
                d = P.tube((bx, by_), ((bx + tx) / 2 + 6, (by_ + ty) / 2), (tx, ty), lambda u: 12 * (1 - u) + 2)
                f.part(d, "hair", htf)
    # face
    fx = 36 * t
    sp = 26 * (1 - 0.34 * t)
    eyes = [(fx - sp, 4), (fx + sp, 4)]
    if t > 0.82:
        eyes = [eyes[1]]
    hs, ss = [], []
    for i, (ex, ey) in enumerate(eyes):
        side = -1 if (len(eyes) == 2 and i == 0) else 1
        es = e["es"]
        cx, cy = ex + e["lx"], ey + e["ly"]
        hs.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{7.5*es:.1f}" ry="{10*es:.1f}" fill="{K["eye"]}"/>'
                  f'<circle cx="{cx-2.3:.1f}" cy="{cy-3.8:.1f}" r="{2.4*es:.1f}" fill="#fff"/>')
        lid = e["lid"]
        if lid > 0.02:
            top = ey - 13 * es
            low = top + lid * 23 * es
            hs.append(f'<path d="M{ex-11:.1f},{top-2:.1f} L{ex+11:.1f},{top-2:.1f} L{ex+11:.1f},{low:.1f} Q{ex:.1f},{low+4:.1f} {ex-11:.1f},{low:.1f} Z" fill="{K["lid"]}"/>'
                      f'<path d="M{ex-9:.1f},{low+0.5:.1f} Q{ex:.1f},{low+4:.1f} {ex+9:.1f},{low+0.5:.1f}" fill="none" stroke="{K["eye"]}" stroke-width="2.4" stroke-linecap="round"/>')
        bin_, bout = e["bi"], e["bo"]
        if e.get("asym") and side == 1:
            bin_, bout = -9, -10
        by = ey - 22 + e["by"]
        inner = (ex - 8 * side, by + bin_ * 0.6); outer = (ex + 11 * side, by + bout * 0.6)
        mid = (ex + 2 * side, by - 3 + (bin_ + bout) * 0.25)
        bw = 7 if e.get("firm") else 6
        hs.append(f'<path d="{P.tube(inner, mid, outer, lambda u: bw - 3 * u)}" fill="{K["hair"]}"/>')
        # the Pull: narrowed, lit eyes
        ss.append(f'<path d="M{cx-12:.1f},{cy+1:.1f} Q{cx:.1f},{cy-10:.1f} {cx+12:.1f},{cy+1:.1f} Q{cx:.1f},{cy+6:.1f} {cx-12:.1f},{cy+1:.1f} Z" '
                  f'fill="{K["amber"]}" filter="url(#b3)"/>'
                  f'<path d="M{cx-11:.1f},{cy+1:.1f} Q{cx:.1f},{cy-8.5:.1f} {cx+11:.1f},{cy+1:.1f} Q{cx:.1f},{cy+5:.1f} {cx-11:.1f},{cy+1:.1f} Z" fill="{K["amber_core"]}"/>')
    mx, my, mw = fx + 3 + 6 * t, 34, e["mw"] * (1 - 0.3 * t)
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


# ------------------------------------------------------------------ body parts
def limb(f, a, b, c, w0, w1, w2, kind):
    if P.bend(a, b, c) < 28:
        d = P.tube(a, b, c, lambda u: w0 + (w2 - w0) * u)
        f.part(d, kind)
    else:
        d = P.seg(a, b, w0, w1) + " " + P.seg(b, c, w1, w2)
        f.part(d, kind + "U")
        v1, v2 = norm(sub(a, b)), norm(sub(c, b))
        inside = norm(add(v1, v2)); p0 = add(b, mul(inside, w1 * 0.42))
        f.detail(f'<path d="M{fmt(add(p0, mul(v1, 7)))} Q{fmt(add(p0, mul(inside, -3)))} {fmt(add(p0, mul(v2, 7)))}" '
                 f'fill="none" stroke="{K["line"]}" stroke-width="2.2" opacity=".8" stroke-linecap="round"/>')


def hand(f, p, d):
    ang = math.degrees(math.atan2(d[1], d[0])) - 90
    tf = f"translate({p[0]:.1f},{p[1]:.1f}) rotate({ang:.1f})"
    f.part("M7,3 C17,1 20,11 14,18 C11,21 7,17 7,12 Z", "skin", tf)
    f.part("M-12,-2 C-13,14 -10,25 0,26 C10,25 13,14 12,-2 Z", "skin", tf)


def arm(f, sh, el, wr):
    d = norm(sub(wr, el))
    hand(f, add(wr, mul(d, 10)), d)
    limb(f, sh, el, wr, 40, 37, 33, "knit")
    ca, cb = sub(wr, mul(d, 11)), add(wr, mul(d, 2))
    f.part(P.seg(ca, cb, 36, 35), "rib")


def shoe(f, an, view, face=1):
    x, y = an
    if view == "front":
        f.part(f"M{x-21},{y+16} C{x-23},{y-3} {x-13},{y-8} {x},{y-8} C{x+13},{y-8} {x+23},{y-3} {x+21},{y+16} Z", "shoe")
        f.part(f"M{x-23},{y+13} L{x+23},{y+13} Q{x+25},{y+22} {x+19},{y+23} L{x-19},{y+23} Q{x-25},{y+22} {x-23},{y+13} Z", "sole")
    else:
        q = face
        f.part(f"M{x-19*q},{y+16} C{x-23*q},{y+2} {x-17*q},{y-9} {x-6*q},{y-9} L{x+6*q},{y-7} "
               f"C{x+18*q},{y} {x+32*q},{y+3} {x+42*q},{y+8} C{x+48*q},{y+11} {x+47*q},{y+18} {x+42*q},{y+18} Z", "shoe")
        f.part(f"M{x-22*q},{y+13} L{x+45*q},{y+13} Q{x+50*q},{y+21} {x+42*q},{y+23} L{x-19*q},{y+23} "
               f"Q{x-25*q},{y+21} {x-22*q},{y+13} Z", "sole")


def leg(f, hp, kn, an, view):
    limb(f, hp, kn, an, 46, 42, 37, "pants")
    shoe(f, an, "front" if view == "front" else "side")


def torso(f, top, bot, ws, wh):
    u = norm(sub(bot, top)); n = perp(u)
    shL, shR = add(add(top, mul(n, ws / 2)), mul(u, 15)), add(sub(top, mul(n, ws / 2)), mul(u, 15))
    cL, cR = add(top, mul(n, ws / 2 - 24)), sub(top, mul(n, ws / 2 - 24))
    hL, hR = add(bot, mul(n, wh / 2)), sub(bot, mul(n, wh / 2))
    kL, kR = add(top, mul(n, ws / 2)), sub(top, mul(n, ws / 2))
    body = (f"M{fmt(cR)} L{fmt(cL)} Q{fmt(kL)} {fmt(shL)} L{fmt(hL)} Q{fmt(add(bot, mul(u, 4)))} {fmt(hR)} "
            f"L{fmt(shR)} Q{fmt(kR)} {fmt(cR)} Z")
    f.part(body, "knit")
    mid = lerp(top, bot, 0.55)
    f.detail(shade(body, mid[0] + ws * 0.34, mid[1], ws * 0.26, abs(bot[1] - top[1]) * 0.6, K["knit_sh"], .9))
    b0 = sub(bot, mul(u, 17))
    rL, rR = add(b0, mul(n, wh / 2 + 1)), sub(b0, mul(n, wh / 2 + 1))
    f.part(f"M{fmt(rL)} L{fmt(hL)} Q{fmt(add(bot, mul(u, 4)))} {fmt(hR)} L{fmt(rR)} Z", "rib")
    lines = []
    s = -wh / 2 + 6
    while s < wh / 2 - 3:
        lines.append(f"M{fmt(add(b0, mul(n, s)))} L{fmt(add(bot, mul(n, s)))}")
        s += 8
    f.detail(f'<path d="{" ".join(lines)}" stroke="{K["line"]}" stroke-width="1.4" opacity=".45"/>')


def collar(f, top, up, t):
    w = 72 * (1 - 0.2 * t)
    n = perp(up)
    c0 = add(top, mul(up, 3)); c1 = sub(top, mul(up, 28))
    d = (f"M{fmt(add(c0, mul(n, w/2)))} Q{fmt(add(lerp(c0, c1, .5), mul(n, w/2 + 5)))} {fmt(add(c1, mul(n, w/2 - 5)))} "
         f"Q{fmt(sub(c1, mul(up, 5)))} {fmt(sub(c1, mul(n, w/2 - 5)))} Q{fmt(sub(lerp(c0, c1, .5), mul(n, w/2 + 5)))} {fmt(sub(c0, mul(n, w/2)))} "
         f"Q{fmt(add(c0, mul(up, 6)))} {fmt(add(c0, mul(n, w/2)))} Z")
    f.part(d, "rib")
    p = lerp(c0, c1, 0.45)
    f.detail(f'<path d="M{fmt(add(p, mul(n, w/2 - 3)))} Q{fmt(add(p, mul(up, 4)))} {fmt(sub(p, mul(n, w/2 - 3)))}" fill="none" '
             f'stroke="{K["line"]}" stroke-width="1.8" opacity=".55"/>')


# ------------------------------------------------------------------ poses (feet at y=0, about 3 heads tall)
POSES = {
    "front": dict(view="front", t=0.0, head=(0, -384), tilt=0, top=(0, -300), bot=(0, -150), ws=152, wh=130,
                  shL=(-70, -284), elL=(-84, -222), wrL=(-88, -168), shR=(70, -284), elR=(84, -222), wrR=(88, -168),
                  hpL=(-26, -144), knL=(-27, -82), anL=(-27, -26), hpR=(26, -144), knR=(27, -82), anR=(27, -26)),
    "tq": dict(view="tq", t=0.5, head=(8, -384), tilt=2, top=(3, -300), bot=(0, -150), ws=134, wh=116,
               shL=(-50, -284), elL=(-62, -222), wrL=(-66, -168), shR=(56, -283), elR=(70, -222), wrR=(74, -168),
               hpL=(-18, -144), knL=(-21, -82), anL=(-24, -26), hpR=(20, -144), knR=(24, -82), anR=(26, -26)),
    "side": dict(view="side", t=0.95, head=(10, -384), tilt=3, top=(3, -300), bot=(0, -150), ws=100, wh=92,
                 shL=(-3, -284), elL=(-5, -222), wrL=(2, -168), shR=(6, -283), elR=(10, -222), wrR=(18, -168),
                 hpL=(-3, -144), knL=(-5, -82), anL=(-9, -26), hpR=(5, -144), knR=(7, -82), anR=(8, -26)),
    "phone": dict(view="tq", t=0.5, head=(14, -378), tilt=18, top=(4, -298), bot=(0, -150), ws=134, wh=116,
                  shL=(-50, -282), elL=(-50, -226), wrL=(14, -238), shR=(56, -281), elR=(74, -226), wrR=(30, -246),
                  hpL=(-18, -144), knL=(-21, -82), anL=(-24, -26), hpR=(20, -144), knR=(24, -82), anR=(26, -26)),
    "seated": dict(view="side", t=0.95, head=(44, -326), tilt=8, top=(24, -244), bot=(0, -98), ws=100, wh=92,
                   shL=(20, -228), elL=(40, -170), wrL=(96, -160), shR=(28, -226), elR=(50, -168), wrR=(106, -156),
                   hpL=(-2, -92), knL=(62, -92), anL=(64, -26), hpR=(4, -90), knR=(68, -90), anR=(72, -26)),
    "losing": dict(view="side", t=0.9, head=(102, -230), tilt=50, top=(36, -182), bot=(0, -38), ws=100, wh=92,
                   shL=(32, -170), elL=(68, -130), wrL=(74, -90), shR=(40, -168), elR=(78, -126), wrR=(84, -86),
                   hpL=(-2, -30), knL=(46, -84), anL=(82, -26), hpR=(4, -30), knR=(52, -80), anR=(90, -26)),
    "decided": dict(view="tq", t=0.4, head=(4, -390), tilt=-4, top=(2, -302), bot=(0, -150), ws=140, wh=120,
                    shL=(-56, -286), elL=(-72, -224), wrL=(-76, -170), shR=(58, -285), elR=(74, -224), wrR=(78, -170),
                    hpL=(-26, -144), knL=(-34, -82), anL=(-40, -26), hpR=(26, -144), knR=(32, -82), anR=(38, -26)),
}


def build(pose, expr="neutral", arms=True, legs=True, cowlick=True, tail_to=None, contact=True):
    p = POSES[pose]; f = Fig(); t = p["t"]; front = p["view"] == "front"
    if legs and contact:
        f.detail(f'<ellipse cx="{"0" if front else "8"}" cy="1" rx="{86 if front else 74}" ry="11" fill="url(#contact)"/>')
    if not front and arms:
        arm(f, p["shL"], p["elL"], p["wrL"])
    if legs:
        leg(f, p["hpL"], p["knL"], p["anL"], p["view"])
        leg(f, p["hpR"], p["knR"], p["anR"], p["view"])
    if tail_to is not None:
        tail(f, p["bot"], tail_to, p["wh"])
    torso(f, p["top"], p["bot"], p["ws"], p["wh"])
    if front and arms:
        arm(f, p["shL"], p["elL"], p["wrL"])
        arm(f, p["shR"], p["elR"], p["wrR"])
    up = norm(sub(p["top"], p["bot"]))
    collar(f, p["top"], up, t)
    hx, hy = p["head"]
    head(f, t, expr, f"translate({hx},{hy}) rotate({p['tilt']})", cowlick)
    if not front and arms:
        arm(f, p["shR"], p["elR"], p["wrR"])
    return f


def tail(f, bot, to, wh):
    """The Pull's lower body: the silhouette narrows into one thread that ends on the object."""
    a = (bot[0], bot[1] - 8); c = to
    mid = (a[0] + (c[0] - a[0]) * 0.32, a[1] + (c[1] - a[1]) * 0.74)
    def w(u):
        return max(5, wh * 0.92 * (1 - u / 0.26) ** 2.1) if u < 0.26 else 5 - 2 * (u - 0.26)
    f.part(P.tube(a, mid, c, w, n=64), "tail")
    core = P.tube(a, mid, c, lambda u: max(1.4, w(u) * 0.12) if u > 0.2 else 1.4, n=64)
    f.detail("", f'<path d="{core}" fill="{K["amber_hi"]}" opacity=".9"/>')


def place(svg_inner, x, y, s=1.0, flip=False, lean=0, opacity=1.0):
    sc = f"scale({-s},{s})" if flip else f"scale({s})"
    rot = f" rotate({lean} 0 -160)" if lean else ""
    return f'<g transform="translate({x},{y}) {sc}{rot}" opacity="{opacity}" stroke-linecap="round">{svg_inner}</g>'


def owen(pose, x, y, s=1.0, expr="neutral", flip=False, **kw):
    return place(render_hero(build(pose, expr, **kw)), x, y, s, flip)


def pull(pose, x, y, s=1.0, flip=False, lean=0, opacity=1.0, **kw):
    kw.setdefault("legs", False)
    return place(render_shadow(build(pose, "smile", contact=False, **kw)), x, y, s, flip, lean, opacity)


def wisp(x, y, s=1.0):
    """Stage 1: a small curl of shadow rising out of the phone on its thread, two slits already lit."""
    f = Fig()
    body = "M0,-120 C-30,-122 -44,-96 -38,-70 C-34,-52 -16,-44 -6,-30 C2,-18 4,-8 2,0 C10,-14 18,-30 26,-48 C38,-74 34,-118 0,-120 Z"
    f.part(body, "tail")
    f.detail("", f'<path d="M-18,-92 q6,-5 11,0 M4,-94 q6,-5 11,0" fill="none" stroke="{K["amber_core"]}" stroke-width="3.2" stroke-linecap="round"/>')
    return place(render_shadow(f, rim=2.6), x, y, s)


def embers(cx, cy, spread, n, seed):
    r = random.Random(seed); out = []
    for _ in range(n):
        x = cx + r.uniform(-spread, spread); y = cy + r.uniform(-spread, spread * 0.6); rr = r.uniform(1.2, 3)
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr*2.4:.1f}" fill="{K["amber"]}" opacity=".3" filter="url(#b3)"/>'
                   f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr:.1f}" fill="{K["amber_hi"]}" opacity="{r.uniform(.5,.95):.2f}"/>')
    return "".join(out)


def phone_flat(x, y, s=1.0):
    return (f'<ellipse cx="{x}" cy="{y}" rx="{130*s}" ry="{22*s}" fill="url(#pool)"/>'
            f'<ellipse cx="{x}" cy="{y-36*s}" rx="{54*s}" ry="{54*s}" fill="{K["amber"]}" opacity=".1" filter="url(#b24)"/>'
            f'<rect x="{x-30*s}" y="{y-8*s}" width="{60*s}" height="{8*s}" rx="{3*s}" fill="#141519" stroke="{K["set_line"]}" stroke-width="1.5"/>'
            f'<rect x="{x-26*s}" y="{y-9*s}" width="{52*s}" height="{2.6*s}" rx="1.3" fill="{K["amber_hi"]}"/>')


# ------------------------------------------------------------------ sheet helpers
def svg(w, h, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{D.svg()}'
            f'<rect width="{w}" height="{h}" fill="{K["bg"]}"/>{body}<rect width="{w}" height="{h}" filter="url(#grain)"/></svg>')


def text(x, y, t, size=22, color="#8a8e98", anchor="middle", font="Avenir Next", weight=500):
    if isinstance(font, int):
        font, weight = "Avenir Next", font
    return (f'<text x="{x}" y="{y}" fill="{color}" font-family="{font}" font-size="{size}" font-weight="{weight}" '
            f'text-anchor="{anchor}">{t.replace("&", "&amp;")}</text>')


def floor(x0, x1, y):
    return f'<rect x="{x0}" y="{y}" width="{x1-x0}" height="56" fill="#0f1014"/><path d="M{x0},{y} H{x1}" stroke="#262830" stroke-width="2"/>'


def swatch(x, y, col, name):
    return (f'<circle cx="{x}" cy="{y}" r="19" fill="{col}" stroke="#2a2c33" stroke-width="2"/>'
            + text(x + 32, y + 7, name, 18, "#8a8e98", "start", font="Menlo", weight=400))


def desk_line(x0, x1, y, h, legs=True):
    """Line-art desk in the reference's manner: dark fill, thin light-grey edges."""
    g = [f'<rect x="{x0}" y="{y}" width="{x1-x0}" height="14" rx="3" fill="{K["set_fill"]}" stroke="{K["set_line"]}" stroke-width="2.5"/>']
    if legs:
        g.append(f'<path d="M{x0+14},{y+14} v{h-14} M{x1-14},{y+14} v{h-14}" stroke="{K["set_line"]}" stroke-width="2.5"/>')
    return "".join(g)


def chair_line(x, fy, seat=86, back=150, w=78):
    return (f'<rect x="{x}" y="{fy-seat}" width="{w}" height="10" rx="3" fill="{K["set_fill"]}" stroke="{K["set_line"]}" stroke-width="2.5"/>'
            f'<path d="M{x+8},{fy-seat+10} V{fy} M{x+w-8},{fy-seat+10} V{fy} M{x+4},{fy-seat} V{fy-seat-back}" stroke="{K["set_line"]}" stroke-width="2.5" fill="none"/>'
            f'<rect x="{x-2}" y="{fy-seat-back}" width="10" height="{back*0.55:.0f}" rx="3" fill="{K["set_fill"]}" stroke="{K["set_line"]}" stroke-width="2.5"/>')


# ------------------------------------------------------------------ sheet 1: Owen
def hero_sheet():
    global D
    D = Defs()
    W, H = 1920, 1500
    b = [text(80, 86, "OWEN  —  the hero (working name)", 42, "#ecebe4", "start", 600),
         text(80, 126, "The reference's look: flat colour, a big round head on a small body, thin dark outlines. "
              "His own: a dark mop of hair with a cowlick and a slate-blue roll-neck.", 22, "#8a8e98", "start")]
    FY = 690
    b.append(floor(60, 1100, FY))
    for i, (pn, lab, ex) in enumerate([("front", "front", "neutral"), ("tq", "three-quarter", "neutral"),
                                         ("side", "side", "neutral"), ("phone", "on the phone", "tempted")]):
        x = 190 + i * 250
        b.append(owen(pn, x, FY, 1.0, ex))
        if pn == "phone":
            b.append(f'<g transform="translate({x},{FY})"><g transform="rotate(-16 22 -258)">'
                     f'<rect x="8" y="-288" width="30" height="50" rx="6" fill="#141519" stroke="{K["line"]}" stroke-width="2.5"/>'
                     f'<rect x="12" y="-284" width="22" height="42" rx="3" fill="{K["amber"]}"/></g></g>')
            b.append(f'<ellipse cx="{x+30}" cy="{FY-270}" rx="60" ry="50" fill="{K["amber"]}" opacity=".16" filter="url(#b24)"/>')
        b.append(text(x, FY + 40, lab))
    # face
    b.append(text(1200, 196, "FACE", 24, "#ecebe4", "start", 600))
    b.append(text(1200, 226, "dot eyes with one highlight; the brows do the acting; no nose, a short mouth", 18, "#8a8e98", "start"))
    names = [("neutral", "neutral"), ("worn", "worn out"), ("ashamed", "ashamed"), ("caught", "caught"),
             ("tempted", "tempted"), ("decided", "decided")]
    for i, (e, lab) in enumerate(names):
        cx = 1320 + (i % 3) * 220; cy = 370 + (i // 3) * 250
        f = Fig(); head(f, 0.25 if e == "tempted" else 0.0, e, "")
        b.append(f'<g transform="translate({cx},{cy}) scale(.95)">{render_hero(f)}</g>')
        b.append(text(cx, cy + 110, lab, 20))
    # acting
    FY2 = 1340
    b.append(floor(60, 1100, FY2))
    sx = 200
    b.append(chair_line(sx - 42, FY2))
    b.append(owen("seated", sx, FY2, 1.0, "tempted"))
    b.append(desk_line(sx + 70, sx + 330, FY2 - 150, 150))
    b.append(phone_flat(sx + 150, FY2 - 150, 0.9))
    b.append(text(sx + 110, FY2 + 40, "at the desk, tempted"))
    b.append(owen("losing", 580, FY2, 1.0, "ashamed"))
    b.append(text(630, FY2 + 40, "losing"))
    b.append(owen("decided", 930, FY2, 1.0, "decided"))
    b.append(text(930, FY2 + 40, "the test: he stands up"))
    # palette + rules
    b.append(text(1200, 930, "PALETTE", 24, "#ecebe4", "start", 600))
    sw = [(K["skin"], "skin  #f3e3ce"), (K["hair"], "hair  #29232d"), (K["knit"], "jumper  #657d9c"),
          (K["pants"], "trousers  #2e3440"), (K["shoe"], "shoes  #e7e7ea"), (K["amber"], "amber (only the Pull)")]
    for i, (col, nm) in enumerate(sw):
        b.append(swatch(1220 + (i % 2) * 330, 980 + (i // 2) * 54, col, nm))
    rules = ["• flat fills, one soft shade, thin dark outlines: the reference's grammar",
             "• his marks: hair + cowlick, roll-neck, slate blue (theirs: bald, hoodie, grey)",
             "• he is the only cool colour on screen; amber belongs to the Pull",
             "• three heads tall, so the face reads on a phone"]
    for i, r in enumerate(rules):
        b.append(text(1200, 1170 + i * 36, r, 20, "#8a8e98", "start"))
    return svg(W, H, "".join(b))


# ------------------------------------------------------------------ sheet 2: the Pull
def pull_sheet():
    global D
    D = Defs()
    W, H = 1920, 1380
    b = [text(80, 86, "THE PULL  —  the antagonist (working name)", 42, K["amber"], "start", 600),
         text(80, 126, "His shadow double: a black silhouette with an amber rim, lit eyes and a smile. "
              "No legs: below the waist it narrows into one thread tied to whatever feeds it.", 22, "#8a8e98", "start")]
    FY = 780
    b.append(floor(60, 1860, FY))
    # 1: a wisp wakes up in the phone
    b.append(phone_flat(320, FY))
    b.append(wisp(318, FY - 8, 1.0))
    b.append(embers(310, FY - 120, 50, 6, 1))
    # 2: it finds a face (small, head and shoulders)
    b.append(phone_flat(770, FY))
    s2 = .62
    b.append(pull("front", 640, FY - 140, s2, arms=False, cowlick=False, tail_to=((770 - 640) / s2, 136 / s2)))
    b.append(embers(650, FY - 300, 70, 7, 2))
    # 3: it leans in (bigger, arms)
    b.append(phone_flat(1210, FY))
    s3 = .86
    b.append(pull("tq", 1060, FY - 120, s3, cowlick=False, tail_to=((1210 - 1060) / s3, 116 / s3)))
    b.append(embers(1080, FY - 380, 90, 9, 3))
    # 4: it is him (same size, same hair, right behind him)
    b.append(phone_flat(1770, FY))
    b.append(pull("side", 1545, FY - 14, 1.0, cowlick=True, tail_to=(1770 - 1545, 10)))
    b.append(owen("side", 1600, FY, 1.0, "worn"))
    b.append(embers(1570, FY - 400, 100, 10, 4))
    labels = ["1 · it wakes up", "2 · it finds a face", "3 · it leans in", "4 · it is him"]
    for i, x in enumerate([320, 700, 1120, 1600]):
        b.append(text(x, FY + 42, labels[i], 22, K["amber"] if i == 3 else "#8a8e98"))
    # faces
    b.append(text(80, 930, "HIM  /  IT", 24, "#ecebe4", "start", 600))
    f = Fig(); head(f, 0, "worn", "")
    b.append(f'<g transform="translate(200,1080)">{render_hero(f)}</g>')
    f = Fig(); head(f, 0, "smile", "")
    b.append(f'<g transform="translate(440,1080)">{render_shadow(f)}</g>')
    b.append(text(200, 1210, "him: dark eyes, tired")); b.append(text(440, 1210, "it: lit eyes, a smile", 22, K["amber"]))
    # voice + rules
    b.append(text(700, 930, "ITS VOICE", 24, "#ecebe4", "start", 600))
    b.append(text(700, 982, "just one look.", 34, K["amber"], "start", "Courier New", 700))
    b.append(text(700, 1028, "you've earned a minute.", 34, K["amber"], "start", "Courier New", 700))
    b.append(text(700, 1072, "amber typewriter, lowercase, typed on letter by letter next to it", 19, "#8a8e98", "start"))
    b.append(text(700, 1100, "the narrator is the opposite: white, sentence case, at the bottom", 19, "#8a8e98", "start"))
    rules = ["• amber rim, eyes and smile (the reference's shadow is pink)",
             "• no floor ring: it is tied by a thread to the thing feeding it",
             "• it grows 1 → 4 as it wins; only at 4 does it get his cowlick",
             "• when it loses, the thread goes slack and the glow dies"]
    for i, r in enumerate(rules):
        b.append(text(1250, 975 + i * 38, r, 20, "#8a8e98", "start"))
    return svg(W, H, "".join(b))


# ------------------------------------------------------------------ sheet 3: a frame of JUST ONE MORE
def frame():
    global D
    D = Defs()
    W, H = 1920, 1080
    FY = 860
    b = [f'<rect width="{W}" height="{FY}" fill="url(#wall)"/>',
         f'<rect y="{FY}" width="{W}" height="{H-FY}" fill="#0c0d10"/><path d="M0,{FY} H{W}" stroke="{K["set_line2"]}" stroke-width="2"/>']
    # window: line-art frame on a night sky, a few cool lights
    wx, wy, ww, wh = 230, 210, 380, 300
    b.append(f'<rect x="{wx}" y="{wy}" width="{ww}" height="{wh}" rx="10" fill="url(#sky)" stroke="{K["set_line"]}" stroke-width="3"/>')
    r = random.Random(5); bx = wx + 6
    while bx < wx + ww - 10:
        bw_ = r.randint(34, 64); bh = r.randint(60, 160)
        bw_ = min(bw_, wx + ww - 6 - bx)
        b.append(f'<rect x="{bx}" y="{wy+wh-bh}" width="{bw_}" height="{bh-3}" fill="#090d16"/>')
        for yy in range(wy + wh - bh + 12, wy + wh - 10, 16):
            for xx in range(bx + 6, bx + bw_ - 6, 12):
                if r.random() < .2:
                    b.append(f'<rect x="{xx}" y="{yy}" width="4" height="6" fill="#9fb8e8" opacity="{r.uniform(.35,.8):.2f}"/>')
        bx += bw_ + 4
    b.append(f'<circle cx="{wx+290}" cy="{wy+64}" r="20" fill="#e9eefb"/><circle cx="{wx+290}" cy="{wy+64}" r="40" fill="{K["cool"]}" opacity=".16" filter="url(#b6)"/>')
    b.append(f'<path d="M{wx+ww/2},{wy} v{wh} M{wx},{wy+wh/2} h{ww}" stroke="{K["set_line"]}" stroke-width="3"/>')
    # wall clock at 9:00 (line art)
    b.append(f'<circle cx="1560" cy="250" r="58" fill="{K["set_fill"]}" stroke="{K["set_line"]}" stroke-width="3"/>')
    for k in range(12):
        a = math.radians(k * 30)
        b.append(f'<path d="M{1560+44*math.sin(a):.1f},{250-44*math.cos(a):.1f} L{1560+50*math.sin(a):.1f},{250-50*math.cos(a):.1f}" stroke="{K["set_line"]}" stroke-width="2.5"/>')
    b.append(f'<path d="M1560,250 V212 M1560,250 H1530" stroke="#dfe3ea" stroke-width="4" stroke-linecap="round"/>')
    # shelf + books (line art)
    b.append(f'<rect x="1150" y="400" width="300" height="10" rx="3" fill="{K["set_fill"]}" stroke="{K["set_line"]}" stroke-width="2.5"/>')
    bx = 1168
    for hh, ww_ in [(70, 20), (84, 16), (64, 24), (78, 15), (88, 22)]:
        b.append(f'<rect x="{bx}" y="{400-hh}" width="{ww_}" height="{hh}" rx="2" fill="{K["set_fill"]}" stroke="{K["set_line"]}" stroke-width="2.2"/>'); bx += ww_ + 4
    # desk, drawers, lamp (cool), laptop (cool screen)
    DT = 700
    b.append(desk_line(760, 1520, DT, FY - DT))
    b.append(f'<rect x="1320" y="{DT+14}" width="186" height="{FY-DT-14}" fill="{K["set_fill"]}" stroke="{K["set_line"]}" stroke-width="2.5"/>'
             f'<path d="M1320,{DT+82} h186" stroke="{K["set_line"]}" stroke-width="2.5"/><path d="M1396,{DT+46} h34 M1396,{DT+116} h34" stroke="{K["set_line"]}" stroke-width="3" stroke-linecap="round"/>')
    b.append(f'<polygon points="1418,486 1240,{DT} 1500,{DT} 1452,486" fill="{K["cool"]}" opacity=".05" filter="url(#b6)"/>')
    b.append(f'<path d="M1470,{DT} h-46 M1447,{DT} L1470,570 L1424,478" fill="none" stroke="{K["set_line"]}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
             f'<path d="M1402,462 L1464,462 L1480,500 L1398,500 Z" fill="{K["set_fill"]}" stroke="{K["set_line"]}" stroke-width="2.5" transform="rotate(-24 1438 480)"/>')
    b.append(f'<rect x="1080" y="{DT-10}" width="200" height="10" rx="3" fill="{K["set_fill"]}" stroke="{K["set_line"]}" stroke-width="2.2"/>')
    b.append(f'<path d="M1090,{DT-10} L1054,{DT-160} L1110,{DT-168} L1144,{DT-12} Z" fill="#c9d8f2" stroke="{K["set_line"]}" stroke-width="2.2"/>')
    b.append(f'<path d="M1064,{DT-150} h36 M1068,{DT-138} h40 M1072,{DT-126} h26" stroke="#7d93ba" stroke-width="3"/>')
    b.append(f'<ellipse cx="1040" cy="{DT-96}" rx="110" ry="84" fill="{K["cool"]}" opacity=".07" filter="url(#b24)"/>')
    # chair + Owen + phone + the Pull
    b.append(chair_line(560, FY, seat=90, back=170, w=84))
    px = 900
    b.append(phone_flat(px, DT, 1.1))
    b.append(owen("seated", 604, FY, 1.12, "tempted"))
    # warm light from the phone on his face (only near it)
    b.append(f'<ellipse cx="760" cy="520" rx="70" ry="80" fill="{K["amber"]}" opacity=".10" filter="url(#b24)"/>')
    ox, oy, s3 = 846, 812, 0.86
    b.append(pull("tq", ox, oy, s3, flip=True, lean=-10, cowlick=False, tail_to=(-(px - ox) / s3, (DT - 4 - oy) / s3)))
    b.append(embers(850, 470, 110, 12, 8))
    b.append(text(940, 372, "it could be important.", 38, K["amber"], "start", "Courier New", 700))
    # counter, top right
    b.append(text(1830, 84, "MINUTES LOST", 20, "#7c818c", "end", "Menlo", 400))
    b.append(text(1830, 140, "07", 54, K["amber"], "end", "Menlo", 700))
    b.append("".join(f'<rect x="{1590 + k*4}" y="160" width="2.6" height="12" fill="{K["amber"] if k < 7 else "#2c2f37"}"/>' for k in range(60)))
    b.append(text(W / 2, 1000, "He gave himself one hour.", 32, "#ecebe4"))
    b.append(f'<rect width="{W}" height="{H}" fill="url(#vig)"/>')
    return svg(W, H, "".join(b))


if __name__ == "__main__":
    for name, fn in [("v3_01_hero", hero_sheet), ("v3_02_pull", pull_sheet), ("v3_03_frame", frame)]:
        f = OUT / f"{name}.svg"
        f.write_text(fn())
        subprocess.run(["rsvg-convert", "-o", str(OUT / f"{name}.png"), str(f)], check=True)
        print("wrote", name)
