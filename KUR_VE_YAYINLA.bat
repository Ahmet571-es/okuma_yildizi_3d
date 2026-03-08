@echo off
chcp 65001 >nul 2>&1
title ⭐ Yıldız Ülkesi — Windows Kurulum
color 0E

echo.
echo  ╔═══════════════════════════════════════════════╗
echo  ║   ⭐  YILDIZ ULKESI  —  KURULUM SIHIRBAZI   ║
echo  ║       MEB 2024 Maarif Modeli Uyumlu           ║
echo  ╚═══════════════════════════════════════════════╝
echo.

:: ═══════════════════════════════════════
:: KONTROLLER
:: ═══════════════════════════════════════
echo  [1/7] Sistem kontrol ediliyor...
echo.

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0C
    echo  ❌ Node.js bulunamadi!
    echo.
    echo  Simdi indirme sayfasini aciyorum...
    start https://nodejs.org
    echo.
    echo  LTS versiyonunu indir, kur, sonra bu scripti tekrar calistir.
    echo.
    pause
    exit /b 1
)
echo  ✅ Node.js bulundu

where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    color 0C
    echo  ❌ Git bulunamadi!
    echo.
    echo  Simdi indirme sayfasini aciyorum...
    start https://git-scm.com
    echo.
    echo  Kur, sonra bu scripti tekrar calistir.
    echo.
    pause
    exit /b 1
)
echo  ✅ Git bulundu
echo.

:: ═══════════════════════════════════════
:: NPM INSTALL
:: ═══════════════════════════════════════
echo  [2/7] Bagimliliklar yukleniyor (1-2 dk)...
echo.
call npm install
if %ERRORLEVEL% neq 0 (
    color 0C
    echo.
    echo  ❌ npm install basarisiz! Hata mesajini Claude'a gonder.
    pause
    exit /b 1
)
echo.
echo  ✅ Bagimliliklar yuklendi
echo.

:: ═══════════════════════════════════════
:: .ENV DOSYASI
:: ═══════════════════════════════════════
echo  [3/7] API ayarlari...
echo.

if not exist .env (
    copy .env.example .env >nul
    echo  .env dosyasi olusturuldu.
)

echo  API key'lerin var mi? (Yoksa "h" de, sistem yine calisir)
echo.
set /p HAS_KEYS="  Claude API key'in var mi? [e/h]: "

if /i "%HAS_KEYS%"=="e" (
    echo.
    set /p CLAUDE_KEY="  ANTHROPIC_API_KEY: "
    set /p EL_KEY="  ELEVENLABS_API_KEY (yoksa Enter): "

    echo ANTHROPIC_API_KEY=%CLAUDE_KEY%> .env
    echo ELEVENLABS_API_KEY=%EL_KEY%>> .env
    echo ELEVENLABS_VOICE_ID=>> .env
    echo PORT=3001>> .env
    echo NODE_ENV=development>> .env

    echo.
    echo  ✅ API key'leri kaydedildi
) else (
    echo.
    echo  ℹ️  API key olmadan devam ediliyor (fallback aktif)
)
echo.

:: ═══════════════════════════════════════
:: BUILD
:: ═══════════════════════════════════════
echo  [4/7] Production build yapiliyor...
echo.
call npx vite build
if %ERRORLEVEL% neq 0 (
    color 0C
    echo.
    echo  ❌ Build basarisiz! Hata mesajini Claude'a gonder.
    pause
    exit /b 1
)
echo.
echo  ✅ Build tamamlandi
echo.

:: ═══════════════════════════════════════
:: LOKAL TEST
:: ═══════════════════════════════════════
echo  [5/7] Lokal test...
echo.
echo  Simdi uygulamayi lokalde test etmek ister misin?
echo  (Tarayicida acilacak, test ettikten sonra terminale don ve Ctrl+C bas)
echo.
set /p TEST_LOCAL="  Lokal test? [e/h]: "

if /i "%TEST_LOCAL%"=="e" (
    echo.
    echo  🚀 Baslatiliyor... Tarayicida http://localhost:5173 aciliyor
    echo  ⚠️  Durdurmak icin bu pencerede Ctrl+C bas
    echo.
    start http://localhost:5173
    call npm run dev
    echo.
)

:: ═══════════════════════════════════════
:: GITHUB PUSH
:: ═══════════════════════════════════════
echo  [6/7] GitHub'a yukleme...
echo.
echo  GitHub'a push etmek ister misin?
set /p DO_GIT="  [e/h]: "

if /i "%DO_GIT%"=="e" (
    echo.

    if not exist .git (
        git init
    )
    git add .
    git commit -m "v2.0 - MEB 2024 Maarif Modeli uyumlu Yildiz Ulkesi" 2>nul

    :: Remote kontrol
    git remote get-url origin >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        git remote add origin https://github.com/Ahmet571-es/okuma_yildizi_3d.git
    )

    git branch -M main

    echo.
    echo  GitHub'a push ediliyor...
    echo  (Kullanici adi ve sifre/token sorabilir)
    echo.
    git push -u origin main --force

    if %ERRORLEVEL% equ 0 (
        echo.
        echo  ✅ GitHub'a push edildi!
    ) else (
        echo.
        echo  ⚠️  Push basarisiz oldu. Muhtemel sebepler:
        echo     - GitHub Personal Access Token gerekli
        echo     - github.com → Settings → Developer Settings
        echo     - Personal Access Tokens → Tokens (classic) → Generate
        echo     - Sifre yerine bu token'i yapistir
        echo.
        echo  Token aldiktan sonra tekrar dene:
        echo     git push -u origin main --force
    )
    echo.
)

:: ═══════════════════════════════════════
:: RENDER YÖNLENDIRME
:: ═══════════════════════════════════════
echo  [7/7] Canli yayina alma...
echo.
echo  ╔═══════════════════════════════════════════════╗
echo  ║  Son adim: Render.com'da 3 tiklamayla yayinla ║
echo  ╚═══════════════════════════════════════════════╝
echo.
echo  Simdi Render.com'u aciyorum. Yapman gerekenler:
echo.
echo  1. GitHub ile giris yap
echo  2. "New +" → "Web Service" tikla
echo  3. Repoyu sec: okuma_yildizi_3d
echo  4. Ayarlar:
echo       Name:          yildiz-ulkesi
echo       Region:        Frankfurt
echo       Build Command: npm install ^&^& npm run build
echo       Start Command: npm start
echo       Instance Type: Free
echo  5. Environment Variables ekle:
echo       NODE_ENV = production
echo       ANTHROPIC_API_KEY = (key'ini gir)
echo       ELEVENLABS_API_KEY = (key'ini gir)
echo  6. "Create Web Service" tikla
echo  7. 3-5 dk bekle → URL'in hazir!
echo.

set /p OPEN_RENDER="  Render.com'u acayim mi? [e/h]: "
if /i "%OPEN_RENDER%"=="e" (
    start https://dashboard.render.com/select-repo?type=web
)

echo.
echo  ╔═══════════════════════════════════════════════╗
echo  ║        ⭐  KURULUM TAMAMLANDI!  ⭐           ║
echo  ╚═══════════════════════════════════════════════╝
echo.
echo  Sorun olursa hata mesajini Claude'a gonder!
echo.
pause
