import type { Boom } from '@hapi/boom'

import type { ErrorWithProps } from '../../interfaces/http/fastify/util/boom-error-wrapper'

export interface InputErrorHandler {
  entityName: string
  error: unknown
  parentEntityName?: string
}

export interface ErrorHandlerInterface {
  errorFromPrismaError(inputErrorHandler: InputErrorHandler): ErrorWithProps
  boomErrorFromPrismaError(inputErrorHandler: InputErrorHandler): Boom<unknown>
}
