# Custom Local Fonts - Download Guide

## Current Status

✅ **CSS Configuration Complete** - @font-face declarations added to `globals.css`
❌ **Font Files Missing** - Need to download 4 WOFF2 files

The build will fail until the font files are downloaded.

---

## Method 1: Automated Download (Recommended)

### Step 1: Run the Download Script
```bash
# Make script executable (if not already)
chmod +x download-fonts.sh

# Run the script
./download-fonts.sh
```

This will download all 4 fonts automatically.

### Step 2: Verify Download
```bash
# Check that files exist
ls -lh src/assets/fonts/amiri/
ls -lh src/assets/fonts/noto-arabic/
```

### Step 3: Build & Test
```bash
# Build the project
NEXT_DISABLE_TURBOPACK=1 pnpm build

# Run development server
NEXT_DISABLE_TURBOPACK=1 pnpm dev
```

---

## Method 2: Manual Download

If the script doesn't work, download these 4 files manually:

### Amiri Font (Regular & Bold)

**Amiri Regular:**
- URL: https://fonts.gstatic.com/s/amiri/v30/J7aRnpd8CGxBHpUrtLMS7JNKIjk.woff2
- Save to: `src/assets/fonts/amiri/amiri-regular.woff2`

**Amiri Bold:**
- URL: https://fonts.gstatic.com/s/amiri/v30/J7acnpd8CGxBHp2VkaY6zp5gGDAbnCA.woff2
- Save to: `src/assets/fonts/amiri/amiri-bold.woff2`

### Noto Sans Arabic (Regular & Bold)

**Noto Sans Arabic Regular:**
- URL: https://fonts.gstatic.com/s/notosansarabic/v33/nwpCtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlj5Jv4rqxzLIhjE.woff2
- Save to: `src/assets/fonts/noto-arabic/noto-arabic-regular.woff2`

**Noto Sans Arabic Bold:**
- URL: https://fonts.gstatic.com/s/notosansarabic/v33/nwpCtLGrOAZMl5nJ_wfgRg3DrWFZWsnVBJ_sS6tlqHHFlj47v4rqxzLIhjE.woff2
- Save to: `src/assets/fonts/noto-arabic/noto-arabic-bold.woff2`

### File Structure After Download
```
src/assets/fonts/
├── amiri/
│   ├── amiri-regular.woff2   (~50KB)
│   └── amiri-bold.woff2      (~50KB)
└── noto-arabic/
    ├── noto-arabic-regular.woff2  (~90KB)
    └── noto-arabic-bold.woff2     (~90KB)
```

---

## Method 3: Download from Google Fonts

1. Visit: https://fonts.google.com/specimen/Amiri
2. Click "Download family"
3. Extract WOFF2 files
4. Copy to `src/assets/fonts/amiri/`

Then repeat for Noto Sans Arabic:
1. Visit: https://fonts.google.com/noto/specimen/Noto+Sans+Arabic
2. Click "Download family"
3. Extract WOFF2 files
4. Copy to `src/assets/fonts/noto-arabic/`

---

## What Was Already Done

### ✅ CSS Configuration (`src/app/globals.css`)

Added @font-face declarations:
```css
@font-face {
  font-family: 'Amiri';
  src: url('../assets/fonts/amiri/amiri-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0600-06FF, U+200C-200E, U+2010-2011, U+FB50-FDFF, U+FE70-FEFF;
}

/* Similar declarations for all 4 font files */
```

Updated font classes to use local fonts:
```css
body {
  font-family: 'Amiri', Arial, Helvetica, sans-serif;
}

.font-arabic {
  font-family: 'Amiri', serif;
}

.font-arabic-sans {
  font-family: 'Noto Sans Arabic', sans-serif;
}
```

---

## Troubleshooting

### Network Issues
If you can't download from fonts.gstatic.com:
1. Try Method 3 (download from Google Fonts website)
2. Use a VPN or different network
3. Download fonts from alternative sources (GitHub, etc.)

### Build Still Fails
After downloading fonts, clear Next.js cache:
```bash
rm -rf .next
NEXT_DISABLE_TURBOPACK=1 pnpm build
```

### Fonts Not Displaying
1. Check browser developer tools → Network tab
2. Verify fonts load with 200 status
3. Check console for 404 errors
4. Ensure file paths are correct

---

## Expected Result

After downloading fonts, the app will:
- ✅ Display Arabic text with Amiri and Noto Sans Arabic
- ✅ Work completely offline (no network requests for fonts)
- ✅ Have consistent, beautiful Arabic typography
- ✅ Maintain all PWA capabilities

---

## Alternative: Use Google Fonts CDN (Easier)

If downloading fonts is problematic, revert to Google Fonts CDN:

1. Edit `src/app/layout.tsx`
2. Add font imports:
```typescript
import { Amiri, Noto_Sans_Arabic } from 'next/font/google';

const amiri = Amiri({ subsets: ['arabic'], weight: ['400', '700'] });
const noto = Noto_Sans_Arabic({ subsets: ['arabic'], weight: ['400', '700'] });
```

3. Update body className:
```tsx
<body className={`${amiri.className} ${noto.className}`}>
```

4. Remove @font-face from globals.css

**Note**: This requires internet connection but is simpler.

---

**Current Status**: Waiting for font files to be downloaded
**Next Step**: Run `./download-fonts.sh` or download fonts manually
