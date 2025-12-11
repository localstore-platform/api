# Current Work – API Repository

> **Last Updated:** 2025-12-12  
> **Current Sprint:** Sprint 0.5 (Menu Demo) - **COMPLETE**  
> **Current Version:** v1.2.1  
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
| Contracts Integration | Import shared types from @localstore/contracts | ✅ Done | v0.3.1 with MenuItemDetailResponse |
| SEO-friendly URL Routing | Use slugs for tenant, category, and items | ✅ Done | /menu/:tenantSlug/:categorySlug/:itemSlug |
| Item Detail Response Wrapper | Wrap item detail per MenuItemDetailResponse | ✅ Done | PR #10 - item + category wrapper |

---

## Spec References

| Story | Specification | Lines |
|-------|--------------|-------|
| 2.1 | [api-specification.md](https://github.com/localstore-platform/specs/blob/master/architecture/api-specification.md) | L200-L280 |
| 2.2 | [database-schema.md](https://github.com/localstore-platform/specs/blob/master/architecture/database-schema.md) | L50-L150 |
| 2.3 | [api-specification.md](https://github.com/localstore-platform/specs/blob/master/architecture/api-specification.md) | L50-L80 |

---

## Current Focus

**✅ Contracts v0.3.1 Alignment Complete:**

All API responses now match @localstore/contracts v0.3.1 exactly, including MenuItemDetailResponse wrapper.

---

## Session Notes

### Session: 2025-12-12 (MenuItemDetailResponse Fix - PR #10)

**Issue from Slack:**

- `ISSUE_CREATED` from menu: Item detail API response not wrapped per MenuItemDetailResponse
- API returned item at root level
- Contracts v0.3.1 expects `{ item: {...}, category: {...} }` wrapper

**Changes:**

1. **Created MenuItemDetailResponseDto matching contracts v0.3.1:**
   - `MenuItemDetailResponseDto` with `item` + `category` wrapper
   - `MenuItemDetailDto` extends `PublicMenuItemDto` with `descriptionFull`, `images`, `variants`, `addOns`
   - `ItemDetailImageDto` (url, alt, isPrimary)
   - `ItemDetailVariantDto` (id, name, priceAdjustment, available)
   - `ItemDetailAddOnDto` (id, name, price, isRequired, available)
   - `ItemDetailCategoryDto` (id, name)

2. **Updated menu.service.ts:**
   - Added `mapMenuItemToDetailDto()` method for extended item mapping
   - `getMenuItemBySlug()` now returns wrapped response

3. **Updated controller and tests:**
   - Controller return type: `MenuItemDetailResponseDto`
   - Unit tests verify wrapped response structure
   - Postman tests updated for 32 assertions

4. **Replaced placeholder CDN URLs:**
   - Changed `cdn.localstore.vn` URLs to Unsplash free images
   - Logo: Vietnamese restaurant image
   - Items: Phở bowl images

**Tests:**

- ✅ 20 unit tests passing
- ✅ Lint clean

**PR:** <https://github.com/localstore-platform/api/pull/10>

---

### Session: 2025-12-12 (Contracts v0.3.0 Response Format Fix)

**Issue from Slack:**

- `ISSUE_CREATED` from menu: API store response doesn't match contracts
- API returned `businessName`, `address`, `phone`, `locale`, `currency`
- Contracts expect `name`, `slug`, `logoUrl`, `primaryColor`, `businessType`

**Changes:**

1. **Added branding fields to Tenant entity and database:**
   - Migration: `1749808800000-AddTenantBrandingFields.ts`
   - Added `logo_url` and `primary_color` columns to tenants table

2. **Updated DTOs to match contracts v0.3.0:**
   - `PublicMenuStoreInfoDto`: Now has `name`, `slug`, `logoUrl`, `primaryColor`, `businessType`
   - `PublicMenuResponseDto`: Now has `totalItems`, `currencyCode`, `lastUpdatedAt` (removed `meta`)
   - `PublicMenuCategoriesResponseDto`: Now has `store` and `categories` (removed `meta`)
   - `PublicMenuItemDto`: Now has `currencyCode`, `imageUrl`, `available`, `displayOrder` (removed `variants`, `addOns`, `images`)
   - `CategoryInfoDto`: Removed `slug` to match `Omit<MenuCategoryDto, 'items'>`

3. **Updated menu.service.ts:**
   - `mapTenantToStoreInfo()`: Returns contracts-aligned store info
   - `mapMenuItemToDto()`: Returns contracts-aligned item (removed variants/addOns mapping)
   - Removed unused helper methods (`mapVariants`, `mapAddOns`, `mapImages`)

4. **Updated seed data:**
   - Added `logo_url` and `primary_color` to sample tenant

5. **Updated tests:**
   - Unit tests: 20 passing
   - API tests: 28 assertions passing

**Tests:**

- ✅ 20 unit tests passing
- ✅ 28 API assertions passing
- ✅ Lint clean

### Session: 2025-12-12 (Contracts v0.3.0 Update)

**Event from Slack:**

- `PACKAGE_RELEASED` from contracts: v0.3.0 - camelCase migration (BREAKING)
- All DTOs now use camelCase instead of snake_case

**Changes:**

- Updated `@localstore/contracts` from v0.2.2 to v0.3.0
- API already uses camelCase internally (NestJS convention)
- No code changes required - tests pass

**Tests:**

- ✅ 20 unit tests passing
- ✅ 30 API assertions passing
- ✅ Lint clean

### Session: 2025-12-12 (v1.1.0 Release)

**Release Summary:**

- **Version:** 1.1.0
- **Branch:** feat/v1.3-tenant-slug-routing
- **Tests:** 20 unit tests + 30 API assertions passing

**Commits:**

1. `feat: add SEO-friendly slug routing for categories and items`
2. `feat: add slugs to seed data for Vietnamese menu items`
3. `test: update unit tests for SEO-friendly slug routing`
4. `docs: update documentation and Postman collection for v1.1.0`
5. `chore: bump version to 1.1.0, update contracts to v0.2.2`

**Changes:**

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
- Updated @localstore/contracts to v0.2.2

**Next Steps:**

- [ ] Push branch and create PR
- [ ] Merge to main
- [ ] Create tag v1.1.0
- [ ] Post release to Slack #agent-events

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
