# Vaishnavi — Android App Quick Start

## ✅ Already Done
- Your React app is wrapped in **Capacitor** for Android
- All project files are set up in `android/`
- Web build is ready in `dist/`

## 🚀 Build & Install in 3 Steps

### Step 1: Install Java 17 (if not already)
Download from https://adoptium.net/ → install JDK 17+
Verify: open PowerShell and type:
```powershell
java -version
```
Should show version 17 or higher.

### Step 2: Run the build
Open **PowerShell** in this folder and run:
```powershell
npm run build
node scripts/gen-icons.js
npx cap sync android
```

### Step 3: Open in Android Studio
```powershell
npx cap open android
```

In Android Studio:
1. Wait for "Gradle sync finished" (bottom bar)
2. Connect your phone via USB
3. On phone: Settings → About Phone → tap **Build number** 7 times → back → **Developer options** → enable **USB debugging**
4. Press the green ▶ **Run** button

---

## 📱 Alternative: Get APK Without Android Studio

After Step 2 above, run:
```powershell
cd android
.\gradlew.bat assembleDebug
```
APK location: `android\app\build\outputs\apk\debug\app-debug.apk`

Send that file to your phone and install it.

---

## 🔧 Troubleshooting

| Problem | Fix |
|---------|-----|
| `java` not found | Install [OpenJDK 17](https://adoptium.net/) |
| SDK not found in Android Studio | File → Project Structure → SDK Location → Browse to `C:\Users\<you>\AppData\Local\Android\Sdk` |
| Gradle download fails | Check internet / use VPN |
| Phone not detected | Enable USB debugging + select "File Transfer" mode |
| Blank screen on launch | Make sure `dist/index.html` exists |

---

## App Details
- **Package:** `com.vaishnavi.app`
- **Min Android:** 6.0 (API 23)
- **Theme color:** Deep green `#173F35`
