#!/usr/bin/env bash
# Renders the three How it works clips (MP4 H.264 + WebM VP9 + posters)
# and copies them into ../public/videos with the names the site expects.
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p out ../public/videos

# id                 | site name | poster frame (unzoomed, representative; 60 fps)
CLIPS=(
  "Step1-PickAStore:step-1:0"
  "Step2-SetsUpWine:step-2:430"
  "Step3-Play:step-3:410"
)

for entry in "${CLIPS[@]}"; do
  IFS=: read -r id name frame <<<"$entry"
  npx remotion render "$id" "out/$id.mp4" --codec=h264 --crf=20 --pixel-format=yuv420p --x264-preset=slow
  ffmpeg -loglevel error -y -i "out/$id.mp4" -c copy -movflags +faststart "out/$id.fs.mp4" && mv "out/$id.fs.mp4" "out/$id.mp4"
  npx remotion render "$id" "out/$id.webm" --codec=vp9 --crf=34
  npx remotion still "$id" "out/$id-poster.png" --frame="$frame"
  cp "out/$id.mp4" "../public/videos/$name.mp4"
  cp "out/$id.webm" "../public/videos/$name.webm"
  # 1200 px WebP poster for the page (the PNG stays in out/ as the master)
  if command -v cwebp >/dev/null; then
    cwebp -quiet -q 78 -resize 1200 750 "out/$id-poster.png" -o "../public/videos/$name-poster.webp"
  else
    python3 -c "from PIL import Image; Image.open('out/$id-poster.png').convert('RGB').resize((1200,750), Image.LANCZOS).save('../public/videos/$name-poster.webp', quality=78, method=6)"
  fi
done

# Budget check: every clip must be ≤ 2.5 MB.
for f in ../public/videos/*.mp4 ../public/videos/*.webm; do
  size=$(wc -c <"$f")
  if [ "$size" -gt 2621440 ]; then echo "OVER BUDGET: $f ($size bytes)"; exit 1; fi
done
ls -la ../public/videos
