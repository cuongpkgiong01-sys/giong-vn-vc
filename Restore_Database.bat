@echo off
setlocal ENABLEEXTENSIONS

echo.
echo ========================================
echo   GIONG ROUTE - DATABASE RESTORE
echo ========================================
echo.

set "PGHOST=127.0.0.1"
set "PGPORT=5432"
set "PGDATABASE=database"
set "PGUSER=postgres"
set "PGPASSWORD=gvn123456"
set "BACKUP_DIR=%~dp0backups"
set "PG_RESTORE_PATH=C:\Program Files\PostgreSQL\17\bin\psql.exe"

if not exist "%PG_RESTORE_PATH%" (
    echo [ERROR] Khong tim thay psql.exe tai: %PG_RESTORE_PATH%
    echo Vui long kiem tra da cai PostgreSQL 17 hay chua.
    pause
    exit /b 1
)

if not exist "%BACKUP_DIR%" (
    echo [ERROR] Thu muc backup khong ton tai: %BACKUP_DIR%
    echo Hay chay Backup_Database.bat truoc.
    pause
    exit /b 1
)

echo Nhap ten file backup (khong bao gom .sql):
set /p BACKUP_NAME=

set "FULL_PATH=%BACKUP_DIR%\%BACKUP_NAME%.sql"

if not exist "%FULL_PATH%" (
    echo [ERROR] Khong tim thay file: %FULL_PATH%
    pause
    exit /b 1
)

echo.
echo [WARNING] Day la hanh dong PHA HOAI du lieu cu!
echo File se duoc restore: %FULL_PATH%
echo.
set /p CONFIRM=Ban co chac chan? (Y/N): 

if /i "%CONFIRM%" NEQ "Y" (
    echo Huy bo!
    pause
    exit /b
)

echo.
echo Dang restore...
"%PG_RESTORE_PATH%" -h %PGHOST% -p %PGPORT% -U %PGUSER% -d %PGDATABASE% -f "%FULL_PATH%"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Restore thanh cong!
) else (
    echo.
    echo [ERROR] Restore that bai!
    echo Vui long kiem tra:
    echo - PostgreSQL dang chay
    echo - Ten database, user va password chinh xac
    echo - File SQL backup khong bi hong
)

echo.
pause
