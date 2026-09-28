# Contact sheet: python3 scripts/sheet.py out/sheet.jpg img1 img2 ... (3 columns, 640 px wide tiles)
import sys
from PIL import Image, ImageDraw
out, files = sys.argv[1], sys.argv[2:]
cols = 3 if len(files) > 4 else 2
tw = 640 if cols == 3 else 960
th = tw * 9 // 16
rows = (len(files) + cols - 1) // cols
sheet = Image.new('RGB', (cols * tw, rows * th), 'black')
d = ImageDraw.Draw(sheet)
for i, f in enumerate(files):
    im = Image.open(f).convert('RGB').resize((tw, th), Image.LANCZOS)
    x, y = (i % cols) * tw, (i // cols) * th
    sheet.paste(im, (x, y))
    d.rectangle([x, y, x + 150, y + 22], fill='black')
    d.text((x + 4, y + 4), f.split('-')[-1], fill='yellow')
sheet.save(out, quality=85)
