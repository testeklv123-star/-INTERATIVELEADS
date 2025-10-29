import { Repository } from 'typeorm';
import { Tenant } from '../../db/entities/Tenant.entity';
import { TenantConfig } from '../../db/entities/TenantConfig.entity';

export class TenantRepository {
  constructor(private readonly repo: Repository<Tenant>) {}

  async findById(tenantId: string): Promise<Tenant | null> {
    return this.repo.findOne({ 
      where: { tenant_id: tenantId },
      relations: ['config']
    });
  }

  async create(data: TenantConfig): Promise<Tenant> {
    const tenant = this.repo.create(data);
    return this.repo.save(tenant);
  }

  async update(tenantId: string, data: Partial<TenantConfig>): Promise<Tenant | null> {
    const tenant = await this.findById(tenantId);
    if (!tenant) return null;
    Object.assign(tenant, data);
    return this.repo.save(tenant);
  }

  async delete(tenantId: string): Promise<void> {
    await this.repo.delete({ tenant_id: tenantId });
  }
}
