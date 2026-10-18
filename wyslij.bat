@echo off
rem Wysyła wszystkie zmiany na GitHuba (strona odświeży się po ok. minucie).
cd /d "%~dp0"
git add -A
git commit -m "Aktualizacja portfolio"
git push
pause
