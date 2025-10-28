import { Pool } from 'pg';
import { createTenantRouter } from './tenant.controller';
import { TenantRepository } from './tenant.repository';
import { TenantService } from './tenant.service';

export const buildTenantRouter = (pool: Pool) => {
  const repository = new TenantRepository(pool);
  const service = new TenantService(repository);
  return createTenantRouter(service);
};
