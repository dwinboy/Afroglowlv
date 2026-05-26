-- Afroglow PostgreSQL Initialization Script
-- Run once on first container startup

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password functions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create admin user (will be managed by Prisma migrations)
-- This script just ensures extensions are available
SELECT version();
