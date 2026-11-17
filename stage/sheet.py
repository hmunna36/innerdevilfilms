"""A contact sheet from rendered frames (after stage/make.sh): n frames between a and b seconds, each with its time.
  python stage/sheet.py <folder> <a> <b> <n> <name> [cols=6] [tile width=533]   ->  <folder>/out/fs_<name>.jpg
(works for a film's 16:9 frames and a Short's 9:16 ones; for a look before rendering, use `render.mjs sheet`)"""
import os, sys
from PIL import Image, ImageDraw
folder, a, b, n, name = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
cols = int(sys.argv[6]) if len(sys.argv) > 6 else 6; tw = int(sys.argv[7]) if len(sys.argv) > 7 else 533
fr = lambda t: os.path.join(folder, 'out', 'frames', '%05d.jpg' % round(t * 30))
w0, h0 = Image.open(fr(a + (b - a) * .5 / n)).size; th = tw * h0 // w0
rows = (n + cols - 1) // cols; im = Image.new('RGB', (cols * tw, rows * th)); d = ImageDraw.Draw(im)
for i in range(n):
    t = a + (b - a) * (i + .5) / n; f = Image.open(fr(t)).resize((tw, th), Image.LANCZOS)
    x, y = (i % cols) * tw, (i // cols) * th; im.paste(f, (x, y)); d.rectangle([x, y, x + 62, y + 16], fill=(0, 0, 0)); d.text((x + 4, y + 2), '%.2f' % t, fill=(255, 255, 0))
out = os.path.join(folder, 'out', 'fs_%s.jpg' % name); im.save(out, quality=86); print(out)
