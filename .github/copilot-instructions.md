# GitHub Copilot Instructions - LocalStore Platform API

## Repository Context

This is the **API repository** for LocalStore Platform - a Vietnamese-first, multi-tenant SaaS platform for small businesses.

**Key Information:**

- **Type:** NestJS Backend + Python AI Service
- **Primary Market:** Vietnamese small businesses (restaurants, street food vendors)
- **Language:** Vietnamese-first approach (vi-VN locale, VND currency)
- **Architecture:** Multi-tenant SaaS with Row-Level Security (RLS)
- **Specs Repository:** <https://github.com/localstore-platform/specs> (v1.1-specs)

## Tech Stack

- **Backend:** NestJS 10 + TypeScript 5
- **Database:** PostgreSQL 14 (with RLS) + TypeORM
- **Cache:** Redis 7
- **Queue:** Bull Queue
- **API:** REST + GraphQL (Apollo) + gRPC
- **Real-time:** Socket.io
- **AI Service:** Python 3.11 + FastAPI
- **Logging:** Winston

## Code Generation Guidelines

### Always Follow These Rules

1. **Check Specs First:** Before implementing features, reference `docs/SPEC_LINKS.md` for relevant specifications
2. **Vietnamese-First:** All user-facing text must be in Vietnamese (vi-VN)
3. **Currency:** Always use VND (₫) for monetary values
4. **Multi-Tenancy:** Every entity must include `tenant_id` for data isolation
5. **RLS Enforcement:** Database queries should respect Row-Level Security policies
6. **Error Messages:** Return Vietnamese error messages with English codes for debugging

### Code Style

```typescript
// ✅ Good: Vietnamese comments for business logic
/**
 * Tính tổng doanh thu theo ngày
 * Calculate daily revenue totals
 */
async calculateDailyRevenue(tenantId: string, date: Date): Promise<number> {
  // Implementation with tenant_id filter
}

// ✅ Good: VND currency formatting
const price = formatCurrency(50000, 'vi-VN', 'VND'); // "50.000 ₫"

// ❌ Bad: Missing tenant context
async getOrders(): Promise<Order[]> {
  return this.orderRepository.find();
}

// ✅ Good: Tenant-scoped queries
async getOrders(tenantId: string): Promise<Order[]> {
  return this.orderRepository.find({ where: { tenantId } });
}
```

### File Structure Conventions

```
src/
├── modules/          # Feature modules (products, orders, etc.)
│   ├── products/
│   │   ├── products.module.ts
│   │   ├── products.controller.ts
│   │   ├── products.service.ts
│   │   ├── products.resolver.ts (GraphQL)
│   │   ├── dto/
│   │   ├── entities/
│   │   └── tests/
├── common/           # Shared code
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   ├── interceptors/
│   └── pipes/
├── database/         # Database configuration
│   ├── migrations/
│   └── seeds/
└── config/           # Configuration modules
```

### TypeORM Entity Pattern

```typescript
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  tenantId: string; // Always include for RLS

  @Column({ type: 'varchar', length: 255 })
  name: string; // Vietnamese product name

  @Column({ type: 'decimal', precision: 12, scale: 0 })
  price: number; // VND, no decimal places

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Tenant)
  tenant: Tenant;
}
```

### API Response Pattern

```typescript
// ✅ Good: Structured response with Vietnamese messages
{
  "success": true,
  "data": { /* ... */ },
  "message": "Sản phẩm đã được tạo thành công",
  "code": "PRODUCT_CREATED"
}

// ❌ Bad: English messages
{
  "success": true,
  "message": "Product created successfully"
}
```

### Testing

- **Unit Tests:** Use Jest for services and utilities
- **E2E Tests:** Use Supertest for API endpoints
- **Test Data:** Use Vietnamese names and VND prices in fixtures
- **Coverage Target:** Minimum 80% for business logic

### Performance Considerations

- **Caching:** Cache frequently accessed data (product lists, user profiles) in Redis
- **Pagination:** Always paginate list endpoints (default: 20 items/page)
- **Indexes:** Ensure `tenant_id` is indexed on all multi-tenant tables
- **Query Optimization:** Use eager loading sparingly, prefer lazy loading with caching

### Security

- **Authentication:** JWT-based with refresh tokens
- **Authorization:** Role-based access control (RBAC) with tenant context
- **RLS:** Rely on PostgreSQL RLS policies for data isolation
- **Input Validation:** Use class-validator DTOs for all inputs
- **Rate Limiting:** Implement per-tenant rate limits

## Common Commands

```bash
# Development
npm run start:dev

# Database
npm run migration:generate -- -n MigrationName
npm run migration:run
npm run seed

# Testing
npm run test
npm run test:e2e
npm run test:cov

# Code Quality
npm run lint
npm run format
```

## Specification References

When implementing features, always reference these key specifications:

- **API Endpoints:** `architecture/api-specification.md` (lines 80-1200)
- **Database Schema:** `architecture/database-schema.md` (lines 80-500)
- **GraphQL Schema:** `architecture/graphql-schema.md` (lines 1-900)
- **Setup Guide:** `architecture/backend-setup-guide.md`

Full links available in `docs/SPEC_LINKS.md`.

## Git Workflow

**IMPORTANT**: Follow the git workflow defined in [docs/GIT_WORKFLOW.md](../docs/GIT_WORKFLOW.md).

Key rules:

- **Never commit directly to main branch**
- If on main, create a new branch before committing
- Branch naming: `<type>/<short-description>` (e.g., `feat/add-menu-api`)
- Commit changes logically (group related changes)
- After commits, push and create/update PR to main branch — **do not wait for confirmation**
- Use conventional commit messages

### Commit Granularity Principle

Each commit should answer ONE of these questions:

- "What single feature/fix does this add?"
- "What single purpose do these files serve together?"

**Rule of thumb:** If you need "and" to describe the commit, split it.

- ❌ `Add docs and config files` → Split
- ❌ `Update README and add environment template` → Split
- ✅ `Add GitHub PR template and CODEOWNERS` → OK (same purpose: GitHub config)
- ✅ `Add specification links documentation` → OK (single purpose)

## AI Service Integration

For AI-powered features (receipt OCR, analytics):

- **Language:** Python 3.11 + FastAPI
- **Communication:** gRPC for internal service calls
- **Location:** `/ai-service` directory
- **Model Format:** ONNX for production deployment

## Cost Optimization

Target: ~$20/month MVP deployment

- Use DigitalOcean/Hetzner for hosting
- Optimize Docker images for smaller size
- Implement aggressive caching strategies
- Use connection pooling for database
- Monitor and optimize expensive queries

## Questions?

Check `docs/SPEC_LINKS.md` or refer to the specs repository: <https://github.com/localstore-platform/specs>
