# GitHub Copilot Instructions – API Repository

This extends the global instructions from the [specs repository](https://github.com/localstore-platform/specs/blob/v1.1-specs/.github/copilot-instructions.md).

## Repository Context

- **Repository:** api
- **Purpose:** NestJS backend serving REST, GraphQL, and WebSocket endpoints for the LocalStore Platform
- **Tech Stack:** NestJS 10, TypeScript 5, PostgreSQL 14, Redis 7, TypeORM, Bull Queue
- **Spec Version:** v1.1-specs

---

## 🚀 "Continue Work" Trigger

When the user says **"continue work"**, **"tiếp tục"**, or **"next task"**:

### Step 1: Read Local Progress

Read `docs/CURRENT_WORK.md` in this repository to understand:

- Current sprint and focus
- Which stories are assigned to this repo
- Current status of each story (🔴 Not Started / 🟡 In Progress / ✅ Done)
- Any blockers or notes from previous session

### Step 2: Identify Next Task

From CURRENT_WORK.md:

1. If any story is 🟡 In Progress → continue that story
2. Otherwise, pick the first 🔴 Not Started story
3. If all stories are ✅ Done → report completion and suggest next sprint

### Step 3: Load Specifications

1. Check the "Spec References" section in CURRENT_WORK.md for the spec link
2. Fetch and read the relevant specification section
3. Also check `docs/SPEC_LINKS.md` for additional context if needed

### Step 4: Implement

1. Follow the spec exactly
2. Apply code standards from this file (see below)
3. Multi-tenant isolation, Vietnamese locale support

### Step 5: Update Progress

After implementation, **update `docs/CURRENT_WORK.md`**:

- Change story status from 🔴 to 🟡 (in progress) or ✅ (done)
- Add notes about what was implemented
- Add any blockers or follow-up items
- Update "Last Updated" timestamp

### Step 6: Git Workflow

1. Create/use feature branch: `feat/<story-description>`
2. Commit with conventional message
3. Start Docker and run all tests:
   ```bash
   pnpm run docker:up:seed              # Start services with sample data
   pnpm run lint                        # Check code quality
   pnpm run test                        # Run unit tests
   pnpm run test:api                    # Run Postman/Newman API tests
   ```
4. Create PR when story is complete

### Step 7: Post Event to Slack

After completing a story, post an event to `#agent-events` (channel ID: `C0A1VSFQ9SS`):

```
📤 API_READY from api: [Story Title]
---
Details: [What endpoints/features were implemented]
Affected: [contracts, menu, mobile, dashboard]
Action: [What other repos should do - e.g., "Add types", "Integrate API"]
Spec: [Link to relevant spec section]
```

Use `slack_post_message` with channel_id `C0A1VSFQ9SS`.

### Step 8: Report

Tell the user:

- What story you worked on
- What was implemented
- Current status
- What's next
- Event posted to Slack

---

## 🔄 "Sync Events" Trigger

When the user says **"sync events"**, **"check events"**, or **"đồng bộ"**:

1. **Read recent messages** from `#agent-events` (channel ID: `C0A1VSFQ9SS`) using `slack_get_channel_history`
2. **Filter for events affecting this repo** (look for "api" in Affected field)
3. **Report relevant events** to user with recommended actions
4. **If SCHEMA_UPDATED from contracts** → suggest updating dependencies
5. **If SPEC_CHANGED from specs** → suggest reviewing spec changes

---

## Key Spec Files

| Spec File | Sections | Purpose |
|-----------|----------|---------|
| `architecture/api-specification.md` | Lines 80-1200 | REST endpoints |
| `architecture/api-specification.md` | Lines 1200-1800 | GraphQL schema |
| `architecture/backend-setup-guide.md` | Lines 1-600 | NestJS setup, TypeORM |
| `architecture/database-schema.md` | Lines 80-750 | Tables, RLS, indexes |
| `planning/sprint-0.5-menu-demo.md` | Stories 2.1-2.3 | Current sprint tasks |

Also check `docs/SPEC_LINKS.md` for curated links with line numbers.

---

## Build & Test Commands

```bash
pnpm install             # Install dependencies
pnpm run start:dev       # Start development server
pnpm run test            # Run unit tests
pnpm run test:e2e        # Run E2E tests
pnpm run test:api        # Run Postman/Newman API tests
pnpm run lint            # Lint code
pnpm run build           # Build for production
```

---

## Docker Commands

```bash
# Development (uses docker-compose.dev.yml)
pnpm run docker:up       # Start postgres, redis, migrate, and api
pnpm run docker:up:seed  # Start with sample data (includes seed)
pnpm run docker:down     # Stop and remove containers + volumes
pnpm run docker:reset    # Full reset with seed data
pnpm run docker:logs     # View API container logs

# Manual Docker Compose
docker compose -f docker-compose.dev.yml up -d              # Start dev environment
docker compose -f docker-compose.dev.yml --profile seed up  # Include seed data
docker compose -f docker-compose.dev.yml down -v            # Stop and clean volumes

# Production (uses docker-compose.yml for EC2)
docker compose up -d     # Start production environment
```

---

## Project Structure

```text
src/
├── modules/
│   ├── menu/           # Menu CRUD (Sprint 0.5 focus)
│   ├── auth/           # JWT + OTP authentication
│   ├── location/       # Multi-location management
│   └── analytics/      # Metrics and AI integration
├── common/
│   ├── decorators/     # @CurrentTenant, @Public
│   ├── guards/         # JwtAuthGuard, RolesGuard
│   ├── filters/        # Exception filters (Vietnamese messages)
│   └── interceptors/   # Logging, caching
├── database/
│   ├── migrations/     # TypeORM migrations
│   └── seeds/          # Vietnamese sample data
└── grpc/               # AI service client
```

---

## Code Standards

### NestJS Patterns

- Use modules for feature boundaries (`src/modules/menu/`)
- Controllers handle HTTP, Services contain business logic
- Use DTOs with class-validator for request/response validation
- Entities mirror database-schema.md exactly

### Multi-Tenancy

- **CRITICAL:** Always scope queries by `tenant_id`
- Use `@CurrentTenant()` decorator to get tenant from JWT
- RLS policies are set in PostgreSQL, but also validate in application layer

### TypeORM Conventions

- Entity names: singular, PascalCase (`MenuItem`, not `MenuItems`)
- Column names: snake_case in database, camelCase in TypeScript
- Always include `tenant_id` in entity definitions
- Use migrations for schema changes, never sync

### Error Handling

- Use NestJS exception filters
- Return Vietnamese error messages for user-facing errors
- Include error codes for programmatic handling
- Log errors with structured format (Winston)

### Vietnamese Localization

- Default locale: vi-VN
- Currency: VND with format 75.000₫
- Error messages: Vietnamese for user-facing, English for system logs

---

## Git Workflow

**CRITICAL:** Follow `docs/GIT_WORKFLOW.md`:

### Never Commit Directly to Main

- **Always** create a new branch for changes
- If currently on `main`, checkout to a new branch before committing
- Branch naming: `<type>/<short-description>`

### Branch Naming Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Maintenance, dependencies, tooling |
| `docs` | Documentation only |
| `refactor` | Code refactoring |
| `test` | Adding or updating tests |

### Logical Commits

- Group related changes into logical commits
- Each commit should represent a single logical change
- Use conventional commit format:

```text
<type>: <short description>

- Detail 1
- Detail 2
```

### Commit Granularity Principle

Each commit should answer ONE question: "What single feature/fix does this add?"

**Rule of thumb:** If you need "and" to describe the commit, split it.

- ❌ `Add docs and config files` → Split
- ✅ `Add GitHub PR template and CODEOWNERS` → OK (same purpose: GitHub config)

### Pull Request Workflow

After committing:

1. Push the branch to origin
2. Create a PR to `main` branch
3. If PR already exists, update the title and description
4. **Do not wait for confirmation** - push and create PR automatically

---

## Testing Requirements

- Unit tests for all services (Jest)
- E2E tests for API endpoints (Supertest)
- Test multi-tenant isolation
- Mock external services (Redis, AI service)

---

## Dependencies

- **Requires:** `contracts` repo for shared TypeScript types (@localstore/contracts)
- **Provides API for:** `menu` and `dashboard` repos
- **Communicates with:** `ml` repo via gRPC (future)

---

## 📦 DTO Coordination with Contracts

**CRITICAL:** When implementing features that require **new DTOs**:

1. **Do NOT create new DTOs locally** without coordinating with contracts
2. **Post a message to `#agent-events`** (channel ID: `C0A1VSFQ9SS`) requesting the DTO:

```
📋 DTO_REQUEST from api: [DTO Name]
---
Details: [Description of the DTO structure needed]
Endpoint: [The API endpoint that will use this DTO]
Fields: [List of fields with types]
Affected: contracts
Action: Create new DTO in @localstore/contracts
```

3. **Wait for contracts to publish** a new version with the DTO
4. **Update @localstore/contracts** dependency to the new version
5. **Import and use the DTO** from contracts

This ensures type synchronization across all services (api, menu, mobile, dashboard).

---

## Related Documentation

- [API Specification](https://github.com/localstore-platform/specs/blob/v1.1-specs/architecture/api-specification.md)
- [Database Schema](https://github.com/localstore-platform/specs/blob/v1.1-specs/architecture/database-schema.md)
- [Backend Setup Guide](https://github.com/localstore-platform/specs/blob/v1.1-specs/architecture/backend-setup-guide.md)
