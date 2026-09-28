#!/usr/bin/env bash
# Robust render: frames are rendered in chunks (fresh browser each time, which
# keeps the WebGL product stages stable on machines without a GPU), then encoded
# once into two MP4s:
#   out/vision-urbaine.mp4             H.264 High, CRF 16 (small, high quality)
#   out/vision-urbaine-compatible.mp4  H.264 Constrained Baseline, CBR 3 Mb/s,
#                                      1 s GOP, no B-frames (for picky LED players)
#
# Usage: scripts/render.sh [--browser-executable=/path/to/chrome]
set -euo pipefail
cd "$(dirname "$0")/.."

FRAMES=900
CHUNK=150
SEQ=$(mktemp -d)
trap 'rm -rf "$SEQ"' EXIT

for ((a = 0; a < FRAMES; a += CHUNK)); do
	b=$((a + CHUNK - 1))
	echo "▶ frames $a–$b"
	npx remotion render VisionUrbaine "$SEQ" --sequence --image-format=png \
		--frames="$a-$b" --concurrency=2 "$@"
done

mkdir -p out
npx remotion ffmpeg -y -loglevel error -framerate 30 -i "$SEQ/element-%03d.png" \
	-c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p \
	-colorspace bt709 -color_primaries bt709 -color_trc bt709 \
	-movflags +faststart -an out/vision-urbaine.mp4

npx remotion ffmpeg -y -loglevel error -framerate 30 -i "$SEQ/element-%03d.png" \
	-c:v libx264 -profile:v baseline -level 3.0 -pix_fmt yuv420p -r 30 \
	-g 30 -keyint_min 30 -sc_threshold 0 -bf 0 -refs 1 \
	-b:v 3M -maxrate 3M -bufsize 6M -x264-params nal-hrd=cbr \
	-movflags +faststart -an -map_metadata -1 out/vision-urbaine-compatible.mp4

echo "✔ out/vision-urbaine.mp4 and out/vision-urbaine-compatible.mp4"
