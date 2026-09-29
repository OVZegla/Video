#!/usr/bin/env bash
# Render a 1920 × 1080 presentation film to out/<name>.mp4 (H.264 High, CRF 17,
# BT.709 limited range, no audio).
#
# Frames are rendered in chunks (fresh browser each time) into FRAMES_DIR, so an
# interrupted render resumes where it stopped; then encoded once.
# Usage: scripts/render-film.sh <CompositionId> <output-name> [extra remotion flags]
set -euo pipefail
cd "$(dirname "$0")/.."

COMP=$1
NAME=$2
shift 2
FRAMES=$(npx remotion compositions 2>/dev/null | awk -v c="$COMP" '$1 == c {print $4}')
[[ -n "$FRAMES" ]] || { echo "unknown composition $COMP" >&2; exit 1; }
CHUNK=300
SEQ=${FRAMES_DIR:-${TMPDIR:-/tmp}/vu_${NAME//[^a-z0-9]/_}_frames}
mkdir -p "$SEQ"

for ((a = 0; a < FRAMES; a += CHUNK)); do
	b=$((a + CHUNK - 1))
	((b > FRAMES - 1)) && b=$((FRAMES - 1))
	if [[ -f "$SEQ/element-$(printf %05d "$b").jpeg" ]]; then
		echo "✓ frames $a–$b already rendered"
		continue
	fi
	echo "▶ frames $a–$b / $FRAMES"
	npx remotion render "$COMP" "$SEQ" --sequence --image-format=jpeg --jpeg-quality=92 \
		--frames="$a-$b" --concurrency=3 --log=error "$@"
	# Remotion pads frame numbers to the width of the chunk's range; normalise to 5 digits.
	for img in "$SEQ"/element-*.jpeg; do
		n=$(basename "$img" .jpeg); n=$((10#${n#element-}))
		dest="$SEQ/element-$(printf %05d "$n").jpeg"
		[[ "$img" == "$dest" ]] || mv "$img" "$dest"
	done
done

mkdir -p out
npx remotion ffmpeg -y -loglevel error -framerate 30 -i "$SEQ/element-%05d.jpeg" \
	-vf "scale=in_range=pc:out_range=tv,format=yuv420p" -c:v libx264 -preset slow -crf 17 \
	-colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
	-movflags +faststart -an "out/$NAME.mp4"

rm -rf "$SEQ"
echo "✔ out/$NAME.mp4"
