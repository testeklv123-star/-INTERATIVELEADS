import {
  TenantConfig,
  TenantConfigCreateInput,
  TenantConfigUpdateInput,
} from './tenant.schemas';
import { TenantRepository } from './tenant.repository';

export class TenantService {
  constructor(private readonly repository: TenantRepository) {}

  async getTenant(tenantId: string): Promise<TenantConfig | null> {
    return this.repository.findById(tenantId);
  }

  async createTenant(data: TenantConfigCreateInput): Promise<TenantConfig> {
    return this.repository.create(data);
  }

  async updateTenant(
    tenantId: string,
    data: TenantConfigUpdateInput
  ): Promise<TenantConfig | null> {
    return this.repository.update(tenantId, data);
  }

  async deleteTenant(tenantId: string): Promise<void> {
    return this.repository.delete(tenantId);
  }
}
