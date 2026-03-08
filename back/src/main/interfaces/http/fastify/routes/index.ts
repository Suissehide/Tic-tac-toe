import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { authRouter } from './auth'
import { healthcheckRouter } from './healthcheck'
import { roomsRouter } from './rooms'
import { userRouter } from './user'

const routes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get('/', () => {
    return { name: 'API', status: 'running' }
  })

  await fastify.register(healthcheckRouter)
  await fastify.register(authRouter, { prefix: '/auth' })
  await fastify.register(userRouter, { prefix: '/user' })
  await fastify.register(roomsRouter, { prefix: '/rooms' })
}

export { routes }
