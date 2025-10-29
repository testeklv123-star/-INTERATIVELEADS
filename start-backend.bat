@echo off
echo ========================================
echo  INICIALIZANDO BACKEND INTERATIVELEADS
echo ========================================
echo.

echo [1/3] Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker nao encontrado!
    echo.
    echo Por favor:
    echo 1. Abra o Docker Desktop
    echo 2. Aguarde ele inicializar completamente
    echo 3. Execute este script novamente
    echo.
    pause
    exit /b 1
)
echo ✅ Docker disponivel

echo.
echo [2/3] Iniciando PostgreSQL...
cd /d "%~dp0"
docker compose up -d
if errorlevel 1 (
    echo ❌ Erro ao iniciar PostgreSQL
    pause
    exit /b 1
)
echo ✅ PostgreSQL iniciado

echo.
echo [3/3] Aguardando PostgreSQL ficar pronto...
timeout /t 5 /nobreak >nul

echo.
echo Executando migracoes...
cd backend
call npm run migration:run
if errorlevel 1 (
    echo ⚠️  Erro nas migracoes, mas continuando...
)

echo.
echo ========================================
echo  ✅ BACKEND PRONTO!
echo ========================================
echo.
echo Iniciando servidor em http://localhost:4000
echo Pressione Ctrl+C para parar
echo.

call npm run dev

