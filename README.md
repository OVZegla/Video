# Vision Urbaine — LED storefront loop

Remotion project for a 15 s seamless loop on a transparent LED storefront display
(640 × 320, 30 fps, H.264, no audio). The canvas is five adjacent windows (128 × 320 each).

```bash
npm install
npm run studio      # preview in Remotion Studio
npm run typecheck
npm run render      # → out/vision-urbaine.mp4
```

## Timeline (frames)

| Frames  | Scene |
|---------|-------|
| 0–58    | Logo + tagline « Pensé à Béthune et ouvert sur le monde », folds into the centre |
| 50–142  | **IMAGINEZ**: the word assembled from five window panes |
| 130–234 | Product conveyor: printed acrylic, engraved acrylic, wood, personalised objects, blade sign |
| 224–308 | **PERSONNALISEZ**: the word takes a different finish in each window |
| 296–382 | **CRÉEZ**: laser cutting, printed decor panel, pro plaque, signage (shutter masks) |
| 368–428 | **SANS LIMITES**: horizon line that collapses to the centre |
| 420–450 | Logo opens from that point, landing on the exact pose of frame 0 |

## Files

- `src/VisionUrbaine.tsx`: main composition and timeline
- `src/scenes/*`: one file per scene
- `src/components/Products.tsx`: SVG product illustrations
- `public/brand/vision-urbaine-logo.png`: official logo, original colours (transparent ground)
- `public/fonts/`: Jost (SIL OFL), bundled so renders are offline

---

# SYMP’S — wall printer range film

Premium launch film for the full Symp’s wall printer range
(1920 × 1080, 30 fps, ~58 s, H.264, no audio).

```bash
npm install
npm run studio          # composition "SympsWallPrinters"
npm run typecheck
npm run symps:render    # → out/symps-wall-printers.mp4
```

## Storyboard

| Time      | Section | Notes |
|-----------|---------|-------|
| 0–5.5 s   | Intro | Macro details out of black (caster, ink system, rail + UV lamp). « SYMP’S », then « L’impression murale. Réinventée. » |
| 5–11 s    | Opaline | Flagship. Side-light reveal, slow pan + push-in, parallax, floor reflection |
| 10–18 s   | M1 · Graphite Edition · Black 2.0 | Mast → line-of-light transition between each machine. Clean white studio / graphite light column / edge-lit black |
| 18–24 s   | Brand moment | The first machines together in a dark studio, camera pulling back. « Une gamme. » « Plusieurs façons de créer. » « Une seule vision. » |
| 23–34 s   | White (TMP1000) · T1000 (TPP1000) · Access · Ruby (MK02) | High-key white / industrial scale reveal / simple / deep red accent |
| 33–42 s   | Applications | Hotel, restaurant, retail, office, home, events: the mural prints swath by swath. « Du mur blanc… » « …à l’espace qui vous ressemble. » |
| 41–47.5 s | Technology | PRÉCISION · COULEUR · TECHNOLOGIE · CRÉATIVITÉ over macro shots |
| 47–54 s   | Full range | All eight machines in three depth planes, lit from back to front. « Une gamme pensée pour chaque projet. » → SYMP’S |
| 53–58 s   | Outro | Logo, light pass, « Donnez une nouvelle dimension aux murs. », fade to black |

## Structure (`src/symps/`)

- `SympsWallPrinters.tsx` — master timeline. Segments + their entry (`fade` / `line`); start frames are derived.
- `data/products.ts` — **the range**: order, names, taglines, per-product environment and machine look.
  Reorder or delete entries freely; product sequence, brand moment and lineup follow.
- `scenes/` — `Intro`, `ProductReveal`, `BrandStatement`, `ApplicationScene`, `TechnologySection`, `ProductLineup`, `Outro`
- `components/` — `Machine` (photo or vector render), `ProductTitle`, `DetailShot`, `LineTransition`,
  `Studio`, `Room`, `Mural`, `Stage` (reflection, shadow, light, grain), `Typography` (reveals, wordmark)

## Product photos

symps.fr could not be reached from the build environment, so the machines are currently drawn by a
parametric vector render (`components/Machine.tsx`). To use the official photos:

1. Save each one as `public/symps/products/<id>.png` (ids: `opaline`, `m1`, `graphite`, `black-2`,
   `white`, `t1000`, `access`, `ruby`; transparent PNG preferred, webp/jpg accepted).
2. Optionally add project photos to `public/symps/projects/` (used in order by the application section).
3. `npm run symps:render` — the asset scan runs first, and every photo is displayed uncropped
   (`object-fit: contain`, bottom-anchored), whatever its aspect ratio.

Fonts: Inter (SIL OFL), bundled in `public/symps/fonts/`.
