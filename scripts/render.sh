#!/usr/bin/env bash
# Robust render: frames are rendered in chunks (fresh browser each time, which
# keeps the WebGL product stages stable on machines without a GPU), then encoded
# once into two MP4s:
#   out/vision-urbaine.mp4             H.264 High, CRF 16 (small, high quality)
#   out/vision-urbaine-compatible.mp4  H.264 Constrained Baseline, CBR 3 Mb/s,
#                                      1 s GOP, no B-frames (for picky LED players)
#
# Usage: scripts/render.sh [--browser-executable=/path/to/chrome]
# An interrupted render resumes: finished chunks are kept in FRAMES_DIR.
set -euo pipefail
cd "$(dirname "$0")/.."

FRAMES=1560
CHUNK=150
SEQ=${FRAMES_DIR:-${TMPDIR:-/tmp}/vu_frames} # no dot in the name: Remotion rejects it
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
	npx remotion render VisionUrbaine "$tmp" --sequence --image-format=png \
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
	-movflags +faststart -an out/vision-urbaine.mp4

npx remotion ffmpeg -y -loglevel error -framerate 30 -i "$SEQ/f-%05d.png" \
	-c:v libx264 -profile:v baseline -level 3.0 -pix_fmt yuv420p -r 30 \
	-g 30 -keyint_min 30 -sc_threshold 0 -bf 0 -refs 1 \
	-b:v 3M -maxrate 3M -bufsize 6M -x264-params nal-hrd=cbr \
	-movflags +faststart -an -map_metadata -1 out/vision-urbaine-compatible.mp4

rm -rf "$SEQ"
echo "✔ out/vision-urbaine.mp4 and out/vision-urbaine-compatible.mp4 ($FRAMES frames)"
