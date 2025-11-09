import { Repository } from 'typeorm';
import { AppDataSource } from '../../db/data-source';
import { License, LicenseStatus, LicenseType } from './license.entity';
import crypto from 'crypto';

export class LicenseService {
  private licenseRepository: Repository<License>;

  constructor() {
    this.licenseRepository = AppDataSource.getRepository(License);
  }

  /**
   * Gera uma chave de licença única
   */
  private generateLicenseKey(): string {
    const prefix = 'WLT'; // White Label Totem
    const randomPart = crypto.randomBytes(16).toString('hex').toUpperCase();
    
    // Formato: WLT-XXXX-XXXX-XXXX-XXXX
    const parts = randomPart.match(/.{1,4}/g) || [];
    return `${prefix}-${parts.slice(0, 4).join('-')}`;
  }

  /**
   * Cria uma nova licença
   */
  async createLicense(data: {
    tenant_id: string;
    client_name: string;
    client_email?: string;
    client_phone?: string;
    license_type: LicenseType;
    max_devices?: number;
    duration_days?: number;
  }): Promise<License> {
    const license = this.licenseRepository.create({
      license_key: this.generateLicenseKey(),
      tenant_id: data.tenant_id,
      client_name: data.client_name,
      client_email: data.client_email,
      client_phone: data.client_phone,
      license_type: data.license_type,
      max_devices: data.max_devices || 1,
      status: LicenseStatus.ACTIVE,
      device_ids: [],
    });

    // Define expiração baseada no tipo
    if (data.duration_days) {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + data.duration_days);
      license.expires_at = expiresAt;
    } else {
      switch (data.license_type) {
        case LicenseType.TRIAL:
          const trialExpires = new Date();
          trialExpires.setDate(trialExpires.getDate() + 30);
          license.expires_at = trialExpires;
          break;
        case LicenseType.MONTHLY:
          const monthlyExpires = new Date();
          monthlyExpires.setMonth(monthlyExpires.getMonth() + 1);
          license.expires_at = monthlyExpires;
          break;
        case LicenseType.YEARLY:
          const yearlyExpires = new Date();
          yearlyExpires.setFullYear(yearlyExpires.getFullYear() + 1);
          license.expires_at = yearlyExpires;
          break;
        case LicenseType.LIFETIME:
          license.expires_at = null;
          break;
      }
    }

    return await this.licenseRepository.save(license);
  }

  /**
   * Valida uma licença pelo key
   */
  async validateLicense(licenseKey: string, deviceId: string): Promise<{
    valid: boolean;
    license?: License;
    message: string;
  }> {
    const license = await this.licenseRepository.findOne({
      where: { license_key: licenseKey }
    });

    if (!license) {
      return { valid: false, message: 'Licença não encontrada' };
    }

    // Verifica status
    if (license.status !== LicenseStatus.ACTIVE) {
      return { valid: false, license, message: `Licença ${license.status}` };
    }

    // Verifica expiração
    if (license.isExpired()) {
      await this.licenseRepository.update(license.id, {
        status: LicenseStatus.EXPIRED
      });
      return { valid: false, license, message: 'Licença expirada' };
    }

    // Verifica dispositivo
    if (!license.canActivateDevice(deviceId)) {
      return { 
        valid: false, 
        license, 
        message: `Limite de dispositivos atingido (${license.max_devices})` 
      };
    }

    // Adiciona dispositivo se não existir
    if (!license.device_ids?.includes(deviceId)) {
      const updatedDevices = [...(license.device_ids || []), deviceId];
      await this.licenseRepository.update(license.id, {
        device_ids: updatedDevices,
        last_validated_at: new Date()
      });
    } else {
      // Atualiza última validação
      await this.licenseRepository.update(license.id, {
        last_validated_at: new Date()
      });
    }

    return { valid: true, license, message: 'Licença válida' };
  }

  /**
   * Lista todas as licenças
   */
  async getAllLicenses(filters?: {
    status?: LicenseStatus;
    tenant_id?: string;
  }): Promise<License[]> {
    const query = this.licenseRepository.createQueryBuilder('license');

    if (filters?.status) {
      query.andWhere('license.status = :status', { status: filters.status });
    }

    if (filters?.tenant_id) {
      query.andWhere('license.tenant_id = :tenant_id', { tenant_id: filters.tenant_id });
    }

    return await query.orderBy('license.created_at', 'DESC').getMany();
  }

  /**
   * Busca licença por ID
   */
  async getLicenseById(id: string): Promise<License | null> {
    return await this.licenseRepository.findOne({ where: { id } });
  }

  /**
   * Atualiza status da licença
   */
  async updateLicenseStatus(id: string, status: LicenseStatus): Promise<License> {
    await this.licenseRepository.update(id, { status });
    const updated = await this.getLicenseById(id);
    if (!updated) throw new Error('Licença não encontrada');
    return updated;
  }

  /**
   * Renova licença
   */
  async renewLicense(id: string, duration_days: number): Promise<License> {
    const license = await this.getLicenseById(id);
    if (!license) throw new Error('Licença não encontrada');

    const newExpiration = new Date();
    newExpiration.setDate(newExpiration.getDate() + duration_days);

    await this.licenseRepository.update(id, {
      expires_at: newExpiration,
      status: LicenseStatus.ACTIVE
    });

    const renewed = await this.getLicenseById(id);
    if (!renewed) throw new Error('Erro ao renovar licença');
    return renewed;
  }

  /**
   * Deleta licença
   */
  async deleteLicense(id: string): Promise<void> {
    await this.licenseRepository.delete(id);
  }

  /**
   * Estatísticas de licenças
   */
  async getStatistics(): Promise<{
    total: number;
    active: number;
    expired: number;
    suspended: number;
    inactive: number;
  }> {
    const [total, active, expired, suspended, inactive] = await Promise.all([
      this.licenseRepository.count(),
      this.licenseRepository.count({ where: { status: LicenseStatus.ACTIVE } }),
      this.licenseRepository.count({ where: { status: LicenseStatus.EXPIRED } }),
      this.licenseRepository.count({ where: { status: LicenseStatus.SUSPENDED } }),
      this.licenseRepository.count({ where: { status: LicenseStatus.INACTIVE } }),
    ]);

    return { total, active, expired, suspended, inactive };
  }
}

