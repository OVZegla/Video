#!/usr/bin/env bash
# Training & support film → out/vision-urbaine-formation.mp4 (~5 min 13 s).
exec "$(dirname "$0")/render-film.sh" Formation vision-urbaine-formation "$@"
