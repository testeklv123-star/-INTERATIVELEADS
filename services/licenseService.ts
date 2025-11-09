import { v4 as uuidv4 } from 'uuid';

interface LicenseValidationResponse {
  valid: boolean;
  message: string;
  license?: {
    license_key: string;
    tenant_id: string;
    status: string;
    expires_at: string | null;
    max_devices: number;
  };
}

interface CachedLicense {
  license_key: string;
  tenant_id: string;
  valid_until: number;
  last_check: number;
}

class LicenseService {
  private apiUrl: string;
  private deviceId: string;
  private cacheKey = 'license_cache';
  private deviceIdKey = 'device_id';
  
  constructor(apiUrl: string = 'http://localhost:3000/api') {
    this.apiUrl = apiUrl;
    this.deviceId = this.getOrCreateDeviceId();
  }

  /**
   * Obtém ou cria um ID único para este dispositivo
   */
  private getOrCreateDeviceId(): string {
    try {
      let deviceId = localStorage.getItem(this.deviceIdKey);
      
      if (!deviceId) {
        // Gera um ID único baseado em informações do sistema
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        const language = navigator.language;
        const timestamp = Date.now();
        
        // Cria hash simples
        const data = `${userAgent}-${platform}-${language}-${timestamp}`;
        deviceId = uuidv4(); // Usa UUID para garantir unicidade
        
        localStorage.setItem(this.deviceIdKey, deviceId);
        console.log('🆔 [License] Novo Device ID criado:', deviceId);
      } else {
        console.log('🆔 [License] Device ID existente:', deviceId);
      }
      
      return deviceId;
    } catch (error) {
      console.error('❌ [License] Erro ao obter Device ID:', error);
      return uuidv4(); // Fallback para UUID
    }
  }

  /**
   * Valida a licença online
   */
  async validateOnline(licenseKey: string): Promise<LicenseValidationResponse> {
    try {
      console.log('🔍 [License] Validando licença online...', { licenseKey, deviceId: this.deviceId });
      
      const response = await fetch(`${this.apiUrl}/licenses/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          license_key: licenseKey,
          device_id: this.deviceId
        })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('✅ [License] Licença válida');
        
        // Salva no cache
        this.saveLicenseCache({
          license_key: licenseKey,
          tenant_id: result.data.tenant_id,
          valid_until: result.data.expires_at 
            ? new Date(result.data.expires_at).getTime() 
            : Date.now() + (365 * 24 * 60 * 60 * 1000), // 1 ano se vitalícia
          last_check: Date.now()
        });
        
        return {
          valid: true,
          message: 'Licença válida',
          license: result.data
        };
      } else {
        console.warn('⚠️ [License] Licença inválida:', result.message);
        return {
          valid: false,
          message: result.message || 'Licença inválida'
        };
      }
    } catch (error) {
      console.error('❌ [License] Erro ao validar online:', error);
      throw error;
    }
  }

  /**
   * Valida a licença (tenta online, fallback para cache)
   */
  async validate(licenseKey: string): Promise<LicenseValidationResponse> {
    try {
      // Tenta validar online
      return await this.validateOnline(licenseKey);
    } catch (error) {
      console.warn('⚠️ [License] Erro ao validar online, tentando cache...', error);
      
      // Fallback: verifica cache
      const cached = this.getLicenseCache();
      
      if (cached && cached.license_key === licenseKey) {
        const now = Date.now();
        const cacheAge = now - cached.last_check;
        const maxCacheAge = 7 * 24 * 60 * 60 * 1000; // 7 dias
        
        // Verifica se o cache ainda é válido
        if (cacheAge < maxCacheAge && now < cached.valid_until) {
          console.log('✅ [License] Usando licença do cache (offline)');
          return {
            valid: true,
            message: 'Licença válida (modo offline)',
            license: {
              license_key: cached.license_key,
              tenant_id: cached.tenant_id,
              status: 'active',
              expires_at: new Date(cached.valid_until).toISOString(),
              max_devices: 1
            }
          };
        } else {
          console.warn('⚠️ [License] Cache expirado');
          this.clearLicenseCache();
        }
      }
      
      return {
        valid: false,
        message: 'Não foi possível validar a licença. Verifique sua conexão com a internet.'
      };
    }
  }

  /**
   * Verifica se há licença em cache
   */
  hasValidCache(): boolean {
    const cached = this.getLicenseCache();
    if (!cached) return false;
    
    const now = Date.now();
    const cacheAge = now - cached.last_check;
    const maxCacheAge = 7 * 24 * 60 * 60 * 1000; // 7 dias
    
    return cacheAge < maxCacheAge && now < cached.valid_until;
  }

  /**
   * Salva licença no cache
   */
  private saveLicenseCache(cache: CachedLicense): void {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify(cache));
      console.log('💾 [License] Cache salvo');
    } catch (error) {
      console.error('❌ [License] Erro ao salvar cache:', error);
    }
  }

  /**
   * Obtém licença do cache
   */
  private getLicenseCache(): CachedLicense | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;
      
      return JSON.parse(cached) as CachedLicense;
    } catch (error) {
      console.error('❌ [License] Erro ao ler cache:', error);
      return null;
    }
  }

  /**
   * Limpa cache de licença
   */
  clearLicenseCache(): void {
    try {
      localStorage.removeItem(this.cacheKey);
      console.log('🗑️ [License] Cache limpo');
    } catch (error) {
      console.error('❌ [License] Erro ao limpar cache:', error);
    }
  }

  /**
   * Obtém informações da licença em cache
   */
  getCachedLicenseInfo(): { license_key: string; tenant_id: string } | null {
    const cached = this.getLicenseCache();
    if (!cached) return null;
    
    return {
      license_key: cached.license_key,
      tenant_id: cached.tenant_id
    };
  }

  /**
   * Obtém o Device ID
   */
  getDeviceId(): string {
    return this.deviceId;
  }
}

export const licenseService = new LicenseService();
export default licenseService;

