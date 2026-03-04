import Boom from '@hapi/boom'
import type { FastifyPluginAsync } from 'fastify'
import HttpStatusCodes from 'http-status-codes'

import {
  type CreateUserInput,
  registerResponseSchema,
  registerSchema,
} from '../../schemas/auth.schema'

const registerRouter: FastifyPluginAsync = (fastify) => {
  const { iocContainer } = fastify
  const { authDomain, logger } = iocContainer

  fastify.post<{ Body: CreateUserInput }>(
    '/',
    {
      schema: {
        body: registerSchema,
        response: {
          201: registerResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { success, data, error } = registerSchema.safeParse(request.body)
      if (!success) {
        logger.debug(
          `req body: ${JSON.stringify(request.body)}, error: ${error.message}`,
        )
        throw Boom.badRequest(error)
      }
      await authDomain.register(data)

      reply.status(HttpStatusCodes.CREATED)
      await reply.send()
    },
  )
  return Promise.resolve()
}

export { registerRouter }
