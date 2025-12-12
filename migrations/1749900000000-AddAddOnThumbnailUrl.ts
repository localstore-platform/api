import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAddOnThumbnailUrl1749900000000 implements MigrationInterface {
  name = 'AddAddOnThumbnailUrl1749900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add thumbnail_url column to item_add_ons table
    await queryRunner.query(`
      ALTER TABLE item_add_ons
      ADD COLUMN thumbnail_url TEXT;
    `);

    // Add comment for documentation
    await queryRunner.query(`
      COMMENT ON COLUMN item_add_ons.thumbnail_url IS 'URL for add-on thumbnail image (48x48px)';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE item_add_ons
      DROP COLUMN thumbnail_url;
    `);
  }
}
