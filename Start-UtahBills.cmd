@echo off
cd /d "%~dp0"
call npm.cmd run build
if errorlevel 1 exit /b 1
echo Open http://127.0.0.1:4173/UtahBills/ in your browser.
node scripts/serve.mjs
