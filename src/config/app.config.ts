import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '8080', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api/v1',
  corsOrigins: process.env.CORS_ORIGINS?.split(',') ?? [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:5173',
  ],

  // Vietnamese locale defaults
  defaultLocale: process.env.DEFAULT_LOCALE ?? 'vi-VN',
  defaultCurrency: process.env.DEFAULT_CURRENCY ?? 'VND',
  defaultTimezone: process.env.DEFAULT_TIMEZONE ?? 'Asia/Ho_Chi_Minh',

  // Rate limiting
  rateLimitTtl: parseInt(process.env.RATE_LIMIT_TTL ?? '60', 10),
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX ?? '100', 10),
}));
