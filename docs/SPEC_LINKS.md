# Specification Links

This document provides curated links to relevant specifications from the [localstore-platform/specs](https://github.com/localstore-platform/specs) repository (v1.1-specs).

## Core Specifications

### Architecture

- [API Specification](https://github.com/localstore-platform/specs/blob/v1.1-specs/architecture/api-specification.md)
  - REST endpoints (lines 80-1200)
  - GraphQL schema (lines 1200-1800)
  - gRPC service definitions (lines 1800-2000)

- [Backend Setup Guide](https://github.com/localstore-platform/specs/blob/v1.1-specs/architecture/backend-setup-guide.md)
  - Development environment (lines 1-200)
  - Docker Compose setup (lines 200-400)
  - Database migrations (lines 400-600)
  - Testing strategy (lines 800-1000)
  - Production deployment (lines 1200-1600)

- [Database Schema](https://github.com/localstore-platform/specs/blob/v1.1-specs/architecture/database-schema.md)
  - Core tables (lines 80-500)
  - RLS policies (lines 500-650)
  - Indexes (lines 650-750)
  - Analytics extension (see database-schema-analytics-extension.md)

- [GraphQL Schema](https://github.com/localstore-platform/specs/blob/v1.1-specs/architecture/graphql-schema.md)
  - Type definitions (lines 1-400)
  - Queries (lines 400-600)
  - Mutations (lines 600-800)
  - Subscriptions (lines 800-900)

### Implementation

- [Implementation Roadmap](https://github.com/localstore-platform/specs/blob/v1.1-specs/planning/implementation-roadmap.md)
- [Sprint 1 Plan](https://github.com/localstore-platform/specs/blob/v1.1-specs/planning/sprint-1-implementation.md)
- [MVP Acceptance Criteria](https://github.com/localstore-platform/specs/blob/v1.1-specs/planning/mvp-acceptance-criteria.md)

## Quick Reference

### Key Technical Constraints

- **Primary Market:** Vietnamese small businesses (restaurants, street food vendors)
- **Language:** Vietnamese-first (vi-VN locale, VND currency)
- **Architecture:** Multi-tenant SaaS platform
- **Cost Target:** ~$20/month MVP deployment
- **Database:** PostgreSQL 14 with Row-Level Security (RLS)
- **Caching:** Redis 7
- **Queue:** Bull Queue for background jobs

### Development Workflow

1. Check specs repository for feature requirements
2. Review relevant specification sections
3. Implement following patterns in Backend Setup Guide
4. Write tests per Testing Strategy guidelines
5. Submit PR with reference to spec sections implemented

## Additional Resources

- [Project README](https://github.com/localstore-platform/specs/blob/v1.1-specs/README.md)
- [Architecture Overview](https://github.com/localstore-platform/specs/blob/v1.1-specs/architecture/overview.md)
- [Contributing Guidelines](https://github.com/localstore-platform/specs/blob/v1.1-specs/CONTRIBUTING.md)
