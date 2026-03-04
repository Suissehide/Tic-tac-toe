import type { FastifyPluginAsync } from 'fastify'

import { fastifyAwilixPlugin } from '@fastify/awilix'

const awilixPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(fastifyAwilixPlugin, {
    disposeOnClose: true,
    disposeOnResponse: true,
    strictBooleanEnforced: true,
  })
}

export { awilixPlugin }
