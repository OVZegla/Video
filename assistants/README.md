# Publicité 60 s — « Votre activité. Toute une équipe à vos côtés. »

Film publicitaire pour un **concept d'application** (sans nom ni logo) : six assistants IA
spécialisés au service des petits commerçants, artisans et petites entreprises.

- 1920 × 1080, 30 i/s, **60 s exactement** (1 800 images), français
- Composition programmée avec **Remotion 4** (React + TypeScript), 100 % déterministe :
  tout est fonction du numéro d'image, sans hasard ni interaction.
- Bande-son **originale**, synthétisée par un script du projet (aucune musique ni aucun
  échantillon tiers) : ambiance électronique discrète et bruitages calés sur l'image.

## Commandes

```bash
cd assistants
npm install
npm run studio        # prévisualisation interactive (Remotion Studio)
npm run typecheck     # vérification TypeScript
npm run audio         # régénère public/audio/soundtrack.wav à partir de scripts/cues.mjs
npm run render        # → out/publicite-assistants-60s.mp4 (H.264 + AAC)
node scripts/stills.mjs 90 330 600    # images de contrôle → out/stills/
```

`npm run render` lance :
`remotion render Publicite out/publicite-assistants-60s.mp4 --concurrency=4`
(H.264 High, yuv420p, CRF 17, BT.709, AAC 192 kb/s, configuré dans `remotion.config.ts`).
Remotion télécharge sa propre version de Chrome Headless Shell au premier lancement ; hors
ligne, indiquer un navigateur local avec `REMOTION_BROWSER=/chemin/vers/chrome`.

## Montage

| Temps   | Images    | Scène (fichier)                 | Fond   | Ce qui se transforme |
|---------|-----------|---------------------------------|--------|----------------------|
| 00–07 s | 0–210     | Surcharge (`scenes/Team.tsx`)   | clair  | 11 demandes arrivent de plus en plus vite et resserrent le cadre ; arrêt net ; elles s'écartent et libèrent le centre |
| 07–14 s | 210–420   | L'équipe se forme (`Team.tsx`)  | clair  | Un point bleu devient le dossier commun ; chaque demande rejoint l'assistant concerné et se transforme en carte de rôle ; des tâches circulent d'un assistant à l'autre via le dossier |
| 14–26 s | 420–780   | Demande vocale (`Voice.tsx`)    | sombre | La carte Stock devient le téléphone ; question vocale → fiche produit (5 en stock · 2 réservés · **3 disponibles**) → brouillon fournisseur **« Brouillon prêt à vérifier »**, rien n'est commandé |
| 26–40 s | 780–1200  | Chantier (`Chantier.tsx`)       | clair  | Transition en cercle depuis le statut ; photo + note vocale rejoignent le dossier « Chantier Tilleuls » ; il alimente 4 livrables (note, facturation, fiche web, visuel) qui se rangent dans un écran de validation |
| 40–49 s | 1200–1470 | Point du jour (`Brief.tsx`)     | sombre | Le panneau de validation « devient la nuit » ; carte du matin, trois décisions en attente, veille en second plan |
| 49–56 s | 1470–1680 | Vous décidez (`Decide.tsx`)     | clair  | La ligne « devis » s'ouvre en gros plan ; Modifier · Valider · Plus tard ; une validation explicite change son état ; les autres restent « En attente » ; l'interface se réduit à un point bleu |
| 56–60 s | 1680–1800 | Signature (`End.tsx`)           | clair  | Le point bleu se divise en six points (six assistants) ; signature et mention « Concept d'application — démonstration illustrative » |

Continuité des objets entre les plans : demande → carte d'assistant ; carte Stock →
téléphone ; mini-fiche du chat → grande fiche → brouillon (le t-shirt glisse de la vignette
à la miniature) ; statut du brouillon → cercle de la scène suivante ; panneau de validation →
fond de nuit ; ligne « devis » → gros plan ; bouton validé → point bleu → six points.

## Organisation

```
src/
  Film.tsx            montage : séquences, transitions anticipées (`lead`), bande-son
  timeline.ts         bornes des scènes (images)
  theme.ts            couleurs, typographies, six rôles (libellé, couleur, pictogramme), ombres
  lib/anim.ts         courbes d'accélération maison, tweens, images-clés, Bézier
  components/
    Icon.tsx          famille de pictogrammes vectoriels (grille 24, trait 1,75)
    ui.tsx            Surface (carte), RoleTile / RoleTag (assistants), Pill (statuts),
                      Button, JobTag (repère commun du chantier), Kicker
    Headline.tsx      révélation typographique mot à mot (masques)
    VoiceWave.tsx     onde vocale en direct / note vocale enregistrée
    Phone.tsx         téléphone générique, barre d'état, en-tête « Votre équipe »
    Docs.tsx          livrables : note d'intervention, facturation, fiche web, visuel
    Illustrations.tsx t-shirt, photo de la terrasse (vectoriels)
  scenes/             une scène par fichier ; constantes de mise en page et de temps en tête
scripts/
  synth-audio.mjs     synthèse de la musique et des bruitages → public/audio/soundtrack.wav
  cues.mjs            repères sonores (images) : ouverture de carte, voix, document prêt, validation…
  stills.mjs          rendu d'images isolées pour le contrôle
  sheet.py            planche contact (Pillow) pour la relecture
public/
  fonts/              Inter et Inter Tight variables (SIL OFL, licences incluses)
  audio/              bande-son générée
```

## Données de démonstration

Toutes fictives et cohérentes entre elles : Mme Martin (terrasse bois, rue des Tilleuls),
M. Robert (pergola), t-shirt bleu taille M, réf. TSB-M. Aucun montant, aucun gain chiffré,
aucun témoignage, aucune marque, aucun faux site, aucun bouton d'inscription. Les actions qui
engagent l'entreprise restent au stade de brouillon ou « à vérifier » jusqu'à la validation.

## Future version verticale (1080 × 1920)

Pas encore réalisée. Le projet y est préparé : chaque scène sépare une **zone texte** et une
**zone interface** dont les coordonnées sont regroupées en tête de fichier (`SLOTS`, `CARD`,
`DOS`, `PANEL`…), et les composants (cartes, documents, téléphone) sont indépendants du cadre.
Recomposition prévue, scène par scène (et non un recadrage) :

- **Surcharge** : les demandes s'empilent en colonne décalée sur toute la hauteur ; le titre
  au tiers supérieur.
- **Équipe** : dossier commun au centre, six cartes en 2 colonnes × 3 rangs autour de lui,
  titre sur deux lignes en haut.
- **Demande vocale** : téléphone en plein cadre ; la fiche puis le brouillon se déploient
  par-dessus sa moitié basse ; la citation passe au-dessus du téléphone.
- **Chantier** : dossier en haut, livrables en carrousel vertical (un gros plan à la fois),
  écran de validation en liste pleine largeur.
- **Point du jour / Décision** : carte seule, pleine largeur ; titres au-dessus.
- **Signature** : texte sur quatre lignes, six points au-dessus.

## Fichiers produits (vérifiés)

- `out/publicite-assistants-60s.mp4` — **rendu réel** : H.264 High, 1920 × 1080, yuv420p,
  30 i/s, **1 800 images = 60,000 s**, AAC stéréo 48 kHz (≈ 10 Mo).
- `public/audio/soundtrack.wav` — bande-son originale générée par `npm run audio`
  (48 kHz, stéréo, 60 s, niveau moyen −21 dBFS, crête ≈ −5 dBFS).
- `out/check/c-XXXX.jpg` — une image représentative par séquence, extraite du MP4
  (numéro d'image dans le nom).

Pas de version verticale rendue (voir ci-dessus).
