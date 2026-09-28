# Vision Urbaine — LED storefront loop

Remotion project for a **30 s seamless loop** on transparent LED storefront panels
(640 × 320 canvas, 30 fps, H.264, no audio).

The canvas feeds **5 separate LED windows of 128 × 320**, with physical gaps between them
(door, counter opening, mullions). Rule of the piece: **every word and every object lives
inside a single window**, so no letter is ever cut by a gap.

```bash
npm install
npm run studio      # preview in Remotion Studio
npm run typecheck
npm run render      # → out/vision-urbaine.mp4 + out/vision-urbaine-compatible.mp4
```

`npm run render` runs `scripts/render.sh`: frames are rendered in chunks (stable WebGL on
machines without a GPU) and encoded twice. `vision-urbaine-compatible.mp4` is
Constrained Baseline / CBR / no B-frames, for LED players that reject the standard file.

## Timeline (frames @ 30 fps)

A tricolour band (red · white · light blue · blue) sweeps across the five windows to change
scenes. Bauhaus rails and scene lines cross the windows continuously; text and products never do.

| Frames  | W1 | W2 | W3 | W4 | W5 |
|---------|----|----|----|----|----|
| 0–90    | blue disc + orbit | | **logo (white) + tagline** | | red square |
| 90–330  | **IMAGINEZ** | printed acrylic | personalised mug | engraved oak | lit engraved acrylic |
| 330–570 | brushed-metal plaque | blade sign | **PERSON-NALISEZ** | printed decor panel | laser-cut plywood |
| 570–800 | **CRÉEZ** | live laser cutting (*Fabriqué à Béthune*) | the logo's eye | **SANS** | **LIMITES** |
| 800–900 | band brings the logo back; frame 900 ≡ frame 0 | | | | |

## Files

- `src/VisionUrbaine.tsx`: main composition and timeline
- `src/scenes/`: `LogoRest` (loop anchor) and `Scenes` (A, B, C)
- `src/components/Sweep.tsx`: tricolour band and Bauhaus rails/lines
- `src/components/Card.tsx`: per-window content revealed and removed by the band
- `src/components/Cards.tsx`: typographic window and product window layouts
- `src/three/`: 3D product stage (studio lighting, mirror floor, orbiting camera), models (`models/*`), procedural textures
- `public/brand/`: official logo (original + white LED versions), plus "Vision" / "Urbaine" crops for the stacked lockup
- `public/fonts/`: Jost and Archivo (SIL OFL), bundled so renders work offline
