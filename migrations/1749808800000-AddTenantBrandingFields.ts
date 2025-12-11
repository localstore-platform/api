import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTenantBrandingFields1749808800000 implements MigrationInterface {
  name = 'AddTenantBrandingFields1749808800000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add branding fields to tenants table
    // These fields are required by MenuStoreInfoDto in @localstore/contracts v0.3.0
    await queryRunner.query(`
      ALTER TABLE tenants
      ADD COLUMN IF NOT EXISTS logo_url VARCHAR(500),
      ADD COLUMN IF NOT EXISTS primary_color CHAR(7);
    `);

    // Add comment for documentation
    await queryRunner.query(`
      COMMENT ON COLUMN tenants.logo_url IS 'Store logo URL for branding';
      COMMENT ON COLUMN tenants.primary_color IS 'Primary brand color in hex format (e.g., #FF5733)';
    `);

    // Update existing seed data with sample branding (optional)
    await queryRunner.query(`
      UPDATE tenants
      SET logo_url = 'https://cdn.localstore.vn/logos/pho-hanoi-24.png',
          primary_color = '#E53935'
      WHERE slug = 'pho-hanoi-24';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE tenants
      DROP COLUMN IF EXISTS logo_url,
      DROP COLUMN IF EXISTS primary_color;
    `);
  }
}
