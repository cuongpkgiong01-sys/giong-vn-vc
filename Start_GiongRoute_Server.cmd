@echo off
setlocal
cd /d "%~dp0"
echo Starting Giong Route server...
call npm run dev
