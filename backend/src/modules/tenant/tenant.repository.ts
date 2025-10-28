import { Pool } from 'pg';
import {
  TenantConfig,
  TenantConfigCreateInput,
  TenantConfigUpdateInput,
} from './tenant.schemas';

export class TenantRepository {
  constructor(private readonly pool: Pool) {}

  async findById(tenantId: string): Promise<TenantConfig | null> {
    // TODO: Implementar SQL real
    console.log('[TenantRepository] findById', tenantId);
    return null;
  }

  async create(data: TenantConfigCreateInput): Promise<TenantConfig> {
    console.log('[TenantRepository] create', data.tenantId);
    return data;
  }

  async update(
    tenantId: string,
    data: TenantConfigUpdateInput
  ): Promise<TenantConfig | null> {
    console.log('[TenantRepository] update', tenantId, data);
    return null;
  }

  async delete(tenantId: string): Promise<void> {
    console.log('[TenantRepository] delete', tenantId);
  }
}
