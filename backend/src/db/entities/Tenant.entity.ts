import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, type Relation } from 'typeorm';
import { TenantConfig } from './TenantConfig.entity';

@Entity('tenants')
export class Tenant {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 64, unique: true })
  tenant_id!: string;

  @Column({ type: 'varchar', length: 120 })
  display_name!: string;

  @OneToOne(() => TenantConfig, (config: TenantConfig) => config.tenant, { cascade: true })
  @JoinColumn()
  config!: Relation<TenantConfig>;
}
