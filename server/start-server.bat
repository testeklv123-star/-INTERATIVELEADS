@echo off
echo ========================================
echo   SERVIDOR DE TESTE - INTERATIVELEADS
echo ========================================
echo.
echo Iniciando servidor JSON...
echo.
echo API disponivel em: http://localhost:3001
echo.
echo Endpoints:
echo   - GET  http://localhost:3001/tenants
echo   - GET  http://localhost:3001/tenants/:id
echo   - POST http://localhost:3001/tenants
echo.
echo Pressione Ctrl+C para parar o servidor
echo.
echo ========================================
echo.

cd %~dp0
json-server --watch db.json --port 3001 --host 0.0.0.0

pause

