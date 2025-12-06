import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMenuTables1733500000000 implements MigrationInterface {
  name = 'CreateMenuTables1733500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enums
    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE user_role_enum AS ENUM ('owner', 'admin', 'staff');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryRunner.query(`
      DO $$ BEGIN
        CREATE TYPE item_status_enum AS ENUM ('draft', 'published', 'archived', 'out_of_stock');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Create tenants table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        business_name VARCHAR(255) NOT NULL,
        business_type VARCHAR(100),
        slug VARCHAR(100) UNIQUE NOT NULL,
        is_chain BOOLEAN DEFAULT false,
        total_locations INT DEFAULT 1,
        phone VARCHAR(50),
        email VARCHAR(255),
        address TEXT,
        city VARCHAR(100),
        province VARCHAR(100),
        postal_code VARCHAR(20),
        country_code CHAR(2) DEFAULT 'VN',
        locale VARCHAR(10) DEFAULT 'vi-VN',
        timezone VARCHAR(50) DEFAULT 'Asia/Ho_Chi_Minh',
        currency_code CHAR(3) DEFAULT 'VND',
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
        onboarding_completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,
        CONSTRAINT slug_format CHECK (slug ~ '^[a-z0-9-]+$')
      );
    `);

    // Create locations table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS locations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        location_name VARCHAR(255) NOT NULL,
        location_code VARCHAR(50),
        slug VARCHAR(100) NOT NULL,
        address TEXT NOT NULL,
        city VARCHAR(100),
        district VARCHAR(100),
        ward VARCHAR(100),
        province VARCHAR(100),
        postal_code VARCHAR(20),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        phone VARCHAR(50),
        manager_name VARCHAR(255),
        manager_phone VARCHAR(50),
        operating_hours JSONB DEFAULT '{
          "monday": {"open": "08:00", "close": "22:00"},
          "tuesday": {"open": "08:00", "close": "22:00"},
          "wednesday": {"open": "08:00", "close": "22:00"},
          "thursday": {"open": "08:00", "close": "22:00"},
          "friday": {"open": "08:00", "close": "22:00"},
          "saturday": {"open": "08:00", "close": "23:00"},
          "sunday": {"open": "08:00", "close": "23:00"}
        }',
        is_active BOOLEAN DEFAULT true,
        is_primary BOOLEAN DEFAULT false,
        opened_at DATE,
        closed_at DATE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP,
        CONSTRAINT unique_tenant_slug UNIQUE (tenant_id, slug),
        CONSTRAINT unique_location_code UNIQUE (tenant_id, location_code)
      );
    `);

    // Create menus table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS menus (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        name_vi VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        description_vi TEXT,
        description_en TEXT,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        available_days SMALLINT[],
        available_from TIME,
        available_until TIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    // Create categories table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        menu_id UUID REFERENCES menus(id) ON DELETE SET NULL,
        parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        name_vi VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        description_vi TEXT,
        description_en TEXT,
        display_order INT DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    // Create menu_items table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
        category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        is_chain_wide BOOLEAN DEFAULT false,
        name_vi VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        description_vi TEXT,
        description_en TEXT,
        base_price DECIMAL(10, 2) NOT NULL CHECK (base_price >= 0),
        compare_at_price DECIMAL(10, 2) CHECK (compare_at_price >= base_price),
        currency_code CHAR(3) DEFAULT 'VND',
        sku VARCHAR(100),
        track_inventory BOOLEAN DEFAULT false,
        stock_quantity INT,
        low_stock_threshold INT,
        display_order INT DEFAULT 0,
        thumbnail_url TEXT,
        is_featured BOOLEAN DEFAULT false,
        is_spicy BOOLEAN DEFAULT false,
        is_vegetarian BOOLEAN DEFAULT false,
        is_vegan BOOLEAN DEFAULT false,
        status item_status_enum DEFAULT 'draft',
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    // Create item_variants table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS item_variants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
        name_vi VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        price_adjustment DECIMAL(10, 2) DEFAULT 0,
        sku VARCHAR(100),
        track_inventory BOOLEAN DEFAULT false,
        stock_quantity INT,
        display_order INT DEFAULT 0,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    // Create item_add_ons table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS item_add_ons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
        name_vi VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
        is_required BOOLEAN DEFAULT false,
        max_selections INT DEFAULT 1,
        display_order INT DEFAULT 0,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    // Create item_images table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS item_images (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
        menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
        original_url TEXT NOT NULL,
        thumbnail_url TEXT,
        medium_url TEXT,
        large_url TEXT,
        alt_text_vi TEXT,
        alt_text_en TEXT,
        display_order INT DEFAULT 0,
        is_primary BOOLEAN DEFAULT false,
        file_size_bytes BIGINT,
        width_px INT,
        height_px INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP
      );
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug) WHERE deleted_at IS NULL;`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status) WHERE deleted_at IS NULL;`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_locations_tenant_id ON locations(tenant_id, is_active) WHERE deleted_at IS NULL;`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_locations_slug ON locations(tenant_id, slug) WHERE deleted_at IS NULL;`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_menus_tenant_id ON menus(tenant_id, display_order) WHERE deleted_at IS NULL;`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_categories_tenant_id ON categories(tenant_id, display_order) WHERE deleted_at IS NULL;`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_categories_menu_id ON categories(menu_id) WHERE deleted_at IS NULL;`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_menu_items_tenant_id ON menu_items(tenant_id, status, display_order) WHERE deleted_at IS NULL;`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_menu_items_category_id ON menu_items(category_id) WHERE deleted_at IS NULL;`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_menu_items_featured ON menu_items(tenant_id) WHERE is_featured = true AND deleted_at IS NULL;`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_item_variants_tenant_id ON item_variants(tenant_id) WHERE deleted_at IS NULL;`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_item_variants_menu_item_id ON item_variants(menu_item_id) WHERE deleted_at IS NULL;`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_item_add_ons_tenant_id ON item_add_ons(tenant_id) WHERE deleted_at IS NULL;`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_item_add_ons_menu_item_id ON item_add_ons(menu_item_id) WHERE deleted_at IS NULL;`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_item_images_tenant_id ON item_images(tenant_id) WHERE deleted_at IS NULL;`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_item_images_menu_item_id ON item_images(menu_item_id, display_order) WHERE deleted_at IS NULL;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop tables in reverse order of dependencies
    await queryRunner.query(`DROP TABLE IF EXISTS item_images CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS item_add_ons CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS item_variants CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS menu_items CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS categories CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS menus CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS locations CASCADE;`);
    await queryRunner.query(`DROP TABLE IF EXISTS tenants CASCADE;`);

    // Drop enums
    await queryRunner.query(`DROP TYPE IF EXISTS item_status_enum;`);
    await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum;`);
  }
}
