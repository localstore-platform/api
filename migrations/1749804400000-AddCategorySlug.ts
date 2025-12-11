import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCategorySlug1749804400000 implements MigrationInterface {
  name = 'AddCategorySlug1749804400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // === CATEGORIES: Add slug column ===
    await queryRunner.query(`
      ALTER TABLE "categories"
      ADD COLUMN "slug" VARCHAR(100)
    `);

    // Generate slug from nameVi for existing categories (lowercase, replace spaces with hyphens, remove accents)
    await queryRunner.query(`
      UPDATE "categories"
      SET "slug" = LOWER(
        TRANSLATE(
          REPLACE(TRIM(name_vi), ' ', '-'),
          'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ',
          'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'
        )
      )
    `);

    // Make slug NOT NULL after setting values
    await queryRunner.query(`
      ALTER TABLE "categories"
      ALTER COLUMN "slug" SET NOT NULL
    `);

    // Add unique index for slug within tenant (WHERE deleted_at IS NULL)
    await queryRunner.query(`
      CREATE INDEX "idx_categories_tenant_slug"
      ON "categories" ("tenant_id", "slug")
      WHERE deleted_at IS NULL
    `);

    // === MENU_ITEMS: Add slug column ===
    await queryRunner.query(`
      ALTER TABLE "menu_items"
      ADD COLUMN "slug" VARCHAR(100)
    `);

    // Generate slug from nameVi for existing menu items
    await queryRunner.query(`
      UPDATE "menu_items"
      SET "slug" = LOWER(
        TRANSLATE(
          REPLACE(TRIM(name_vi), ' ', '-'),
          'áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđ',
          'aaaaaaaaaaaaaaaaaeeeeeeeeeeeiiiiiooooooooooooooooouuuuuuuuuuuyyyyyd'
        )
      )
    `);

    // Make slug NOT NULL after setting values
    await queryRunner.query(`
      ALTER TABLE "menu_items"
      ALTER COLUMN "slug" SET NOT NULL
    `);

    // Add index for slug within tenant (WHERE deleted_at IS NULL)
    await queryRunner.query(`
      CREATE INDEX "idx_menu_items_tenant_slug"
      ON "menu_items" ("tenant_id", "slug")
      WHERE deleted_at IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_menu_items_tenant_slug"`);
    await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "slug"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_categories_tenant_slug"`);
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "slug"`);
  }
}
