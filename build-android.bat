@echo off
chcp 65001 >nul 2>&1
echo.
echo ========================================
echo   Vaishnavi — Android App Builder
echo ========================================
echo.

REM Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is required but not found.
    echo         Download from https://nodejs.org (LTS version)
    echo         After installing, restart this script.
    pause
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version 2^>nul') do set NODE_VER=%%i
echo [OK] Node.js %NODE_VER%
echo.

REM Step 1: Build web app
echo [1/5] Building web app...
npm run build >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Vite build failed. Check output above.
    pause
    exit /b 1
)
echo       dist/ ready.
echo.

REM Step 2: Generate icons
echo [2/5] Generating launcher icons...
node scripts/gen-icons.js 2>nul
if errorlevel 1 (
    echo       Using XML adaptive icons (no PNGs).
)
echo.

REM Step 3: Init Capacitor (first time only)
if not exist "android\app\build.gradle" (
    echo [3/5] Initializing Android project...
    npx cap init com.vaishnavi.app Vaishnavi --web-dir=dist --no-run
    npx cap add android
) else (
    echo [3/5] Android project exists.
)
echo.

REM Step 4: Sync
echo [4/5] Syncing Capacitor...
npx cap sync android
if errorlevel 1 (
    echo [ERROR] Cap sync failed.
    pause
    exit /b 1
)
echo       Synced.
echo.

REM Step 5: Open Android Studio
echo [5/5] Opening Android Studio...
echo.
echo   When Gradle finishes syncing (watch bottom bar):
echo   1. Connect your phone via USB
echo   2. Enable USB Debugging on your phone
echo      (Settings -> About Phone -> tap Build Number 7x)
echo   3. Press the green Run button
echo.
npx cap open android
echo.
echo ========================================
echo   Done! Check Android Studio for build status.
echo ========================================
pause
