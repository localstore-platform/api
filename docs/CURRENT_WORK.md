# Current Work – API Repository

> **Last Updated:** 2025-12-11  
> **Current Sprint:** Sprint 0.5 (Menu Demo)  
> **Sprint Spec:** [planning/sprint-0.5-menu-demo.md](https://github.com/localstore-platform/specs/blob/master/planning/sprint-0.5-menu-demo.md)

---

## Sprint 0.5 Stories (This Repo)

| Story | Description | Status | Notes |
|-------|-------------|--------|-------|
| 2.1 | Menu API Endpoints | ✅ Done | GET /menu/:tenantSlug, /:categorySlug, /:categorySlug/:itemSlug |
| 2.2 | Mock Data Seeder | ✅ Done | Vietnamese sample menu with 13 items |
| 2.3 | Health Check & CORS | ✅ Done | /health, /health/ready endpoints + CORS config |

**Status Legend:** 🔴 Not Started | 🟡 In Progress | ✅ Done | ⏸️ Blocked

---

## Post-Sprint Tasks

| Task | Description | Status | Notes |
|------|-------------|-----------|-------|
| Contracts Integration | Import shared types from @localstore/contracts | ✅ Done | v0.2.2 with CategoryItemsResponse |
| SEO-friendly URL Routing | Use slugs for tenant, category, and items | ✅ Done | /menu/:tenantSlug/:categorySlug/:itemSlug |

---

## Spec References

| Story | Specification | Lines |
|-------|--------------|-------|
| 2.1 | [api-specification.md](https://github.com/localstore-platform/specs/blob/master/architecture/api-specification.md) | L200-L280 |
| 2.2 | [database-schema.md](https://github.com/localstore-platform/specs/blob/master/architecture/database-schema.md) | L50-L150 |
| 2.3 | [api-specification.md](https://github.com/localstore-platform/specs/blob/master/architecture/api-specification.md) | L50-L80 |

---

## Current Focus

**✅ Sprint 0.5 Complete + v1.3-specs Updates Applied!**

All stories implemented. Tenant slug routing updated per v1.3-specs.

---

## Session Notes

### Session: 2025-12-12 (SEO-friendly URL Structure)

- Implemented full SEO-friendly URL structure:
  - `GET /menu/:tenantSlug` → Full menu
  - `GET /menu/:tenantSlug/categories` → Categories list
  - `GET /menu/:tenantSlug/:categorySlug` → Items in category
  - `GET /menu/:tenantSlug/:categorySlug/:itemSlug` → Item details
- Added `slug` column to Category and MenuItem entities
- Created migration for slug columns with Vietnamese accent removal
- Updated seed data with slugs (pho, bun, com, pho-bo-tai, etc.)
- Updated Postman collection with new URL patterns
- Cleaned up deprecated getMenuItem method (replaced by getMenuItemBySlug)

### Session: 2025-12-11 (v1.3-specs Sync + Contracts Update)

- Synced events from #agent-events channel
- Actions:
  - Updated `@localstore/contracts` from v0.2.0 to v0.2.1 (currency format fix: `75.000đ`)
  - Implemented v1.3-specs tenant slug routing (BREAKING CHANGE):
    - Changed `/menu/:tenantId` → `/menu/:tenantSlug`
    - Changed `/menu/:tenantId/categories` → `/menu/:tenantSlug/categories`
    - Changed `/menu/:tenantId/items/:itemId` → `/menu/:tenantSlug/items/:itemId`
  - Service now queries tenants by `slug` instead of `id`
  - Updated all unit tests to use tenantSlug
  - Updated Postman collection with tenantSlug variable
- Completed:
  - All 15 tests passing
  - Lint clean
- Next: Create PR for v1.3-specs compliance

### Session: 2025-12-06 (Sprint 0.5)

- Started: Story 2.1, 2.2, 2.3 (Full Sprint)
- Completed:
  - Initialized NestJS 10 project with TypeScript 5
  - Created Menu module with entities, DTOs, service, controller
  - Created Health module with /health and /health/ready endpoints
  - Set up TypeORM with PostgreSQL connection
  - Created database migration for menu tables
  - Created Vietnamese sample menu seed data (Phở Hà Nội 24)
  - Configured CORS for frontend origins
  - Added Swagger documentation
- Blockers: None
- Next: Run tests, create PR, notify other repos via Slack

---

## Implementation Summary

### Endpoints Created

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/health/ready` | Readiness check |
| GET | `/api/v1/menu/:tenantSlug` | Full menu with store info |
| GET | `/api/v1/menu/:tenantSlug/categories` | Categories with items |
| GET | `/api/v1/menu/:tenantSlug/:categorySlug` | Items in a category |
| GET | `/api/v1/menu/:tenantSlug/:categorySlug/:itemSlug` | Single item details |

### Files Created

```plaintext
src/
├── main.ts                           # App bootstrap with CORS, Swagger
├── app.module.ts                     # Root module
├── config/
│   ├── app.config.ts                 # App configuration
│   ├── database.config.ts            # Database configuration
│   ├── typeorm.config.ts             # TypeORM CLI config
│   └── index.ts
├── modules/
│   ├── health/
│   │   ├── health.controller.ts      # Health endpoints
│   │   ├── health.module.ts
│   │   └── index.ts
│   └── menu/
│       ├── dto/
│       │   ├── public-menu.dto.ts    # Response DTOs
│       │   ├── error-response.dto.ts # Error DTOs
│       │   └── index.ts
│       ├── entities/
│       │   ├── tenant.entity.ts
│       │   ├── location.entity.ts
│       │   ├── menu.entity.ts
│       │   ├── category.entity.ts
│       │   ├── menu-item.entity.ts
│       │   ├── item-variant.entity.ts
│       │   ├── item-add-on.entity.ts
│       │   ├── item-image.entity.ts
│       │   └── index.ts
│       ├── menu.controller.ts        # Public menu endpoints
│       ├── menu.service.ts           # Business logic
│       ├── menu.module.ts
│       └── index.ts
└── database/
    └── seeds/
        └── run-seed.ts               # Vietnamese sample data

migrations/
└── 1733500000000-CreateMenuTables.ts # Database schema
```

### Sample Data

- **Tenant:** Phở Hà Nội 24 (ID: 550e8400-e29b-41d4-a716-446655440000)
- **Categories:** Phở, Bún, Cơm, Đồ Uống, Tráng Miệng
- **Items:** 13 Vietnamese dishes with prices in VND
- **Variants:** Size options (nhỏ, thường, lớn)
- **Add-ons:** Extra meat, egg, milk options

---

## Blockers

None currently.

---

## Quick Commands

```bash
pnpm install              # Install dependencies
docker-compose up -d postgres redis  # Start DB and cache
pnpm run start:dev        # Start dev server (localhost:8080)
pnpm run test             # Run tests
pnpm run test:e2e         # Run e2e tests
pnpm run lint             # Lint code
pnpm run migration:run    # Run database migrations
pnpm run seed             # Seed database with sample data
pnpm run build            # Build for production
```

### Test API

```bash
# Health check
curl http://localhost:8080/api/v1/health

# Get full menu
curl http://localhost:8080/api/v1/menu/pho-hanoi-24

# Get categories
curl http://localhost:8080/api/v1/menu/pho-hanoi-24/categories

# Get items in a category
curl http://localhost:8080/api/v1/menu/pho-hanoi-24/pho

# Get specific item
curl http://localhost:8080/api/v1/menu/pho-hanoi-24/pho/pho-bo-tai
```
