# LocalStore Platform - API

🔧 Backend API for LocalStore Platform - A Vietnamese-first, multi-tenant SaaS platform for small businesses.

## Overview

This repository contains the backend API implementation for LocalStore Platform, built with NestJS and Python (AI service). It provides REST, GraphQL, and WebSocket endpoints for managing products, orders, customers, and analytics for Vietnamese restaurants and small businesses.

**Primary Market:** Vietnamese small businesses (restaurants, street food vendors, cafés)  
**Target Cost:** ~$20/month MVP deployment  
**Localization:** Vietnamese-first (vi-VN locale, VND currency)

## Architecture

- **Backend Framework:** NestJS 10 + TypeScript 5
- **Database:** PostgreSQL 14 with Row-Level Security (RLS)
- **Cache:** Redis 7
- **Queue:** Bull Queue for background jobs
- **APIs:** REST + GraphQL (Apollo) + gRPC
- **Real-time:** Socket.io for live updates
- **AI Service:** Python 3.11 + FastAPI (receipt OCR, analytics)
- **ORM:** TypeORM
- **Logging:** Winston

## Documentation

- **Specifications:** [localstore-platform/specs](https://github.com/localstore-platform/specs) (v1.1-specs)
- **Spec Links:** [docs/SPEC_LINKS.md](./docs/SPEC_LINKS.md) - Curated links to relevant specifications
- **Copilot Instructions:** [.github/copilot-instructions.md](./.github/copilot-instructions.md)

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- PostgreSQL 14+ (if running without Docker)
- Redis 7+ (if running without Docker)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/localstore-platform/api.git
    cd api
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up environment variables:**

    ```bash
    cp .env.example .env
    # Edit .env with your configuration
    ```

4. **Start services with Docker Compose:**

    ```bash
    # Start all services (API, PostgreSQL, Redis, AI Service)
    docker-compose up -d

    # For development with hot reload and debug tools
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
    ```

5. **Run database migrations:**

    ```bash
    npm run migration:run
    ```

6. **Seed initial data (optional):**

    ```bash
    npm run seed
    ```

### Development

```bash
# Development mode with hot reload
npm run start:dev

# Debug mode
npm run start:debug

# Watch mode
npm run start:watch
```

Access the API:

- **REST API:** <http://localhost:3000/api/v1>
- **GraphQL Playground:** <http://localhost:3000/graphql>
- **API Documentation:** <http://localhost:3000/api/docs> (Swagger)
- **AI Service:** <http://localhost:8000> (FastAPI)

Development tools (when using docker-compose.dev.yml):

- **PgAdmin:** <http://localhost:5050> (<admin@localstore.local> / admin)
- **Redis Commander:** <http://localhost:8081>

## Project Structure

```graph
api/
├── src/
│   ├── modules/          # Feature modules (products, orders, etc.)
│   ├── common/           # Shared utilities, decorators, guards
│   ├── database/         # Database configuration and seeds
│   ├── config/           # Configuration modules
│   └── main.ts           # Application entry point
├── ai-service/           # Python AI service (OCR, analytics)
├── migrations/           # TypeORM migrations
├── test/                 # E2E tests
├── docs/                 # Documentation
├── docker/               # Docker configuration files
└── kubernetes/           # Kubernetes manifests (production)
```

## Available Scripts

### Starting the Application

```bash
npm run start:dev         # Start in development mode
npm run start:debug       # Start with debugger
npm run build             # Build for production
npm run start:prod        # Start production build
```

### Database

```bash
npm run migration:create  # Create new migration
npm run migration:generate # Generate migration from entities
npm run migration:run     # Run pending migrations
npm run migration:revert  # Revert last migration
npm run seed              # Seed database with initial data
```

### Testing

```bash
npm run test              # Run unit tests
npm run test:watch        # Run tests in watch mode
npm run test:cov          # Run tests with coverage
npm run test:e2e          # Run E2E tests
```

### Code Quality

```bash
npm run lint              # Lint code
npm run lint:fix          # Fix linting errors
npm run format            # Format code with Prettier
npm run format:check      # Check code formatting
```

## Key Features

- ✅ **Multi-tenancy:** Complete data isolation with PostgreSQL RLS
- ✅ **Vietnamese Localization:** vi-VN locale, VND currency formatting
- ✅ **Authentication:** JWT-based with refresh tokens
- ✅ **Authorization:** Role-based access control (RBAC)
- ✅ **Real-time Updates:** WebSocket support for live data
- ✅ **Background Jobs:** Bull Queue for async processing
- ✅ **Caching:** Redis for performance optimization
- ✅ **AI Features:** Receipt OCR, sales analytics, predictions
- ✅ **API Documentation:** Auto-generated Swagger docs
- ✅ **Monitoring:** Winston logging + Sentry integration

## API Endpoints

### REST API

```markdown
POST   /api/v1/auth/login
POST   /api/v1/auth/register
GET    /api/v1/products
POST   /api/v1/products
GET    /api/v1/orders
POST   /api/v1/orders
GET    /api/v1/customers
GET    /api/v1/analytics/revenue
```

Full API specification: [architecture/api-specification.md](https://github.com/localstore-platform/specs/blob/v1.1-specs/architecture/api-specification.md)

### GraphQL

```graphql
query {
  products(tenantId: "xxx") {
    id
    name
    price
  }
}

mutation {
  createOrder(input: {...}) {
    id
    total
  }
}
```

Full GraphQL schema: [architecture/graphql-schema.md](https://github.com/localstore-platform/specs/blob/v1.1-specs/architecture/graphql-schema.md)

## Environment Variables

See [.env.example](./.env.example) for all available configuration options.

Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT signing secret
- `AI_SERVICE_URL` - AI service endpoint
- `DEFAULT_LOCALE` - Default locale (vi-VN)
- `DEFAULT_CURRENCY` - Default currency (VND)

## Testing Scripts

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
```

Target coverage: 80% for business logic modules.

## Deployment

### Development/Staging

```bash
# Build Docker image
docker build -t localstore-api:latest .

# Run with Docker Compose
docker-compose -f docker-compose.yml up -d
```

### Production

See [architecture/backend-setup-guide.md](https://github.com/localstore-platform/specs/blob/v1.1-specs/architecture/backend-setup-guide.md) (lines 1200-1600) for detailed production deployment instructions.

## Contributing

1. Check [docs/SPEC_LINKS.md](./docs/SPEC_LINKS.md) for relevant specifications
2. Create a feature branch from `main`
3. Implement changes following the specification
4. Write tests (unit + E2E)
5. Submit PR with reference to spec sections
6. Ensure all checks pass (lint, tests, coverage)

See [CONTRIBUTING.md](https://github.com/localstore-platform/specs/blob/v1.1-specs/CONTRIBUTING.md) for detailed guidelines.

## Multi-Tenancy

All API endpoints enforce tenant isolation:

- Every entity includes `tenant_id`
- PostgreSQL RLS policies enforce data isolation
- JWT tokens contain tenant context
- Queries automatically scoped to tenant

## Vietnamese Localization

- Default locale: `vi-VN`
- Currency: VND (₫) with no decimal places
- Date format: DD/MM/YYYY
- Time zone: Asia/Ho_Chi_Minh
- All user-facing messages in Vietnamese

## License

AGPL-3.0 - See [LICENSE](./LICENSE) for details.

## Links

- **Specifications:** <https://github.com/localstore-platform/specs>
- **Implementation Roadmap:** [planning/implementation-roadmap.md](https://github.com/localstore-platform/specs/blob/v1.1-specs/planning/implementation-roadmap.md)
- **Database Schema:** [architecture/database-schema.md](https://github.com/localstore-platform/specs/blob/v1.1-specs/architecture/database-schema.md)
- **Backend Setup Guide:** [architecture/backend-setup-guide.md](https://github.com/localstore-platform/specs/blob/v1.1-specs/architecture/backend-setup-guide.md)

## Support

For questions or issues:

1. Check [docs/SPEC_LINKS.md](./docs/SPEC_LINKS.md)
2. Review specifications at <https://github.com/localstore-platform/specs>
3. Open an issue using the provided templates

---

**Built for Vietnamese small businesses 🇻🇳!**
