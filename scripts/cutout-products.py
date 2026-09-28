"""Turn raw machine photos into transparent cut-outs for the film.

    pip install "rembg[cpu]" scipy pillow
    python3 scripts/cutout-products.py            # every photo in public/symps/raw/
    python3 scripts/cutout-products.py m1 ruby    # only these ids

Input : public/symps/raw/<id>.jpg|png   (one machine per photo, whole machine in frame)
Output: public/symps/products/<id>.png  (then run `npm run symps:assets`)

The background is removed with rembg (isnet-general-use); only the largest
object (the machine) and the pieces inside its bounding box are kept, so
other machines or posters in the background are dropped. Check the result:
thin parts shot against a similar-coloured wall can need a manual touch-up.
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image
from rembg import new_session, remove
from scipy import ndimage

RAW = Path('public/symps/raw')
OUT = Path('public/symps/products')


def cutout(src: Path, dst: Path, session) -> None:
    rgba = np.array(remove(Image.open(src).convert('RGB'), session=session))
    mask = rgba[:, :, 3] > 20
    labels, n = ndimage.label(mask)
    if n == 0:
        raise SystemExit(f'{src}: nothing found')
    sizes = ndimage.sum(mask, labels, range(1, n + 1))
    boxes = ndimage.find_objects(labels)
    ys, xs = boxes[int(np.argmax(sizes))]
    keep = np.zeros(n + 1, bool)
    for i, (by, bx) in enumerate(boxes):
        keep[i + 1] = by.start >= ys.start and by.stop <= ys.stop and bx.start >= xs.start and bx.stop <= xs.stop
    rgba[:, :, 3] = np.where(keep[labels], rgba[:, :, 3], 0)
    pad = 12
    box = (max(0, xs.start - pad), max(0, ys.start - pad), min(rgba.shape[1], xs.stop + pad), min(rgba.shape[0], ys.stop + pad))
    Image.fromarray(rgba).crop(box).save(dst, optimize=True)
    print(f'{src} -> {dst}')


if __name__ == '__main__':
    wanted = set(sys.argv[1:])
    OUT.mkdir(parents=True, exist_ok=True)
    session = new_session('isnet-general-use')
    for f in sorted(RAW.glob('*')):
        if f.suffix.lower() in {'.jpg', '.jpeg', '.png', '.webp'} and (not wanted or f.stem in wanted):
            cutout(f, OUT / f'{f.stem}.png', session)
