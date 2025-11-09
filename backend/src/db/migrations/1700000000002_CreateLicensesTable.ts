import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateLicensesTable1700000000002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'licenses',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'license_key',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'tenant_id',
            type: 'varchar',
          },
          {
            name: 'client_name',
            type: 'varchar',
          },
          {
            name: 'client_email',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'client_phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'active'",
          },
          {
            name: 'license_type',
            type: 'varchar',
            default: "'monthly'",
          },
          {
            name: 'expires_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'max_devices',
            type: 'int',
            default: 1,
          },
          {
            name: 'device_ids',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'last_validated_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'last_device_info',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'metadata',
            type: 'jsonb',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true
    );

    // Criar índices
    await queryRunner.query(`
      CREATE INDEX idx_licenses_tenant_id ON licenses(tenant_id);
      CREATE INDEX idx_licenses_status ON licenses(status);
      CREATE INDEX idx_licenses_expires_at ON licenses(expires_at);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('licenses');
  }
}

