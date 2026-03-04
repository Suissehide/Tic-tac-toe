import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'

import { authRouter } from './auth'
import { healthcheckRouter } from './healthcheck'
import { userRouter } from './user'

const routes: FastifyPluginAsyncZod = async (fastify) => {
  fastify.get('/', async () => {
    return { name: 'API', status: 'running' }
  })

  await fastify.register(healthcheckRouter)
  await fastify.register(authRouter, { prefix: '/auth' })
  await fastify.register(userRouter, { prefix: '/user' })
}

export { routes }
