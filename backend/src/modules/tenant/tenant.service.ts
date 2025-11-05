import {
  TenantConfig,
  TenantConfigCreateInput,
  TenantConfigUpdateInput,
} from './tenant.schemas';
import { TenantRepository } from './tenant.repository';
import { Tenant } from '../../db/entities/Tenant.entity';

export class TenantService {
  constructor(private readonly repository: TenantRepository) {}

  private mapTenantToConfig(tenant: Tenant): TenantConfig {
    if (!tenant.config) {
      throw new Error('Tenant config is missing');
    }

    return {
      tenantId: tenant.tenant_id,
      displayName: tenant.display_name,
      theme: tenant.config.theme,
      formSettings: tenant.config.form_settings,
    };
  }

  async getTenant(tenantId: string): Promise<TenantConfig | null> {
    const tenant = await this.repository.findById(tenantId);
    if (!tenant || !tenant.config) return null;
    return this.mapTenantToConfig(tenant);
  }

  async createTenant(data: TenantConfigCreateInput): Promise<TenantConfig> {
    const tenant = await this.repository.create(data);
    return this.mapTenantToConfig(tenant);
  }

  async updateTenant(
    tenantId: string,
    data: TenantConfigUpdateInput
  ): Promise<TenantConfig | null> {
    const tenant = await this.repository.update(tenantId, data);
    if (!tenant || !tenant.config) return null;
    return this.mapTenantToConfig(tenant);
  }

  async deleteTenant(tenantId: string): Promise<void> {
    return this.repository.delete(tenantId);
  }

  async getConfig(tenantId: string): Promise<TenantConfig | null> {
    const tenant = await this.repository.findById(tenantId);
    if (!tenant?.config) return null;

    return this.mapTenantToConfig(tenant);
  }
}
