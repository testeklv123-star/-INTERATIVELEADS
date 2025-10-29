import { DataSource } from 'typeorm';
import { User } from '../../db/entities/User.entity';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { createAuthRouter } from './auth.controller';

export const buildAuthRouter = (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);
  const repository = new AuthRepository(userRepository);
  const service = new AuthService(repository);
  return createAuthRouter(service);
};
