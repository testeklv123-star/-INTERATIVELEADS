import { Pool } from 'pg';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { createAuthRouter } from './auth.controller';

export const buildAuthRouter = (pool: Pool) => {
  const repository = new AuthRepository(pool);
  const service = new AuthService(repository);
  return createAuthRouter(service);
};
