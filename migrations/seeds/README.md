# Database Seeds

This directory contains seed data for development and testing.

## Running Seeds

```bash
# Run all seeds
npm run seed

# Run specific seed
npm run seed:run -- --class=TenantSeeder
```

## Seed Guidelines

### 1. Vietnamese Test Data

Use realistic Vietnamese business data:

```typescript
const products = [
  {
    name: 'Phở Bò Tái',
    price: 45000, // VND
    category: 'Món chính'
  },
  {
    name: 'Cà Phê Sữa Đá',
    price: 25000,
    category: 'Đồ uống'
  }
];
```

### 2. Tenant-Scoped Data

All seed data must be associated with a tenant:

```typescript
const tenant = await tenantRepository.findOne({ where: { slug: 'demo' } });

const product = productRepository.create({
  tenantId: tenant.id,
  name: 'Phở Bò',
  price: 45000
});
```

### 3. Idempotent Seeds

Seeds should be safe to run multiple times:

```typescript
// Check if data exists before creating
const existingProduct = await productRepository.findOne({
  where: { name: 'Phở Bò', tenantId }
});

if (!existingProduct) {
  await productRepository.save(product);
}
```

## Seed Order

Seeds should run in dependency order:

1. `TenantSeeder` - Create demo tenants
2. `UserSeeder` - Create admin and demo users
3. `CategorySeeder` - Create product categories
4. `ProductSeeder` - Create products
5. `CustomerSeeder` - Create demo customers
6. `OrderSeeder` - Create demo orders

## Example Seed

```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../modules/products/entities/product.entity';
import { Tenant } from '../modules/tenants/entities/tenant.entity';

@Injectable()
export class ProductSeeder {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async run() {
    const tenant = await this.tenantRepository.findOne({
      where: { slug: 'demo-restaurant' }
    });

    const products = [
      {
        name: 'Phở Bò Tái',
        description: 'Phở bò tái chín với nước dùng thơm ngon',
        price: 45000,
        category: 'Món chính',
        tenantId: tenant.id,
      },
      {
        name: 'Bún Chả Hà Nội',
        description: 'Bún chả truyền thống Hà Nội',
        price: 40000,
        category: 'Món chính',
        tenantId: tenant.id,
      },
    ];

    for (const productData of products) {
      const exists = await this.productRepository.findOne({
        where: { name: productData.name, tenantId: tenant.id }
      });

      if (!exists) {
        await this.productRepository.save(productData);
      }
    }
  }
}
```

## References

- [Backend Setup Guide](https://github.com/localstore-platform/specs/blob/v1.0-specs/architecture/backend-setup-guide.md)
- [Database Schema](https://github.com/localstore-platform/specs/blob/v1.0-specs/architecture/database-schema.md)
