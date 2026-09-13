# Vaishnavi - Home Services

A complete home services marketplace app converted to Android via Capacitor.

## Getting Started

### Run in browser
```bash
npm run dev
```

### Build for Android
```bash
npm run build
npx cap add android    # only needed first time
npx cap sync           # sync after code changes
npx cap open android   # opens in Android Studio
```

### Build APK directly
```bash
npm run build
npx cap sync android
cd android && ./gradlew assembleDebug
# APK at android/app/build/outputs/apk/debug/app-debug.apk
```

### Install on phone via USB
```bash
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

### Quick test install (no studio)
```bash
npm run build
npx cap run android --livereload --external
```

## What was changed

- Added **Capacitor** (ionic) to wrap the React web app in a native Android shell
- Created `capacitor.config.ts` with app ID, name, and native plugin config
- Added `android/` project with AndroidManifest.xml
- Configured Material You themed splash screen (green `#173F35`)
- Status bar styled dark-on-light for the green theme
- Keyboard resize enabled so forms don't get hidden on mobile
- Back-button handled gracefully (no accidental exits)

## App ID
`com.vaishnavi.app`
