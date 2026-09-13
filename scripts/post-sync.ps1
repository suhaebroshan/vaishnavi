# Post-sync customization script
# Run this AFTER `npx cap sync android` to apply custom configurations

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent

Write-Host "`n=== Applying Android Post-Sync Customizations ===" -ForegroundColor Cyan

# 1. Update AndroidManifest with our config
$manifest = @'
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme"
        android:usesCleartextTraffic="true">
        <activity
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|locale|smallestScreenSize|screenLayout|uiMode"
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/title_activity_main"
            android:theme="@style/AppTheme.NoActionBar"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
'@
$manifest | Out-File -FilePath "$root\android\app\src\main\AndroidManifest.xml" -Encoding UTF8
Write-Host "[OK] AndroidManifest.xml updated" -ForegroundColor Green

# 2. Update styles to match app theme
$styles = @'
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
        <item name="colorPrimary">#173F35</item>
        <item name="colorPrimaryDark">#173F35</item>
        <item name="colorAccent">#C86F52</item>
        <item name="android:statusBarColor">#173F35</item>
        <item name="android:navigationBarColor">#F5F0E8</item>
    </style>
    <style name="AppTheme.NoActionBar">
        <item name="windowActionBar">false</item>
        <item name="windowNoTitle">true</item>
        <item name="android:background">@null</item>
    </style>
</resources>
'@
$stylesPath = "$root\android\app\src\main\res\values\styles.xml"
$styles | Out-File -FilePath $stylesPath -Encoding UTF8
Write-Host "[OK] styles.xml updated" -ForegroundColor Green

# 3. Generate launcher icons if PNGs don't exist
$hasIcons = Test-Path "$root\android\app\src\main\res\mipmap-hdpi\ic_launcher.png"
if (-not $hasIcons) {
    Write-Host "[INFO] Generating launcher icons..." -ForegroundColor Yellow
    $nodeScript = "$root\scripts\gen-icons.js"
    if (Test-Path $nodeScript) {
        node $nodeScript
        Write-Host "[OK] Icons generated" -ForegroundColor Green
    } else {
        Write-Host "[WARN] gen-icons.js not found, skipping icon generation" -ForegroundColor Yellow
    }
} else {
    Write-Host "[OK] Launcher icons already present" -ForegroundColor Green
}

Write-Host "`n=== Setup Complete! ===" -ForegroundColor Green
Write-Host "You can now open this project in Android Studio:" -ForegroundColor White
Write-Host "  npx cap open android" -ForegroundColor Cyan
Write-Host ""
