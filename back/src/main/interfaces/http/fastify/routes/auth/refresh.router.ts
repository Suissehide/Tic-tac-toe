import type { CookieSerializeOptions } from '@fastify/cookie'
import Boom from '@hapi/boom'
import type { FastifyPluginAsync } from 'fastify'

import { signInResponseSchema } from '../../schemas/auth.schema'

const refreshRouter: FastifyPluginAsync = (fastify) => {
  const { iocContainer } = fastify
  const { authDomain } = iocContainer

  fastify.post(
    '/',
    {
      schema: {
        response: {
          200: signInResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const refreshToken = request.cookies.refresh_token
      if (!refreshToken) {
        throw Boom.unauthorized('Missing refresh token')
      }
      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        email,
        firstName,
        lastName,
      } = await authDomain.refresh(refreshToken)

      const cookieOptions: CookieSerializeOptions = {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // strict
      }
      reply
        .setCookie('access_token', newAccessToken, {
          ...cookieOptions,
          maxAge: 1000 * 60 * 15, // 15 minutes in ms
        })
        .setCookie('refresh_token', newRefreshToken, {
          ...cookieOptions,
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in ms
        })

      return { email, firstName, lastName }
    },
  )
  return Promise.resolve()
}

export { refreshRouter }
