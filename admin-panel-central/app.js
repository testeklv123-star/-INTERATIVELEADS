// Configuração da API
const API_URL = 'http://localhost:3000/api'; // Ajuste conforme seu backend

// Estado global
let currentLicenses = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    loadStatistics();
    loadLicenses();
});

/**
 * Carrega estatísticas
 */
async function loadStatistics() {
    try {
        const response = await fetch(`${API_URL}/licenses/stats`);
        const result = await response.json();
        
        if (result.success) {
            document.getElementById('stat-active').textContent = result.data.active;
            document.getElementById('stat-total').textContent = result.data.total;
            document.getElementById('stat-expired').textContent = result.data.expired;
            document.getElementById('stat-suspended').textContent = result.data.suspended;
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
        showNotification('Erro ao carregar estatísticas', 'error');
    }
}

/**
 * Carrega todas as licenças
 */
async function loadLicenses() {
    const tbody = document.getElementById('licensesTableBody');
    tbody.innerHTML = '<tr><td colspan="8" class="loading">Carregando...</td></tr>';
    
    try {
        const statusFilter = document.getElementById('statusFilter').value;
        const url = statusFilter 
            ? `${API_URL}/licenses?status=${statusFilter}`
            : `${API_URL}/licenses`;
        
        const response = await fetch(url);
        const result = await response.json();
        
        if (result.success) {
            currentLicenses = result.data;
            renderLicensesTable(result.data);
        } else {
            tbody.innerHTML = '<tr><td colspan="8" class="loading">Erro ao carregar licenças</td></tr>';
        }
    } catch (error) {
        console.error('Erro ao carregar licenças:', error);
        tbody.innerHTML = '<tr><td colspan="8" class="loading">Erro ao conectar com o servidor</td></tr>';
    }
}

/**
 * Renderiza tabela de licenças
 */
function renderLicensesTable(licenses) {
    const tbody = document.getElementById('licensesTableBody');
    
    if (licenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="loading">Nenhuma licença encontrada</td></tr>';
        return;
    }
    
    tbody.innerHTML = licenses.map(license => `
        <tr>
            <td>
                <strong>${license.client_name}</strong>
                ${license.client_email ? `<br><small>${license.client_email}</small>` : ''}
            </td>
            <td><code>${license.tenant_id}</code></td>
            <td>
                <code style="font-size: 0.85rem;">${license.license_key}</code>
                <button onclick="copyToClipboard('${license.license_key}')" class="btn-copy" title="Copiar">📋</button>
            </td>
            <td>${getTypeBadge(license.license_type)}</td>
            <td>${getStatusBadge(license.status)}</td>
            <td>${formatExpiration(license.expires_at)}</td>
            <td>
                <span title="${license.device_ids?.join(', ') || 'Nenhum'}">
                    ${license.device_ids?.length || 0}/${license.max_devices}
                </span>
            </td>
            <td class="actions">
                <button class="btn btn-success" onclick="showDetails('${license.id}')" title="Detalhes">👁️</button>
                <button class="btn btn-warning" onclick="renewLicense('${license.id}')" title="Renovar">🔄</button>
                <button class="btn ${license.status === 'active' ? 'btn-warning' : 'btn-success'}" 
                        onclick="toggleStatus('${license.id}', '${license.status}')" 
                        title="${license.status === 'active' ? 'Suspender' : 'Ativar'}">
                    ${license.status === 'active' ? '⏸️' : '▶️'}
                </button>
                <button class="btn btn-danger" onclick="deleteLicense('${license.id}')" title="Excluir">🗑️</button>
            </td>
        </tr>
    `).join('');
}

/**
 * Formata data de expiração
 */
function formatExpiration(expiresAt) {
    if (!expiresAt) return '<span class="status-active">Vitalícia</span>';
    
    const date = new Date(expiresAt);
    const now = new Date();
    const daysLeft = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) {
        return `<span class="status-expired">Expirada</span>`;
    } else if (daysLeft <= 7) {
        return `<span class="status-suspended">${daysLeft} dias</span>`;
    } else {
        return `<span class="status-active">${daysLeft} dias</span>`;
    }
}

/**
 * Badge de status
 */
function getStatusBadge(status) {
    const statusMap = {
        active: { text: 'Ativa', class: 'status-active' },
        expired: { text: 'Expirada', class: 'status-expired' },
        suspended: { text: 'Suspensa', class: 'status-suspended' },
        inactive: { text: 'Inativa', class: 'status-inactive' }
    };
    
    const s = statusMap[status] || { text: status, class: '' };
    return `<span class="status-badge ${s.class}">${s.text}</span>`;
}

/**
 * Badge de tipo
 */
function getTypeBadge(type) {
    const typeMap = {
        trial: { text: 'Trial', class: 'type-trial' },
        monthly: { text: 'Mensal', class: 'type-monthly' },
        yearly: { text: 'Anual', class: 'type-yearly' },
        lifetime: { text: 'Vitalícia', class: 'type-lifetime' }
    };
    
    const t = typeMap[type] || { text: type, class: '' };
    return `<span class="type-badge ${t.class}">${t.text}</span>`;
}

/**
 * Mostra modal de criar licença
 */
function showCreateModal() {
    document.getElementById('createModal').classList.add('show');
    document.getElementById('createForm').reset();
}

/**
 * Cria nova licença
 */
async function createLicense(event) {
    event.preventDefault();
    
    const formData = {
        tenant_id: document.getElementById('tenant_id').value,
        client_name: document.getElementById('client_name').value,
        client_email: document.getElementById('client_email').value || undefined,
        client_phone: document.getElementById('client_phone').value || undefined,
        license_type: document.getElementById('license_type').value,
        max_devices: parseInt(document.getElementById('max_devices').value),
        duration_days: document.getElementById('duration_days').value 
            ? parseInt(document.getElementById('duration_days').value) 
            : undefined
    };
    
    try {
        const response = await fetch(`${API_URL}/licenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Licença criada com sucesso!', 'success');
            closeModal('createModal');
            loadLicenses();
            loadStatistics();
            
            // Mostra a chave da licença
            alert(`Licença criada!\n\nChave: ${result.data.license_key}\n\nCopie esta chave para o cliente.`);
        } else {
            showNotification(result.message || 'Erro ao criar licença', 'error');
        }
    } catch (error) {
        console.error('Erro ao criar licença:', error);
        showNotification('Erro ao conectar com o servidor', 'error');
    }
}

/**
 * Mostra detalhes da licença
 */
async function showDetails(licenseId) {
    try {
        const response = await fetch(`${API_URL}/licenses/${licenseId}`);
        const result = await response.json();
        
        if (result.success) {
            const license = result.data;
            const detailsContent = document.getElementById('licenseDetails');
            
            detailsContent.innerHTML = `
                <div class="license-key-display">
                    ${license.license_key}
                    <br>
                    <button onclick="copyToClipboard('${license.license_key}')" class="btn btn-secondary" style="margin-top: 10px;">
                        📋 Copiar Chave
                    </button>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Cliente:</span>
                    <span class="detail-value">${license.client_name}</span>
                </div>
                
                ${license.client_email ? `
                <div class="detail-row">
                    <span class="detail-label">E-mail:</span>
                    <span class="detail-value">${license.client_email}</span>
                </div>
                ` : ''}
                
                ${license.client_phone ? `
                <div class="detail-row">
                    <span class="detail-label">Telefone:</span>
                    <span class="detail-value">${license.client_phone}</span>
                </div>
                ` : ''}
                
                <div class="detail-row">
                    <span class="detail-label">Tenant ID:</span>
                    <span class="detail-value"><code>${license.tenant_id}</code></span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value">${getStatusBadge(license.status)}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Tipo:</span>
                    <span class="detail-value">${getTypeBadge(license.license_type)}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Expira em:</span>
                    <span class="detail-value">${formatExpiration(license.expires_at)}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Dispositivos:</span>
                    <span class="detail-value">${license.device_ids?.length || 0}/${license.max_devices}</span>
                </div>
                
                ${license.device_ids?.length > 0 ? `
                <div class="detail-row">
                    <span class="detail-label">IDs dos Dispositivos:</span>
                    <span class="detail-value" style="font-size: 0.85rem;">${license.device_ids.join('<br>')}</span>
                </div>
                ` : ''}
                
                <div class="detail-row">
                    <span class="detail-label">Criada em:</span>
                    <span class="detail-value">${new Date(license.created_at).toLocaleString('pt-BR')}</span>
                </div>
                
                <div class="detail-row">
                    <span class="detail-label">Última validação:</span>
                    <span class="detail-value">${license.last_validated_at ? new Date(license.last_validated_at).toLocaleString('pt-BR') : 'Nunca'}</span>
                </div>
            `;
            
            document.getElementById('detailsModal').classList.add('show');
        }
    } catch (error) {
        console.error('Erro ao buscar detalhes:', error);
        showNotification('Erro ao buscar detalhes', 'error');
    }
}

/**
 * Renova licença
 */
async function renewLicense(licenseId) {
    const days = prompt('Por quantos dias deseja renovar?', '30');
    if (!days || isNaN(days)) return;
    
    try {
        const response = await fetch(`${API_URL}/licenses/${licenseId}/renew`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ duration_days: parseInt(days) })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Licença renovada com sucesso!', 'success');
            loadLicenses();
            loadStatistics();
        } else {
            showNotification(result.message || 'Erro ao renovar licença', 'error');
        }
    } catch (error) {
        console.error('Erro ao renovar licença:', error);
        showNotification('Erro ao conectar com o servidor', 'error');
    }
}

/**
 * Alterna status da licença
 */
async function toggleStatus(licenseId, currentStatus) {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    
    if (!confirm(`Tem certeza que deseja ${newStatus === 'active' ? 'ativar' : 'suspender'} esta licença?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/licenses/${licenseId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Status atualizado com sucesso!', 'success');
            loadLicenses();
            loadStatistics();
        } else {
            showNotification(result.message || 'Erro ao atualizar status', 'error');
        }
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        showNotification('Erro ao conectar com o servidor', 'error');
    }
}

/**
 * Deleta licença
 */
async function deleteLicense(licenseId) {
    if (!confirm('Tem certeza que deseja EXCLUIR esta licença? Esta ação não pode ser desfeita!')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/licenses/${licenseId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Licença excluída com sucesso!', 'success');
            loadLicenses();
            loadStatistics();
        } else {
            showNotification(result.message || 'Erro ao excluir licença', 'error');
        }
    } catch (error) {
        console.error('Erro ao excluir licença:', error);
        showNotification('Erro ao conectar com o servidor', 'error');
    }
}

/**
 * Fecha modal
 */
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

/**
 * Copia texto para clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copiado para a área de transferência!', 'success');
    }).catch(err => {
        console.error('Erro ao copiar:', err);
        showNotification('Erro ao copiar', 'error');
    });
}

/**
 * Mostra notificação
 */
function showNotification(message, type = 'info') {
    // Remove notificação anterior se existir
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#6366F1'};
        color: white;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

/**
 * Logout (placeholder)
 */
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        // Implementar lógica de logout
        window.location.href = '/';
    }
}

// Adiciona estilos de animação
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
    .btn-copy {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1rem;
        margin-left: 8px;
        opacity: 0.6;
        transition: opacity 0.2s;
    }
    .btn-copy:hover {
        opacity: 1;
    }
`;
document.head.appendChild(style);

