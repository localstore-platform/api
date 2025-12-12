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

    // Insert sample tenant - Logo from Google Stitch design
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
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCNKFNlOJ9dNTb79rAgR46TQ-bBt9DiSoFJgC5YOgMJyeQNmLgPUTUyEowAx2EX5C5nudiHab4L1q5KR9c8Zgtpe3rsXOXHgQ1KiqQ9jDJWlLwkTVdezSQ2upA5IsimJqwYNp9akvFLgiXR5kw7PAJkfyU1MWv9ko91DXw5nmXbtx-ObQQOvvrB4DkYm2m1BIrlIlQZfEJFNjV_-2GKK7Z4AJNMKlrv2LqsYUg_CgNhC9VQSs0UutNTm9ply9ER1_OJJCbozavyhA27',
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

    // Insert sample menu items with Google Stitch design images
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
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC3QyHcnil92lyB7KRCC3SKyw5_PVQ8jEUcGKu96BYEDJABkNJT8VR-4aHHEMLZrpBY7uV_bMxNB306VcZNbooCpqzeTFVarlIrPOWLZC4cF3KsDHb-0MuJRfCzzMZ6Ll0nL4J6vQ1v4cHUFWtO_sLwT_cP8ZAfGdexaBBjH8qvrrVxSG-QDrpM7ZkMqePyrG-gjqGuG9rM1asmq-rYWW2nglEibJQHdWR6Z_Eiue8CPx216arjCKF2oH-nxU1yggB2KGfvSBArOd-X',
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
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBQEVMHcS4nOY7jB9soqo8h5ZmGKKb0FtjHNsJJTYUyl9ec3hibx-kX6AnAnGbc0QsT6bStRQB8wiJFI3BsgXOQjT0TXE8C6Nkr9ld-R8Qg9P3EzuwFtA01w1NADiEfz5P4CdSmL9_oQUGJ6Nmbd99jgh8Uncm535JJGj0ALs6BB0WiLj_-TqYUM3e3uN7cluqCCX6yXxRAwB9xew61nU3u5syfhC0CUMjfBTh7KlaLeKP_sy5PItIQhNcfgsa6Y_sqXE-6dyDpJ_uG'
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
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCYQufSLSNGn_OrMPM2eGIyK_oLTuTYf6XyC-VhTECYeFfvsPO8f0J9v1UBOwRdlRMZSJpHOXgxz3nfr299DFGYbSDI6iMh3VvgpOSHL6uiSwSC0dtsWdAB6BlBVkwCiEa_Q2BEZ-vuFPDnvBG-Jm5es6AL22FEGs5274oN2dqDRjOS_1IG838nILET3IInIcs1xpL2Hss0jj5jtBIAEbBYRDly8d9ZLNkWOd9rxYnw3stRnBGIfraxaKqMFb5gEcfIlrDPA-OCfMXi',
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
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDTKqmQTlill8yQYc8pFZYbTCABQ37x2_cWjRFXBIi42ElSEVmIGAre3UE6vy9_RzWOeqsSLyjNpxPwmTqxf7IaPqTv8Iqwg9vMjIFRm-vYydbz89CHtaL4ygwzDbiCTzdwS-10Q55CK9E_yxl9R8TjUXc4owB_Rf3aCC6hZeXfeJuSNOGKemxLTePxoac8lLCHvTZi35JtD4FOjO6FPw9SABk7IjaNoDNgmfO6gOIW3LxtvHLIJSS6_vBem6JMos4NJcHkVzL0OJIF'
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
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCRZsyBGCRCdvMV5W1e0u3XgKHhVWJEtopSVpNZSIw9V9Fpu2xKqZUHDFMjN-T-0sLM5RZcv_9uG3xDGTqlCyFRatG1a5qbLADtcTTSv4RG_FpzqxwTqbCRPkR5flHySDP27NZsOuVLJ4ZJCuozEzEdm7P2rICzk_LSP0VlTMCgcRG-Vd34cFCl4uaP4mH00O2XpcxfgxhnpXgTZLkajLQn-lKfthMlVMMFl97Fxe7JxnuZicK_lja7qbXyccKiw_oAB4oN32b2bSVv',
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
        featured: true,
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuD7XIw94A6zSQYV06abt83p0H_QaaUpyAKXc3wwl8qPMqyAsqI27qqqqSF4WhJuFPGa8fcddp3VPl89RkvVZN761TXz3YY556FXzZf1AKrsEGseiWHcTfsjrwiap7cFNuzJ5wC2WahGGaxskpLOoP4jcgS7TctKTEx-2bQJmMccW-4nGW9BodmSuShtCcQ5WCOZa9p7FshKE4YkYloKrBaBZBAEuuKQaH9PRkZScl8Vxl8go1DtTjAz2QwX4O9D-f-4vwrSKx9uVlFg',
      },
      // Cơm category - Add Cơm Rang Dưa Bò as requested by Stitch design
      {
        id: '550e8400-e29b-41d4-a716-446655440046',
        categoryId: '550e8400-e29b-41d4-a716-446655440032',
        nameVi: 'Cơm Rang Dưa Bò',
        nameEn: 'Fried Rice with Beef',
        slug: 'com-rang-dua-bo',
        descVi: 'Cơm rang với thịt bò xào và dưa chua',
        descEn: 'Fried rice with beef and pickled mustard greens',
        price: 65000,
        order: 1,
        featured: true,
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuABkKfkMuELcWY6Jsji07AY5yVKb9n7WR_jJJv9npSb7zpDXGfGLjkqpOslFB3B7MH1hFOb3819pGYLTCEH1UDnmkq6rEy-7gGGkVFqc1Ggt6nNWl_33Jnp_bhStU0PSQaNlkp1kPbaZyq5sOUEDZEiU03Sc3M00V2n517_OigIPKx3cKx4jldeIqv3dJVkPH1ISLn6pnF7QRihPr5-CIboH3Iiy0cJCSNZOG4i2SqLLnL_QeeTRPl7IHtTZWlhQcCzk0PmW8VU4L3t',
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
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDGZVbVkJGTu9m7oOJs2p-lJpfH8DSx3E5QgbshqezgfhokTdIWKyQGe2lrpvrjtuhY7cUbkpkIgbMUdu3E9KMtD5viUekao0VjbKXZO9o2SGADb5PwFaK4iQLlcPvKFk_2iejFxTi7iOZhYet6DssOHphaFCYQtn53obKf2a8Kgg4d4gxmRD4JoZVbWDMTXPylo_LRwj6m3_YLV6Sv2MKKSq2SIYDgbp9eQKXX_JmRknAi-mFvSO0IrxzhsWMQyWe1V0Hqad65wCjD'
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
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuC43jRAgcd_rVQpLl-lRrTzdp4h8WQm-681kaGJ-afML7-SvvGZbvYtvPBoXTT0N2RLNbj-mUh5YBzoC_Nh5l5xsp8G0ZKOmIwiR9CBiodPAX0j8QaLAyMmpqWdj9gdg5n7VLSuX9hwn9QQtkk13L2305Hwb8jJ_5Ia4-qBvmZNX9nf5G-HIvIj3NK7Gql2YccuzEvhxbw4F8aVTC2PAmMgD9UlkRkW-R8i8Wm0Pzf5zdVgDEMfyIn2v9SiKVRJbhQQWV1HUN3Q69O3'
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
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBBsHr0Yophaiw5tDy7GRY1jsTi5PDe5KEBBwJ-nFyYSu-TNZU1LrZXpXetPRQ17sPgzRqpW7Z21cmMX5AIRhQTZsF3Rb1ni5gdZ-ih6q5RfFoBOiK2dqMLKhVNd0rq5BiXoxMqD0yq3_xFWzBCaycJxTMt5nSQ093rnDoPPYb5ruN5iTBZiEZKz_PtdR3q78tEMSDpGyhmF9Mq1pcvqv7hply4vSl0_ZUEJ06O7KO58Bm-qEtUvfYEAv_-S0nxGFWJgE07vQYg-Lnl'
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
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDLeOoHLWDF_kiK0wmPLSY53XC6zpYyI7OAVcZWDiU4rNDdi2P44rO4H6Fo1hYAITFp82sUJIjZ_kvWwtI7V0HLw_6WVmNfRWhuc0G-QZR9SIpddsCsCzkLc2YNot7Xi3unolVO0WLEIKeZ6Q6zKwHsB2cxZgeVQ0LK-p9YPs7gj5J9meYl3zCcoojuHejoR2wSQo9l91dPkryG6Yy8uf9PyZnPDUdSp8l6PybmstIj3-lzqXbofGFmCzok8Itg_ZOnwDXGw9sYXZlA'
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
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCx5YevRICNXWQDHyy8UVcxFGZKsB8kE6brZD04eEkle3RBdF3-my8Bvr5tf-FzA8Ki8YnAVLMYJrFOt8Hya5K-mvsP7zFxvri7GtglIGfy994IjwsXp8dzdrI0TmYZ93VFpAgVnTy0PGu3l7V35EY5_JRK4Sr4X2OTu1vq7ZS1i9a7BogJErDlagKWoGLc_iwpz5LpjBhT9YPT_ytajp2iMVdx1vqry5VVTCmAo3zkyXfgjX8RMuRkrbEUBACnXOiaO3JYVgzyLLK6'
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
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuApof-xQfAI1HK80Q25WnFCOkm9EtbxjudQn44wDHLlyROiaZUbrxz-gcMOIsmt7CRwGNDwWggIzgzWcPGE5WG6j0K_KepcfC5GfZvgAT_I9ytM4k7z-qoqb7AT9bSJLVKADF1Gpli1YxedBz55uZ86bipE_ncS4NhWn56mePoZtfPFBet03Bm8HjcOjCCa1iyNGH1xpB_whyIo22V0iOfdQdnG-5wKw5wnShR67tFIa2G2cOPT2tAzQKLvZYJyywCGSoE_LBX32fId'
      },
    ];

    for (const item of menuItems) {
      await dataSource.query(
        `
        INSERT INTO menu_items (
          id, tenant_id, category_id, name_vi, name_en, slug,
          description_vi, description_en, base_price, 
          display_order, is_featured, is_spicy, status, published_at, thumbnail_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'published', NOW(), $13)
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
          item.thumbnailUrl || null,
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

    // Insert sample add-ons with Google Stitch design images
    const addOns = [
      {
        itemId: '550e8400-e29b-41d4-a716-446655440040', // Phở Bò Tái
        nameVi: 'Quẩy Giòn',
        nameEn: 'Fried Dough Stick',
        price: 5000,
        order: 1,
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBdUF1JietdtL8qeIGT0vlIh5XUNuBsOGQzIFU3JDZGpjcuLANsV8XFyaqzM0zBq7Yo3t4G-0YWi_c55-k7ILjPgkW7MBhKk5zBVTjnDnSlY4gyOe-PSJhxA5ZXlhTJpulK2v5WLEzD0qXtcb4YlS1QvIIGoh5skfRA28-YYYBErYdoq7K9G565njIQvJIwRpS70EK9L9A222Z5ehkK-eNrQDaBvAixTfEJ6k06Sj4cmOu9EwswKDE1OLWiZ6-wvbUX7TFkVvJiwdvv',
      },
      {
        itemId: '550e8400-e29b-41d4-a716-446655440040', // Phở Bò Tái
        nameVi: 'Trứng Trần',
        nameEn: 'Poached Egg',
        price: 8000,
        order: 2,
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCives_kuc9ZR8HkCowwngI3JK-8IJkNX1wXzvhNDZCdAxoeQESKn8LkhTv3-7tIGFnqzL_W8ga3AyRtVc7FEWVh5u0Gj8Qnlk_Jnle4-WKGSIlUfYMzFyiLfiz2H_jGeUMlKsvenLjhIPu_Y48hpFDZr52DyaqNFrE4MKOgms29fQ9kBp6ZmuVgONYsAXY0D4HSM3ye-f2jiwTGpvm9UiLxwOtbwQCuY9XebIGK3RSadMHeT8YHlM0VFUQ9tRapXBuEQlo7csVsbwS',
      },
      {
        itemId: '550e8400-e29b-41d4-a716-446655440040', // Phở Bò Tái
        nameVi: 'Thêm Bò Tái',
        nameEn: 'Extra Rare Beef',
        price: 25000,
        order: 3,
        thumbnailUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBbbwbz1Nae7aCqpMjYWulaYtoYx7GWKH2fYzYlthirxvarD5Y3rFJm6hdYDeuPP4CVfPTX78o-fOzTDOwFziPndNERWWIDzsv0R4uvZV7tBCAT6xLOnYpRFrOtbyi02KpEnDdMSQFLNHMs6mypVRggFe5rLnO1mlmt6LGVUO4GScf3oj6tyCokX_hGv6fkq7XLhkhwkyhc58PfO5whU3Di17AoTnVpRgM4CfS3sPv2UzmrQupHmirJEc39kcbJ6n4TVUtVbJMK2CQ5',
      },
      {
        itemId: '550e8400-e29b-41d4-a716-446655440048', // Cà Phê Sữa Đá
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
          price, display_order, is_available, thumbnail_url
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      `,
        [
          tenantId,
          addOn.itemId,
          addOn.nameVi,
          addOn.nameEn,
          addOn.price,
          addOn.order,
          true,
          addOn.thumbnailUrl || null,
        ],
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
