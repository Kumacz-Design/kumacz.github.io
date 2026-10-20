@echo off
chcp 65001 >nul
rem Wysyła wszystkie ręczne zmiany (np. poprawione teksty) na GitHuba.
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0narzedzia\wersja.ps1"
git add -A
git commit -q -m "Aktualizacja portfolio"
git push
echo.
echo Gotowe! Strona odswiezy sie za ok. minute.
pause
