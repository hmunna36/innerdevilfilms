#!/usr/bin/env python3
"""Character design v8 (19 Oct 2026): the genre-standard figure, with small distinctions.

The user: "Make a small distinction but I need the same. Because u saw so many viral channels with the same
figures." True: this round-head, bean-body, tube-limb figure is the genre's shared stock figure. So v8 uses its
standard proportions (bigger head, thicker soft limbs, warm cream, soft outline). What stays ours is character-
level, not a token tweak: his own face (thin short brows, a highlight in the eyes, no eye bags at rest), no clothes
(no hood or scarf), and the amber shadow tied by a thread that takes his eyes at stage 4. Not traced from any one
channel's character.

(v7 notes follow.)
v7: as simple as the genre's figure.

The user, sending a frame of the kind of figure they want: "why can't we keep it simple like this".
So the whole hero is: a round head, a bean body, four rounded tubes. No hands, no feet, no hair, no neck.
The tired face does the acting. Adult read comes from heavy lids, a calm mouth and long limbs, not from
detail. Our own: his face (small dot eyes, short thin brows, no eye bags at rest), slim long limbs, and
the amber shadow tied by a thread. With no tuft, the stage-4 reveal is the shadow taking HIS eyes.

Run:  python3 -I v8_genre.py
"""
import math, subprocess, pathlib, sys
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import proper as P
import v3_flat as V
import v5_white as W5
from v3_flat import Fig, render_hero, render_shadow, place, text, K

OUT = pathlib.Path(__file__).parent
add, sub, mul, lerp, norm, perp, fmt = P.add, P.sub, P.mul, P.lerp, P.norm, P.perp, P.fmt
CREAM, FAR = "#e9e3d3", "#b6b0a3"
V.K["line"] = "#3a3a3e"   # a softer outline
V.FILL.update(skin=CREAM, far=FAR)
R = 84
KF = R / 70   # face features keep their v7 layout, scaled to the bigger head
LEG = 1.1    # standard genre proportions: legs only a little longer than v5


def stretch(p):
    """v5 skeleton -> v7: legs longer (floor stays put), everything above the hips moves up by the same amount."""
    hip = (p["hpL"][1] + p["hpR"][1]) / 2
    out = dict(p)
    for k, v in p.items():
        if isinstance(v, tuple) and len(v) == 2:
            x, y = v
            out[k] = (x, y * LEG) if y >= hip else (x, y + hip * (LEG - 1))
    return out


POSES = {k: stretch(v) for k, v in V.POSES.items()}

EXPR = {
    "neutral": dict(lid=.36, lx=0, ly=0, mc=1, mw=15, bi=1, bo=1, bags=0),
    "worn":    dict(lid=.55, lx=0, ly=2, mc=0, mw=13, bi=2, bo=4, bags=1),
    "ashamed": dict(lid=.5, lx=-2, ly=6, mc=-4, mw=13, bi=-6, bo=3, bags=0),
    "caught":  dict(lid=0, lx=0, ly=-1, mc=0, mw=9, bi=-7, bo=-7, bags=0, mo=1, es=1.15),
    "tempted": dict(lid=.38, lx=5, ly=3, mc=3, mw=13, bi=0, bo=-4, bags=0, asym=1),
    "decided": dict(lid=.42, lx=0, ly=0, mc=0, mw=16, bi=4, bo=-1, bags=0, firm=1),
}


def eyes_svg(e, t, fx, sp, color_eye, lid_fill, lash, mine=True):
    out = []
    eyes = [(fx - sp, 4), (fx + sp, 4)] if t <= 0.82 else [(fx + sp, 4)]
    for i, (ex, ey) in enumerate(eyes):
        side = -1 if (len(eyes) == 2 and i == 0) else 1
        es = e.get("es", 1)
        cx, cy = ex + e["lx"], ey + e["ly"]
        out.append(f'<ellipse cx="{cx:.1f}" cy="{cy:.1f}" rx="{6.2*es:.1f}" ry="{7.4*es:.1f}" fill="{color_eye}"/>')
        if mine:
            out.append(f'<circle cx="{cx-1.8:.1f}" cy="{cy-2.6:.1f}" r="{1.8*es:.1f}" fill="#fff"/>')
        if e["lid"] > 0.02:
            top = ey - 9.5 * es; low = top + e["lid"] * 17 * es
            out.append(f'<path d="M{ex-9:.1f},{top-2:.1f} L{ex+9:.1f},{top-2:.1f} L{ex+9:.1f},{low:.1f} Q{ex:.1f},{low+2:.1f} {ex-9:.1f},{low:.1f} Z" fill="{lid_fill}"/>'
                       f'<path d="M{ex-8:.1f},{low+0.3:.1f} Q{ex:.1f},{low+2.2:.1f} {ex+8:.1f},{low+0.3:.1f}" fill="none" stroke="{lash}" stroke-width="2.4" stroke-linecap="round"/>')
        if mine and e.get("bags"):
            out.append(f'<path d="M{ex-6:.1f},{ey+11:.1f} Q{ex:.1f},{ey+14:.1f} {ex+6:.1f},{ey+11:.1f}" fill="none" stroke="#9e9b94" stroke-width="1.8" stroke-linecap="round"/>')
        if mine:
            bi, bo = e["bi"], e["bo"]
            if e.get("asym") and side == 1:
                bi, bo = -7, -8
            by = ey - 17
            inner = (ex - 6 * side, by + bi * 0.5); outer = (ex + 8 * side, by + bo * 0.5)
            mid = (ex + 1 * side, by - 1.5 + (bi + bo) * 0.2)
            bw = 4.6 if e.get("firm") else 4.0
            out.append(f'<path d="{P.tube(inner, mid, outer, lambda u: bw - 1.6 * u)}" fill="#26232a"/>')
    return "".join(out)


def head(f, t, expr, tf, reveal=False):
    """Round head, nothing on top. The Pull renders its own face: slit eyes, or (reveal) HIS eyes, lit."""
    e = dict(EXPR[expr])
    c = (f"M0,{-R} C{R*.55:.1f},{-R} {R},{-R*.55:.1f} {R},0 C{R},{R*.55:.1f} {R*.55:.1f},{R} 0,{R} "
         f"C{-R*.55:.1f},{R} {-R},{R*.55:.1f} {-R},0 C{-R},{-R*.55:.1f} {-R*.55:.1f},{-R} 0,{-R} Z")
    f.part(c, "skin", tf)
    f.detail(V.shade(c, 40 + 6 * t, 40, 50, 46, "#d3cec2", .75), "", tf)
    fx = 31 * t
    sp = 22 * (1 - 0.35 * t)
    hs = eyes_svg(e, t, fx, sp, "#141217", CREAM, "#141217", True)
    mx, my, mw = fx + 3 + 5 * t, 32, e["mw"] * (1 - 0.3 * t)
    if e.get("mo"):
        hs += f'<ellipse cx="{mx:.1f}" cy="{my+2:.1f}" rx="5" ry="6" fill="#3a2a2a"/>'
    else:
        y1 = my - (2.5 if e.get("asym") else 0)
        hs += f'<path d="M{mx-mw/2:.1f},{my:.1f} Q{mx:.1f},{my+e["mc"]:.1f} {mx+mw/2:.1f},{y1:.1f}" fill="none" stroke="#2a2326" stroke-width="{3.2 if e.get("firm") else 2.8}" stroke-linecap="round"/>'
    # the Pull's face
    if reveal:   # it has HIS eyes now (same lids), lit amber, and his calm mouth turned into a smile
        se = eyes_svg(dict(EXPR["neutral"], lid=.36), t, fx, sp, K["amber_core"], K["shadow"], K["amber"], False)
        ss = f'<g filter="url(#b3)" opacity=".9">{se}</g>{se}'
    else:
        ss = ""
        for (ex, ey) in ([(fx - sp, 4), (fx + sp, 4)] if t <= 0.82 else [(fx + sp, 4)]):
            ss += (f'<path d="M{ex-11:.1f},{ey+1:.1f} Q{ex:.1f},{ey-9:.1f} {ex+11:.1f},{ey+1:.1f} Q{ex:.1f},{ey+5:.1f} {ex-11:.1f},{ey+1:.1f} Z" fill="{K["amber"]}" filter="url(#b3)"/>'
                   f'<path d="M{ex-10:.1f},{ey+1:.1f} Q{ex:.1f},{ey-7.5:.1f} {ex+10:.1f},{ey+1:.1f} Q{ex:.1f},{ey+4.5:.1f} {ex-10:.1f},{ey+1:.1f} Z" fill="{K["amber_core"]}"/>')
    sw = 26 * (1 - 0.3 * t)
    smile = f"M{mx-sw/2:.1f},{my-2:.1f} Q{mx:.1f},{my+11:.1f} {mx+sw/2:.1f},{my-4:.1f}"
    ss += (f'<path d="{smile}" fill="none" stroke="{K["amber"]}" stroke-width="7" stroke-linecap="round" filter="url(#b3)"/>'
           f'<path d="{smile}" fill="none" stroke="{K["amber_core"]}" stroke-width="3" stroke-linecap="round"/>')
    f.detail(hs, ss, tf + f" scale({KF:.3f})")


def tube_limb(f, a, b, c, w0, w2, kind, extend=0.0):
    """One limb = one rounded tube (two joined segments, no seam). extend lengthens the end a little,
    because there is no hand or foot after it."""
    d = norm(sub(c, b))
    c2 = add(c, mul(d, extend))
    w1 = (w0 + w2) / 2
    f.part(P.seg(a, b, w0, w1) + " " + P.seg(b, c2, w1, w2), kind + "U")


def build(pose, expr="neutral", legs=True, tail_to=None, reveal=False, contact=True):
    p = POSES[pose]; f = Fig(); t = p["t"]; front = p["view"] == "front"
    if legs and contact:
        f.detail(f'<ellipse cx="{0 if front else 8}" cy="1" rx="{70 if front else 60}" ry="9" fill="url(#contact)"/>')
    if not front:
        tube_limb(f, p["shL"], p["elL"], p["wrL"], 32, 29, "far", 14)
    if legs:
        tube_limb(f, p["hpL"], p["knL"], p["anL"], 36, 33, "skin" if front else "far", 8)
        tube_limb(f, p["hpR"], p["knR"], p["anR"], 36, 33, "skin", 8)
    if tail_to is not None:
        V.tail(f, p["bot"], tail_to, p["wh"])
    W5.body(f, p["top"], p["bot"], p["ws"] * 0.98, p["wh"] * 1.0)
    if front:
        tube_limb(f, p["shL"], p["elL"], p["wrL"], 32, 29, "skin", 14)
        tube_limb(f, p["shR"], p["elR"], p["wrR"], 32, 29, "skin", 14)
    hx, hy = p["head"]
    head(f, t, expr, f"translate({hx},{hy + 6}) rotate({p['tilt']})", reveal)
    if not front:
        tube_limb(f, p["shR"], p["elR"], p["wrR"], 32, 29, "skin", 14)
    return f


def sheet():
    V.D = V.Defs()
    Wd, H = 1920, 1420
    b = [W5.card_bg(Wd, H),
         text(80, 80, "OWEN  —  the genre-standard figure, with small distinctions", 40, "#ecebe4", "start", 600),
         text(80, 118, "Standard genre build: big round head, bean body, thick soft tubes, warm cream, soft outline. Ours: his face, no clothes, the amber thread shadow.", 22, "#9a9ea8", "start")]
    FY = 700
    b.append(W5.floor(40, 1880, FY))
    for i, (pn, lab, ex) in enumerate([("front", "front", "neutral"), ("tq", "three-quarter", "neutral"), ("side", "side", "neutral")]):
        x = 170 + i * 220
        b.append(place(render_hero(build(pn, ex)), x, FY, 1.0))
        b.append(text(x, FY + 40, lab, 20, "#9a9ea8"))
    # at the desk, losing, with the Pull at his back (our staging: it is tied to the phone)
    dx = 900
    b.append(f'<g opacity=".9">{V.chair_line(dx - 50, FY, seat=108, back=180, w=86)}</g>')
    b.append(f'<rect x="{dx+60}" y="{FY-188}" width="420" height="12" rx="3" fill="#2c2d33" stroke="#45474f" stroke-width="2.4"/>'
             f'<path d="M{dx+74},{FY-176} V{FY} M{dx+466},{FY-176} V{FY}" stroke="#3a3b42" stroke-width="2.4"/>')
    b.append(W5.phone_flat(dx + 170, FY - 188, 1.0))
    ph = (dx + 170, FY - 196)
    pr, sc = (dx - 120, FY - 70), 1.05
    tail_local = ((ph[0] - pr[0]) / sc, (ph[1] - pr[1]) / sc)
    b.append(place(render_shadow(build("tq", "neutral", legs=False, tail_to=tail_local, reveal=True, contact=False)), pr[0], pr[1], sc))
    b.append(place(render_hero(build("seated", "worn")), dx, FY, 1.0))
    b.append(text(dx + 190, FY + 40, "a still in this style: the Pull at his back, tied to the phone", 20, "#9a9ea8"))
    # faces
    b.append(text(80, 830, "FACE  (heavy lids at rest: an adult, not a kid)", 22, "#ecebe4", "start", 600))
    for j, e in enumerate(["neutral", "worn", "ashamed", "caught", "tempted", "decided"]):
        f = Fig(); head(f, 0.25 if e == "tempted" else 0.0, e, "")
        b.append(f'<g transform="translate({160 + j * 175},{980})">{render_hero(f)}</g>')
        b.append(text(160 + j * 175, 1090, {"worn": "worn out"}.get(e, e), 19, "#9a9ea8"))
    # the Pull's faces: before / reveal
    b.append(text(1240, 830, "THE PULL: BEFORE / THE REVEAL", 22, K["amber"], "start", 600))
    f = Fig(); head(f, 0, "neutral", "", reveal=False); b.append(f'<g transform="translate(1340,980)">{render_shadow(f)}</g>')
    f = Fig(); head(f, 0, "neutral", "", reveal=True); b.append(f'<g transform="translate(1560,980)">{render_shadow(f)}</g>')
    b.append(text(1340, 1090, "its own slit eyes", 19, "#9a9ea8")); b.append(text(1560, 1090, "stage 4: his eyes, lit", 19, K["amber"]))
    b.append(text(80, 1200, "The whole rig: head (2 eyes, 2 lids, 2 brows, mouth), body, 4 tubes. A pose is 8 joint angles.", 20, "#9a9ea8", "start"))
    b.append(text(80, 1236, "Ours: his face (thin short brows, a highlight, no eye bags at rest), no clothes, and the amber shadow tied by a thread that takes his eyes at stage 4.", 20, "#9a9ea8", "start"))
    return V.svg(Wd, H, "".join(b))


if __name__ == "__main__":
    f = OUT / "v8_genre.svg"
    f.write_text(sheet())
    subprocess.run(["rsvg-convert", "-o", str(OUT / "v8_genre.png"), str(f)], check=True)
    print("wrote v8_genre")
