import type { z } from 'zod/v4'
import type { configSchema } from '../../application/config'

export type Config = z.infer<typeof configSchema>

export type ConfigEnvVars = Omit<Config, 'baseDir' | 'isDevelopment'>
