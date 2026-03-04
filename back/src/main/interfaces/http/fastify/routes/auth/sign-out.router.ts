import type { CookieSerializeOptions } from '@fastify/cookie'
import type { FastifyPluginAsync } from 'fastify'
import HttpStatusCodes from 'http-status-codes'

const signOutRouter: FastifyPluginAsync = (fastify) => {
  fastify.post('/', (__, reply) => {
    const cookieOptions: CookieSerializeOptions = {
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    }

    reply
      .clearCookie('access_token', cookieOptions)
      .clearCookie('refresh_token', cookieOptions)
      .status(HttpStatusCodes.NO_CONTENT)
      .send()
  })

  return Promise.resolve()
}

export { signOutRouter }
