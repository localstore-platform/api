# Multi-stage Dockerfile for LocalStore API
# Supports development and production builds

# ============================================
# Base stage - common dependencies
# ============================================
FROM node:22-alpine AS base

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# ============================================
# Development stage
# ============================================
FROM base AS development

# Install all dependencies (including devDependencies)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Start development server
CMD ["pnpm", "run", "start:dev"]

# ============================================
# Build stage - compile TypeScript
# ============================================
FROM base AS build

# Install all dependencies for building
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm run build

# Build migrations (compile TS migrations to JS for production)
RUN pnpm run migration:build

# Prune devDependencies
RUN pnpm prune --prod

# ============================================
# Production stage - minimal runtime image
# ============================================
FROM node:22-alpine AS production

# Install pnpm for running
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy built application, compiled migrations, and production dependencies
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001 -G nodejs

USER nestjs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/v1/health || exit 1

# Start production server
CMD ["node", "dist/main.js"]
