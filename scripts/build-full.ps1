# Full Android build script for Vaishnavi
# Run: powershell -ExecutionPolicy Bypass -File scripts/build-full.ps1

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Vaishnavi — Android Build Script" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check prerequisites
Write-Host "[Pre-check] Verifying environment..." -ForegroundColor Yellow

$node = Get-Command node -ErrorAction SilentlyContinue
if (-not $node) {
    Write-Host "`n[ERROR] Node.js is not installed!" -ForegroundColor Red
    Write-Host "        Download from https://nodejs.org (LTS version)" -ForegroundColor Gray
    Write-Host "        After installing, close and reopen PowerShell, then run this again.`n" -ForegroundColor Gray
    pause; exit 1
}

$java = Get-Command java -ErrorAction SilentlyContinue
if (-not $java) {
    Write-Host "`n[WARNING] Java not found in PATH." -ForegroundColor Yellow
    Write-Host "          Android Studio bundles its own JDK — that's OK." -ForegroundColor Yellow
    Write-Host "          If Gradle fails later, install OpenJDK 17 from https://adoptium.net/`n" -ForegroundColor Gray
} else {
    $ver = java -version 2>&1 | Select-String "version"
    Write-Host "        Java: $ver" -ForegroundColor Gray
}

Write-Host "`n[Step 1/4] Building web app (Vite)..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[ERROR] Build failed!" -ForegroundColor Red; pause; exit 1
}
Write-Host "        dist/ created.`n" -ForegroundColor Green

Write-Host "[Step 2/4] Generating launcher icons..." -ForegroundColor Cyan
if (Test-Path "$root\scripts\gen-icons.js") {
    node "$root\scripts\gen-icons.js"
} else {
    Write-Host "        Skipping (no gen-icons.js found)." -ForegroundColor Gray
}
Write-Host ""

Write-Host "[Step 3/4] Initializing & syncing Capacitor..." -ForegroundColor Cyan
if (-not (Test-Path "$root\android\app\build.gradle")) {
    Write-Host "        First time setup — initializing Capacitor project..." -ForegroundColor Gray
    npx cap init com.vaishnavi.app Vaishnavi --web-dir=dist --no-run
    if ($LASTEXITCODE -ne 0) {
        Write-Host "        cap init failed, trying without options..." -ForegroundColor Gray
        npx cap init --no-open
    }
    npx cap add android
    if ($LASTEXITCODE -ne 0) {
        Write-Host "        cap add android failed." -ForegroundColor Red
        Write-Host "        Make sure @capacitor/android is installed:" -ForegroundColor Gray
        Write-Host "        npm install @capacitor/android@latest`n" -ForegroundColor Gray
        pause; exit 1
    }
} else {
    Write-Host "        Project already initialized." -ForegroundColor Gray
}

npx cap sync android
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[ERROR] Cap sync failed!" -ForegroundColor Red; pause; exit 1
}
Write-Host "        Synced.`n" -ForegroundColor Green

Write-Host "[Step 4/4] Opening Android Studio..." -ForegroundColor Cyan
Write-Host ""
Write-Host "  Android Studio should open automatically." -ForegroundColor White
Write-Host "  When you see 'Gradle sync finished' at the bottom:" -ForegroundColor White
Write-Host "    1. Connect your phone via USB cable" -ForegroundColor White
Write-Host "    2. On phone: Settings -> About Phone -> tap Build Number 7 times" -ForegroundColor White
Write-Host "       -> go back -> Developer Options -> enable USB Debugging" -ForegroundColor White
Write-Host "    3. Press the green Play button (or Shift+F10)" -ForegroundColor White
Write-Host ""

# Try to open Android Studio
try {
    Start-Process "npx" -ArgumentList "cap","open","android" -Wait -NoNewWindow
} catch {
    Write-Host "        Could not auto-open Android Studio." -ForegroundColor Yellow
    Write-Host "        Open it manually: File -> Open -> select 'android' folder`n" -ForegroundColor Gray
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Build script completed!" -ForegroundColor Green
Write-Host "  APK will be at:" -ForegroundColor White
Write-Host "  android\app\build\outputs\apk\debug\app-debug.apk" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
pause
