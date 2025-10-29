@echo off
echo ========================================
echo  PARANDO BACKEND INTERATIVELEADS
echo ========================================
echo.

cd /d "%~dp0"

echo Parando PostgreSQL...
docker compose down

echo.
echo ✅ Backend parado com sucesso!
echo.
pause

