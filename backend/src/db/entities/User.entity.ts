import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  email!: string;

  @Column({ type: 'text' })
  password_hash!: string;

  @Column({ type: 'varchar', length: 32 })
  role!: string;

  @Column({ type: 'integer', nullable: true })
  tenant_id!: number | null;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;
}

