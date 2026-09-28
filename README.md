> **Autre projet de ce dépôt :** `assistants/` — publicité 60 s pour un concept d’application (six assistants IA pour petites entreprises). Voir `assistants/README.md`.

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
npm run render      # → out/vision-urbaine.mp4 + out/vision-urbaine-compatible.mp4 (≈ 15–20 min without a GPU)
```

`npm run render` runs `scripts/render.sh`: frames are rendered in chunks (stable WebGL on
machines without a GPU) and encoded twice. `vision-urbaine-compatible.mp4` is
Constrained Baseline / CBR / no B-frames, for LED players that reject the standard file.

## Timeline (frames @ 30 fps, 83 s loop)

A burst of ideas, category by category. Each category opens with a header window
("Exemples de réalisations"); some product windows swap to a second product halfway.
A tricolour band sweeps across the five windows to change scenes; Bauhaus motifs and a
flowing stripe ribbon cross the windows, while text and products stay inside one window
(PERSONNALISEZ spans the three right-hand windows, split between whole letters).

| Frames    | Scene |
|-----------|-------|
| 0–90      | Logo (white) + tagline, resting pose |
| 90–300    | IMAGINEZ · PERSONNALISEZ |
| 300–600   | 01 Petits objets: mugs (names cycling), t-shirts → tote bags, caps → bottles, keychains |
| 600–900   | 02 Signalétique: plaques pro → de porte, enseignes, totems, plaques de rue → plexi |
| 900–1200  | 03 Déco intérieure: claustras, plexi → bois gravé, métal découpé → murs rétroéclairés, décors |
| 1200–1500 | 04 Mariages, fêtes, salons: gobelets, panneaux de mariage, plaques gravées, marque-places |
| 1500–1770 | 05 Plexi lumineux: the storefront goes dark, engraved panels light up |
| 1770–1950 | FABRIQUER · SIGNALER · DÉCORER · VALORISER · GRAVER |
| 1950–2190 | CRÉEZ · laser live (*Fabriqué à Béthune*) · découpe laser · SANS · LIMITES |
| 2190–2390 | CRÉER · AUJOURD'HUI · UN DEMAIN · PLUS · BEAU |
| 2390–2490 | band brings the logo back; frame 2490 ≡ frame 0 |

## Files

- `src/VisionUrbaine.tsx`: main composition and timeline
- `src/scenes/`: `LogoRest` (loop anchor), `Categories` (intro + the five categories), `Scenes` (verbs, CRÉEZ, closing line)
- `src/components/Sweep.tsx`: tricolour band and Bauhaus rails/lines
- `src/components/Card.tsx`: per-window content revealed and removed by the band
- `src/components/Cards.tsx`: typographic window and product window layouts
- `src/three/`: 3D product stage (studio lighting, mirror floor, orbiting camera), models (`models/*`), procedural textures
- `public/brand/`: official logo (original + white LED versions), plus "Vision" / "Urbaine" crops for the stacked lockup
- `public/fonts/`: Jost and Archivo (SIL OFL), bundled so renders work offline
