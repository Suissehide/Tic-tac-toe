import type { Boom } from '@hapi/boom'
import type {
  ErrorNormalizer,
  ErrorResponse,
} from '../../../../../types/interfaces/http/fastify/errors'
import { ZodError } from 'zod/v4'

const isZodError = (error: unknown): error is ZodError => {
  return error instanceof ZodError
}

const formatZodErrorFromBoomError = (error: Boom & ZodError) => {
  const message = error.issues
    .map((issue) => {
      const pathPrefix = issue.path.length ? `${issue.path.join('/')}: ` : ''
      return `${pathPrefix}${issue.message}`
    })
    .join(' and ')
  return {
    error: error.output.payload.error,
    message,
    statusCode: error.output.payload.statusCode,
  }
}

const isBoomError = (error: unknown): error is Boom => {
  const boomError = error as { isBoom?: boolean }
  return !!boomError.isBoom
}

const boomErrorNormalizer: ErrorNormalizer = (
  error: unknown,
): Partial<ErrorResponse> | undefined => {
  if (isBoomError(error)) {
    if (isZodError(error)) {
      return formatZodErrorFromBoomError(error)
    }
    return {
      error: error.output.payload.error,
      message: error.output.payload.message,
      statusCode: error.output.payload.statusCode,
    }
  }
  return undefined
}

export {
  boomErrorNormalizer,
  isBoomError,
  isZodError,
  formatZodErrorFromBoomError,
}
