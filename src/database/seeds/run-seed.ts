import { DataSource } from 'typeorm';
import { dataSourceOptions } from '../../config/typeorm.config';

/**
 * Vietnamese Sample Menu Seed Data
 * Per Sprint 0.5 - Story 2.2: Mock Data Seeder
 */
async function runSeed() {
  const dataSource = new DataSource(dataSourceOptions);

  try {
    await dataSource.initialize();
    console.log('📦 Database connected. Running seeds...');

    // Sample tenant data
    const tenantId = '550e8400-e29b-41d4-a716-446655440000';

    // Check if tenant already exists
    const existingTenant = await dataSource.query(`SELECT id FROM tenants WHERE id = $1`, [
      tenantId,
    ]);

    if (existingTenant.length > 0) {
      console.log('⏭️  Seed data already exists. Skipping...');
      await dataSource.destroy();
      return;
    }

    // Insert sample tenant
    await dataSource.query(
      `
      INSERT INTO tenants (id, business_name, slug, business_type, phone, address, city, province, status, logo_url, primary_color)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `,
      [
        tenantId,
        'Phở Hà Nội 24',
        'pho-hanoi-24',
        'restaurant',
        '+84912345678',
        '123 Nguyễn Huệ, Quận 1',
        'Hồ Chí Minh',
        'Hồ Chí Minh',
        'active',
        'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=200&h=200&fit=crop',
        '#E53935',
      ],
    );
    console.log('✅ Created sample tenant: Phở Hà Nội 24');

    // Insert sample location
    const locationId = '550e8400-e29b-41d4-a716-446655440010';
    await dataSource.query(
      `
      INSERT INTO locations (id, tenant_id, location_name, slug, address, city, district, is_active, is_primary)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `,
      [
        locationId,
        tenantId,
        'Chi nhánh Quận 1',
        'quan-1',
        '123 Nguyễn Huệ, Quận 1',
        'Hồ Chí Minh',
        'Quận 1',
        true,
        true,
      ],
    );
    console.log('✅ Created sample location: Chi nhánh Quận 1');

    // Insert sample menu
    const menuId = '550e8400-e29b-41d4-a716-446655440020';
    await dataSource.query(
      `
      INSERT INTO menus (id, tenant_id, name_vi, name_en, is_active)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [menuId, tenantId, 'Thực Đơn Chính', 'Main Menu', true],
    );
    console.log('✅ Created sample menu: Thực Đơn Chính');

    // Insert sample categories
    const categories = [
      {
        id: '550e8400-e29b-41d4-a716-446655440030',
        nameVi: 'Phở',
        nameEn: 'Pho',
        slug: 'pho',
        order: 1,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440031',
        nameVi: 'Bún',
        nameEn: 'Noodles',
        slug: 'bun',
        order: 2,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440032',
        nameVi: 'Cơm',
        nameEn: 'Rice Dishes',
        slug: 'com',
        order: 3,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440033',
        nameVi: 'Đồ Uống',
        nameEn: 'Drinks',
        slug: 'do-uong',
        order: 4,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440034',
        nameVi: 'Tráng Miệng',
        nameEn: 'Desserts',
        slug: 'trang-mieng',
        order: 5,
      },
    ];

    for (const cat of categories) {
      await dataSource.query(
        `
        INSERT INTO categories (id, tenant_id, menu_id, name_vi, name_en, slug, display_order, is_active)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
        [cat.id, tenantId, menuId, cat.nameVi, cat.nameEn, cat.slug, cat.order, true],
      );
    }
    console.log('✅ Created 5 sample categories');

    // Insert sample menu items
    const menuItems = [
      // Phở category
      {
        id: '550e8400-e29b-41d4-a716-446655440040',
        categoryId: '550e8400-e29b-41d4-a716-446655440030',
        nameVi: 'Phở Bò Tái',
        nameEn: 'Rare Beef Pho',
        slug: 'pho-bo-tai',
        descVi: 'Phở bò tái mềm, nước dùng thanh ngọt từ xương bò hầm 12 tiếng',
        descEn: 'Rare beef pho with light sweet broth simmered for 12 hours',
        price: 75000,
        order: 1,
        featured: true,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440041',
        categoryId: '550e8400-e29b-41d4-a716-446655440030',
        nameVi: 'Phở Bò Chín',
        nameEn: 'Well-done Beef Pho',
        slug: 'pho-bo-chin',
        descVi: 'Phở bò chín thái lát, nước dùng đậm đà',
        descEn: 'Sliced well-done beef pho with rich broth',
        price: 75000,
        order: 2,
        featured: false,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440042',
        categoryId: '550e8400-e29b-41d4-a716-446655440030',
        nameVi: 'Phở Gà',
        nameEn: 'Chicken Pho',
        slug: 'pho-ga',
        descVi: 'Phở gà ta thả vườn, thịt gà dai ngọt',
        descEn: 'Free-range chicken pho with tender meat',
        price: 65000,
        order: 3,
        featured: false,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440043',
        categoryId: '550e8400-e29b-41d4-a716-446655440030',
        nameVi: 'Phở Đặc Biệt',
        nameEn: 'Special Pho',
        slug: 'pho-dac-biet',
        descVi: 'Phở đặc biệt với tái, chín, nạm, gầu, gân',
        descEn: 'Special pho with all types of beef cuts',
        price: 95000,
        order: 4,
        featured: true,
      },
      // Bún category
      {
        id: '550e8400-e29b-41d4-a716-446655440044',
        categoryId: '550e8400-e29b-41d4-a716-446655440031',
        nameVi: 'Bún Bò Huế',
        nameEn: 'Hue Style Beef Noodles',
        slug: 'bun-bo-hue',
        descVi: 'Bún bò Huế cay nồng, giò heo, chả cua',
        descEn: 'Spicy Hue style beef noodles with pork knuckle and crab cake',
        price: 85000,
        order: 1,
        featured: true,
        spicy: true,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440045',
        categoryId: '550e8400-e29b-41d4-a716-446655440031',
        nameVi: 'Bún Chả Hà Nội',
        nameEn: 'Hanoi Grilled Pork Noodles',
        slug: 'bun-cha-ha-noi',
        descVi: 'Bún chả thịt nướng than hoa, nước mắm pha chua ngọt',
        descEn: 'Charcoal grilled pork with rice noodles and fish sauce',
        price: 70000,
        order: 2,
        featured: false,
      },
      // Cơm category
      {
        id: '550e8400-e29b-41d4-a716-446655440046',
        categoryId: '550e8400-e29b-41d4-a716-446655440032',
        nameVi: 'Cơm Tấm Sườn Bì Chả',
        nameEn: 'Broken Rice with Pork',
        slug: 'com-tam-suon-bi-cha',
        descVi: 'Cơm tấm sườn nướng, bì, chả trứng',
        descEn: 'Broken rice with grilled pork, shredded pork skin, and egg cake',
        price: 65000,
        order: 1,
        featured: false,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440047',
        categoryId: '550e8400-e29b-41d4-a716-446655440032',
        nameVi: 'Cơm Gà Xối Mỡ',
        nameEn: 'Crispy Chicken Rice',
        slug: 'com-ga-xoi-mo',
        descVi: 'Cơm gà xối mỡ giòn tan, da vàng ươm',
        descEn: 'Crispy fried chicken with rice, golden skin',
        price: 70000,
        order: 2,
        featured: false,
      },
      // Đồ Uống category
      {
        id: '550e8400-e29b-41d4-a716-446655440048',
        categoryId: '550e8400-e29b-41d4-a716-446655440033',
        nameVi: 'Cà Phê Sữa Đá',
        nameEn: 'Iced Milk Coffee',
        slug: 'ca-phe-sua-da',
        descVi: 'Cà phê phin truyền thống với sữa đặc Ông Thọ',
        descEn: 'Traditional drip coffee with condensed milk',
        price: 25000,
        order: 1,
        featured: true,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440049',
        categoryId: '550e8400-e29b-41d4-a716-446655440033',
        nameVi: 'Trà Đá',
        nameEn: 'Iced Tea',
        slug: 'tra-da',
        descVi: 'Trà đá miễn phí',
        descEn: 'Free iced tea',
        price: 0,
        order: 2,
        featured: false,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440050',
        categoryId: '550e8400-e29b-41d4-a716-446655440033',
        nameVi: 'Nước Chanh Đường',
        nameEn: 'Lemonade',
        slug: 'nuoc-chanh-duong',
        descVi: 'Nước chanh tươi đường phèn',
        descEn: 'Fresh lemonade with rock sugar',
        price: 20000,
        order: 3,
        featured: false,
      },
      // Tráng Miệng category
      {
        id: '550e8400-e29b-41d4-a716-446655440051',
        categoryId: '550e8400-e29b-41d4-a716-446655440034',
        nameVi: 'Chè Thái',
        nameEn: 'Thai Dessert Soup',
        slug: 'che-thai',
        descVi: 'Chè thái với nhãn, vải, mít, nước cốt dừa',
        descEn: 'Thai style dessert with longan, lychee, jackfruit, and coconut milk',
        price: 30000,
        order: 1,
        featured: false,
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440052',
        categoryId: '550e8400-e29b-41d4-a716-446655440034',
        nameVi: 'Bánh Flan',
        nameEn: 'Caramel Flan',
        slug: 'banh-flan',
        descVi: 'Bánh flan mềm mịn, caramel thơm ngọt',
        descEn: 'Smooth caramel flan',
        price: 25000,
        order: 2,
        featured: false,
      },
    ];

    for (const item of menuItems) {
      await dataSource.query(
        `
        INSERT INTO menu_items (
          id, tenant_id, category_id, name_vi, name_en, slug,
          description_vi, description_en, base_price, 
          display_order, is_featured, is_spicy, status, published_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'published', NOW())
      `,
        [
          item.id,
          tenantId,
          item.categoryId,
          item.nameVi,
          item.nameEn,
          item.slug,
          item.descVi,
          item.descEn,
          item.price,
          item.order,
          item.featured || false,
          item.spicy || false,
        ],
      );
    }
    console.log(`✅ Created ${menuItems.length} sample menu items`);

    // Insert sample variants for Phở
    const variants = [
      {
        itemId: '550e8400-e29b-41d4-a716-446655440040',
        nameVi: 'Tô nhỏ',
        nameEn: 'Small',
        adjustment: -10000,
        order: 1,
      },
      {
        itemId: '550e8400-e29b-41d4-a716-446655440040',
        nameVi: 'Tô thường',
        nameEn: 'Regular',
        adjustment: 0,
        order: 2,
      },
      {
        itemId: '550e8400-e29b-41d4-a716-446655440040',
        nameVi: 'Tô lớn',
        nameEn: 'Large',
        adjustment: 15000,
        order: 3,
      },
      {
        itemId: '550e8400-e29b-41d4-a716-446655440048',
        nameVi: 'Đá ít',
        nameEn: 'Less ice',
        adjustment: 0,
        order: 1,
      },
      {
        itemId: '550e8400-e29b-41d4-a716-446655440048',
        nameVi: 'Đá nhiều',
        nameEn: 'More ice',
        adjustment: 0,
        order: 2,
      },
    ];

    for (const variant of variants) {
      await dataSource.query(
        `
        INSERT INTO item_variants (
          tenant_id, menu_item_id, name_vi, name_en, 
          price_adjustment, display_order, is_available
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [
          tenantId,
          variant.itemId,
          variant.nameVi,
          variant.nameEn,
          variant.adjustment,
          variant.order,
          true,
        ],
      );
    }
    console.log(`✅ Created ${variants.length} sample variants`);

    // Insert sample add-ons
    const addOns = [
      {
        itemId: '550e8400-e29b-41d4-a716-446655440040',
        nameVi: 'Thêm thịt',
        nameEn: 'Extra meat',
        price: 20000,
        order: 1,
      },
      {
        itemId: '550e8400-e29b-41d4-a716-446655440040',
        nameVi: 'Thêm hành',
        nameEn: 'Extra onion',
        price: 5000,
        order: 2,
      },
      {
        itemId: '550e8400-e29b-41d4-a716-446655440040',
        nameVi: 'Trứng gà',
        nameEn: 'Egg',
        price: 10000,
        order: 3,
      },
      {
        itemId: '550e8400-e29b-41d4-a716-446655440048',
        nameVi: 'Thêm sữa',
        nameEn: 'Extra milk',
        price: 5000,
        order: 1,
      },
    ];

    for (const addOn of addOns) {
      await dataSource.query(
        `
        INSERT INTO item_add_ons (
          tenant_id, menu_item_id, name_vi, name_en, 
          price, display_order, is_available
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
        [tenantId, addOn.itemId, addOn.nameVi, addOn.nameEn, addOn.price, addOn.order, true],
      );
    }
    console.log(`✅ Created ${addOns.length} sample add-ons`);

    console.log('\n🎉 Seed completed successfully!');
    console.log(`   Tenant ID: ${tenantId}`);
    console.log(`   Test URL: GET /api/v1/menu/${tenantId}`);

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Seed failed:', error);
    await dataSource.destroy();
    process.exit(1);
  }
}

runSeed();
