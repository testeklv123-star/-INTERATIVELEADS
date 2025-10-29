import { DataSource } from 'typeorm';
import { Tenant } from '../../db/entities/Tenant.entity';
import { TenantRepository } from './tenant.repository';
import { TenantService } from './tenant.service';
import { createTenantRouter } from './tenant.controller';

export const buildTenantRouter = (dataSource: DataSource) => {
  const tenantRepository = dataSource.getRepository(Tenant);
  const repository = new TenantRepository(tenantRepository);
  const service = new TenantService(repository);
  return createTenantRouter(service);
};
