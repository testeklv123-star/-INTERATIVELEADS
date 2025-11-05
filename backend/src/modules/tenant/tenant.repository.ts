import { Repository } from 'typeorm';
import { Tenant } from '../../db/entities/Tenant.entity';
import { TenantConfig as TenantConfigEntity } from '../../db/entities/TenantConfig.entity';
import { TenantConfigCreateInput, TenantConfigUpdateInput } from './tenant.schemas';

export class TenantRepository {
  constructor(private readonly repo: Repository<Tenant>) {}

  async findById(tenantId: string): Promise<Tenant | null> {
    return this.repo.findOne({
      where: { tenant_id: tenantId },
      relations: ['config'],
    });
  }

  async create(data: TenantConfigCreateInput): Promise<Tenant> {
    const config = new TenantConfigEntity();
    config.theme = data.theme;
    config.form_settings = data.formSettings;

    const tenant = this.repo.create({
      tenant_id: data.tenantId,
      display_name: data.displayName,
      config,
    });

    await this.repo.save(tenant);
    return (await this.findById(data.tenantId)) as Tenant;
  }

  async update(
    tenantId: string,
    data: TenantConfigUpdateInput
  ): Promise<Tenant | null> {
    const tenant = await this.findById(tenantId);
    if (!tenant) return null;

    if (data.displayName !== undefined) {
      tenant.display_name = data.displayName;
    }

    if (data.theme !== undefined) {
      if (!tenant.config) {
        tenant.config = new TenantConfigEntity();
      }
      tenant.config.theme = data.theme;
    }

    if (data.formSettings !== undefined) {
      if (!tenant.config) {
        tenant.config = new TenantConfigEntity();
      }
      tenant.config.form_settings = data.formSettings;
    }

    await this.repo.save(tenant);
    return (await this.findById(tenantId)) as Tenant;
  }

  async delete(tenantId: string): Promise<void> {
    await this.repo.delete({ tenant_id: tenantId });
  }
}
