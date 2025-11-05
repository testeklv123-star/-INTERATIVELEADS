import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Tenant } from './Tenant.entity';
import { z } from 'zod';
import { ThemeSchema, FormSettingsSchema } from '../../modules/tenant/tenant.schemas';

@Entity('tenant_configs')
export class TenantConfig {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'jsonb' })
  theme!: z.infer<typeof ThemeSchema>;

  @Column({ type: 'jsonb' })
  form_settings!: z.infer<typeof FormSettingsSchema>;

  @OneToOne(() => Tenant, (tenant) => tenant.config)
  tenant!: Tenant;
}
