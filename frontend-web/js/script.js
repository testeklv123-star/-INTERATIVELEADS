/**
 * Script do frontend para captura de leads
 * Integrado com backend offline-first
 */

// Configuração da API
const API_URL = 'http://localhost:5000';

// Elementos do DOM
const form = document.getElementById('lead-form');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const btnLoader = document.getElementById('btn-loader');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const statusDot = document.getElementById('status-dot');
const statusText = document.getElementById('status-text');

// Verificar status da API ao carregar
checkAPIStatus();

// Verificar status periodicamente
setInterval(checkAPIStatus, 10000); // A cada 10 segundos

/**
 * Verifica o status da API
 */
async function checkAPIStatus() {
    try {
        const response = await fetch(`${API_URL}/health`);
        if (response.ok) {
            statusDot.className = 'status-dot online';
            statusText.textContent = 'Sistema online';
        } else {
            throw new Error('API não disponível');
        }
    } catch (error) {
        statusDot.className = 'status-dot offline';
        statusText.textContent = 'Sistema offline (dados serão salvos localmente)';
    }
}

/**
 * Valida o formulário
 */
function validateForm(formData) {
    const errors = {};

    // Validar nome
    if (!formData.name || formData.name.trim().length < 3) {
        errors.name = 'Nome deve ter pelo menos 3 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
        errors.email = 'Email inválido';
    }

    return errors;
}

/**
 * Exibe erros de validação
 */
function showErrors(errors) {
    // Limpar erros anteriores
    document.querySelectorAll('.error-text').forEach(el => el.textContent = '');
    document.querySelectorAll('input').forEach(el => el.classList.remove('error'));

    // Mostrar novos erros
    Object.keys(errors).forEach(field => {
        const input = document.getElementById(field);
        const errorText = document.getElementById(`${field}-error`);
        
        if (input) input.classList.add('error');
        if (errorText) errorText.textContent = errors[field];
    });
}

/**
 * Limpa mensagens
 */
function clearMessages() {
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');
}

/**
 * Mostra mensagem de sucesso
 */
function showSuccess() {
    clearMessages();
    successMessage.classList.remove('hidden');
    
    // Scroll suave para a mensagem
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Esconder após 5 segundos
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 5000);
}

/**
 * Mostra mensagem de erro
 */
function showError() {
    clearMessages();
    errorMessage.classList.remove('hidden');
    
    // Scroll suave para a mensagem
    errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Esconder após 5 segundos
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

/**
 * Envia o formulário
 */
async function submitForm(event) {
    event.preventDefault();
    
    // Coletar dados do formulário
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim() || null,
    };

    // Validar
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
        showErrors(errors);
        return;
    }

    // Limpar erros
    showErrors({});
    clearMessages();

    // Desabilitar botão e mostrar loader
    submitBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');

    try {
        // Enviar para API
        const response = await fetch(`${API_URL}/api/leads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok && result.success) {
            // Sucesso!
            console.log('✅ Lead salvo:', result.data);
            showSuccess();
            
            // Limpar formulário
            form.reset();
        } else {
            // Erro da API
            console.error('❌ Erro ao salvar lead:', result);
            showError();
        }
    } catch (error) {
        // Erro de rede
        console.error('❌ Erro de rede:', error);
        showError();
    } finally {
        // Reabilitar botão
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
    }
}

// Event listener do formulário
form.addEventListener('submit', submitForm);

// Limpar erros ao digitar
document.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorText = document.getElementById(`${input.id}-error`);
        if (errorText) errorText.textContent = '';
    });
});

console.log('✅ Frontend carregado. API URL:', API_URL);

