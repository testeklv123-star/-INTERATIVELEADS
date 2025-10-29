import { Entity, PrimaryGeneratedColumn, Column, OneToOne, type Relation } from 'typeorm';
import { Tenant } from './Tenant.entity';

@Entity('tenant_configs')
export class TenantConfig {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'jsonb' })
  theme!: Record<string, any>;

  @Column({ type: 'jsonb' })
  form_settings!: Record<string, any>;

  @OneToOne(() => Tenant, (tenant: Tenant) => tenant.config, { onDelete: 'CASCADE' })
  tenant!: Relation<Tenant>;
}
