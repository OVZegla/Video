#!/bin/sh
# Bundle three.js + modèle GLB (en base64) dans un seul script classique (compatible file:// dans la WebView)
set -e
cd "$(dirname "$0")"
npx esbuild main.js --bundle --minify --format=iife --target=es2018 --loader:.glb=base64 --outfile=../android/app/src/main/assets/app.js
cp index.html ../android/app/src/main/assets/index.html
