@echo off
chcp 65001 >nul
rem Wysyła wszystkie ręczne zmiany (np. poprawione teksty) na GitHuba.
cd /d "%~dp0"
git add -A
git commit -q -m "Aktualizacja portfolio"
git push
echo.
echo Gotowe! Strona odswiezy sie za ok. minute.
pause
