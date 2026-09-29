#!/usr/bin/env bash
# Franchise presentation film → out/vision-urbaine-franchise.mp4 (~2 min 21 s).
exec "$(dirname "$0")/render-film.sh" Franchise vision-urbaine-franchise "$@"
