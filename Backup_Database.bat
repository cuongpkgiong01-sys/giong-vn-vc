@echo off
setlocal ENABLEEXTENSIONS

REM ========================================
REM Giong Route - Database Backup Script
REM ========================================

echo.
echo ========================================
echo   GIONG ROUTE - DATABASE BACKUP
echo ========================================
echo.

REM Database settings
set "PGHOST=127.0.0.1"
set "PGPORT=5432"
set "PGDATABASE=database"
set "PGUSER=postgres"
set "PGPASSWORD=gvn123456"
set "BACKUP_DIR=%~dp0backups"
set "PG_DUMP_PATH=C:\Program Files\PostgreSQL\17\bin\pg_dump.exe"

if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

if not exist "%PG_DUMP_PATH%" (
    echo [ERROR] Khong tim thay pg_dump.exe tai: %PG_DUMP_PATH%
    echo Vui long kiem tra da cai PostgreSQL 17 hay chua.
    pause
    exit /b 1
)

REM Create timestamp for unique file name
set "TIMESTAMP=%date:~-4%%date:~3,2%%date:~0,2%_%time:~0,2%%time:~3,2%%time:~6,2%"
set "TIMESTAMP=%TIMESTAMP: =0%"
set "BACKUP_FILE=%BACKUP_DIR%\giong_route_backup_%TIMESTAMP%.sql"

 echo [1/3] Dang ket noi database...
 echo [2/3] Dang xuat du lieu...

"%PG_DUMP_PATH%" -h %PGHOST% -p %PGPORT% -U %PGUSER% -d %PGDATABASE% -F p -f "%BACKUP_FILE%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [3/3] THANH CONG!
    echo.
    echo File backup da duoc tao:
    echo %BACKUP_FILE%
    echo.
    echo Kich thuoc file:
    for %%A in ("%BACKUP_FILE%") do echo %%~zA bytes
    echo.
) else (
    echo.
    echo [ERROR] Backup that bai!
    echo.
    echo Vui long kiem tra:
    echo - Dich vu PostgreSQL dang chay
    echo - Ten database, user va password chinh xac
    echo - Duong dan pg_dump.exe dung
    echo.
)

echo ========================================
echo Nhan phim bat ky de dong...
pause >nul
