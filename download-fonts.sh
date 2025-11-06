#!/bin/bash

# Script to download Arabic fonts for local hosting
# Run this script to download WOFF2 font files

echo "Downloading Arabic fonts..."

# Create directories
mkdir -p src/assets/fonts/amiri
mkdir -p src/assets/fonts/noto-arabic

# Download Amiri font
echo "Downloading Amiri Regular..."
curl -L -o src/assets/fonts/amiri/amiri-regular.woff2 \
  "https://fonts.gstatic.com/s/amiri/v30/J7aRnpd8CGxBHpUrtLMS7JNKIjk.woff2"

echo "Downloading Amiri Bold..."
curl -L -o src/assets/fonts/amiri/amiri-bold.woff2 \
  "https://fonts.gstatic.com/s/amiri/v30/J7acnpd8CGxBHp2VkaY6zp5gGDAbnCA.woff2"

# Download Noto Sans Arabic
echo "Downloading Noto Sans Arabic Regular..."
curl -L -o src/assets/fonts/noto-arabic/noto-arabic-regular.woff2 \
  "https://fonts.gstatic.com/s/notosansarabic/v33/nwpCtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlj5Jv4rqxzLIhjE.woff2"

echo "Downloading Noto Sans Arabic Bold..."
curl -L -o src/assets/fonts/noto-arabic/noto-arabic-bold.woff2 \
  "https://fonts.gstatic.com/s/notosansarabic/v33/nwpCtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlj47v4rqxzLIhjE.woff2"

echo "Download complete!"

# Show file sizes
echo ""
echo "Font files downloaded:"
ls -lh src/assets/fonts/amiri/
ls -lh src/assets/fonts/noto-arabic/

echo ""
echo "✅ Fonts ready! Now you can build the project with: NEXT_DISABLE_TURBOPACK=1 pnpm build"
