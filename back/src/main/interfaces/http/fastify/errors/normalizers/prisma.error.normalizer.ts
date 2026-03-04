import type { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'

import type {
  ErrorNormalizer,
  ErrorResponse,
} from '../../../../../types/interfaces/http/fastify/errors'

const isPrismaClientKnownRequestError = (
  error: unknown,
): error is PrismaClientKnownRequestError => {
  const prismaError = error as { type?: string }
  return prismaError.type === 'PrismaClientKnownRequestError'
}

const prismaErrorNormalizer: ErrorNormalizer = (
  error: unknown,
): Partial<ErrorResponse> | undefined =>
  isPrismaClientKnownRequestError(error)
    ? {
        error: error.name,
        message: error.message,
      }
    : undefined

export { prismaErrorNormalizer }
