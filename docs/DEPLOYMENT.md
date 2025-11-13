# Deployment Guide - Phase 7

## 🚀 Production Deployment

This guide covers deploying the Elm app to production using Vercel.

---

## 📋 Pre-Deployment Checklist

### 1. Run Tests
```bash
# Unit tests
pnpm test:run

# Unit tests with coverage
pnpm test:coverage

# E2E tests (after installing Playwright)
pnpm exec playwright install
pnpm exec playwright test
```

### 2. Build Application
```bash
# Note: Use NEXT_DISABLE_TURBOPACK due to known font loading issues
NEXT_DISABLE_TURBOPACK=1 pnpm build
```

### 3. Verify Build
```bash
# Test production build locally
NEXT_DISABLE_TURBOPACK=1 pnpm start
# Open http://localhost:3000
```

---

## 🌐 Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts:
# - Set up and deploy: Y
# - Which scope: [your account]
# - Link to existing project: N
# - Project name: elm-salam (or your choice)
# - Directory: ./
# - Override settings: N
```

### Option 2: GitHub Integration

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit - Elm app complete"
git branch -M main
git remote add origin https://github.com/yourusername/elm-app.git
git push -u origin main
```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Next.js
     - Root Directory: ./
     - Build Command: `NEXT_DISABLE_TURBOPACK=1 pnpm build`
     - Output Directory: `.next`
   - Click "Deploy"

### Option 3: Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import from GitHub
4. Configure deployment settings

---

## ⚙️ Vercel Configuration

### Environment Variables
Add these in Vercel Dashboard > Settings > Environment Variables:

```
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Build Settings
```
Framework Preset: Next.js
Build Command: NEXT_DISABLE_TURBOPACK=1 pnpm build
Output Directory: .next
Install Command: pnpm install
```

### Build Optimization

The app already has these optimizations configured:

- **SSG**: All chapters pre-built
- **ISR**: 1-hour revalidation
- **Code Splitting**: Dynamic imports
- **Image Optimization**: Built-in Next.js

---

## 🔧 Post-Deployment Steps

### 1. Verify Deployment
- [ ] Visit production URL
- [ ] Check all 29 chapters load
- [ ] Test search functionality
- [ ] Verify PWA installation works
- [ ] Test offline mode
- [ ] Check mobile responsiveness

### 2. Test SEO Features
- [ ] Check sitemap.xml: `https://your-domain.vercel.app/sitemap.xml`
- [ ] Check robots.txt: `https://your-domain.vercel.app/robots.txt`
- [ ] Verify metadata on chapter pages
- [ ] Test with Google Rich Results Test
- [ ] Submit sitemap to Google Search Console

### 3. Performance Testing
```bash
# Run Lighthouse in Chrome DevTools
# Target scores:
# - Performance: 90+
# - Accessibility: 90+
# - Best Practices: 90+
# - SEO: 90+
```

### 4. Test PWA
- [ ] Install on mobile (Add to Home Screen)
- [ ] Install on desktop
- [ ] Test offline mode
- [ ] Verify app icons display correctly

---

## 🔄 Custom Domain (Optional)

### Add Custom Domain in Vercel

1. Go to Vercel Dashboard > Project > Settings > Domains
2. Add your domain (e.g., `elm-app.com`)
3. Configure DNS with your domain provider:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com

   Type: A
   Name: @
   Value: 76.76.19.61
   ```

4. Update environment variable:
   ```
   NEXT_PUBLIC_APP_URL=https://elm-app.com
   ```

---

## 🧪 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install pnpm
        run: npm install -g pnpm

      - name: Install dependencies
        run: pnpm install

      - name: Run unit tests
        run: pnpm test:run

      - name: Build application
        run: NEXT_DISABLE_TURBOPACK=1 pnpm build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### Required Secrets
Add these in GitHub > Settings > Secrets and variables > Actions:

```
VERCEL_TOKEN - From vercel.com/account/tokens
ORG_ID - From vercel.com/account/[id]
PROJECT_ID - From project settings
```

---

## 📊 Monitoring

### Vercel Analytics
1. Enable in Vercel Dashboard > Analytics
2. Monitor:
   - Page views
   - Unique visitors
   - Core Web Vitals
   - Performance metrics

### Error Monitoring (Optional)
Consider adding:
- **Sentry**: Error tracking
- **LogRocket**: Session replay
- **DataDog**: Performance monitoring

---

## 🐛 Troubleshooting

### Build Fails with Turbopack
**Solution**: Use `NEXT_DISABLE_TURBOPACK=1` for build

### Fonts Not Loading
**Known Issue**: Next.js 16.0.1 Turbopack font loading
**Current**: App uses system fonts as fallback
**Fix**: Will be resolved in future Next.js versions

### PWA Icons Missing
**Solution**: Add icons to `/public/icons/`
- icon-72x72.png
- icon-192x192.png
- icon-512x512.png
(All sizes listed in manifest.json)

### Service Worker Not Registering
- Ensure HTTPS in production
- Check `/sw.js` is accessible
- Verify in DevTools > Application

### Search Not Working
- Check `/elm-data.json` is accessible
- Verify data format matches types
- Check browser console for errors

---

## 🎯 Success Metrics

### Performance Targets
- **Lighthouse Score**: 90+ (Performance, Accessibility, SEO)
- **FCP**: < 1.5s
- **LCP**: < 2.5s
- **CLS**: < 0.1

### Functional Targets
- [ ] All 29 chapters accessible
- [ ] Search finds results
- [ ] Bookmarks save/load
- [ ] PWA installs successfully
- [ ] Offline mode works
- [ ] Mobile responsive
- [ ] Dark/Light theme toggles

---

## 📚 Additional Resources

### Documentation
- [Vercel Deployment Docs](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [PWA Guide](https://web.dev/progressive-web-apps/)
- [Core Web Vitals](https://web.dev/vitals/)

### Tools
- [Vercel CLI](https://vercel.com/cli)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [PWA Builder](https://www.pwabuilder.com/)

---

## ✅ Deployment Checklist

- [ ] All tests passing
- [ ] Build successful
- [ ] Deployed to Vercel
- [ ] Domain configured (optional)
- [ ] Environment variables set
- [ ] Sitemap accessible
- [ ] Robots.txt accessible
- [ ] PWA installation tested
- [ ] Offline mode tested
- [ ] Mobile responsive verified
- [ ] SEO metadata verified
- [ ] Performance tested
- [ ] Analytics enabled

---

## 🎉 Congratulations!

Your Elm app is now live! The Islamic spiritual texts are accessible to users worldwide with:

- ⚡ Fast loading (SSG + ISR)
- 📱 Mobile-first design
- 🔍 Powerful search
- 📚 Bookmarking system
- 💾 Offline reading (PWA)
- ♿ Full accessibility
- 🔍 SEO optimized
- 🌍 Custom domain ready

**Share your deployment URL and celebrate! 🎊**
