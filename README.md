# Vaishnavi — Home Services Marketplace

A premium home services app (housekeeping, plumbing, cooking, elder care, etc.) built with React + TypeScript + Capacitor for Android.

## Web Development
```bash
npm run dev      # start dev server
npm run build    # production build
npm test         # Playwright e2e tests
```

## Android App
See **[ANDROID_SETUP.md](./ANDROID_SETUP.md)** for full instructions.

Quick start:
```bash
npm run build
node scripts/gen-icons.js
npx cap sync android
npx cap open android
```
Then connect your phone via USB and press Run in Android Studio.

Or just double-click **`build-android.bat`** for an automated walkthrough.
