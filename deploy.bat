@echo off
setlocal EnableExtensions
chcp 65001 >nul

cd /d "%~dp0"
if errorlevel 1 (
  echo [HATA] Publish klasorune girilemedi: %~dp0
  goto :fail
)

echo.
echo ========================================
echo  GitHub Deploy
echo ========================================
echo.
echo Klasor: %CD%
echo.

where git >nul 2>&1
if errorlevel 1 (
  echo [HATA] git bulunamadi. Git kurulu oldugundan emin olun.
  goto :fail
)

if not exist ".git" (
  echo Git deposu yok, olusturuluyor...
  git init
  if errorlevel 1 goto :fail
  git branch -M main
  if errorlevel 1 goto :fail
)

git remote get-url origin >nul 2>&1
if errorlevel 1 (
  echo [HATA] GitHub uzak deposu ^(origin^) tanimli degil.
  echo.
  echo Once GitHub'da bir repo olusturun, bu klasorde su komutu calistirin:
  echo   git remote add origin https://github.com/KULLANICI/REPO.git
  echo.
  echo Sonra deploy.bat dosyasini tekrar calistirin.
  goto :fail
)

echo appsettings dosyalari indeksten cikariliyor ^(varsa^)...
git rm -r --cached --ignore-unmatch -- appsettings.json appsettings.Development.json appsettings.Production.json secrets.json 1>nul 2>nul

echo Dosyalar ekleniyor...
git add -A
if errorlevel 1 goto :fail

git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Otomatik Deploy: %date% %time%"
  if errorlevel 1 goto :fail
) else (
  echo Degisiklik yok, commit atlandi.
)

for /f "delims=" %%B in ('git rev-parse --abbrev-ref HEAD') do set "BRANCH=%%B"
echo.
echo GitHub'a gonderiliyor ^(origin/%BRANCH%^)...
git push -u origin "%BRANCH%"
if errorlevel 1 goto :fail

echo.
echo ========================================
echo  Islem tamamlandi
echo ========================================
echo.
echo Publish klasoru GitHub'a gonderildi.
echo.
pause
endlocal
exit /b 0

:fail
echo.
echo ========================================
echo  Hata olustu
echo ========================================
echo.
echo Yukaridaki mesajlari inceleyin.
echo.
pause
endlocal
exit /b 1
