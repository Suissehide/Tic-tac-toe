import type { Boom } from '@hapi/boom'
import { html } from 'common-tags'
import type {
  FastifyError,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from 'fastify'

import type {
  ErrorNormalizer,
  ErrorResponse,
} from '../../../../types/interfaces/http/fastify/errors'
import {
  defaultErrorResponse,
  errorNormalizer,
} from './normalizers/error.normalizer'

const normalizeResponse = (
  error: unknown,
  customErrorNormalizers: ErrorNormalizer[],
): ErrorResponse => {
  const initialCustomError = error as Partial<ErrorResponse>
  const customError = [...customErrorNormalizers, errorNormalizer].reduce<
    Partial<ErrorResponse>
  >((acc, normalizer) => normalizer(acc) ?? acc, initialCustomError)
  return {
    ...defaultErrorResponse,
    ...customError,
  }
}

const buildErrorHandler = (...errorNormalizers: ErrorNormalizer[]) => {
  return function (
    this: FastifyInstance,
    error: Boom | Error | FastifyError,
    request: FastifyRequest,
    reply: FastifyReply,
  ): string | { error: string; message: string; statusCode: number } {
    this.log.debug(error)
    const errorResponse = normalizeResponse(error, errorNormalizers)
    this.log.error(`Error: ${JSON.stringify(errorResponse)}`)
    reply.status(errorResponse.statusCode)
    const accept = request.accepts()
    if (accept.type('json', 'html') === 'html') {
      reply.type('text/html')
      return html`
        <html lang="en">
          <body>
            <h2>${errorResponse.error}</h2>
            <h3>${errorResponse.message}</h3>
          </body>
        </html>
      `
    }
    return {
      error: errorResponse.error,
      message: errorResponse.message,
      statusCode: errorResponse.statusCode,
    }
  }
}

export { buildErrorHandler, normalizeResponse }
