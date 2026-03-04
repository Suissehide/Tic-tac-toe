import { Boom, conflict, internal, notFound } from '@hapi/boom'

import { Prisma } from '../../generated/client'
import PrismaErrorCodes from '../infra/orm/error-codes-prisma'
import {
  buildBoomError,
  type ErrorWithProps,
} from '../interfaces/http/fastify/util/boom-error-wrapper'
import type { IocContainer } from '../types/application/ioc'
import type {
  ErrorHandlerInterface,
  InputErrorHandler,
} from '../types/utils/error-handler'
import type { Logger } from '../types/utils/logger'

class ErrorHandler implements ErrorHandlerInterface {
  private readonly logger: Logger

  constructor({ logger }: IocContainer) {
    this.logger = logger
  }

  boomErrorFromPrismaError({
    entityName,
    parentEntityName,
    error,
  }: InputErrorHandler): Boom<unknown> {
    let boomError: Boom<unknown> = internal(`Something went wrong! ${error}`)
    if (error instanceof Boom) {
      boomError = error
    } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const { code, message, meta } = error
      this.logger.debug(`Prisma Error [${code}] on ${entityName}: ${message}`)
      if (meta) {
        this.logger.debug(`Prisma meta: ${JSON.stringify(meta)}`)
      }
      if (code === PrismaErrorCodes.OPERATION_DEPENDS_ON_MISSING_RECORD) {
        const cause = meta?.cause ?? `${entityName} with this ID doesn't exist`
        boomError = notFound(`${entityName}: ${cause}`)
      }
      if (code === PrismaErrorCodes.FOREIGN_KEY_CONSTRAINT_FAILED) {
        const field = parentEntityName ?? meta?.constraint ?? 'unknown relation'
        boomError = conflict(
          `${entityName} cannot be deleted because it has related records (${field})`,
        )
      }
      if (code === PrismaErrorCodes.OPERATION_FAILED_ON_UNIQUE_CONSTRAINT) {
        const target = meta?.target ?? 'unknown field'
        boomError = conflict(`${entityName} already exists (${target})`)
      }
    }
    return boomError
  }

  errorFromPrismaError(errorInput: InputErrorHandler): ErrorWithProps {
    const boomError = this.boomErrorFromPrismaError(errorInput)
    return buildBoomError(boomError)
  }
}

export { ErrorHandler }
