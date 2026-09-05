@echo off
setlocal
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
    echo [AutoStart] npm not found in PATH. Please open Command Prompt once and make sure Node.js is installed.
    exit /b 1
)

rem Kiểm tra nếu port 8080 đã chạy để không mở trùng.
for /f "tokens=1" %%i in ('powershell -NoProfile -Command "$socket = New-Object System.Net.Sockets.TcpClient; try { $socket.Connect('127.0.0.1', 8080); $socket.Close(); exit 1 } catch { exit 0 }" 2^>nul') do set portStatus=%%i
if "%portStatus%"=="1" (
    echo [AutoStart] App is already running on port 8080.
    exit /b 0
)

echo [AutoStart] Starting Giong Route app...
start "Giong Route" cmd /k "npm run dev"

exit /b 0
