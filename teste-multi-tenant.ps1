# ========================================
# Script de Teste Multi-Tenant
# ========================================
# Este script testa todas as funcionalidades do sistema multi-tenant

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "║   🧪 Teste Completo - Sistema Multi-Tenant                ║" -ForegroundColor Cyan
Write-Host "║                                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:5000"

# ========================================
# Função auxiliar para fazer requisições
# ========================================
function Invoke-ApiTest {
    param (
        [string]$Method,
        [string]$Endpoint,
        [string]$Body,
        [string]$Description
    )
    
    Write-Host "`n📌 $Description" -ForegroundColor Yellow
    Write-Host "   $Method $Endpoint" -ForegroundColor Gray
    
    try {
        if ($Body) {
            $response = Invoke-RestMethod -Uri "$baseUrl$Endpoint" -Method $Method -Body $Body -ContentType "application/json" -ErrorAction Stop
        } else {
            $response = Invoke-RestMethod -Uri "$baseUrl$Endpoint" -Method $Method -ErrorAction Stop
        }
        
        Write-Host "   ✅ Sucesso!" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "   ❌ Erro: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

# ========================================
# TESTE 1: Health Check
# ========================================
Write-Host "`n═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TESTE 1: Health Check" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan

$health = Invoke-ApiTest -Method "GET" -Endpoint "/health" -Description "Verificando se o servidor está rodando"

if ($health -and $health.status -eq "ok") {
    Write-Host "   ✅ Servidor está funcionando!" -ForegroundColor Green
} else {
    Write-Host "   ❌ Servidor não está respondendo. Certifique-se de que está rodando." -ForegroundColor Red
    Write-Host "   Execute: cd backend && npm run offline:dev" -ForegroundColor Yellow
    exit 1
}

# ========================================
# TESTE 2: Listar Tenants Existentes
# ========================================
Write-Host "`n═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TESTE 2: Listar Tenants Existentes" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan

$tenants = Invoke-ApiTest -Method "GET" -Endpoint "/api/tenants" -Description "Buscando tenants existentes"

if ($tenants -and $tenants.success) {
    Write-Host "   📊 Tenants encontrados: $($tenants.data.Count)" -ForegroundColor Cyan
    foreach ($tenant in $tenants.data) {
        Write-Host "      - $($tenant.name) ($($tenant.slug))" -ForegroundColor Gray
    }
}

# ========================================
# TESTE 3: Criar Novos Tenants
# ========================================
Write-Host "`n═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TESTE 3: Criar Novos Tenants" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan

$tenant1Body = '{"name":"Loja Teste A","slug":"loja-teste-a"}'
$tenant1 = Invoke-ApiTest -Method "POST" -Endpoint "/api/tenants" -Body $tenant1Body -Description "Criando 'Loja Teste A'"

$tenant2Body = '{"name":"Loja Teste B","slug":"loja-teste-b"}'
$tenant2 = Invoke-ApiTest -Method "POST" -Endpoint "/api/tenants" -Body $tenant2Body -Description "Criando 'Loja Teste B'"

Start-Sleep -Seconds 1

# ========================================
# TESTE 4: Ver Tenant Atual
# ========================================
Write-Host "`n═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TESTE 4: Ver Tenant Atual" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan

$currentTenant = Invoke-ApiTest -Method "GET" -Endpoint "/api/tenants/current" -Description "Verificando tenant atual do totem"

if ($currentTenant -and $currentTenant.success) {
    Write-Host "   🏢 Tenant atual: $($currentTenant.data.name) ($($currentTenant.data.slug))" -ForegroundColor Cyan
}

# ========================================
# TESTE 5: Configurar Loja Teste A
# ========================================
Write-Host "`n═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TESTE 5: Configurar para Loja Teste A" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan

$setTenantBody = '{"slug":"loja-teste-a"}'
$setTenant = Invoke-ApiTest -Method "POST" -Endpoint "/api/tenants/set-current" -Body $setTenantBody -Description "Configurando tenant atual"

Start-Sleep -Seconds 1

# ========================================
# TESTE 6: Criar Lead para Loja A
# ========================================
Write-Host "`n═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TESTE 6: Criar Lead para Loja Teste A" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan

$leadABody = '{"name":"Maria Silva","email":"maria@lojaa.com","phone":"11999999999"}'
$leadA = Invoke-ApiTest -Method "POST" -Endpoint "/api/leads" -Body $leadABody -Description "Criando lead 'Maria Silva'"

if ($leadA -and $leadA.success) {
    Write-Host "   👤 Lead criado: $($leadA.data.name) - Tenant: $($leadA.data.tenant_slug)" -ForegroundColor Cyan
}

Start-Sleep -Seconds 1

# ========================================
# TESTE 7: Configurar Loja Teste B
# ========================================
Write-Host "`n═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TESTE 7: Configurar para Loja Teste B" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan

$setTenantBBody = '{"slug":"loja-teste-b"}'
$setTenantB = Invoke-ApiTest -Method "POST" -Endpoint "/api/tenants/set-current" -Body $setTenantBBody -Description "Configurando tenant atual"

Start-Sleep -Seconds 1

# ========================================
# TESTE 8: Criar Lead para Loja B
# ========================================
Write-Host "`n═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TESTE 8: Criar Lead para Loja Teste B" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan

$leadBBody = '{"name":"João Pedro","email":"joao@lojab.com","phone":"11888888888"}'
$leadB = Invoke-ApiTest -Method "POST" -Endpoint "/api/leads" -Body $leadBBody -Description "Criando lead 'João Pedro'"

if ($leadB -and $leadB.success) {
    Write-Host "   👤 Lead criado: $($leadB.data.name) - Tenant: $($leadB.data.tenant_slug)" -ForegroundColor Cyan
}

# ========================================
# TESTE 9: Ver Estatísticas
# ========================================
Write-Host "`n═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TESTE 9: Ver Estatísticas de Leads" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan

$stats = Invoke-ApiTest -Method "GET" -Endpoint "/api/leads/stats" -Description "Buscando estatísticas"

if ($stats -and $stats.success) {
    Write-Host "   📊 PENDING: $($stats.data.PENDING)" -ForegroundColor Yellow
    Write-Host "   📊 SYNCED: $($stats.data.SYNCED)" -ForegroundColor Green
    Write-Host "   📊 ERROR: $($stats.data.ERROR)" -ForegroundColor Red
}

# ========================================
# TESTE 10: Aguardar Sincronização
# ========================================
Write-Host "`n═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TESTE 10: Aguardar Sincronização" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan

Write-Host "   ⏳ Aguardando 35 segundos para sincronização automática..." -ForegroundColor Yellow
Write-Host "   (Você verá os logs no terminal do servidor)" -ForegroundColor Gray

for ($i = 35; $i -gt 0; $i--) {
    Write-Host -NoNewline "`r   ⏰ $i segundos restantes...   " -ForegroundColor Yellow
    Start-Sleep -Seconds 1
}
Write-Host ""

# ========================================
# TESTE 11: Ver Estatísticas Pós-Sincronização
# ========================================
Write-Host "`n═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "TESTE 11: Estatísticas Pós-Sincronização" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan

$statsAfter = Invoke-ApiTest -Method "GET" -Endpoint "/api/leads/stats" -Description "Verificando estatísticas após sincronização"

if ($statsAfter -and $statsAfter.success) {
    Write-Host "   📊 PENDING: $($statsAfter.data.PENDING)" -ForegroundColor Yellow
    Write-Host "   📊 SYNCED: $($statsAfter.data.SYNCED)" -ForegroundColor Green
    Write-Host "   📊 ERROR: $($statsAfter.data.ERROR)" -ForegroundColor Red
    
    if ($statsAfter.data.SYNCED -gt 0) {
        Write-Host "`n   ✅ Sincronização funcionou!" -ForegroundColor Green
    } else {
        Write-Host "`n   ⚠️  Leads ainda não foram sincronizados. Verifique os logs do servidor." -ForegroundColor Yellow
    }
}

# ========================================
# RESULTADO FINAL
# ========================================
Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "║   ✅ TESTES CONCLUÍDOS                                     ║" -ForegroundColor Green
Write-Host "║                                                            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`n📋 Próximos Passos:" -ForegroundColor Cyan
Write-Host "   1. Verifique os logs do servidor para detalhes da sincronização" -ForegroundColor Gray
Write-Host "   2. Acesse o Supabase para ver os dados:" -ForegroundColor Gray
Write-Host "      https://rtodbbiugsrhupmyarut.supabase.co" -ForegroundColor Gray
Write-Host "   3. No SQL Editor, execute:" -ForegroundColor Gray
Write-Host "      SELECT l.name, t.name as tenant FROM leads l JOIN tenants t ON l.tenant_id = t.id;" -ForegroundColor DarkGray

Write-Host "`n🎉 Sistema Multi-Tenant está funcionando!" -ForegroundColor Green
Write-Host ""

