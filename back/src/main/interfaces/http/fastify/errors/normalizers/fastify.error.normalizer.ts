import type { FastifyError } from 'fastify'

import type {
  ErrorNormalizer,
  ErrorResponse,
} from '../../../../../types/interfaces/http/fastify/errors'

const isFastifyError = (error: unknown): error is FastifyError => {
  const fastifyError = error as Partial<FastifyError>
  return (
    typeof fastifyError.code === 'string' &&
    typeof fastifyError.name === 'string' &&
    typeof fastifyError.statusCode === 'number'
  )
}

const fastifyErrorNormalizer: ErrorNormalizer = (
  error: unknown,
): Partial<ErrorResponse> | undefined =>
  isFastifyError(error)
    ? {
        error: error.code,
        message: error.message,
        statusCode: error.statusCode,
      }
    : undefined

export { fastifyErrorNormalizer, isFastifyError }
