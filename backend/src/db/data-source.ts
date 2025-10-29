import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Tenant } from './entities/Tenant.entity';
import { TenantConfig } from './entities/TenantConfig.entity';
import { User } from './entities/User.entity';
import { env } from '../config/env';

export const AppDataSource: DataSource = new DataSource({
  type: 'postgres',
  url: env.databaseUrl,
  synchronize: env.nodeEnv === 'development',
  logging: env.nodeEnv === 'development',
  entities: [Tenant, TenantConfig, User],
  migrations: [__dirname + '/migrations/*.ts'],
  subscribers: [],
  ssl: env.nodeEnv === 'production' ? { rejectUnauthorized: false } : undefined,
});
