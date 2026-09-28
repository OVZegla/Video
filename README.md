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
npm run render      # → out/vision-urbaine.mp4
```

On a machine without a GPU, `npm run render -- --concurrency=2` keeps the 3D stages fast enough.

## Timeline (frames @ 30 fps)

| Frames  | W1 | W2 | W3 | W4 | W5 |
|---------|----|----|----|----|----|
| 0–100   | blue disc | | **logo + tagline** | | red square |
| 100–350 | **IMAGINEZ** | printed acrylic | personalised mug | engraved oak | lit engraved acrylic |
| 350–600 | brushed-metal plaque | blade sign | **PERSONNALISEZ** | printed decor panel | laser-cut plywood |
| 600–820 | **CRÉEZ** | live laser cutting — *Fabriqué à Béthune* | the logo's eye | **SANS** | **LIMITES** |
| 820–900 | logo wipes back in — frame 900 ≡ frame 0 | | | | |

Scenes change window by window with a vertical wipe travelling left → right.

## Files

- `src/VisionUrbaine.tsx`: main composition and timeline
- `src/scenes/`: `LogoRest` (loop anchor) and `Scenes` (A, B, C)
- `src/components/Card.tsx`: per-window wipe transition
- `src/components/Cards.tsx`: typographic window and product window layouts
- `src/three/`: 3D product stage (studio lighting) and models (`models/*`), procedural textures
- `public/brand/`: official logo (original colours), plus "Vision" / "Urbaine" crops for the stacked lockup
- `public/fonts/`: Jost and Archivo (SIL OFL), bundled so renders work offline
