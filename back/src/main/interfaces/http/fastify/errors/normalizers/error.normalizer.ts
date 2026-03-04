import HttpStatusCodes from 'http-status-codes'
import type {
  ErrorNormalizer,
  ErrorResponse,
} from '../../../../../types/interfaces/http/fastify/errors'

const defaultErrorResponse: ErrorResponse = {
  error: 'Internal Error',
  message: 'Unknown error',
  statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR,
}

const isError = (error: unknown): error is Error => error instanceof Error

const errorNormalizer: ErrorNormalizer = (error) =>
  isError(error)
    ? {
        error: error.name,
        message: error.message,
      }
    : undefined

export { defaultErrorResponse, errorNormalizer }
