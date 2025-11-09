// ============================================
// APLICAÇÃO PRINCIPAL - Lógica do Painel Admin
// ============================================

// ============================================
// VARIÁVEIS GLOBAIS E ESTADO DA APLICAÇÃO
// ============================================

let currentSection = 'tenant-management'; // Seção ativa
let tenantsCache = []; // Cache de tenants para evitar requisições desnecessárias

// ============================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Painel Administrativo Iniciado');
  
  // Configurar navegação
  setupNavigation();
  
  // Configurar formulário de tenant
  setupTenantForm();
  
  // Carregar dados iniciais
  loadInitialData();
  
  // Mostrar seção de tenants por padrão
  showSection('tenant-management');
});

// ============================================
// CONFIGURAÇÃO DE NAVEGAÇÃO
// ============================================

function setupNavigation() {
  const navButtons = document.querySelectorAll('[data-section]');
  
  navButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const section = button.getAttribute('data-section');
      showSection(section);
    });
  });
}

/**
 * Mostra uma seção específica e esconde as outras
 * @param {string} sectionId - ID da seção a ser mostrada
 */
function showSection(sectionId) {
  // Esconder todas as seções
  document.querySelectorAll('section[id$="-management"], section[id$="-dashboard"]').forEach(section => {
    section.classList.add('hidden');
  });
  
  // Mostrar seção selecionada
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.remove('hidden');
    currentSection = sectionId;
    
    // Atualizar navegação ativa
    document.querySelectorAll('[data-section]').forEach(btn => {
      btn.classList.remove('bg-blue-700');
      btn.classList.add('bg-blue-600');
    });
    
    const activeBtn = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeBtn) {
      activeBtn.classList.remove('bg-blue-600');
      activeBtn.classList.add('bg-blue-700');
    }
    
    // Carregar dados da seção se necessário
    if (sectionId === 'lead-dashboard') {
      loadLeadDashboard();
    }
  }
}

// ============================================
// CARREGAMENTO DE DADOS INICIAIS
// ============================================

async function loadInitialData() {
  try {
    showLoadingState('tenant-list', 'Carregando tenants...');
    await renderTenantList();
  } catch (error) {
    showError('Erro ao carregar dados iniciais: ' + error.message);
  }
}

// ============================================
// GERENCIAMENTO DE TENANTS - FORMULÁRIO
// ============================================

function setupTenantForm() {
  const form = document.getElementById('tenant-form');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('tenant-name').value.trim();
    const slug = document.getElementById('tenant-slug').value.trim();
    
    if (!name || !slug) {
      showError('Por favor, preencha todos os campos');
      return;
    }
    
    // Validar formato do slug
    if (!/^[a-z0-9-]+$/.test(slug)) {
      showError('O slug deve conter apenas letras minúsculas, números e hífens');
      return;
    }
    
    await createNewTenant({ name, slug });
  });
  
  // Auto-gerar slug ao digitar o nome
  document.getElementById('tenant-name').addEventListener('input', (e) => {
    const name = e.target.value;
    const slugInput = document.getElementById('tenant-slug');
    
    // Só auto-gerar se o campo slug estiver vazio
    if (!slugInput.value) {
      const autoSlug = name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
        .replace(/\s+/g, '-') // Substitui espaços por hífens
        .replace(/-+/g, '-') // Remove hífens duplicados
        .replace(/^-|-$/g, ''); // Remove hífens no início e fim
      
      slugInput.value = autoSlug;
    }
  });
}

/**
 * Cria um novo tenant
 * @param {Object} tenantData - Dados do tenant
 */
async function createNewTenant(tenantData) {
  const submitBtn = document.querySelector('#tenant-form button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  try {
    // Mostrar estado de carregamento
    submitBtn.disabled = true;
    submitBtn.textContent = 'Criando...';
    
    // Criar tenant no backend
    const newTenant = await createTenant(tenantData);
    
    // Sucesso!
    showSuccess(`Tenant "${newTenant.name}" criado com sucesso!`);
    
    // Limpar formulário
    document.getElementById('tenant-form').reset();
    
    // Atualizar lista
    await renderTenantList();
    
  } catch (error) {
    showError('Erro ao criar tenant: ' + error.message);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// ============================================
// GERENCIAMENTO DE TENANTS - LISTAGEM
// ============================================

/**
 * Renderiza a lista de tenants na tabela
 */
async function renderTenantList() {
  const tbody = document.getElementById('tenant-list');
  
  try {
    // Buscar tenants do backend
    const tenants = await fetchTenants();
    tenantsCache = tenants; // Atualizar cache
    
    // Limpar tabela
    tbody.innerHTML = '';
    
    if (tenants.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="3" class="px-6 py-4 text-center text-gray-500">
            Nenhum tenant cadastrado ainda. Crie seu primeiro cliente acima! 👆
          </td>
        </tr>
      `;
      return;
    }
    
    // Renderizar cada tenant
    tenants.forEach(tenant => {
      const row = createTenantRow(tenant);
      tbody.appendChild(row);
    });
    
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="px-6 py-4 text-center text-red-500">
          Erro ao carregar tenants: ${error.message}
        </td>
      </tr>
    `;
    throw error;
  }
}

/**
 * Cria uma linha da tabela para um tenant
 * @param {Object} tenant - Dados do tenant
 * @returns {HTMLElement} Elemento <tr>
 */
function createTenantRow(tenant) {
  const tr = document.createElement('tr');
  tr.className = 'border-b hover:bg-gray-50 transition-colors';
  
  tr.innerHTML = `
    <td class="px-6 py-4 font-medium text-gray-900">${escapeHtml(tenant.name)}</td>
    <td class="px-6 py-4 text-gray-700">
      <code class="bg-gray-100 px-2 py-1 rounded">${escapeHtml(tenant.slug)}</code>
    </td>
    <td class="px-6 py-4 text-right space-x-2">
      <button 
        onclick="viewTenantLeads('${escapeHtml(tenant.slug)}')"
        class="text-blue-600 hover:text-blue-800 font-medium"
      >
        Ver Leads
      </button>
      <button 
        onclick="deleteTenantConfirm('${escapeHtml(tenant.slug)}', '${escapeHtml(tenant.name)}')"
        class="text-red-600 hover:text-red-800 font-medium"
      >
        Excluir
      </button>
    </td>
  `;
  
  return tr;
}

/**
 * Confirmação e exclusão de tenant
 */
async function deleteTenantConfirm(slug, name) {
  const confirmed = confirm(
    `Tem certeza que deseja excluir o tenant "${name}"?\n\n` +
    `⚠️ ATENÇÃO: Todos os leads associados serão perdidos!\n\n` +
    `Esta ação não pode ser desfeita.`
  );
  
  if (!confirmed) return;
  
  try {
    await deleteTenant(slug);
    showSuccess(`Tenant "${name}" excluído com sucesso!`);
    await renderTenantList();
  } catch (error) {
    showError('Erro ao excluir tenant: ' + error.message);
  }
}

/**
 * Visualizar leads de um tenant específico
 */
function viewTenantLeads(slug) {
  // Selecionar o tenant no dropdown do dashboard
  const tenantFilter = document.getElementById('tenant-filter');
  tenantFilter.value = slug;
  
  // Mudar para a seção de leads
  showSection('lead-dashboard');
  
  // Carregar os leads
  renderLeadList(slug);
}

// ============================================
// DASHBOARD DE LEADS
// ============================================

async function loadLeadDashboard() {
  try {
    // Atualizar dropdown de tenants
    await updateTenantFilter();
    
    // Carregar leads do primeiro tenant (se houver)
    const tenantFilter = document.getElementById('tenant-filter');
    if (tenantFilter.value) {
      await renderLeadList(tenantFilter.value);
    }
  } catch (error) {
    showError('Erro ao carregar dashboard: ' + error.message);
  }
}

/**
 * Atualiza o dropdown de filtro de tenants
 */
async function updateTenantFilter() {
  const select = document.getElementById('tenant-filter');
  
  try {
    let tenants = tenantsCache;
    
    // Se o cache estiver vazio, buscar do backend
    if (tenants.length === 0) {
      tenants = await fetchTenants();
      tenantsCache = tenants;
    }
    
    // Limpar opções
    select.innerHTML = '<option value="">Selecione um tenant...</option>';
    
    // Adicionar opção para todos os leads
    select.innerHTML += '<option value="all">📊 Todos os Leads</option>';
    
    // Adicionar cada tenant
    tenants.forEach(tenant => {
      const option = document.createElement('option');
      option.value = tenant.slug;
      option.textContent = tenant.name;
      select.appendChild(option);
    });
    
    // Event listener para mudança
    select.addEventListener('change', (e) => {
      const selectedSlug = e.target.value;
      if (selectedSlug) {
        renderLeadList(selectedSlug === 'all' ? null : selectedSlug);
      }
    });
    
  } catch (error) {
    select.innerHTML = '<option value="">Erro ao carregar tenants</option>';
    throw error;
  }
}

/**
 * Renderiza a lista de leads
 * @param {string|null} tenantSlug - Slug do tenant (null para todos)
 */
async function renderLeadList(tenantSlug) {
  const tbody = document.getElementById('lead-list');
  
  try {
    showLoadingState('lead-list', 'Carregando leads...');
    
    // Buscar leads
    const leads = tenantSlug ? await fetchLeads(tenantSlug) : await fetchAllLeads();
    
    // Limpar tabela
    tbody.innerHTML = '';
    
    if (leads.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="px-6 py-4 text-center text-gray-500">
            Nenhum lead encontrado para este tenant. 📭
          </td>
        </tr>
      `;
      return;
    }
    
    // Renderizar cada lead
    leads.forEach(lead => {
      const row = createLeadRow(lead);
      tbody.appendChild(row);
    });
    
    // Atualizar contador
    updateLeadCount(leads.length);
    
  } catch (error) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-4 text-center text-red-500">
          Erro ao carregar leads: ${error.message}
        </td>
      </tr>
    `;
    throw error;
  }
}

/**
 * Cria uma linha da tabela para um lead
 * @param {Object} lead - Dados do lead
 * @returns {HTMLElement} Elemento <tr>
 */
function createLeadRow(lead) {
  const tr = document.createElement('tr');
  tr.className = 'border-b hover:bg-gray-50 transition-colors';
  
  const createdAt = new Date(lead.created_at);
  const formattedDate = createdAt.toLocaleString('pt-BR');
  
  tr.innerHTML = `
    <td class="px-6 py-4 font-medium text-gray-900">${escapeHtml(lead.name || '-')}</td>
    <td class="px-6 py-4 text-gray-700">${escapeHtml(lead.email || '-')}</td>
    <td class="px-6 py-4 text-gray-700">${escapeHtml(lead.phone || '-')}</td>
    <td class="px-6 py-4 text-gray-600">
      <code class="bg-gray-100 px-2 py-1 rounded text-sm">${escapeHtml(lead.tenant_slug || '-')}</code>
    </td>
    <td class="px-6 py-4 text-gray-500 text-sm">${formattedDate}</td>
    <td class="px-6 py-4 text-right">
      <button 
        onclick="viewLeadDetails('${lead.id}')"
        class="text-blue-600 hover:text-blue-800 font-medium"
      >
        Detalhes
      </button>
    </td>
  `;
  
  return tr;
}

/**
 * Visualiza detalhes completos de um lead
 */
function viewLeadDetails(leadId) {
  // Por enquanto, apenas mostrar um alerta
  // Você pode expandir isso para mostrar um modal com mais informações
  alert(`Visualizando detalhes do lead ID: ${leadId}\n\nEm breve: Modal com informações completas!`);
}

/**
 * Atualiza o contador de leads
 */
function updateLeadCount(count) {
  const counter = document.getElementById('lead-count');
  if (counter) {
    counter.textContent = `${count} lead${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
  }
}

// ============================================
// FUNÇÕES DE UI - FEEDBACK VISUAL
// ============================================

/**
 * Mostra estado de carregamento
 */
function showLoadingState(elementId, message = 'Carregando...') {
  const element = document.getElementById(elementId);
  if (element && element.tagName === 'TBODY') {
    element.innerHTML = `
      <tr>
        <td colspan="10" class="px-6 py-8 text-center">
          <div class="flex items-center justify-center space-x-2">
            <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600">${message}</span>
          </div>
        </td>
      </tr>
    `;
  }
}

/**
 * Mostra mensagem de sucesso
 */
function showSuccess(message) {
  showNotification(message, 'success');
}

/**
 * Mostra mensagem de erro
 */
function showError(message) {
  showNotification(message, 'error');
}

/**
 * Sistema de notificações
 */
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  
  const bgColor = type === 'success' ? 'bg-green-500' : 
                  type === 'error' ? 'bg-red-500' : 'bg-blue-500';
  
  notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-in`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remover após 5 segundos
  setTimeout(() => {
    notification.classList.add('animate-slide-out');
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

/**
 * Escapa HTML para prevenir XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Tornar funções disponíveis globalmente (para onclick nos botões)
window.deleteTenantConfirm = deleteTenantConfirm;
window.viewTenantLeads = viewTenantLeads;
window.viewLeadDetails = viewLeadDetails;

