#!/usr/bin/env python3
"""Character design v2 for the new channel (19 Oct 2026): proper, filled, shaded, dressed characters.
The outline-only v1 was rejected by the user ("it's just outline. it should be proper"); it is kept in
rejected-outline/ for the record.

  OWEN     the hero. Warm skin, a dark mop of hair with a cowlick, a slate-blue roll-neck jumper,
           charcoal trousers, grey canvas shoes. Lit from the upper left, soft vector shading,
           thin edge lines in a darker shade of each colour (never black ink).
  THE PULL his double made of amber light. Same silhouette and face, but it glows, its eyes are lit,
           it smiles, and below the jumper's hem it has no legs: it tapers into one glowing thread
           tied to whatever feeds it (the phone, in film 1).

Run:  python3 -I proper.py   (writes SVG + PNG for the three sheets next to this file)
"""
import math, random, subprocess, pathlib

OUT = pathlib.Path(__file__).parent

C = dict(
    bg="#0b0b0d",
    skin="#f0cfad", skin_sh="#c8977a", skin_edge="#8a604c", skin_mid="#e2b996",
    hair="#2c2328", hair_hi="#5a4a54", hair_edge="#100c0f",
    knit="#7590b2", knit_sh="#4a5d7a", knit_edge="#2b3850", knit_rib="#3b4b65",
    pants="#3a4252", pants_sh="#232934", pants_edge="#12161d",
    shoe="#dde0e6", shoe_sh="#9ea4ae", shoe_edge="#5a5f69", sole="#f4f2ed",
    eye="#161318", mouth="#6b3c33", brow="#2c2328",
    amber="#f2a33a", amber_hi="#ffd690", amber_deep="#b8641b", amber_core="#fff2d2", amber_dark="#6e3510",
    cool="#cfe0ff",
)

# ------------------------------------------------------------------ defs
STATIC_DEFS = f"""
<linearGradient id="gSkin" x1=".1" y1="0" x2=".95" y2="1"><stop offset="0" stop-color="{C['skin']}"/><stop offset=".55" stop-color="{C['skin_mid']}"/><stop offset="1" stop-color="{C['skin_sh']}"/></linearGradient>
<linearGradient id="gHair" x1=".1" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="{C['hair_hi']}"/><stop offset=".45" stop-color="{C['hair']}"/><stop offset="1" stop-color="{C['hair_edge']}"/></linearGradient>
<linearGradient id="gKnit" x1=".05" y1="0" x2=".95" y2=".9"><stop offset="0" stop-color="{C['knit']}"/><stop offset="1" stop-color="{C['knit_sh']}"/></linearGradient>
<linearGradient id="gRib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{C['knit_sh']}"/><stop offset="1" stop-color="{C['knit_rib']}"/></linearGradient>
<linearGradient id="gPants" x1=".05" y1="0" x2=".95" y2=".9"><stop offset="0" stop-color="{C['pants']}"/><stop offset="1" stop-color="{C['pants_sh']}"/></linearGradient>
<linearGradient id="gShoe" x1="0" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="{C['shoe']}"/><stop offset="1" stop-color="{C['shoe_sh']}"/></linearGradient>
<linearGradient id="gAmber" x1=".1" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="{C['amber_hi']}" stop-opacity=".95"/><stop offset=".55" stop-color="{C['amber']}" stop-opacity=".78"/><stop offset="1" stop-color="{C['amber_deep']}" stop-opacity=".7"/></linearGradient>
<linearGradient id="gAmberFace" x1=".1" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="{C['amber_core']}" stop-opacity=".95"/><stop offset="1" stop-color="{C['amber_hi']}" stop-opacity=".8"/></linearGradient>
<linearGradient id="gAmberHair" x1=".1" y1="0" x2=".9" y2="1"><stop offset="0" stop-color="{C['amber']}" stop-opacity=".95"/><stop offset="1" stop-color="{C['amber_dark']}" stop-opacity=".9"/></linearGradient>
<linearGradient id="gAmberRib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{C['amber']}" stop-opacity=".9"/><stop offset="1" stop-color="{C['amber_deep']}" stop-opacity=".85"/></linearGradient>
<linearGradient id="rimAmber" x1="0" y1="0" x2="1" y2="0"><stop offset=".5" stop-color="{C['amber']}" stop-opacity="0"/><stop offset="1" stop-color="{C['amber_hi']}" stop-opacity=".95"/></linearGradient>
<linearGradient id="rimCool" x1="0" y1="0" x2="1" y2="0"><stop offset=".55" stop-color="{C['cool']}" stop-opacity="0"/><stop offset="1" stop-color="{C['cool']}" stop-opacity=".75"/></linearGradient>
<radialGradient id="pool" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="{C['amber']}" stop-opacity=".55"/><stop offset=".5" stop-color="{C['amber']}" stop-opacity=".16"/><stop offset="1" stop-color="{C['amber']}" stop-opacity="0"/></radialGradient>
<radialGradient id="poolCool" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="{C['cool']}" stop-opacity=".35"/><stop offset="1" stop-color="{C['cool']}" stop-opacity="0"/></radialGradient>
<radialGradient id="contact" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#000" stop-opacity=".75"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx="50%" cy="46%" r="72%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".72"/></radialGradient>
<filter id="b2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2"/></filter>
<filter id="b4" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
<filter id="b8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="b14" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="b26" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="26"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="7"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .045 0"/></filter>
"""


class Defs:
    def __init__(self):
        self.items, self.n = [], 0

    def clip(self, d, transform=""):
        self.n += 1
        cid = f"cl{self.n}"
        t = f' transform="{transform}"' if transform else ""
        self.items.append(f'<clipPath id="{cid}"><path d="{d}"{t}/></clipPath>')
        return f"url(#{cid})"

    def svg(self):
        return "<defs>" + STATIC_DEFS + "".join(self.items) + "</defs>"


D = Defs()

# ------------------------------------------------------------------ geometry
def add(a, b): return (a[0] + b[0], a[1] + b[1])
def sub(a, b): return (a[0] - b[0], a[1] - b[1])
def mul(a, k): return (a[0] * k, a[1] * k)
def lerp(a, b, t): return (a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t)
def norm(v):
    l = math.hypot(*v) or 1.0
    return (v[0] / l, v[1] / l)
def perp(v): return (-v[1], v[0])
def fmt(p): return f"{p[0]:.1f},{p[1]:.1f}"


def qpt(a, b, c, t):
    """Quadratic through b at t=0.5."""
    cx, cy = 2 * b[0] - (a[0] + c[0]) / 2, 2 * b[1] - (a[1] + c[1]) / 2
    return ((1 - t) ** 2 * a[0] + 2 * (1 - t) * t * cx + t * t * c[0],
            (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * cy + t * t * c[1])


def tube(a, b, c, wfun, n=26, cap=True):
    """Closed outline of a tapered tube along a->b->c with width wfun(t)."""
    P = [qpt(a, b, c, i / n) for i in range(n + 1)]
    L, R, T = [], [], []
    for i, p in enumerate(P):
        d = norm(sub(P[min(i + 1, n)], P[max(i - 1, 0)]))
        nv = perp(d)
        w = wfun(i / n) / 2
        L.append(add(p, mul(nv, w))); R.append(sub(p, mul(nv, w))); T.append(d)
    pts = list(L)
    if cap:
        w1, d1, n1, e = wfun(1) / 2, T[-1], perp(T[-1]), P[-1]
        for k in range(1, 10):
            ang = math.pi * k / 10
            pts.append(add(e, add(mul(n1, w1 * math.cos(ang)), mul(d1, w1 * math.sin(ang)))))
    pts += list(reversed(R))
    if cap:
        w0, d0, n0, s = wfun(0) / 2, T[0], perp(T[0]), P[0]
        for k in range(1, 10):
            ang = math.pi * k / 10
            pts.append(add(s, add(mul(n0, -w0 * math.cos(ang)), mul(d0, -w0 * math.sin(ang)))))
    return "M" + " L".join(fmt(p) for p in pts) + " Z"


def seg(a, b, w0, w1):
    m = lerp(a, b, 0.5)
    return tube(a, m, b, lambda t: w0 + (w1 - w0) * t)


# ------------------------------------------------------------------ materials
def M(mat):
    if mat == "amber":
        return dict(skin="url(#gAmberFace)", skin_edge=C["amber_core"], hair="url(#gAmberHair)", hair_edge=C["amber_hi"],
                    knit="url(#gAmber)", knit_edge=C["amber_core"], rib="url(#gAmberRib)", rib_line=C["amber_deep"],
                    pants="url(#gAmber)", pants_edge=C["amber_core"], shoe="url(#gAmber)", shoe_edge=C["amber_core"],
                    sole=C["amber_hi"], eye=C["amber_core"], mouth=C["amber_dark"], brow=C["amber_dark"],
                    shade=C["amber_dark"], shade_op=.35, lid=C["amber_hi"], lash=C["amber_dark"], ew=2.2, hair_hi=C["amber_hi"])
    return dict(skin="url(#gSkin)", skin_edge=C["skin_edge"], hair="url(#gHair)", hair_edge=C["hair_edge"],
                knit="url(#gKnit)", knit_edge=C["knit_edge"], rib="url(#gRib)", rib_line=C["knit_edge"],
                pants="url(#gPants)", pants_edge=C["pants_edge"], shoe="url(#gShoe)", shoe_edge=C["shoe_edge"],
                sole=C["sole"], eye=C["eye"], mouth=C["mouth"], brow=C["brow"],
                shade="#000", shade_op=.32, lid=C["skin_mid"], lash=C["eye"], ew=2.4, hair_hi=C["hair_hi"])


def shape(d, fill, edge, ew, extra=""):
    return f'<path d="{d}" fill="{fill}" stroke="{edge}" stroke-width="{ew}" stroke-linejoin="round" {extra}/>'


def shade_in(d, cx, cy, rx, ry, color, op, blur="b8", transform=""):
    """A soft shadow (or light) inside a part, clipped to its outline."""
    cp = D.clip(d, transform)
    return (f'<g clip-path="{cp}"><ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{rx:.1f}" ry="{ry:.1f}" '
            f'fill="{color}" opacity="{op}" filter="url(#{blur})"/></g>')


# ------------------------------------------------------------------ face + head
EXPR = {
    "neutral": dict(bi=0, bo=0, by=0, lid=.12, lx=0, ly=0, mc=2, mw=20, mo=0, es=1),
    "worn":    dict(bi=2, bo=4, by=4, lid=.52, lx=0, ly=2, mc=-1, mw=16, mo=0, es=1),
    "ashamed": dict(bi=-8, bo=3, by=2, lid=.42, lx=-1, ly=5, mc=-5, mw=18, mo=0, es=.95),
    "caught":  dict(bi=-9, bo=-9, by=-4, lid=0, lx=0, ly=-1, mc=0, mw=10, mo=1, es=1.18),
    "tempted": dict(bi=-2, bo=-6, by=0, lid=.24, lx=5, ly=3, mc=3, mw=18, mo=0, es=1, asym=True),
    "decided": dict(bi=6, bo=-1, by=2, lid=.34, lx=0, ly=0, mc=0, mw=20, mo=0, es=1, firm=True),
    "smile":   dict(bi=-3, bo=-1, by=-1, lid=.3, lx=0, ly=0, mc=9, mw=28, mo=0, es=1),
}


def skull_path(t):
    """Egg-shaped head, wider at the top, centred on (0,0). t = turn to the right (0 front, 1 profile)."""
    a = max(0.0, (t - 0.6) / 0.4) * 13          # nose bump in profile
    s = 6 * t                                     # lower face slides forward a little
    return (f"M0,-86 C47,-86 77,-58 77,-12 C77.5,{-2} {77+a*0.25:.1f},4 {77+a*0.3:.1f},7 "
            f"Q{77+a:.1f},15 {77+a*0.25:.1f},25 C{76+s*0.4:.1f},40 {55+s:.1f},79 {2+s:.1f},86 "
            f"C{-50+s:.1f},80 -77,34 -77,-12 C-77,-58 -47,-86 0,-86 Z")


def hair_path(t):
    pts = [(80, -4), (92, -44), (80, -92), (30, -106), (-14, -116), (-72, -100), (-88, -56), (-94, -38), (-90, -18), (-80, -4),
           (-76, -22), (-68, -34), (-58, -38), (-50, -22), (-44, -38), (-30, -47), (-16, -47), (-7, -27), (0, -46), (18, -51),
           (33, -45), (45, -25), (51, -38), (64, -41), (72, -31), (76, -24), (78, -14), (80, -4)]
    out = []
    for x, y in pts:
        if t > 0:
            back = x < -40
            x = x * (1 - 0.2 * t) + 18 * t - (12 * t if back else 0)
            if back and y > -60:
                y = y + 10 * t       # hair covers more of the back of the head when turned
        out.append((x, y))
    p = out
    d = (f"M{fmt(p[0])} C{fmt(p[1])} {fmt(p[2])} {fmt(p[3])} C{fmt(p[4])} {fmt(p[5])} {fmt(p[6])} "
         f"C{fmt(p[7])} {fmt(p[8])} {fmt(p[9])} C{fmt(p[10])} {fmt(p[11])} {fmt(p[12])} L{fmt(p[13])} "
         f"C{fmt(p[14])} {fmt(p[15])} {fmt(p[16])} L{fmt(p[17])} C{fmt(p[18])} {fmt(p[19])} {fmt(p[20])} "
         f"L{fmt(p[21])} C{fmt(p[22])} {fmt(p[23])} {fmt(p[24])} C{fmt(p[25])} {fmt(p[26])} {fmt(p[27])} Z")
    return d


def head(t=0.0, expr="neutral", mat="flesh", cowlick=True, rim=None):
    """Head in local units, centre (0,0), about 172 tall without hair. Returns svg (no transform)."""
    m = M(mat); e = EXPR[expr]
    g = []
    sk = skull_path(t)
    # ears
    def ear(x, flip=1, on_top=False):
        d = f"M{x-10*flip:.1f},-14 C{x+8*flip:.1f},-24 {x+16*flip:.1f},-4 {x+12*flip:.1f},10 C{x+8*flip:.1f},22 {x-6*flip:.1f},22 {x-10*flip:.1f},16 Z"
        inner = f'<path d="M{x+2*flip:.1f},-8 q{6*flip},8 0,16" fill="none" stroke="{m["skin_edge"]}" stroke-width="2" opacity=".6" stroke-linecap="round"/>'
        return shape(d, m["skin"], m["skin_edge"], m["ew"]) + inner
    if t < 0.2:
        g.append(ear(-74, -1)); g.append(ear(74, 1))
    g.append(shape(sk, m["skin"], m["skin_edge"], m["ew"]))
    # form shading on the jaw (shaded side) and a soft light on the lit cheek
    g.append(shade_in(sk, 58 + 10 * t, 34, 38, 70, m["shade"], m["shade_op"] * 0.75, "b14"))
    if mat == "flesh":
        g.append(shade_in(sk, -30 + 30 * t, -30, 30, 26, "#fff", .14, "b8"))
    if t >= 0.2:
        k = 18 * t
        back = (f"M-6,-97 C-62,-97 -90,-60 -88,-14 C-87,12 -80,32 -63,46 "
                f"C{-58+k:.1f},26 {-52+k:.1f},4 {-46+k:.1f},-16 C{-38+k:.1f},-50 {-24+k:.1f},-70 -6,-78 Z")
        g.append(shape(back, m["hair"], m["hair_edge"], m["ew"]))
        g.append(ear(-70 + 36 * t, -1))
    # hair: shadow it casts on the forehead, then the hair mass, highlight, cowlick
    hp = hair_path(t)
    cp = D.clip(sk)
    g.append(f'<g clip-path="{cp}"><path d="{hp}" fill="#000" opacity="{.3 if mat=="flesh" else .25}" transform="translate(2,8)" filter="url(#b4)"/></g>')
    g.append(shape(hp, m["hair"], m["hair_edge"], m["ew"]))
    g.append(f'<path d="M-52,-80 Q-24,-102 14,-98" fill="none" stroke="{m["hair_hi"]}" stroke-width="7" stroke-linecap="round" opacity=".55" filter="url(#b2)"/>')
    g.append(f'<path d="M-40,-62 Q-28,-72 -12,-74" fill="none" stroke="{m["hair_hi"]}" stroke-width="3" stroke-linecap="round" opacity=".45"/>')
    if cowlick:
        for bx, by_, tx, ty in [(-16, -103, -38 - 8 * t, -136), (-4, -108, -18 - 8 * t, -150), (8, -106, 4 - 6 * t, -142)]:
            d = tube((bx, by_), ((bx + tx) / 2 + 6, (by_ + ty) / 2), (tx, ty), lambda u: 12 * (1 - u) + 2)
            g.append(shape(d, m["hair"], m["hair_edge"], m["ew"] * 0.85))
    # features
    fx = 34 * t
    sp = 25 * (1 - 0.34 * t)
    eyes = [(fx - sp, 8), (fx + sp, 8)]
    if t > 0.82:
        eyes = [eyes[1]]
    for i, (ex, ey) in enumerate(eyes):
        side = -1 if (len(eyes) == 2 and i == 0) else 1
        es = e["es"]
        cx, cy = ex + e["lx"], ey + e["ly"]
        if mat == "amber":
            g.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{13*es:.1f}" ry="{15*es:.1f}" fill="{C["amber_core"]}" opacity=".55" filter="url(#b4)"/>')
            g.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{8.5*es:.1f}" ry="{11.5*es:.1f}" fill="#fffaf0"/>')
            g.append(f'<ellipse cx="{cx+2:.1f}" cy="{cy+1:.1f}" rx="{3.2*es:.1f}" ry="{4.2*es:.1f}" fill="{C["amber_dark"]}"/>')
        else:
            g.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{8.5*es:.1f}" ry="{11.5*es:.1f}" fill="{m["eye"]}"/>')
            g.append(f'<circle cx="{cx-2.6:.1f}" cy="{cy-4.4:.1f}" r="{2.7*es:.1f}" fill="#fff"/>')
        lid = e["lid"]
        if lid > 0.02:
            top = ey - 15 * es
            low = top + lid * 27 * es
            g.append(f'<path d="M{ex-12:.1f},{top-2:.1f} L{ex+12:.1f},{top-2:.1f} L{ex+12:.1f},{low:.1f} Q{ex:.1f},{low+4:.1f} {ex-12:.1f},{low:.1f} Z" fill="{m["lid"]}"/>')
            g.append(f'<path d="M{ex-10:.1f},{low+0.5:.1f} Q{ex:.1f},{low+4.5:.1f} {ex+10:.1f},{low+0.5:.1f}" fill="none" stroke="{m["lash"]}" stroke-width="2.6" stroke-linecap="round"/>')
        # brows: inner end toward the face centre
        bin_, bout = e["bi"], e["bo"]
        if e.get("asym") and side == 1:
            bin_, bout = -9, -10           # the raised brow of temptation
        by = ey - 24 + e["by"]
        inner = (ex - 9 * side, by + bin_ * 0.6)
        outer = (ex + 12 * side, by + bout * 0.6)
        mid = (ex + 2 * side, by - 3 + (bin_ + bout) * 0.25)
        bw = 8 if e.get("firm") else 7
        g.append(shape(tube(inner, mid, outer, lambda u: bw - 3.5 * u), m["brow"], m["brow"], 0.8))
    # nose (front/three-quarter only; in profile the bump is part of the head outline)
    if t <= 0.82:
        nx = fx + 5
        g.append(f'<path d="M{nx:.1f},18 Q{nx-7:.1f},30 {nx+2:.1f},33" fill="none" stroke="{m["skin_edge"]}" stroke-width="2.6" stroke-linecap="round" opacity=".85"/>')
    # mouth
    mx, my, mw = fx + 3 + (6 * t), 52, e["mw"] * (1 - 0.3 * t)
    if e["mo"]:
        g.append(f'<ellipse cx="{mx:.1f}" cy="{my+2:.1f}" rx="6.5" ry="7.5" fill="{m["mouth"]}"/>')
    else:
        x0, x1 = mx - mw / 2, mx + mw / 2
        y1 = my - (3 if e.get("asym") else 0)
        g.append(f'<path d="M{x0:.1f},{my:.1f} Q{mx:.1f},{my+e["mc"]:.1f} {x1:.1f},{y1:.1f}" fill="none" stroke="{m["mouth"]}" stroke-width="{4 if e.get("firm") else 3.4}" stroke-linecap="round"/>')
    if rim:
        g.append(f'<path d="{sk}" fill="none" stroke="url(#{rim})" stroke-width="3.5"/>')
        g.append(f'<path d="{hp}" fill="none" stroke="url(#{rim})" stroke-width="3"/>')
    return "".join(g)


# ------------------------------------------------------------------ body
def hand(p, ang, m, thumb=1, s=1.0):
    """Mitten hand with a thumb. ang = direction the hand points (deg, 0 = +x)."""
    rot = ang - 90
    palm = "M-15,-2 C-16,18 -12,32 0,33 C12,32 16,18 15,-2 Z"
    th = f"M{8*thumb},4 C{20*thumb},2 {24*thumb},14 {16*thumb},22 C{12*thumb},26 {8*thumb},20 {8*thumb},14 Z"
    fingers = f'<path d="M-5,22 v9 M5,22 v9" stroke="{m["skin_edge"]}" stroke-width="1.8" opacity=".55" stroke-linecap="round"/>'
    return (f'<g transform="translate({p[0]:.1f},{p[1]:.1f}) rotate({rot:.1f}) scale({s})">'
            f'{shape(th, m["skin"], m["skin_edge"], m["ew"])}{shape(palm, m["skin"], m["skin_edge"], m["ew"])}{fingers}</g>')


def bend(a, b, c):
    v1, v2 = norm(sub(b, a)), norm(sub(c, b))
    return math.degrees(math.acos(max(-1, min(1, v1[0] * v2[0] + v1[1] * v2[1]))))


def limb_shape(a, b, c, w0, w1, w2, fill, edge, ew):
    """One seamless limb: a single smooth tube when nearly straight, two joined tubes when bent.
    Outline pass then fill pass, so the joint shows no inner seam."""
    if bend(a, b, c) < 28:
        d = tube(a, b, c, lambda u: w0 + (w2 - w0) * u)
    else:
        d = seg(a, b, w0, w1) + " " + seg(b, c, w1, w2)
    out = (f'<path d="{d}" fill="{edge}" stroke="{edge}" stroke-width="{ew*2}" stroke-linejoin="round"/>'
           f'<path d="{d}" fill="{fill}"/>')
    if bend(a, b, c) >= 28:   # a crease on the inside of the joint
        v1, v2 = norm(sub(a, b)), norm(sub(c, b))
        inside = norm(add(v1, v2))
        p0 = add(b, mul(inside, w1 * 0.42))
        out += (f'<path d="M{fmt(add(p0, mul(v1, 9)))} Q{fmt(add(p0, mul(inside, -3)))} {fmt(add(p0, mul(v2, 9)))}" '
                f'fill="none" stroke="{edge}" stroke-width="2.2" opacity=".7" stroke-linecap="round"/>')
    return out, d


def arm(sh, el, wr, m, thumb=1, rim=None):
    d = norm(sub(wr, el))
    cuff_a, cuff_b = sub(wr, mul(d, 14)), add(wr, mul(d, 3))
    cuff = seg(cuff_a, cuff_b, 44, 43)
    hpos = add(wr, mul(d, 13))
    sleeve, sd = limb_shape(sh, el, wr, 50, 45, 40, m["knit"], m["knit_edge"], m["ew"])
    g = [hand(hpos, math.degrees(math.atan2(d[1], d[0])), m, thumb, 1.08), sleeve,
         shape(cuff, m["rib"], m["knit_edge"], m["ew"])]
    nv = perp(d)
    for k in (-14, -6, 2, 10):
        a = add(cuff_a, mul(nv, k)); b = add(cuff_b, mul(nv, k))
        g.append(f'<path d="M{fmt(a)} L{fmt(b)}" stroke="{m["rib_line"]}" stroke-width="1.6" opacity=".55"/>')
    return "".join(g)


def shoe(an, view, m, face=1):
    x, y = an
    if view == "front":
        up = f"M{x-26},{y+20} C{x-28},{y-4} {x-16},{y-10} {x},{y-10} C{x+16},{y-10} {x+28},{y-4} {x+26},{y+20} Z"
        sole = f"M{x-29},{y+16} L{x+29},{y+16} Q{x+31},{y+27} {x+24},{y+28} L{x-24},{y+28} Q{x-31},{y+27} {x-29},{y+16} Z"
        lace = f'<path d="M{x-8},{y-2} h16 M{x-9},{y+5} h18" stroke="{m["shoe_edge"]}" stroke-width="2" opacity=".6" stroke-linecap="round"/>'
    else:
        f = face
        up = (f"M{x-24*f},{y+20} C{x-29*f},{y+2} {x-21*f},{y-12} {x-8*f},{y-12} L{x+8*f},{y-9} "
              f"C{x+22*f},{y} {x+40*f},{y+3} {x+52*f},{y+10} C{x+60*f},{y+14} {x+59*f},{y+22} {x+52*f},{y+22} Z")
        sole = (f"M{x-28*f},{y+16} L{x+56*f},{y+16} Q{x+62*f},{y+26} {x+52*f},{y+28} L{x-24*f},{y+28} "
                f"Q{x-31*f},{y+26} {x-28*f},{y+16} Z")
        lace = (f'<path d="M{x+6*f},{y-4} l{8*f},6 M{x+14*f},{y-1} l{8*f},6 M{x+22*f},{y+2} l{7*f},5" '
                f'stroke="{m["shoe_edge"]}" stroke-width="2" opacity=".55" stroke-linecap="round"/>')
    return (shape(up, m["shoe"], m["shoe_edge"], m["ew"]) + shape(sole, m["sole"], m["shoe_edge"], m["ew"]) + lace)


def leg(hp, kn, an, m, view, face=1, rim=None):
    trousers, _ = limb_shape(hp, kn, an, 56, 50, 44, m["pants"], m["pants_edge"], m["ew"])
    return trousers + shoe(an, view, m, face)


def torso(top, bot, ws, wh, m, rim=None):
    u = norm(sub(bot, top)); n = perp(u)
    shL, shR = add(add(top, mul(n, ws / 2)), mul(u, 18)), add(sub(top, mul(n, ws / 2)), mul(u, 18))
    cL, cR = add(top, mul(n, ws / 2 - 30)), sub(top, mul(n, ws / 2 - 30))
    hL, hR = add(bot, mul(n, wh / 2)), sub(bot, mul(n, wh / 2))
    kL, kR = add(top, mul(n, ws / 2)), sub(top, mul(n, ws / 2))
    body = (f"M{fmt(cR)} L{fmt(cL)} Q{fmt(kL)} {fmt(shL)} L{fmt(hL)} Q{fmt(add(bot, mul(u, 5)))} {fmt(hR)} "
            f"L{fmt(shR)} Q{fmt(kR)} {fmt(cR)} Z")
    g = [shape(body, m["knit"], m["knit_edge"], m["ew"])]
    mid = lerp(top, bot, 0.55)
    g.append(shade_in(body, mid[0] + ws * 0.32, mid[1], ws * 0.28, abs(bot[1] - top[1]) * 0.62, m["shade"], m["shade_op"], "b14"))
    g.append(shade_in(body, top[0], top[1] + 26, ws * 0.32, 22, m["shade"], m["shade_op"] * 0.9, "b8"))
    # ribbed hem band
    b0 = sub(bot, mul(u, 22))
    rL, rR = add(b0, mul(n, wh / 2 + 1)), sub(b0, mul(n, wh / 2 + 1))
    band = f"M{fmt(rL)} L{fmt(hL)} Q{fmt(add(bot, mul(u, 5)))} {fmt(hR)} L{fmt(rR)} Z"
    g.append(shape(band, m["rib"], m["knit_edge"], m["ew"]))
    s = -wh / 2 + 7
    while s < wh / 2 - 4:
        a = add(b0, mul(n, s)); b = add(bot, mul(n, s))
        g.append(f'<path d="M{fmt(a)} L{fmt(b)}" stroke="{m["rib_line"]}" stroke-width="1.6" opacity=".5"/>')
        s += 9
    # two soft folds
    f1a, f1b = lerp(shL, hL, 0.35), lerp(lerp(shL, hL, 0.55), mid, 0.35)
    g.append(f'<path d="M{fmt(f1a)} Q{fmt(lerp(f1a, f1b, .5))} {fmt(f1b)}" fill="none" stroke="{m["knit_edge"]}" stroke-width="2" opacity=".35" stroke-linecap="round"/>')
    if rim:
        g.append(f'<path d="{body}" fill="none" stroke="url(#{rim})" stroke-width="3.2"/>')
    return "".join(g), body


def collar(top, up, m, t):
    """Roll-neck: a soft ribbed tube around the neck, under the chin."""
    w = 92 * (1 - 0.22 * t)
    n = perp(up)
    c0 = add(top, mul(up, 4)); c1 = sub(top, mul(up, 36))
    d = (f"M{fmt(add(c0, mul(n, w/2)))} Q{fmt(add(lerp(c0, c1, .5), mul(n, w/2 + 6)))} {fmt(add(c1, mul(n, w/2 - 6)))} "
         f"Q{fmt(sub(c1, mul(up, 6)))} {fmt(sub(c1, mul(n, w/2 - 6)))} Q{fmt(sub(lerp(c0, c1, .5), mul(n, w/2 + 6)))} {fmt(sub(c0, mul(n, w/2)))} "
         f"Q{fmt(add(c0, mul(up, 8)))} {fmt(add(c0, mul(n, w/2)))} Z")
    g = [shape(d, m["rib"], m["knit_edge"], m["ew"])]
    for k in (0.3, 0.62):
        p = lerp(c0, c1, k)
        g.append(f'<path d="M{fmt(add(p, mul(n, w/2 - 2)))} Q{fmt(add(p, mul(up, 5)))} {fmt(sub(p, mul(n, w/2 - 2)))}" fill="none" stroke="{m["rib_line"]}" stroke-width="2" opacity=".55"/>')
    return "".join(g)


# ------------------------------------------------------------------ poses (feet at y=0, ~575 tall)
POSES = {
    "front": dict(view="front", t=0.0, head=(0, -462), tilt=0, top=(0, -362), bot=(0, -176), ws=206, wh=166,
                  shL=(-96, -340), elL=(-114, -262), wrL=(-118, -192), shR=(96, -340), elR=(114, -262), wrR=(118, -192),
                  hpL=(-36, -168), knL=(-38, -94), anL=(-38, -30), hpR=(36, -168), knR=(38, -94), anR=(38, -30)),
    "tq": dict(view="tq", t=0.55, head=(10, -462), tilt=2, top=(4, -362), bot=(0, -176), ws=178, wh=146,
               shL=(-62, -340), elL=(-78, -262), wrL=(-84, -192), shR=(70, -338), elR=(88, -262), wrR=(94, -194),
               hpL=(-24, -168), knL=(-28, -94), anL=(-32, -30), hpR=(28, -168), knR=(34, -94), anR=(36, -30)),
    "side": dict(view="side", t=0.95, head=(14, -462), tilt=4, top=(4, -362), bot=(0, -176), ws=124, wh=114,
                 shL=(-4, -340), elL=(-6, -262), wrL=(2, -192), shR=(8, -338), elR=(12, -262), wrR=(22, -194),
                 hpL=(-4, -168), knL=(-6, -94), anL=(-12, -30), hpR=(6, -168), knR=(8, -94), anR=(10, -30)),
    "seated": dict(view="side", t=0.95, head=(62, -384), tilt=10, top=(34, -286), bot=(0, -112), ws=124, wh=114,
                   shL=(28, -268), elL=(48, -196), wrL=(112, -184), shR=(36, -266), elR=(60, -194), wrR=(124, -180),
                   hpL=(-2, -104), knL=(76, -104), anL=(80, -30), hpR=(6, -102), knR=(84, -100), anR=(92, -30)),
    "slump": dict(view="side", t=0.9, head=(118, -262), tilt=48, top=(44, -206), bot=(0, -44), ws=124, wh=114,
                  shL=(40, -192), elL=(84, -150), wrL=(88, -100), shR=(50, -190), elR=(96, -144), wrR=(100, -96),
                  hpL=(-2, -36), knL=(58, -96), anL=(98, -30), hpR=(6, -36), knR=(66, -92), anR=(108, -30)),
    "decided": dict(view="tq", t=0.4, head=(4, -470), tilt=-4, top=(2, -366), bot=(0, -176), ws=190, wh=150,
                    shL=(-70, -344), elL=(-92, -266), wrL=(-96, -196), shR=(74, -342), elR=(94, -266), wrR=(98, -196),
                    hpL=(-34, -168), knL=(-46, -94), anL=(-54, -30), hpR=(34, -168), knR=(44, -94), anR=(52, -30)),
    "phone": dict(view="tq", t=0.55, head=(14, -452), tilt=16, top=(6, -360), bot=(0, -176), ws=178, wh=146,
                  shL=(-62, -338), elL=(-62, -268), wrL=(22, -282), shR=(70, -336), elR=(92, -268), wrR=(40, -290),
                  hpL=(-24, -168), knL=(-28, -94), anL=(-32, -30), hpR=(28, -168), knR=(34, -94), anR=(36, -30)),
}


def figure(pose, x, y, s=1.0, expr="neutral", mat="flesh", flip=False, rim=None, arms=True, legs=True,
           cowlick=True, tail_to=None, lean=0, opacity=1.0, glow=False, extra_back=""):
    """Whole character. tail_to = (x,y) in the figure's local units: replaces the legs by a glowing thread."""
    P = POSES[pose]; m = M(mat)
    face = 1
    t = P["t"]
    near_first = P["view"] != "front"
    g = []
    # contact shadow (only for things standing on the floor)
    if legs and mat == "flesh":
        g.append(f'<ellipse cx="0" cy="2" rx="{110 if P["view"]=="front" else 96}" ry="14" fill="url(#contact)"/>')
    g.append(extra_back)
    far_arm = arm(P["shL"], P["elL"], P["wrL"], m, thumb=1, rim=None) if arms else ""
    near_arm = arm(P["shR"], P["elR"], P["wrR"], m, thumb=1, rim=rim) if arms else ""
    if P["view"] == "front":
        if legs:
            g.append(leg(P["hpL"], P["knL"], P["anL"], m, "front"))
            g.append(leg(P["hpR"], P["knR"], P["anR"], m, "front", rim=rim))
    else:
        g.append(far_arm)
        if legs:
            g.append(leg(P["hpL"], P["knL"], P["anL"], m, "side", face))
            g.append(leg(P["hpR"], P["knR"], P["anR"], m, "side", face, rim=rim))
    if tail_to is not None:
        g.append(tail(P["bot"], tail_to, P["wh"]))
    tor, body = torso(P["top"], P["bot"], P["ws"], P["wh"], m, rim=rim)
    g.append(tor)
    if P["view"] == "front":
        g.append(far_arm)
    up = norm(sub(P["top"], P["bot"]))
    g.append(collar(P["top"], up, m, t))
    hx, hy = add(P["head"], mul(up, -8))
    g.append(f'<g transform="translate({hx:.1f},{hy:.1f}) rotate({P["tilt"]}) scale(.9)">{head(t, expr, mat, cowlick, rim)}</g>')
    g.append(near_arm)
    inner = "".join(g)
    sc = f"scale({-s},{s})" if flip else f"scale({s})"
    rot = f" rotate({lean} 0 -200)" if lean else ""
    out = f'<g transform="translate({x},{y}) {sc}{rot}" opacity="{opacity}" stroke-linecap="round">'
    if glow:
        out += f'<g filter="url(#b14)" opacity=".85">{inner}</g>'
    out += inner + "</g>"
    return out


def tail(bot, to, wh):
    """The Pull's lower body: the jumper's hem tapers into one glowing thread that ends on the object."""
    a = (bot[0], bot[1] - 10)
    c = to
    mid = (a[0] + (c[0] - a[0]) * 0.32, a[1] + (c[1] - a[1]) * 0.74)
    def w(u):
        return max(4.5, wh * 0.9 * (1 - u / 0.24) ** 2.2) if u < 0.24 else 4.5 - 1.8 * (u - 0.24)
    d = tube(a, mid, c, w, n=60)
    core = tube(a, mid, c, lambda u: max(1.6, w(u) * 0.35), n=60)
    return (f'<path d="{d}" fill="{C["amber"]}" opacity=".55" filter="url(#b8)"/>'
            f'<path d="{d}" fill="url(#gAmber)" stroke="{C["amber_core"]}" stroke-width="1.6"/>'
            f'<path d="{core}" fill="{C["amber_core"]}" opacity=".8"/>')


def thread_curl(base, s=1.0, seed=2):
    """Stage 1: only a thread rising from the object, ending in a small curl, like smoke that has decided."""
    bx, by = base
    pts = []
    for i in range(80):
        u = i / 79
        if u < 0.65:
            k = u / 0.65
            pts.append((bx - 40 * k + 18 * math.sin(k * 5), by - 150 * k))
        else:
            k = (u - 0.65) / 0.35
            ang = k * 5.2
            r = 26 * (1 - 0.65 * k)
            cx, cy = bx - 40 + 18 * math.sin(5) - 26, by - 150
            pts.append((cx + r * math.cos(ang), cy - r * math.sin(ang)))
    d = "M" + " L".join(fmt(p) for p in pts)
    return (f'<path d="{d}" fill="none" stroke="{C["amber"]}" stroke-width="12" opacity=".5" filter="url(#b8)"/>'
            f'<path d="{d}" fill="none" stroke="{C["amber"]}" stroke-width="5" stroke-linecap="round"/>'
            f'<path d="{d}" fill="none" stroke="{C["amber_core"]}" stroke-width="1.8" stroke-linecap="round"/>')


def embers(cx, cy, spread, n, seed):
    r = random.Random(seed); out = []
    for _ in range(n):
        x = cx + r.uniform(-spread, spread); y = cy + r.uniform(-spread, spread * 0.6)
        rr = r.uniform(1.4, 3.4)
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr*2.4:.1f}" fill="{C["amber"]}" opacity=".35" filter="url(#b4)"/>'
                   f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr:.1f}" fill="{C["amber_hi"]}" opacity="{r.uniform(.5, .95):.2f}"/>')
    return "".join(out)


def phone_flat(x, y, s=1.0, lit=True):
    """A phone lying face-up on a surface, seen from the side, with its amber glow."""
    g = []
    if lit:
        g.append(f'<ellipse cx="{x}" cy="{y}" rx="{150*s}" ry="{26*s}" fill="url(#pool)"/>')
        g.append(f'<ellipse cx="{x}" cy="{y-40*s}" rx="{60*s}" ry="{60*s}" fill="{C["amber"]}" opacity=".12" filter="url(#b26)"/>')
    g.append(f'<rect x="{x-34*s}" y="{y-9*s}" width="{68*s}" height="{9*s}" rx="{3*s}" fill="#15161b" stroke="#4a4f5b" stroke-width="1.5"/>')
    if lit:
        g.append(f'<rect x="{x-30*s}" y="{y-10*s}" width="{60*s}" height="{3*s}" rx="1.5" fill="{C["amber_hi"]}"/>')
    return "".join(g)


# ------------------------------------------------------------------ sheet helpers
def svg(w, h, body, defs):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{defs}'
            f'<rect width="{w}" height="{h}" fill="{C["bg"]}"/>{body}'
            f'<rect width="{w}" height="{h}" filter="url(#grain)"/></svg>')


def text(x, y, t, size=22, color="#8a8e98", anchor="middle", font="Avenir Next", weight=500, extra=""):
    t = t.replace("&", "&amp;")
    return (f'<text x="{x}" y="{y}" fill="{color}" font-family="{font}" font-size="{size}" font-weight="{weight}" '
            f'text-anchor="{anchor}" {extra}>{t}</text>')


def floor(x0, x1, y):
    return (f'<rect x="{x0}" y="{y}" width="{x1-x0}" height="60" fill="#0f1014"/>'
            f'<path d="M{x0},{y} H{x1}" stroke="#262830" stroke-width="2"/>')


def swatch(x, y, col, name):
    return (f'<circle cx="{x}" cy="{y}" r="20" fill="{col}" stroke="#2a2c33" stroke-width="2"/>'
            + text(x + 34, y + 7, name, 18, "#8a8e98", "start", font="Menlo", weight=400))


# ------------------------------------------------------------------ sheet 1: the hero
def hero_sheet():
    global D
    D = Defs()
    W, H = 1920, 1560
    b = [text(80, 86, "OWEN  —  the hero (working name)", 42, "#ecebe4", "start", weight=600),
         text(80, 128, "A dark mop of hair with a cowlick, a slate-blue roll-neck jumper, charcoal trousers, grey canvas shoes. "
              "Soft vector shading, lit from the upper left.", 22, "#8a8e98", "start")]
    # turnaround
    b.append(floor(60, 1060, 760))
    for i, (pn, lab) in enumerate([("front", "front"), ("tq", "three-quarter"), ("side", "side"), ("phone", "on the phone")]):
        x = 190 + i * 250
        extra = ""
        b.append(figure(pn, x, 760, 0.92, "tempted" if pn == "phone" else "neutral"))
        if pn == "phone":
            b.append(f'<g transform="translate({x},{760}) scale(.92)"><rect x="18" y="-312" width="34" height="58" rx="7" fill="#15161b" stroke="#4a4f5b" stroke-width="2" transform="rotate(-18 35 -283)"/>'
                     f'<rect x="22" y="-308" width="26" height="48" rx="4" fill="{C["amber"]}" opacity=".9" transform="rotate(-18 35 -283)"/></g>')
        b.append(text(x, 800, lab))
    # expressions
    b.append(text(1180, 200, "FACE", 24, "#ecebe4", "start", weight=600))
    b.append(text(1180, 230, "dark oval eyes with one highlight, brows do the acting, a small nose, a short mouth", 18, "#8a8e98", "start"))
    names = [("neutral", "neutral"), ("worn", "worn out"), ("ashamed", "ashamed"), ("caught", "caught"), ("tempted", "tempted"), ("decided", "decided")]
    for i, (e, lab) in enumerate(names):
        cx = 1300 + (i % 3) * 230; cy = 370 + (i // 3) * 270
        b.append(f'<g transform="translate({cx},{cy}) scale(.95)">{head(0.0 if e != "tempted" else 0.25, e)}</g>')
        b.append(text(cx, cy + 126, lab, 20))
    # acting poses
    b.append(floor(60, 1060, 1420))
    # seated at the desk with the phone
    sx = 210
    b.append(f'<g transform="translate({sx},1420)">'
             f'<rect x="-40" y="-104" width="96" height="12" rx="4" fill="#2a2e38" stroke="#3c414d" stroke-width="2"/>'
             f'<path d="M-30,-92 v92 M44,-92 v92" stroke="#2a2e38" stroke-width="8" stroke-linecap="round"/>'
             f'<rect x="-48" y="-232" width="12" height="134" rx="5" fill="#2a2e38" stroke="#3c414d" stroke-width="2"/>'
             f'</g>')
    b.append(figure("seated", sx, 1420, 1.0, "tempted", legs=True))
    b.append(f'<rect x="{sx+90}" y="1250" width="260" height="14" rx="4" fill="#2c303a" stroke="#40454f" stroke-width="2"/>'
             f'<path d="M{sx+330},1264 v156" stroke="#2c303a" stroke-width="10"/>')
    b.append(phone_flat(sx + 200, 1250, 1.0))
    b.append(text(sx + 110, 1462, "at the desk, tempted"))
    b.append(figure("slump", 590, 1420, 1.0, "ashamed"))
    b.append(text(650, 1462, "losing"))
    b.append(figure("decided", 930, 1420, 0.92, "decided"))
    b.append(text(930, 1462, "the test: he stands up"))
    # palette
    b.append(text(1180, 960, "PALETTE", 24, "#ecebe4", "start", weight=600))
    sw = [(C["skin"], "skin  #f0cfad"), (C["hair"], "hair  #2c2328"), (C["knit"], "jumper  #7590b2"),
          (C["pants"], "trousers  #3a4252"), (C["shoe"], "shoes  #dde0e6"), (C["amber"], "amber  #f2a33a (never on him)")]
    for i, (col, nm) in enumerate(sw):
        b.append(swatch(1200 + (i % 2) * 330, 1010 + (i // 2) * 56, col, nm))
    rules = ["• the only cool colour in a scene; the Pull is the only warm one",
             "• edges are a darker shade of each colour, never black ink",
             "• silhouette test: hair mop + cowlick + roll-neck read in black",
             "• about 3.7 heads tall: young adult, not a mascot"]
    for i, r in enumerate(rules):
        b.append(text(1180, 1210 + i * 36, r, 20, "#8a8e98", "start"))
    return svg(W, H, "".join(b), D.svg())


# ------------------------------------------------------------------ sheet 2: the Pull
def pull_sheet():
    global D
    D = Defs()
    W, H = 1920, 1400
    b = [text(80, 86, "THE PULL  —  the antagonist (working name)", 42, C["amber"], "start", weight=600),
         text(80, 128, "His double, made of amber light. It has his hair, his jumper, his face; its eyes are lit and it smiles. "
              "No legs: below the hem it is one thread tied to whatever feeds it.", 22, "#8a8e98", "start")]
    fy = 820
    b.append(floor(60, 1860, fy))
    labels = ["1 · a thread wakes up", "2 · it finds a face", "3 · it leans in", "4 · it is him"]
    # stage 1
    b.append(phone_flat(330, fy, 1.0))
    b.append(thread_curl((318, fy - 8)))
    b.append(embers(300, fy - 120, 50, 6, 1))
    # stage 2: small bust
    b.append(phone_flat(760, fy, 1.0))
    s2 = 0.62
    b.append(figure("front", 600, fy - 150, s2, "smile", "amber", arms=False, legs=False, cowlick=False,
                    tail_to=((760 - 600) / s2, 140 / s2), opacity=.72, glow=True))
    b.append(embers(620, fy - 330, 70, 7, 2))
    # stage 3: bigger, arms, leaning in
    b.append(phone_flat(1200, fy, 1.0))
    s3 = 0.86
    b.append(figure("tq", 1030, fy - 130, s3, "smile", "amber", legs=False, cowlick=False,
                    tail_to=((1200 - 1030) / s3, 122 / s3), lean=10, opacity=.88, glow=True))
    b.append(embers(1060, fy - 420, 90, 9, 3))
    # stage 4: behind him, the same silhouette
    b.append(phone_flat(1760, fy, 1.0))
    b.append(figure("side", 1520, fy - 18, 0.95, "smile", "amber", legs=False, cowlick=True,
                    tail_to=((1760 - 1520) / 0.95, 10 / 0.95), opacity=.92, glow=True))
    b.append(figure("side", 1580, fy, 0.95, "worn", rim="rimAmber"))
    b.append(embers(1540, fy - 420, 100, 10, 4))
    for i, x in enumerate([300, 700, 1110, 1590]):
        b.append(text(x, fy + 46, labels[i], 22, C["amber"] if i == 3 else "#8a8e98"))
    # faces side by side
    b.append(text(80, 960, "HIM  /  IT", 24, "#ecebe4", "start", weight=600))
    b.append(f'<g transform="translate(200,1110) scale(.95)">{head(0, "worn")}</g>')
    b.append(f'<g transform="translate(450,1110) scale(.95)"><g filter="url(#b14)" opacity=".8">{head(0, "smile", "amber")}</g>{head(0, "smile", "amber")}</g>')
    b.append(text(200, 1250, "him: dark eyes, tired")); b.append(text(450, 1250, "it: lit eyes, a smile", 22, C["amber"]))
    # voice + rules
    b.append(text(700, 960, "ITS VOICE", 24, "#ecebe4", "start", weight=600))
    b.append(text(700, 1010, "just one look.", 34, C["amber"], "start", font="Courier New", weight=700))
    b.append(text(700, 1056, "you've earned a minute.", 34, C["amber"], "start", font="Courier New", weight=700))
    b.append(text(700, 1100, "amber typewriter, lowercase, typed on letter by letter next to it", 19, "#8a8e98", "start"))
    b.append(text(700, 1128, "the narrator is the opposite: white, sentence case, at the bottom", 19, "#8a8e98", "start"))
    rules = ["• it is the only warm light in any scene: it lights his face",
             "• it never walks; it pays out thread, and goes slack when it loses",
             "• it grows 1 → 4 as it wins; only at 4 does it get his cowlick",
             "• it has the same face: by film's end you can't tell whose line it is"]
    for i, r in enumerate(rules):
        b.append(text(1240, 1000 + i * 38, r, 20, "#8a8e98", "start"))
    return svg(W, H, "".join(b), D.svg())


# ------------------------------------------------------------------ sheet 3: a frame of JUST ONE MORE
def sample_frame():
    global D
    D = Defs()
    W, H = 1920, 1080
    FY = 860
    b = []
    # wall, floor, skirting
    b.append(f'<linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#101117"/><stop offset="1" stop-color="#17181f"/></linearGradient>')
    b.append(f'<rect width="{W}" height="{FY}" fill="url(#wall)"/>')
    b.append(f'<rect y="{FY}" width="{W}" height="{H-FY}" fill="#0c0d10"/><rect y="{FY-14}" width="{W}" height="14" fill="#15161c"/>'
             f'<path d="M0,{FY} H{W}" stroke="#23252c" stroke-width="2"/>')
    # window with night city
    wx, wy, ww, wh = 210, 190, 400, 330
    b.append(f'<linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1222"/><stop offset="1" stop-color="#1d2c48"/></linearGradient>')
    b.append(f'<rect x="{wx-14}" y="{wy-14}" width="{ww+28}" height="{wh+28}" rx="8" fill="#1d2028"/>')
    b.append(f'<rect x="{wx}" y="{wy}" width="{ww}" height="{wh}" fill="url(#sky)"/>')
    b.append(f'<circle cx="{wx+300}" cy="{wy+70}" r="22" fill="#e9eefb"/><circle cx="{wx+300}" cy="{wy+70}" r="44" fill="#cfe0ff" opacity=".18" filter="url(#b8)"/>')
    r = random.Random(5)
    bx = wx
    while bx < wx + ww:
        bw_ = r.randint(36, 70); bh = r.randint(70, 190)
        b.append(f'<rect x="{bx}" y="{wy+wh-bh}" width="{bw_}" height="{bh}" fill="#0a0f1a"/>')
        for yy in range(wy + wh - bh + 12, wy + wh - 8, 16):
            for xx in range(bx + 6, bx + bw_ - 8, 12):
                if r.random() < .22:
                    b.append(f'<rect x="{xx}" y="{yy}" width="5" height="7" fill="#9fb8e8" opacity="{r.uniform(.35,.85):.2f}"/>')
        bx += bw_ + 4
    b.append(f'<path d="M{wx+ww/2},{wy} v{wh} M{wx},{wy+wh/2} h{ww}" stroke="#1d2028" stroke-width="10"/>')
    b.append(f'<rect x="{wx-30}" y="{wy+wh+12}" width="{ww+60}" height="14" rx="4" fill="#22252e"/>')
    # curtain
    b.append(f'<linearGradient id="cur" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#20242e"/><stop offset=".5" stop-color="#2b303c"/><stop offset="1" stop-color="#1a1d25"/></linearGradient>')
    b.append(f'<path d="M{wx+ww-40},{wy-30} C{wx+ww-10},{wy+120} {wx+ww+40},{wy+260} {wx+ww+20},{wy+wh+60} L{wx+ww+90},{wy+wh+60} '
             f'C{wx+ww+96},{wy+200} {wx+ww+70},{wy+80} {wx+ww+70},{wy-30} Z" fill="url(#cur)"/>')
    b.append(f'<path d="M{wx-60},{wy-34} H{wx+ww+110}" stroke="#2d313b" stroke-width="6" stroke-linecap="round"/>')
    # wall clock at 9:00
    b.append(f'<circle cx="1560" cy="250" r="64" fill="#1b1d24" stroke="#2f333d" stroke-width="6"/>'
             f'<circle cx="1560" cy="250" r="54" fill="#8e94a0" opacity=".55"/>')
    for k in range(12):
        a = math.radians(k * 30)
        b.append(f'<path d="M{1560+46*math.sin(a):.1f},{250-46*math.cos(a):.1f} L{1560+52*math.sin(a):.1f},{250-52*math.cos(a):.1f}" stroke="#20232a" stroke-width="3"/>')
    b.append(f'<path d="M1560,250 V206 M1560,250 H1528" stroke="#15161b" stroke-width="5" stroke-linecap="round"/><circle cx="1560" cy="250" r="5" fill="#15161b"/>')
    # shelf with books
    b.append(f'<rect x="1130" y="380" width="330" height="12" rx="3" fill="#252830"/>')
    bx = 1146
    for col, hh, ww_ in [("#3d4a5f", 78, 22), ("#4a5368", 92, 18), ("#2f3a4a", 70, 26), ("#56606f", 84, 16), ("#384252", 96, 24)]:
        b.append(f'<rect x="{bx}" y="{380-hh}" width="{ww_}" height="{hh}" rx="2" fill="{col}"/>'); bx += ww_ + 3
    b.append(f'<rect x="{bx+8}" y="320" width="62" height="60" rx="3" fill="#2a2f3a" transform="rotate(-14 {bx+8} 380)"/>')
    # desk (side view): top, legs, drawers
    DT = 690
    b.append(f'<rect x="760" y="{DT}" width="760" height="22" rx="4" fill="#2b2f39"/><rect x="760" y="{DT}" width="760" height="4" rx="2" fill="#454b58"/>')
    b.append(f'<rect x="790" y="{DT+22}" width="16" height="{FY-DT-22}" fill="#20232b"/><rect x="1300" y="{DT+22}" width="200" height="{FY-DT-22}" rx="3" fill="#20232b"/>'
             f'<path d="M1310,{DT+80} h180 M1310,{DT+130} h180" stroke="#2c303a" stroke-width="3"/><rect x="1380" y="{DT+50}" width="40" height="6" rx="3" fill="#3a3f4b"/>')
    # lamp (cool, on) lighting the open notebook = the work he means to do
    b.append(f'<polygon points="1418,478 1230,{DT} 1500,{DT} 1452,478" fill="#cfe0ff" opacity=".05" filter="url(#b8)"/>')
    b.append(f'<ellipse cx="1370" cy="{DT}" rx="150" ry="18" fill="url(#poolCool)"/>')
    b.append(f'<path d="M1470,{DT} h-50 M1445,{DT} L1470,560 L1420,470" fill="none" stroke="#3a3f4b" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>'
             f'<path d="M1398,452 L1462,452 L1478,492 L1394,492 Z" fill="#2d323d" transform="rotate(-24 1436 472)"/>')
    # laptop, open, screen toward him
    b.append(f'<rect x="1080" y="{DT-12}" width="210" height="12" rx="3" fill="#3a3f4b"/>')
    b.append(f'<path d="M1090,{DT-12} L1052,{DT-168} L1112,{DT-176} L1146,{DT-14} Z" fill="#cfe0ff" opacity=".85"/>')
    b.append(f'<path d="M1060,{DT-160} h40 M1064,{DT-148} h44 M1068,{DT-136} h30" stroke="#8ea3c7" stroke-width="3" opacity=".8"/>')
    b.append(f'<path d="M1090,{DT-12} L1052,{DT-168}" stroke="#2a2e37" stroke-width="5"/>')
    b.append(f'<ellipse cx="1040" cy="{DT-100}" rx="120" ry="90" fill="#cfe0ff" opacity=".08" filter="url(#b26)"/>')
    # chair
    b.append(f'<g><rect x="560" y="{FY-112}" width="110" height="14" rx="5" fill="#2a2e38"/>'
             f'<path d="M574,{FY-98} v98 M656,{FY-98} v98" stroke="#22252d" stroke-width="10" stroke-linecap="round"/>'
             f'<rect x="548" y="{FY-290}" width="16" height="190" rx="6" fill="#2a2e38"/></g>')
    # phone on the desk, close to his hand, and the Pull rising out of it
    px = 900
    b.append(phone_flat(px, DT, 1.15))
    # him
    b.append(figure("seated", 600, FY, 1.05, "tempted", rim="rimAmber"))
    # the Pull at stage 3, leaning toward him, between him and his work
    s3 = 0.8
    ox, oy = 840, 800
    b.append(figure("tq", ox, oy, s3, "smile", "amber", flip=True, legs=False, cowlick=False,
                    tail_to=(-(px - ox) / s3, (DT - 4 - oy) / s3), lean=-10, opacity=.9, glow=True))
    b.append(embers(840, 470, 110, 12, 8))
    # its words
    b.append(text(930, 380, "it could be important.", 38, C["amber"], "start", font="Courier New", weight=700))
    # the counter, top right, with an hour bar
    b.append(text(1830, 84, "MINUTES LOST", 20, "#7c818c", "end", font="Menlo", weight=400))
    b.append(text(1830, 140, "07", 54, C["amber"], "end", font="Menlo", weight=700))
    for k in range(60):
        on = k < 7
        b.append(f'<rect x="{1590 + k*4}" y="160" width="2.6" height="12" fill="{C["amber"] if on else "#2c2f37"}"/>')
    # narrator
    b.append(text(W / 2, 1000, "He gave himself one hour.", 32, "#ecebe4", "middle"))
    b.append(f'<rect width="{W}" height="{H}" fill="url(#vig)"/>')
    return svg(W, H, "".join(b), D.svg())


if __name__ == "__main__":
    for name, fn in [("v2_01_hero", hero_sheet), ("v2_02_pull", pull_sheet), ("v2_03_frame", sample_frame)]:
        f = OUT / f"{name}.svg"
        f.write_text(fn())
        subprocess.run(["rsvg-convert", "-o", str(OUT / f"{name}.png"), str(f)], check=True)
        print("wrote", name)
