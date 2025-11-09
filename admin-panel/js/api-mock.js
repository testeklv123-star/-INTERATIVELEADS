// ============================================
// API CLIENT MOCK - Para Testes Sem Backend
// ============================================
// Use este arquivo se você quiser testar o painel
// sem precisar do backend rodando.
//
// Para usar:
// 1. No index.html, comente a linha: <script src="js/api.js"></script>
// 2. E descomente: <script src="js/api-mock.js"></script>

// Dados mockados em memória
let mockTenants = [
  { 
    id: 1, 
    name: 'Empresa Demo ABC', 
    slug: 'empresa-demo-abc',
    created_at: new Date('2025-01-10T10:00:00').toISOString()
  },
  { 
    id: 2, 
    name: 'Loja Exemplo XYZ', 
    slug: 'loja-exemplo-xyz',
    created_at: new Date('2025-01-12T14:30:00').toISOString()
  },
  { 
    id: 3, 
    name: 'Startup Teste 123', 
    slug: 'startup-teste-123',
    created_at: new Date('2025-01-15T09:15:00').toISOString()
  }
];

let mockLeads = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@example.com',
    phone: '(11) 98765-4321',
    tenant_slug: 'empresa-demo-abc',
    created_at: new Date('2025-01-15T10:30:00').toISOString(),
    synced: false
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@example.com',
    phone: '(11) 91234-5678',
    tenant_slug: 'empresa-demo-abc',
    created_at: new Date('2025-01-15T11:45:00').toISOString(),
    synced: true
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@example.com',
    phone: '(21) 99876-5432',
    tenant_slug: 'loja-exemplo-xyz',
    created_at: new Date('2025-01-15T13:20:00').toISOString(),
    synced: false
  },
  {
    id: 4,
    name: 'Ana Costa',
    email: 'ana.costa@example.com',
    phone: '(21) 98765-1234',
    tenant_slug: 'loja-exemplo-xyz',
    created_at: new Date('2025-01-15T14:00:00').toISOString(),
    synced: true
  },
  {
    id: 5,
    name: 'Carlos Mendes',
    email: 'carlos.mendes@example.com',
    phone: '(31) 97654-3210',
    tenant_slug: 'startup-teste-123',
    created_at: new Date('2025-01-15T15:30:00').toISOString(),
    synced: false
  }
];

// Simular delay de rede (para parecer real)
const simulateDelay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

// ============================================
// FUNÇÕES PARA GERENCIAR TENANTS (MOCK)
// ============================================

async function fetchTenants() {
  await simulateDelay();
  console.log('[MOCK] Buscando tenants...', mockTenants);
  return [...mockTenants]; // Retornar cópia para evitar mutação
}

async function createTenant(tenantData) {
  await simulateDelay();
  
  // Verificar se slug já existe
  if (mockTenants.some(t => t.slug === tenantData.slug)) {
    throw new Error('Já existe um tenant com este slug');
  }
  
  const newTenant = {
    id: Math.max(...mockTenants.map(t => t.id), 0) + 1,
    name: tenantData.name,
    slug: tenantData.slug,
    created_at: new Date().toISOString()
  };
  
  mockTenants.push(newTenant);
  console.log('[MOCK] Tenant criado:', newTenant);
  return newTenant;
}

async function updateTenant(slug, tenantData) {
  await simulateDelay();
  
  const index = mockTenants.findIndex(t => t.slug === slug);
  if (index === -1) {
    throw new Error('Tenant não encontrado');
  }
  
  mockTenants[index] = {
    ...mockTenants[index],
    ...tenantData,
    slug: tenantData.newSlug || slug
  };
  
  console.log('[MOCK] Tenant atualizado:', mockTenants[index]);
  return mockTenants[index];
}

async function deleteTenant(slug) {
  await simulateDelay();
  
  const index = mockTenants.findIndex(t => t.slug === slug);
  if (index === -1) {
    throw new Error('Tenant não encontrado');
  }
  
  // Remover tenant
  const deleted = mockTenants.splice(index, 1)[0];
  
  // Remover leads associados
  mockLeads = mockLeads.filter(lead => lead.tenant_slug !== slug);
  
  console.log('[MOCK] Tenant deletado:', deleted);
  return { success: true, message: `Tenant ${slug} deletado com sucesso` };
}

// ============================================
// FUNÇÕES PARA GERENCIAR LEADS (MOCK)
// ============================================

async function fetchLeads(tenantSlug) {
  await simulateDelay();
  
  const filtered = mockLeads.filter(lead => lead.tenant_slug === tenantSlug);
  console.log(`[MOCK] Buscando leads do tenant ${tenantSlug}:`, filtered);
  return [...filtered];
}

async function fetchAllLeads() {
  await simulateDelay();
  console.log('[MOCK] Buscando todos os leads:', mockLeads);
  return [...mockLeads];
}

// ============================================
// FUNÇÕES DE ESTATÍSTICAS (MOCK)
// ============================================

async function fetchSyncStats() {
  await simulateDelay();
  
  const stats = {
    total_leads: mockLeads.length,
    synced: mockLeads.filter(l => l.synced).length,
    pending: mockLeads.filter(l => !l.synced).length,
    total_tenants: mockTenants.length
  };
  
  console.log('[MOCK] Estatísticas:', stats);
  return stats;
}

async function checkServerHealth() {
  await simulateDelay();
  
  const health = {
    status: 'healthy',
    mode: 'mock',
    message: 'API Mock funcionando (dados em memória)',
    timestamp: new Date().toISOString()
  };
  
  console.log('[MOCK] Health check:', health);
  return health;
}

// ============================================
// MENSAGEM DE AVISO
// ============================================

console.warn(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  ⚠️  MODO DE TESTE - API MOCK ATIVADA  ⚠️                    ║
║                                                               ║
║  Você está usando dados mockados (falsos) em memória.        ║
║  Nenhuma mudança será salva no banco de dados.               ║
║                                                               ║
║  Para usar o backend real:                                    ║
║  1. Certifique-se que o backend está rodando                 ║
║  2. No index.html, troque api-mock.js por api.js             ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

