import { Repository } from 'typeorm';
import { User } from '../../db/entities/User.entity';

export class AuthRepository {
  constructor(private readonly repo: Repository<User>) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }
}
