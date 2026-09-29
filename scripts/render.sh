#!/usr/bin/env bash
# Robust render: frames are rendered in chunks (fresh browser each time, which
# keeps the WebGL product stages stable on machines without a GPU), then encoded
# once into two MP4s:
#   out/vision-urbaine-complete-$VERSION.mp4    H.264 High, CRF 16 (small, high quality)
#   out/vision-urbaine-compatible-$VERSION.mp4 H.264 Constrained Baseline, CBR 3 Mb/s,
#                                      1 s GOP, no B-frames (for picky LED players)
#   out/clips/VU-0x-*-$VERSION.mp4     the loop cut into ≤ 15 s clips at scene changes
#
# Usage: [COMP=VisionUrbainePub] [VERSION=vN] scripts/render.sh [--browser-executable=/path/to/chrome]
# An interrupted render resumes: finished chunks are kept in FRAMES_DIR.
set -euo pipefail
cd "$(dirname "$0")/.."

# COMP selects the video: VisionUrbaine (showcase loop) or VisionUrbainePub (the ad).
COMP=${COMP:-VisionUrbaine}
case "$COMP" in
VisionUrbaine)
	FRAMES=2490
	OUT=vision-urbaine
	CUTS=(0 300 600 900 1200 1500 1770 2190 2490)
	NAMES=(01-logo-intro 02-petits-objets 03-signaletique 04-deco-interieure 05-mariages-evenements 06-plexi-lumineux 07-creez-sans-limites 08-creer-aujourdhui)
	DEFAULT_VERSION=v2
	;;
VisionUrbainePub)
	FRAMES=1500
	OUT=vision-urbaine-pub
	CUTS=(0 150 420 720 1020 1260 1500)
	NAMES=(pub-01-allumage pub-02-matieres pub-03-grand-format pub-04-votre-nom pub-05-metiers pub-06-entrez)
	DEFAULT_VERSION=v1
	;;
*)
	echo "unknown COMP $COMP" >&2
	exit 1
	;;
esac
CHUNK=150
# LED players cache files by name: bump VERSION for every new delivery so the
# screen picks up the new clips instead of replaying the old ones.
VERSION=${VERSION:-$DEFAULT_VERSION}
SEQ=${FRAMES_DIR:-${TMPDIR:-/tmp}/vu_frames_$COMP} # no dot in the name: Remotion rejects it
mkdir -p "$SEQ"
frame() { printf '%s/f-%05d.png' "$SEQ" "$1"; }

for ((a = 0; a < FRAMES; a += CHUNK)); do
	b=$((a + CHUNK - 1))
	if ((b > FRAMES - 1)); then b=$((FRAMES - 1)); fi
	if [[ -f "$(frame "$b")" ]]; then
		echo "✓ frames $a–$b already rendered"
		continue
	fi
	echo "▶ frames $a–$b"
	tmp="$SEQ/chunk_$a"
	rm -rf "$tmp"
	npx remotion render "$COMP" "$tmp" --sequence --image-format=png \
		--frames="$a-$b" --concurrency=2 "$@"
	# Remotion's zero-padding depends on the chunk; rename to a fixed width.
	for f in "$tmp"/element-*.png; do
		n=${f##*/element-}
		n=$((10#${n%.png}))
		mv "$f" "$(frame "$n")"
	done
	rm -rf "$tmp"
done

for ((n = 0; n < FRAMES; n++)); do
	[[ -f "$(frame "$n")" ]] || { echo "✗ missing frame $n" >&2; exit 1; }
done

mkdir -p out
npx remotion ffmpeg -y -loglevel error -framerate 30 -i "$SEQ/f-%05d.png" \
	-c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p \
	-colorspace bt709 -color_primaries bt709 -color_trc bt709 \
	-movflags +faststart -an "out/$OUT-complete-$VERSION.mp4"

npx remotion ffmpeg -y -loglevel error -framerate 30 -i "$SEQ/f-%05d.png" \
	-c:v libx264 -profile:v baseline -level 3.0 -pix_fmt yuv420p -r 30 \
	-g 30 -keyint_min 30 -sc_threshold 0 -bf 0 -refs 1 \
	-b:v 3M -maxrate 3M -bufsize 6M -x264-params nal-hrd=cbr \
	-movflags +faststart -an -map_metadata -1 "out/$OUT-compatible-$VERSION.mp4"

# ≤ 15 s clips cut at scene boundaries, for players with duration/size limits
mkdir -p out/clips
for ((k = 0; k < ${#NAMES[@]}; k++)); do
	a=${CUTS[$k]}
	n=$((CUTS[k + 1] - a))
	npx remotion ffmpeg -y -loglevel error -framerate 30 -start_number "$a" -i "$SEQ/f-%05d.png" \
		-frames:v "$n" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -colorspace bt709 \
		-movflags +faststart -an "out/clips/VU-${NAMES[$k]}-$VERSION.mp4"
done

rm -rf "$SEQ"
echo "✔ out/$OUT-complete-$VERSION.mp4, out/$OUT-compatible-$VERSION.mp4 and clips ($FRAMES frames)"
