import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1700000000001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS citext;
      
      CREATE TABLE IF NOT EXISTS tenants (
        id SERIAL PRIMARY KEY,
        tenant_id VARCHAR(64) UNIQUE NOT NULL,
        display_name VARCHAR(120) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      
      CREATE TABLE IF NOT EXISTS tenant_configs (
        id SERIAL PRIMARY KEY,
        tenant_id INTEGER NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        theme JSONB NOT NULL,
        form_settings JSONB NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE (tenant_id)
      );
      
      CREATE OR REPLACE FUNCTION trigger_set_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
      
      CREATE TRIGGER set_timestamp
      BEFORE UPDATE ON tenants
      FOR EACH ROW
      EXECUTE FUNCTION trigger_set_timestamp();
      
      CREATE TRIGGER set_timestamp_configs
      BEFORE UPDATE ON tenant_configs
      FOR EACH ROW
      EXECUTE FUNCTION trigger_set_timestamp();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS tenant_configs CASCADE`);
    await queryRunner.query(`DROP TABLE IF EXISTS tenants CASCADE`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS trigger_set_timestamp`);
  }
}
