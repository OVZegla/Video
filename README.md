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
| 0–58    | Logo at rest, folds into the centre |
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
- `public/brand/vision-urbaine-logo-led.png`: official logo recoloured for LED (navy → white, transparent)
- `public/fonts/`: Jost (SIL OFL), bundled so renders are offline
