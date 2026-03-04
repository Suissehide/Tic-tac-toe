import type { FastifyPluginAsync } from 'fastify/types/plugin'
import fastifyPlugin from 'fastify-plugin'
import type {
  FastifyInstance,
  FastifyRequest,
  preHandlerAsyncHookHandler,
} from 'fastify'
import { hashSecret, verifyJwt } from '../../../../utils/auth-helper'
import fastifyCookie, { type FastifyCookieOptions } from '@fastify/cookie'
import Boom from '@hapi/boom'
import type { JwtPayload } from '../../../../types/interfaces/http/fastify/plugins/jwt.plugin'

declare module 'fastify' {
  export interface FastifyRequest {
    user: JwtPayload
  }
}

declare module 'fastify' {
  export interface FastifyInstance {
    verifySessionCookie: preHandlerAsyncHookHandler
  }
}

const cookiePreHandler = async function (
  this: FastifyInstance,
  request: FastifyRequest,
): Promise<void> {
  const { config } = this.iocContainer
  const { jwtSecret } = config
  if (!jwtSecret) {
    throw Boom.unauthorized('missing jwtSecret in config')
  }

  const accessToken = request.cookies.access_token
  if (!accessToken) {
    throw Boom.unauthorized('Missing cookie')
  }

  try {
    const jwtPayload = verifyJwt<JwtPayload>(accessToken, jwtSecret)
    this.log.trace({ jwtPayload }, 'JWT payload in cookiePreHandler')
    request.user = jwtPayload
    return await Promise.resolve()
  } catch {
    throw Boom.unauthorized('Invalid cookie')
  }
}

const cookiePlugin: FastifyPluginAsync = fastifyPlugin(
  async (fastify: FastifyInstance) => {
    const { iocContainer, log } = fastify
    const { config } = iocContainer
    const { cookieSecret } = config
    if (!cookieSecret) {
      throw new Error('missing cookieSecret in config')
    }
    log.trace('Registering cookie plugin')
    const secret = hashSecret(cookieSecret)
    const cookieOptions: FastifyCookieOptions = {
      secret,
      hook: 'onRequest',
    }
    await fastify.register(fastifyCookie, cookieOptions)
    fastify.decorate('verifySessionCookie', cookiePreHandler)
    log.debug('Cookie plugin successfully registered')
  },
)

export { cookiePlugin }
