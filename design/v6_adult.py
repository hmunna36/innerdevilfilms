#!/usr/bin/env python3
"""Character design v6 (19 Oct 2026): Owen as an adult.

The user on v5 / the rig test: "no, it feels like a kid". What made him read as a child: a huge round head
(under 3 heads tall), a short wide body with stubby legs, big centred eyes, thin arched brows, and the
three-stroke curl on a bald head (a baby's curl). Same simple construction, adult cues:
  - head about a quarter of his height; a short neck; a slimmer torso; longer legs and arms
  - smaller eyes set a little higher, heavier straighter brows, lids slightly lowered at rest
  - grown-up hair (one rigid shape that moves with the head, so it costs no animation)
Three hair options to pick from: A neat short crop, B the crop with light stubble, C short messy hair.

Run:  python3 -I v6_adult.py
"""
import math, subprocess, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import proper as P
import v3_flat as V
import v5_white as W5
from v3_flat import Fig, render_hero, place, text, K

OUT = pathlib.Path(__file__).parent
add, sub, mul, lerp, norm, perp, fmt = P.add, P.sub, P.mul, P.lerp, P.norm, P.perp, P.fmt
WHITE, LINE, HAIR = W5.WHITE, W5.LINE, "#25222a"
R = 62  # head radius (v5 was 80)

POSES = {
    "front": dict(t=0.0, head=(0, -432), tilt=0, top=(0, -358), bot=(0, -198), ws=100, wh=80,
                  shL=(-46, -346), elL=(-56, -276), wrL=(-60, -208), shR=(46, -346), elR=(56, -276), wrR=(60, -208),
                  hpL=(-20, -192), knL=(-21, -108), anL=(-21, -24), hpR=(20, -192), knR=(21, -108), anR=(21, -24)),
    "tq": dict(t=0.5, head=(6, -432), tilt=2, top=(2, -358), bot=(0, -198), ws=88, wh=72,
               shL=(-34, -346), elL=(-44, -276), wrL=(-48, -208), shR=(40, -345), elR=(50, -276), wrR=(54, -208),
               hpL=(-14, -192), knL=(-16, -108), anL=(-18, -24), hpR=(16, -192), knR=(18, -108), anR=(20, -24)),
    "side": dict(t=0.95, head=(8, -432), tilt=3, top=(2, -358), bot=(0, -198), ws=64, wh=60,
                 shL=(-2, -346), elL=(-4, -276), wrL=(2, -208), shR=(4, -345), elR=(8, -276), wrR=(14, -208),
                 hpL=(-2, -192), knL=(-4, -108), anL=(-8, -24), hpR=(4, -192), knR=(6, -108), anR=(6, -24)),
}

EXPR = {
    "neutral": dict(lid=.25, lx=0, ly=0, mc=1, mw=13, bi=1, bo=0, bags=0),
    "worn":    dict(lid=.5, lx=0, ly=1, mc=0, mw=12, bi=2, bo=3, bags=1),
    "tempted": dict(lid=.3, lx=4, ly=2, mc=3, mw=12, bi=0, bo=-4, bags=0, asym=1),
    "decided": dict(lid=.38, lx=0, ly=0, mc=0, mw=14, bi=4, bo=-1, bags=0, firm=1),
}


def hair_path(t, style):
    """Short adult hair in head-local units (radius 62). One rigid shape; it shifts toward the face as he turns."""
    if style == "messy":
        pts = [(-64, -4), (-72, -50), (-40, -80), (-12, -74), (-4, -88), (10, -74), (24, -84), (32, -70), (52, -74),
               (50, -60), (70, -44), (64, -6), (56, -22), (44, -30), (30, -28), (24, -40), (12, -30), (-6, -38), (-16, -26), (-36, -30), (-52, -20)]
        d_pts = pts
        def tx(p):
            x, y = p
            return (x * (1 - 0.18 * t) + 12 * t - (10 * t if x < -40 else 0), y)
        q = [tx(p) for p in d_pts]
        d = "M" + " L".join(fmt(p) for p in q[:12])
        d += " L" + " L".join(fmt(p) for p in q[12:]) + " Z"
        return d
    # neat crop with a side part: a smooth cap with a low fringe that sweeps across
    pts = [(-64, -4), (-70, -50), (-38, -76), (2, -75), (42, -75), (70, -48), (64, -6),
           (58, -20), (50, -31), (36, -35), (18, -41), (-6, -39), (-22, -31), (-36, -23), (-50, -20)]
    def tx(p):
        x, y = p
        return (x * (1 - 0.18 * t) + 12 * t - (10 * t if x < -40 else 0), y)
    p = [tx(a) for a in pts]
    return (f"M{fmt(p[0])} C{fmt(p[1])} {fmt(p[2])} {fmt(p[3])} C{fmt(p[4])} {fmt(p[5])} {fmt(p[6])} "
            f"C{fmt(p[7])} {fmt(p[8])} {fmt(p[9])} C{fmt(p[10])} {fmt(p[11])} {fmt(p[12])} C{fmt(p[13])} {fmt(p[14])} {fmt(p[0])} Z")


def head(f, t, expr, tf, style="crop", stubble=False):
    e = dict(EXPR[expr])
    circle = (f"M0,{-R} C{R*.55:.1f},{-R} {R},{-R*.55:.1f} {R},0 C{R},{R*.55:.1f} {R*.55:.1f},{R} 0,{R} "
              f"C{-R*.55:.1f},{R} {-R},{R*.55:.1f} {-R},0 C{-R},{-R*.55:.1f} {-R*.55:.1f},{-R} 0,{-R} Z")
    f.part(circle, "skin", tf)
    f.detail(V.shade(circle, 36 + 6 * t, 36, 46, 42, "#cfd0d6", .7), "", tf)
    fx = 28 * t
    if stubble:   # light stubble along the jaw: one soft shape, slides with the face
        s = (f"M{fx-34:.1f},24 C{fx-30:.1f},46 {fx-12:.1f},56 {fx:.1f},56 C{fx+12:.1f},56 {fx+30:.1f},46 {fx+34:.1f},24 "
             f"C{fx+22:.1f},36 {fx+10:.1f},40 {fx:.1f},40 C{fx-10:.1f},40 {fx-22:.1f},36 {fx-34:.1f},24 Z")
        f.detail(f'<g clip-path="{V.D.clip(circle)}"><path d="{s}" fill="#c3c5cc" opacity=".38" filter="url(#b3)"/></g>', "", tf)
    hd = hair_path(t, style)
    if t >= 0.2:   # hair covers the back of the head when he turns; one shape with the cap, so no seam
        k = 14 * t
        # drawn in the same direction as the cap (clockwise on screen) so the two never cancel where they overlap
        back = (f"M-4,-62 C{-20+k:.1f},-58 {-32+k:.1f},-42 {-40+k:.1f},-20 C{-46+k:.1f},-8 {-52+k:.1f},2 -58,14 "
                f"C-65,6 -67,-2 -68,-14 C-70,-46 -50,-76 -4,-76 Z")
        hd = back + " " + hd
    f.part(hd, "hairU", tf)
    sp = 19 * (1 - 0.35 * t)
    eyes = [(fx - sp, -2), (fx + sp, -2)] if t <= 0.82 else [(fx + sp, -2)]
    hs = []
    for i, (ex, ey) in enumerate(eyes):
        side = -1 if (len(eyes) == 2 and i == 0) else 1
        cx, cy = ex + e["lx"], ey + e["ly"]
        hs.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="5.4" ry="6.6" fill="#141217"/><circle cx="{cx-1.6:.1f}" cy="{cy-2.4:.1f}" r="1.6" fill="#fff"/>')
        top = ey - 8.5; low = top + e["lid"] * 15
        hs.append(f'<path d="M{ex-8:.1f},{top-2:.1f} L{ex+8:.1f},{top-2:.1f} L{ex+8:.1f},{low:.1f} Q{ex:.1f},{low+2:.1f} {ex-8:.1f},{low:.1f} Z" fill="{WHITE}"/>'
                  f'<path d="M{ex-7:.1f},{low+0.3:.1f} Q{ex:.1f},{low+2.2:.1f} {ex+7:.1f},{low+0.3:.1f}" fill="none" stroke="#141217" stroke-width="2.2" stroke-linecap="round"/>')
        if e.get("bags"):
            hs.append(f'<path d="M{ex-5.5:.1f},{ey+10:.1f} Q{ex:.1f},{ey+13:.1f} {ex+5.5:.1f},{ey+10:.1f}" fill="none" stroke="#9a9ba3" stroke-width="1.8" stroke-linecap="round"/>')
        bi, bo = e["bi"], e["bo"]
        if e.get("asym") and side == 1:
            bi, bo = -6, -7
        by = ey - 15
        inner = (ex - 7 * side, by + bi * 0.5); outer = (ex + 8 * side, by + bo * 0.5)
        mid = (ex + 0.5 * side, by - 0.8 + (bi + bo) * 0.2)
        bw = 5.6 if e.get("firm") else 5.0
        hs.append(f'<path d="{P.tube(inner, mid, outer, lambda u: bw - 1.6 * u)}" fill="{HAIR}"/>')
    mx, my, mw = fx + 2 + 5 * t, 27, e["mw"] * (1 - 0.3 * t)
    y1 = my - (2 if e.get("asym") else 0)
    hs.append(f'<path d="M{mx-mw/2:.1f},{my:.1f} Q{mx:.1f},{my+e["mc"]:.1f} {mx+mw/2:.1f},{y1:.1f}" fill="none" stroke="#2a2326" stroke-width="{3 if e.get("firm") else 2.7}" stroke-linecap="round"/>')
    f.detail("".join(hs), "", tf)


def arm(f, sh, el, wr, kind):
    d = norm(sub(wr, el))
    W5.limb(f, sh, el, wr, 22, 19, kind)
    hp = add(wr, mul(d, 7))
    ang = math.degrees(math.atan2(d[1], d[0])) - 90
    tf = f"translate({hp[0]:.1f},{hp[1]:.1f}) rotate({ang:.1f}) scale(.82)"
    f.part("M6,2 C15,0 18,9 13,15 C10,18 6,14 6,10 Z", kind, tf)
    f.part("M-11,-3 C-12,11 -9,21 0,22 C9,21 12,11 11,-3 Z", kind, tf)


def leg(f, hp, kn, an, front, kind):
    W5.limb(f, hp, kn, an, 26, 22, kind)
    x, y = an
    if front:
        f.part(f"M{x-14},{y+16} C{x-16},{y-1} {x-8},{y-6} {x},{y-6} C{x+8},{y-6} {x+16},{y-1} {x+14},{y+16} Q{x},{y+21} {x-14},{y+16} Z", kind)
    else:
        f.part(f"M{x-12},{y+16} C{x-15},{y} {x-8},{y-6} {x},{y-6} C{x+10},{y-4} {x+26},{y+2} {x+29},{y+10} "
               f"C{x+31},{y+17} {x+27},{y+20} {x+20},{y+20} L{x-8},{y+20} Q{x-12},{y+20} {x-12},{y+16} Z", kind)


def build(pose, expr="neutral", style="crop", stubble=False):
    p = POSES[pose]; f = Fig(); t = p["t"]; front = pose == "front"
    f.detail(f'<ellipse cx="0" cy="1" rx="{66 if front else 58}" ry="9" fill="url(#contact)"/>')
    if not front:
        arm(f, p["shL"], p["elL"], p["wrL"], "far")
    leg(f, p["hpL"], p["knL"], p["anL"], front, "skin" if front else "far")
    leg(f, p["hpR"], p["knR"], p["anR"], front, "skin")
    W5.body(f, p["top"], p["bot"], p["ws"], p["wh"])
    # a short neck: the clearest adult cue after the head size
    f.part(P.tube(add(p["top"], (0, 6)), add(p["top"], (p["head"][0] * 0.4, -18)), add(p["top"], (p["head"][0] * 0.7, -36)), lambda u: 26 - 2 * u), "skin")
    if front:
        arm(f, p["shL"], p["elL"], p["wrL"], "skin"); arm(f, p["shR"], p["elR"], p["wrR"], "skin")
    hx, hy = p["head"]
    head(f, t, expr, f"translate({hx},{hy}) rotate({p['tilt']})", style, stubble)
    if not front:
        arm(f, p["shR"], p["elR"], p["wrR"], "skin")
    return f


def options_sheet():
    V.D = V.Defs()
    Wd, H = 1920, 1300
    b = [W5.card_bg(Wd, H),
         text(80, 80, "OWEN AS AN ADULT  —  pick one", 42, "#ecebe4", "start", 600),
         text(80, 118, "Same simple build. Adult cues: head about a quarter of his height, a neck, a slimmer body, longer legs, "
              "smaller eyes, heavier brows, grown-up hair.", 22, "#9a9ea8", "start")]
    FY = 700
    b.append(W5.floor(40, 1880, FY))
    # the current one, for comparison (same floor, same scale)
    b.append(f'<g opacity=".55">{W5.owen("front", 170, FY, 1.0, "neutral")}</g>')
    b.append(text(170, FY + 40, "now: reads as a kid", 20, "#c98b8b"))
    opts = [("A", "crop", False, "A · neat short crop"), ("B", "crop", True, "B · crop + light stubble"), ("C", "messy", False, "C · short messy hair")]
    for i, (lab, style, stub, name) in enumerate(opts):
        x0 = 470 + i * 480
        b.append(place(render_hero(build("front", "neutral", style, stub)), x0, FY, 1.0))
        b.append(place(render_hero(build("tq", "neutral", style, stub)), x0 + 170, FY, 1.0))
        b.append(text(x0 + 85, FY + 40, name, 22, "#ecebe4", weight=600))
    # faces: neutral + worn for each option
    b.append(text(80, 830, "FACES (neutral · worn out · tempted · decided)", 22, "#ecebe4", "start", 600))
    for i, (lab, style, stub, name) in enumerate(opts):
        x0 = 120 + i * 600
        for j, e in enumerate(["neutral", "worn", "tempted", "decided"]):
            f = Fig(); head(f, 0.25 if e == "tempted" else 0.0, e, "", style, stub)
            b.append(f'<g transform="translate({x0 + j * 135},{1010}) scale(.95)">{render_hero(f)}</g>')
        b.append(text(x0 + 200, 1120, name, 20, "#9a9ea8"))
    b.append(text(80, 1220, "All three stay one rigid hair shape (no animation cost). The Pull copies whichever you pick, "
              "and gets the hair at stage 4.", 20, "#9a9ea8", "start"))
    return V.svg(Wd, H, "".join(b))


if __name__ == "__main__":
    f = OUT / "v6_adult_options.svg"
    f.write_text(options_sheet())
    subprocess.run(["rsvg-convert", "-o", str(OUT / "v6_adult_options.png"), str(f)], check=True)
    print("wrote v6_adult_options")
