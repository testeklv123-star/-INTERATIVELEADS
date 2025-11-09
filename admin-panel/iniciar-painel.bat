@echo off
:: ========================================
:: Script de Inicialização do Painel Admin
:: ========================================

title Painel Administrativo - InterativeLeads

echo.
echo ========================================
echo    PAINEL ADMINISTRATIVO
echo    InterativeLeads Multi-Tenant
echo ========================================
echo.

:: Verificar se o Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo [AVISO] Python nao encontrado!
    echo.
    echo Opcao 1: Instale o Python em https://python.org
    echo Opcao 2: Abra o arquivo index.html diretamente no navegador
    echo.
    echo Abrindo index.html no navegador...
    timeout /t 3 >nul
    start index.html
    exit /b
)

echo [OK] Python encontrado!
echo.

:: Verificar se o backend está rodando
echo Verificando se o backend esta rodando...
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo.
    echo [AVISO] Backend nao esta rodando!
    echo.
    echo Por favor, inicie o backend primeiro:
    echo   1. Abra outro terminal
    echo   2. Va para a pasta backend
    echo   3. Execute: npm start
    echo.
    echo Pressione qualquer tecla para continuar mesmo assim...
    pause >nul
)

echo.
echo ========================================
echo Iniciando servidor local na porta 8080
echo ========================================
echo.
echo Acesse o painel em:
echo.
echo   http://localhost:8080
echo.
echo Pressione Ctrl+C para parar o servidor
echo ========================================
echo.

:: Iniciar servidor Python
python -m http.server 8080

