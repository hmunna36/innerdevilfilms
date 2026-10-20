#!/usr/bin/env python3
"""Design sheets for the new channel: the hero (hollow white line figure) and the
amber antagonist (his double, drawn in light, tethered to the thing that pulls him).
Writes SVGs next to this file; render with rsvg-convert (see bottom)."""
import math, random, subprocess, pathlib

OUT = pathlib.Path(__file__).parent
BG = "#0b0b0d"
FILL = "#17181c"      # inside of the hero, a step above the background so he reads
LINE = "#ecebe4"      # bone white
AMBER = "#f2a33a"
AMBER_HI = "#ffd38a"
GREY = "#5d6068"
LW = 3.2              # outline width

# ---------------------------------------------------------------- hero
def pose(name):
    """Joint positions (x, y) in figure units, feet at y=0, ~300 tall. Facing right = +x."""
    P = {
        # head centre, head tilt deg, neck, hips, (shoulder L, elbow L, hand L), (shoulder R...), (hip L, knee L, foot L), (hip R...)
        "front": dict(head=(0, -252), tilt=0, neck=(0, -206), hip=(0, -112),
                      armL=[(-40, -190), (-50, -142), (-52, -98)], armR=[(40, -190), (50, -142), (52, -98)],
                      legL=[(-17, -110), (-19, -55), (-21, 0)], legR=[(17, -110), (19, -55), (21, 0)], side=False),
        "side": dict(head=(6, -252), tilt=4, neck=(0, -206), hip=(0, -112),
                     armL=[(-4, -190), (-2, -142), (8, -100)], armR=[(4, -190), (10, -142), (18, -102)],
                     legL=[(-4, -110), (-2, -55), (-6, 0)], legR=[(4, -110), (8, -55), (10, 0)], side=True),
        "walk": dict(head=(10, -250), tilt=6, neck=(4, -204), hip=(0, -112),
                     armL=[(0, -190), (-18, -146), (-22, -104)], armR=[(6, -190), (24, -148), (34, -112)],
                     legL=[(-4, -110), (-18, -58), (-30, -2)], legR=[(4, -110), (22, -60), (26, 0)], side=True),
        "slump": dict(head=(52, -146), tilt=48, neck=(20, -128), hip=(-14, -24),
                      armL=[(14, -116), (40, -92), (62, -70)], armR=[(20, -116), (48, -96), (70, -76)],
                      legL=[(-14, -24), (40, -84), (66, -4)], legR=[(-8, -24), (48, -80), (74, -4)], side=True),
        "phone": dict(head=(18, -238), tilt=22, neck=(6, -202), hip=(0, -112),
                      armL=[(0, -188), (4, -146), (34, -150)], armR=[(6, -188), (14, -144), (40, -156)],
                      legL=[(-4, -110), (-4, -55), (-6, 0)], legR=[(4, -110), (8, -55), (10, 0)], side=True),
        "seated": dict(head=(14, -232), tilt=10, neck=(4, -190), hip=(-8, -100),
                       armL=[(-2, -176), (20, -140), (52, -132)], armR=[(4, -176), (28, -140), (60, -134)],
                       legL=[(-8, -100), (44, -100), (46, -40)], legR=[(-4, -100), (50, -98), (54, -40)], side=True),
    }
    return P[name]

def limb(pts):
    (x0, y0), (x1, y1), (x2, y2) = pts
    return f"M{x0},{y0} Q{x1*2-(x0+x2)/2},{y1*2-(y0+y2)/2} {x2},{y2}"

def torso(p):
    nx, ny = p["neck"]; hx, hy = p["hip"]
    w_sh = 26 if p["side"] else 44
    w_hp = 22 if p["side"] else 34
    # rounded trapezoid along the neck->hip axis
    ang = math.atan2(hy - ny, hx - nx); px, py = -math.sin(ang), math.cos(ang)
    a = (nx + px * w_sh, ny + py * w_sh); b = (nx - px * w_sh, ny - py * w_sh)
    c = (hx - px * w_hp, hy - py * w_hp); d = (hx + px * w_hp, hy + py * w_hp)
    return (f"M{a[0]:.1f},{a[1]:.1f} Q{nx:.1f},{ny-14:.1f} {b[0]:.1f},{b[1]:.1f} "
            f"L{c[0]:.1f},{c[1]:.1f} Q{hx:.1f},{hy+10:.1f} {d[0]:.1f},{d[1]:.1f} Z")

def head(p, eyes="open", line=LINE, fill=FILL, mouth=None, hair=True, look=0):
    hx, hy = p["head"]; t = p["tilt"]
    g = [f'<g transform="translate({hx},{hy}) rotate({t})">']
    g.append(f'<ellipse cx="0" cy="0" rx="37" ry="45" fill="{fill}" stroke="{line}" stroke-width="{LW}"/>')
    if hair:  # the signature: a three-stroke cowlick that sticks up and back
        g.append(f'<path d="M-4,-39 q-4,-16 -16,-20 M3,-40 q2,-19 -6,-29 M10,-38 q8,-12 4,-24" '
                 f'fill="none" stroke="{line}" stroke-width="{LW}" stroke-linecap="round"/>')
    ex = 8 if p["side"] else 0
    for sx in ((ex + 4 + look, ex + 18 + look) if p["side"] else (-11 + look, 11 + look)):
        if eyes == "open":
            d = f"M{sx},-8 v14"
        elif eyes == "tired":
            d = f"M{sx-4},2 h8"
        elif eyes == "down":
            d = f"M{sx-4},6 q4,4 8,0"
        elif eyes == "wide":
            d = f"M{sx},-12 v20"
        elif eyes == "set":
            d = f"M{sx-6},-9 h12 M{sx},-4 v11"
        else:
            d = f"M{sx},-8 v14"
        g.append(f'<path d="{d}" fill="none" stroke="{line}" stroke-width="{LW+0.6}" stroke-linecap="round"/>')
    if mouth:
        mx = ex + 11 if p["side"] else 0
        g.append(f'<path d="M{mx-10},16 q10,{mouth} 20,0" fill="none" stroke="{line}" stroke-width="{LW}" stroke-linecap="round"/>')
    g.append("</g>")
    return "".join(g)

def hero(name, x, y, s=1.0, eyes="open", flip=False, line=LINE, fill=FILL, mouth=None, look=0):
    p = pose(name)
    limbs = [p["armL"], p["legL"], p["legR"], p["armR"]]
    sc = f"scale({-s},{s})" if flip else f"scale({s})"
    out = [f'<g transform="translate({x},{y}) {sc}" stroke-linecap="round" stroke-linejoin="round">']
    # pass 1: outlines of limbs + torso (one silhouette), pass 2: fill them in -> hollow tubes
    for L in limbs:
        out.append(f'<path d="{limb(L)}" fill="none" stroke="{line}" stroke-width="{18+2*LW}"/>')
    out.append(f'<path d="{torso(p)}" fill="{line}" stroke="{line}" stroke-width="{2*LW}"/>')
    # high collar: the second signature, a soft roll-neck
    nx, ny = p["neck"]
    out.append(f'<rect x="{nx-15}" y="{ny-14}" width="30" height="18" rx="8" fill="{line}" stroke="{line}" stroke-width="{2*LW}"/>')
    for L in limbs:
        out.append(f'<path d="{limb(L)}" fill="none" stroke="{fill}" stroke-width="18"/>')
    out.append(f'<path d="{torso(p)}" fill="{fill}"/>')
    out.append(f'<rect x="{nx-15}" y="{ny-14}" width="30" height="18" rx="8" fill="{fill}"/>')
    out.append(f'<path d="M{nx-13},{ny-2} h26" stroke="{line}" stroke-width="2" opacity=".55"/>')
    out.append(head(p, eyes, line, fill, mouth, look=look))
    out.append("</g>")
    return "".join(out)

# ---------------------------------------------------------------- antagonist
def jitter_path(d, amp, seed):
    """Wobble every number in a path a little: the antagonist is drawn with a nervous double line."""
    rnd = random.Random(seed); out = []; num = ""
    for ch in d + " ":
        if ch.isdigit() or ch in ".-" and (not num or ch != "-"):
            num += ch
        else:
            if num and num not in "-.":
                out.append(f"{float(num) + rnd.uniform(-amp, amp):.1f}")
            elif num:
                out.append(num)
            num = ""; out.append(ch)
    return "".join(out)

def tether(x0, y0, x1, y1, loops=2, seed=1, width=3.2, opacity=1.0):
    """The amber thread from the antagonist's waist to the object that feeds it."""
    rnd = random.Random(seed)
    pts = []
    n = 60
    for i in range(n + 1):
        t = i / n
        x = x0 + (x1 - x0) * t; y = y0 + (y1 - y0) * t + math.sin(t * math.pi) * 40
        x += math.sin(t * math.pi * 2 * loops) * 22 * (1 - t); y += math.sin(t * math.pi * 2 * loops) * 12 * (1 - t)
        pts.append((x + rnd.uniform(-1, 1), y + rnd.uniform(-1, 1)))
    d = "M" + " L".join(f"{a:.1f},{b:.1f}" for a, b in pts)
    return (f'<path d="{d}" fill="none" stroke="{AMBER}" stroke-width="{width+6}" opacity="{0.18*opacity}" stroke-linecap="round"/>'
            f'<path d="{d}" fill="none" stroke="{AMBER}" stroke-width="{width}" opacity="{opacity}" stroke-linecap="round"/>')

def pull(stage, x, y, s=1.0, target=(260, 0), flip=False, seed=3):
    """stage 1: a curl of thread; 2: head + shoulders; 3: full upper body; 4: his exact double."""
    if stage == 3:
        s *= 1.12
    sc = f"scale({-s},{s})" if flip else f"scale({s})"
    lean = 14 if stage == 3 else 0
    g = [f'<g transform="translate({x},{y}) {sc}" stroke-linecap="round" stroke-linejoin="round">']
    tx, ty = target
    if stage == 1:
        g.append(tether(0, -60, tx, ty, loops=3, seed=seed))
        g.append(f'<path d="M0,-60 q-20,-30 0,-52 q22,-18 30,8 q4,22 -16,24" fill="none" stroke="{AMBER}" stroke-width="3.2"/>')
        g.append('</g>'); return "".join(g)
    p = pose("front" if stage in (2, 3) else "side")
    waist = p["hip"]
    # the thread stays in the unrotated frame so it always lands on the object; only the body leans
    a = math.radians(lean); wx = waist[0] * math.cos(a) - (waist[1] + 110) * math.sin(a)
    wy = waist[0] * math.sin(a) + (waist[1] + 110) * math.cos(a) - 110
    g.append(tether(wx, wy - 2, tx, ty, loops=2, seed=seed, opacity=1.0))
    g.append(f'<g transform="rotate({lean} 0 -110)">')
    # body of light: soft glow fill + two wobbling outlines
    tor = torso(p)
    g.append(f'<path d="{tor}" fill="url(#amberGlow)" opacity="{0.5 if stage==2 else 0.8}"/>')
    for k in range(2):
        g.append(f'<path d="{jitter_path(tor, 2.2, seed+k)}" fill="none" stroke="{AMBER}" stroke-width="{2.4-k*0.8}" opacity="{0.95-k*0.4}"/>')
    if stage >= 3:
        for L in (p["armL"], p["armR"]):
            for k in range(2):
                g.append(f'<path d="{jitter_path(limb(L), 2.5, seed+7+k)}" fill="none" stroke="{AMBER}" stroke-width="{2.4-k*0.8}" opacity="{0.95-k*0.4}"/>')
    # no legs ever: below the waist it is only thread
    mouth = 8 if stage < 4 else 10
    g.append(head(p, "open", AMBER, "url(#amberHead)", mouth=mouth, hair=(stage == 4)))
    g.append("</g></g>")
    return "".join(g)

# ---------------------------------------------------------------- sheet helpers
DEFS = f"""<defs>
<radialGradient id="amberGlow" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="{AMBER}" stop-opacity=".35"/><stop offset="1" stop-color="{AMBER}" stop-opacity="0"/></radialGradient>
<radialGradient id="amberHead" cx="45%" cy="40%" r="70%"><stop offset="0" stop-color="{AMBER}" stop-opacity=".28"/><stop offset="1" stop-color="{AMBER}" stop-opacity=".04"/></radialGradient>
<radialGradient id="pool" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="{AMBER}" stop-opacity=".22"/><stop offset="1" stop-color="{AMBER}" stop-opacity="0"/></radialGradient>
<radialGradient id="vig" cx="50%" cy="45%" r="75%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .05 0"/></filter>
</defs>"""

def svg(w, h, body):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">{DEFS}'
            f'<rect width="{w}" height="{h}" fill="{BG}"/>{body}'
            f'<rect width="{w}" height="{h}" filter="url(#grain)"/></svg>')

def label(x, y, t, size=22, color=GREY, anchor="middle", font="Avenir Next", weight=500):
    return f'<text x="{x}" y="{y}" fill="{color}" font-family="{font}" font-size="{size}" font-weight="{weight}" text-anchor="{anchor}">{t}</text>'

def floor(x0, x1, y):
    return f'<path d="M{x0},{y} H{x1}" stroke="#2a2c32" stroke-width="2"/>'

# ---------------------------------------------------------------- sheet 1: hero
def hero_sheet():
    b = [label(80, 90, "THE HERO — working name: OWEN", 40, LINE, "start", weight=600),
         label(80, 130, "Hollow bone-white line, no fill colour of his own. Cowlick + roll-neck = his silhouette. No mouth.", 24, GREY, "start")]
    # turnaround
    b.append(floor(80, 1100, 540))
    for i, (pn, e) in enumerate([("front", "open"), ("side", "open"), ("walk", "open"), ("phone", "open")]):
        b.append(hero(pn, 200 + i * 260, 540, 1.15, e))
        b.append(label(200 + i * 260, 580, ["front", "side", "walk", "on the phone"][i]))
    # expressions (head close-ups)
    b.append(label(1240, 180, "EYES CARRY EVERYTHING", 24, LINE, "start", weight=600))
    exps = [("open", "neutral"), ("tired", "worn out"), ("down", "ashamed"), ("wide", "caught"), ("set", "decided"), ("open", "tempted (eyes slide)")]
    for i, (e, n) in enumerate(exps):
        cx = 1320 + (i % 3) * 210; cy = 330 + (i // 3) * 230
        p = dict(pose("front")); p["head"] = (0, 0)
        look = 9 if "tempted" in n else 0
        b.append(f'<g transform="translate({cx},{cy}) scale(1.6)">{head(p, e, look=look)}</g>')
        b.append(label(cx, cy + 108, n, 20))
    # acting poses
    b.append(floor(80, 1100, 1000))
    b.append(hero("seated", 220, 1000, 1.1))
    b.append(f'<rect x="168" y="880" width="72" height="10" rx="3" fill="none" stroke="{GREY}" stroke-width="2"/><path d="M178,890 v110 M230,890 v110" stroke="{GREY}" stroke-width="2"/>')
    b.append(label(240, 1040, "on a stool"))
    b.append(hero("slump", 520, 1000, 1.1, "down"))
    b.append(label(560, 1040, "losing"))
    b.append(hero("front", 840, 1000, 1.1, "set"))
    b.append(label(840, 1040, "the test: he stands up"))
    # rules
    rules = ["• one line weight, round caps, body filled near-black",
             "• limbs are soft tubes that end round: no hands, no feet",
             "• emotion = eye strokes + head tilt + posture, never a mouth",
             "• the only bone-white thing on screen; props are grey line",
             "• amber never touches him"]
    for i, r in enumerate(rules):
        b.append(label(1240, 840 + i * 38, r, 21, GREY, "start"))
    return svg(1920, 1080, "".join(b))

# ---------------------------------------------------------------- sheet 2: antagonist
def pull_sheet():
    b = [label(80, 90, "THE ANTAGONIST — working name: THE PULL", 40, AMBER, "start", weight=600),
         label(80, 130, "His double, drawn in amber light. No legs: below the waist it is one thread, tied to whatever feeds it.", 24, GREY, "start")]
    b.append(floor(80, 1840, 640))
    # object it is tied to (a phone, glowing)
    def phone(x, y):
        return (f'<ellipse cx="{x}" cy="{y+4}" rx="60" ry="10" fill="url(#pool)"/>'
                f'<rect x="{x-26}" y="{y-12}" width="52" height="14" rx="4" fill="#111" stroke="{GREY}" stroke-width="2"/>'
                f'<rect x="{x-22}" y="{y-10}" width="44" height="9" rx="2" fill="{AMBER}" opacity=".85"/>')
    names = ["1 · a curl of thread", "2 · it finds a face", "3 · it leans in", "4 · it is him"]
    for i in range(4):
        x = 230 + i * 420
        b.append(phone(x + 200, 628))
        if i == 3:
            b.append(pull(4, x - 46, 626, 1.22, target=(246 / 1.22, -8 / 1.22)))
            b.append(hero("side", x, 640, 1.2, "tired"))
        else:
            sc_ = 1.4 if i == 0 else 1.2
            b.append(pull(i + 1, x, 640, sc_, target=(200 / (sc_ * (1.12 if i == 2 else 1)), -10 / sc_)))
        b.append(label(x + 60, 690, names[i], 22, AMBER if i == 3 else GREY))
    # its voice
    b.append(label(80, 800, "ITS VOICE", 24, LINE, "start", weight=600))
    b.append(label(80, 850, "just one look.", 34, AMBER, "start", font="Courier New"))
    b.append(label(80, 895, "you've earned a minute.", 34, AMBER, "start", font="Courier New"))
    b.append(label(80, 945, "Typewriter, amber, lowercase, types on letter by letter with a soft key tick.", 21, GREY, "start"))
    b.append(label(80, 975, "The narrator is the opposite: white Avenir, sentence case, centred at the bottom.", 21, GREY, "start"))
    rules = ["• it has the one thing he lacks: a mouth (a thin smile)",
             "• it never walks, it pays out thread; when it loses, the thread goes slack",
             "• it grows more solid as it wins (1 → 4); stage 4 gets his cowlick: the reveal",
             "• amber = the struggle, everywhere: its body, its words, the counter when it climbs",
             "• it casts light; he casts none. Its glow is the only warm light in a scene"]
    for i, r in enumerate(rules):
        b.append(label(1000, 800 + i * 40, r, 21, GREY, "start"))
    return svg(1920, 1080, "".join(b))

# ---------------------------------------------------------------- sheet 3: a frame of JUST ONE MORE
def sample_frame():
    W, H = 1920, 1080; fy = 800
    b = []
    b.append(f'<rect y="{fy}" width="{W}" height="{H-fy}" fill="#0e0f12"/>')
    b.append(floor(0, W, fy))
    # window (night), wall clock, desk, laptop, lamp off
    b.append(f'<rect x="300" y="250" width="300" height="230" rx="10" fill="#0f1420" stroke="{GREY}" stroke-width="2.5"/><path d="M450,250 v230 M300,365 h300" stroke="{GREY}" stroke-width="2"/>')
    b.append(f'<circle cx="180" cy="300" r="52" fill="none" stroke="{GREY}" stroke-width="2.5"/><path d="M180,300 v-38" stroke="{LINE}" stroke-width="3" stroke-linecap="round"/><path d="M180,300 h-26" stroke="{LINE}" stroke-width="4" stroke-linecap="round"/>')
    b.append(f'<path d="M820,640 h560 M850,640 v160 M1350,640 v160" stroke="{GREY}" stroke-width="2.5" fill="none"/>')
    b.append(f'<path d="M960,640 l20,-110 h200 l-20,110 z" fill="#101116" stroke="{GREY}" stroke-width="2.5"/>')
    b.append(f'<rect x="1000" y="550" width="130" height="5" rx="2" fill="{GREY}" opacity=".5"/><rect x="1000" y="566" width="90" height="5" rx="2" fill="{GREY}" opacity=".5"/>')
    # phone on desk, lit, with the pull rising from it
    b.append(f'<ellipse cx="1260" cy="640" rx="120" ry="16" fill="url(#pool)"/>')
    b.append(f'<rect x="1228" y="628" width="64" height="12" rx="4" fill="#111" stroke="{GREY}" stroke-width="2"/><rect x="1232" y="630" width="56" height="7" rx="2" fill="{AMBER}"/>')
    b.append(hero("seated", 780, fy, 1.5, "open", look=8))
    b.append(f'<rect x="700" y="640" width="110" height="12" rx="4" fill="none" stroke="{GREY}" stroke-width="2"/><path d="M715,652 v148 M795,652 v148" stroke="{GREY}" stroke-width="2"/>')
    b.append(pull(3, 960, 600, 1.0, target=(300 / 1.12, 32 / 1.12), flip=False, seed=9))
    # its words, next to it
    b.append(label(1060, 330, "it could be important.", 36, AMBER, "start", font="Courier New"))
    # counter: top right, mono, amber when it climbs
    b.append(label(1830, 92, "MINUTES LOST", 20, GREY, "end", font="Menlo", weight=400))
    b.append(label(1830, 140, "07", 46, AMBER, "end", font="Menlo", weight=700))
    # narrator line
    b.append(label(W / 2, 980, "He gave himself one hour.", 30, LINE, "middle"))
    b.append(f'<rect width="{W}" height="{H}" fill="url(#vig)"/>')
    return svg(W, H, "".join(b))

for name, fn in [("01_hero_sheet", hero_sheet), ("02_pull_sheet", pull_sheet), ("03_sample_frame", sample_frame)]:
    f = OUT / f"{name}.svg"; f.write_text(fn())
    subprocess.run(["rsvg-convert", "-w", "1920", "-o", str(OUT / f"{name}.png"), str(f)], check=True)
    print("wrote", name)
