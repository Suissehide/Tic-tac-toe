import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { config as configDotenv } from 'dotenv'
import type { SignOptions } from 'jsonwebtoken'
import { levels } from 'pino'
import { z } from 'zod/v4'

import baseDir from '../base-dir'
import type { ConfigEnvVars } from '../types/application/config'
import { pickFromDict, toCamelCase } from '../utils/helper'

const isDevelopment = process.env.NODE_ENV === 'development'
const isTestRunning = process.env.JEST_RUNNING === 'true'
const envLocalPath = join(baseDir, '.env.local')
const envLocalExists = existsSync(envLocalPath)
if (envLocalExists) {
  configDotenv({
    debug: isDevelopment,
    encoding: 'utf8',
    path: envLocalPath,
  })
}
configDotenv({
  debug: isDevelopment,
  encoding: 'utf8',
  path: join(baseDir, '.env'),
})
const configSchema = z.object({
  baseDir: z.string(),
  isDevelopment: z.boolean(),
  host: z.string().optional(),
  corsOrigin: z.string().optional(),
  frontUrl: z.string(),

  jwtSecret: z.string().default('medisync-jwt'),
  jwtRefreshSecret: z.string().default('medisync-refresh'),
  jwtExpiresIn: z.custom<SignOptions['expiresIn']>().default('60m'),
  jwtRefreshExpiresIn: z.custom<SignOptions['expiresIn']>().default('180d'),

  cookieSecret: z.string().default('medisync-cookie'),

  logLevel: z.enum(['silent', ...Object.values(levels.labels)]).default('info'),
  port: z
    .string()
    .default('0')
    .transform((val) => Number.parseInt(val, 10)),
  mockServerPort: z
    .string()
    .default('4000')
    .transform((val) => Number.parseInt(val, 10)),
  isTestRunning: z.boolean().default(false),
})
const envVarNames = [
  'CORS_ORIGIN',
  'HOST',
  'FRONT_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'JWT_EXPIRES_IN',
  'JWT_REFRESH_EXPIRES_IN',
  'COOKIE_SECRET',
  'LOG_LEVEL',
  'PORT',
  'MOCK_SERVER_PORT',
]

const loadConfig = () => {
  const envConfig = pickFromDict<ConfigEnvVars>(
    process.env,
    envVarNames,
    toCamelCase,
  )
  envConfig.logLevel = envConfig.logLevel.toLowerCase()
  const configData = {
    ...envConfig,
    baseDir,
    isDevelopment,
    isTestRunning,
  }
  return configSchema.parse(configData)
}

export { loadConfig, configSchema }
