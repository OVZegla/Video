#!/usr/bin/env bash
# Franchise presentation film (1920 × 1080, 30 fps, ~2 min 21 s, no audio).
#   out/vision-urbaine-franchise.mp4   H.264 High, CRF 17, BT.709 limited range
#
# Frames are rendered in chunks (fresh browser each time) into FRAMES_DIR, so an
# interrupted render resumes where it stopped; then encoded once.
# Usage: scripts/render-franchise.sh [extra remotion flags]
set -euo pipefail
cd "$(dirname "$0")/.."

FRAMES=4230
CHUNK=300
SEQ=${FRAMES_DIR:-${TMPDIR:-/tmp}/vu_franchise_frames}
mkdir -p "$SEQ"

for ((a = 0; a < FRAMES; a += CHUNK)); do
	b=$((a + CHUNK - 1))
	((b > FRAMES - 1)) && b=$((FRAMES - 1))
	if [[ -f "$SEQ/element-$(printf %04d "$b").jpeg" ]]; then
		echo "✓ frames $a–$b already rendered"
		continue
	fi
	echo "▶ frames $a–$b"
	npx remotion render Franchise "$SEQ" --sequence --image-format=jpeg --jpeg-quality=92 \
		--frames="$a-$b" --concurrency=3 --log=error "$@"
	# Remotion pads frame numbers to the width of the chunk's range; normalise to 4 digits.
	for img in "$SEQ"/element-*.jpeg; do
		n=$(basename "$img" .jpeg); n=$((10#${n#element-}))
		dest="$SEQ/element-$(printf %04d "$n").jpeg"
		[[ "$img" == "$dest" ]] || mv "$img" "$dest"
	done
done

mkdir -p out
npx remotion ffmpeg -y -loglevel error -framerate 30 -i "$SEQ/element-%04d.jpeg" \
	-vf "scale=in_range=pc:out_range=tv,format=yuv420p" -c:v libx264 -preset slow -crf 17 \
	-colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
	-movflags +faststart -an out/vision-urbaine-franchise.mp4

rm -rf "$SEQ"
echo "✔ out/vision-urbaine-franchise.mp4"
