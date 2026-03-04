import pino from 'pino'

import type { IocContainer } from '../../../types/application/ioc'
import type { Logger } from '../../../types/utils/logger'

class PinoLogger implements Logger {
  private readonly _pinoLogger: pino.Logger

  get pinoLogger(): pino.Logger {
    return this._pinoLogger
  }

  constructor({ config }: IocContainer) {
    this._pinoLogger = pino({
      level: config.logLevel,
      transport: {
        target: 'pino-pretty',
      },
    })
  }

  debug(message: string): void {
    this._pinoLogger.debug(message)
  }

  error(message: string): void {
    this._pinoLogger.error(message)
  }

  info(message: string): void {
    this._pinoLogger.info(message)
  }

  trace(message: string): void {
    this._pinoLogger.trace(message)
  }

  warn(message: string): void {
    this._pinoLogger.warn(message)
  }
}

export { PinoLogger }
