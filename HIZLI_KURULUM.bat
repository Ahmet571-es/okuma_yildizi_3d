@echo off
chcp 65001 >nul 2>&1
title ⭐ Yıldız Ülkesi — Kurulum

echo.
echo ⭐ Yıldız Ülkesi — Kurulum Başlıyor...
echo ════════════════════════════════════════
echo.

:: Node.js kontrolü
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js bulunamadı!
    echo    https://nodejs.org adresinden LTS versiyonu indir.
    pause
    exit /b 1
)
echo ✅ Node.js bulundu

:: Git kontrolü
where git >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Git bulunamadı! https://git-scm.com adresinden indir.
    pause
    exit /b 1
)
echo ✅ Git bulundu

:: Bağımlılıkları yükle
echo.
echo 📦 Bağımlılıklar yükleniyor...
call npm install
echo ✅ Bağımlılıklar yüklendi

:: .env dosyası
if not exist .env (
    copy .env.example .env >nul
    echo.
    echo 📝 .env dosyası oluşturuldu.
    echo    Şimdi .env dosyasını editörle açıp API key'lerini girebilirsin.
    echo    (Key olmadan da çalışır, fallback devreye girer)
)

:: Build
echo.
echo 🔨 Production build yapılıyor...
call npx vite build
echo ✅ Build tamamlandı

echo.
echo ════════════════════════════════════════
echo ⭐ KURULUM TAMAMLANDI!
echo ════════════════════════════════════════
echo.
echo 📌 Lokalde test: npm run dev
echo    Tarayıcı:     http://localhost:5173
echo.
echo 📌 Canlıya almak için: DEPLOYMENT.md dosyasını oku
echo.

:: Direkt çalıştır mı?
set /p ANSWER="Şimdi lokalde çalıştırmak ister misin? [e/h]: "
if /i "%ANSWER%"=="e" (
    echo.
    echo 🚀 Başlatılıyor...
    call npm run dev
)

pause
