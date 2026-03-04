import type { CookieSerializeOptions } from '@fastify/cookie'
import Boom from '@hapi/boom'
import type { FastifyPluginAsync } from 'fastify'

import {
  type SignInInput,
  signInResponseSchema,
  signInSchema,
} from '../../schemas/auth.schema'

const signInRouter: FastifyPluginAsync = (fastify) => {
  const { iocContainer } = fastify
  const { authDomain, logger } = iocContainer

  fastify.post<{ Body: SignInInput }>(
    '/',
    {
      schema: {
        body: signInSchema,
        response: {
          201: signInResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { success, data, error } = signInSchema.safeParse(request.body)
      if (!success) {
        logger.debug(
          `req body: ${JSON.stringify(request.body)}, error: ${error.message}`,
        )
        throw Boom.badRequest(error)
      }
      const { email: inputEmail, password: inputPassword } = data

      const {
        accessToken,
        refreshToken,
        id,
        email,
        firstName,
        lastName,
        role,
      } = await authDomain.signIn(inputEmail, inputPassword)

      const cookieOptions: CookieSerializeOptions = {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax', // strict
      }
      reply
        .setCookie('access_token', accessToken, {
          ...cookieOptions,
          maxAge: 1000 * 60 * 15, // 15 minutes in ms
        })
        .setCookie('refresh_token', refreshToken, {
          ...cookieOptions,
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in ms
        })

      console.log('ROLE', role)

      return { id, email, firstName, lastName, role }
    },
  )
  return Promise.resolve()
}

export { signInRouter }
