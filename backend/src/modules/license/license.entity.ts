import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum LicenseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  EXPIRED = 'expired'
}

export enum LicenseType {
  TRIAL = 'trial',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  LIFETIME = 'lifetime'
}

@Entity('licenses')
export class License {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', unique: true })
  license_key: string;

  @Column({ type: 'varchar' })
  tenant_id: string;

  @Column({ type: 'varchar' })
  client_name: string;

  @Column({ type: 'varchar', nullable: true })
  client_email: string;

  @Column({ type: 'varchar', nullable: true })
  client_phone: string;

  @Column({ type: 'enum', enum: LicenseStatus, default: LicenseStatus.ACTIVE })
  status: LicenseStatus;

  @Column({ type: 'enum', enum: LicenseType, default: LicenseType.MONTHLY })
  license_type: LicenseType;

  @Column({ type: 'timestamp', nullable: true })
  expires_at: Date;

  @Column({ type: 'int', default: 1 })
  max_devices: number;

  @Column({ type: 'simple-array', nullable: true })
  device_ids: string[];

  @Column({ type: 'timestamp', nullable: true })
  last_validated_at: Date;

  @Column({ type: 'varchar', nullable: true })
  last_device_info: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    created_by?: string;
    notes?: string;
    [key: string]: any;
  };

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Validações
  isExpired(): boolean {
    if (!this.expires_at) return false;
    return new Date() > this.expires_at;
  }

  isActive(): boolean {
    return this.status === LicenseStatus.ACTIVE && !this.isExpired();
  }

  canActivateDevice(deviceId: string): boolean {
    if (!this.isActive()) return false;
    
    // Se já está na lista, pode
    if (this.device_ids?.includes(deviceId)) return true;
    
    // Verifica se não excedeu o limite
    const currentDevices = this.device_ids?.length || 0;
    return currentDevices < this.max_devices;
  }
}

