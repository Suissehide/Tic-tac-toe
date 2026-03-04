import type { FastifyJWTOptions, VerifyPayloadType } from '@fastify/jwt'
import fastifyJwt from '@fastify/jwt'
import Boom from '@hapi/boom'
import type {
  FastifyInstance,
  FastifyRequest,
  preHandlerAsyncHookHandler,
} from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify/types/plugin'

import type { JwtPayload } from '../../../../types/interfaces/http/fastify/plugins/jwt.plugin'
import { hashSecret } from '../../../../utils/auth-helper'

declare module '@fastify/jwt' {
  export interface FastifyJWT {
    payload: JwtPayload
  }
}

declare module 'fastify' {
  export interface FastifyInstance {
    verifyJWT: preHandlerAsyncHookHandler
  }
}

const jwtPreHandler: preHandlerAsyncHookHandler = async function (
  this: FastifyInstance,
  request: FastifyRequest,
): Promise<VerifyPayloadType> {
  try {
    const jwtPayload = await request.jwtVerify<JwtPayload>()
    this.log.trace({ jwtPayload }, 'JWT payload in jwtPreHandler')
    return jwtPayload
  } catch {
    throw Boom.unauthorized()
  }
}

const jwtPlugin: FastifyPluginAsync = fastifyPlugin(
  async (fastify: FastifyInstance) => {
    const { iocContainer, log } = fastify
    const { config } = iocContainer
    const { jwtSecret } = config
    if (!jwtSecret) {
      throw new Error('missing jwtSecret in config')
    }
    log.trace('Registering jwt plugin')
    const secret = hashSecret(jwtSecret)
    const jwtOptions: FastifyJWTOptions = {
      secret,
    }
    await fastify.register(fastifyJwt, jwtOptions)
    fastify.decorate('verifyJWT', jwtPreHandler)
    log.debug('Jwt plugin successfully registered')
  },
)

export { jwtPlugin }
