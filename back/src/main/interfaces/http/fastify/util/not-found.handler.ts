import Boom from '@hapi/boom'
import type { FastifyRequest } from 'fastify'

const notFoundHandler = (request: FastifyRequest): void => {
  const { method, url } = request
  throw Boom.notFound(`Route ${method} ${url} not found`, {
    method,
    url,
  })
}

export { notFoundHandler }
