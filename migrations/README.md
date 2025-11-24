# Database Migrations

This directory contains TypeORM migrations for the LocalStore Platform API.

## Migration Workflow

### Creating a New Migration

```bash
# Generate migration from entity changes
npm run migration:generate -- -n MigrationName

# Create empty migration
npm run migration:create -- -n MigrationName
```

### Running Migrations

```bash
# Run all pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

## Migration Guidelines

### 1. Always Include Tenant Context

Every table must include `tenant_id` for multi-tenancy:

```typescript
await queryRunner.query(`
  CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(12, 0) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
  )
`);
```

### 2. Create Indexes on tenant_id

```typescript
await queryRunner.query(`
  CREATE INDEX idx_products_tenant_id ON products(tenant_id)
`);
```

### 3. Apply RLS Policies

```typescript
// Enable RLS
await queryRunner.query(`ALTER TABLE products ENABLE ROW LEVEL SECURITY`);

// Create policy
await queryRunner.query(`
  CREATE POLICY tenant_isolation_policy ON products
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID)
`);
```

### 4. Handle Down Migration

Always implement the `down` method to reverse changes:

```typescript
public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`DROP TABLE IF EXISTS products CASCADE`);
}
```

### 5. Vietnamese Data Considerations

- Use `VARCHAR` with sufficient length for Vietnamese characters
- Default locale should be `vi-VN`
- Currency fields use `DECIMAL(12, 0)` for VND (no decimal places)

## Migration Naming Convention

Format: `YYYYMMDDHHMMSS-DescriptiveName.ts`

Examples:

- `20250101120000-CreateTenantsTable.ts`
- `20250101120100-CreateProductsTable.ts`
- `20250101120200-AddRlsPolicies.ts`

## Testing Migrations

```bash
# Test up migration
npm run migration:run

# Test down migration
npm run migration:revert

# Verify database state
npm run migration:show
```

## Production Deployment

1. Backup database before running migrations
2. Run migrations in maintenance window
3. Verify data integrity after migration
4. Monitor application logs for errors

## Common Patterns

### Adding a New Table

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  // Create table
  await queryRunner.query(`
    CREATE TABLE table_name (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      -- other columns
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `);

  // Create indexes
  await queryRunner.query(`
    CREATE INDEX idx_table_name_tenant_id ON table_name(tenant_id)
  `);

  // Enable RLS
  await queryRunner.query(`ALTER TABLE table_name ENABLE ROW LEVEL SECURITY`);

  // Create RLS policy
  await queryRunner.query(`
    CREATE POLICY tenant_isolation_policy ON table_name
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID)
  `);
}
```

### Modifying a Column

```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE products 
    ALTER COLUMN price TYPE DECIMAL(15, 0)
  `);
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.query(`
    ALTER TABLE products 
    ALTER COLUMN price TYPE DECIMAL(12, 0)
  `);
}
```

## References

- [Backend Setup Guide](https://github.com/localstore-platform/specs/blob/v1.0-specs/architecture/backend-setup-guide.md) (lines 400-600)
- [Database Schema](https://github.com/localstore-platform/specs/blob/v1.0-specs/architecture/database-schema.md)
