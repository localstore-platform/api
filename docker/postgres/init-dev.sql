-- Development Database Initialization
-- Additional setup for development environment

\c localstore_dev;

-- Create development-specific schemas
CREATE SCHEMA IF NOT EXISTS testing;

-- Grant permissions for development user
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;

-- Log development setup completion
DO $$
BEGIN
    RAISE NOTICE 'Development database setup completed';
    RAISE NOTICE 'Connected to: localstore_dev';
END $$;
