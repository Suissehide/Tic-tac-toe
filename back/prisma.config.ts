import 'dotenv/config'
import type { PrismaConfig } from 'prisma'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed:
      process.env.NODE_ENV === 'production'
        ? 'node lib/seed.js'
        : 'tsx prisma/seed.ts',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
} satisfies PrismaConfig)
