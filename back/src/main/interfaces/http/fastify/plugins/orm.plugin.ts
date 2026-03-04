import type { FastifyInstance } from 'fastify'
import fastifyPlugin from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify/types/plugin'

const ormPlugin: FastifyPluginAsync = fastifyPlugin(
  (fastify: FastifyInstance) => {
    const { postgresOrm } = fastify.iocContainer
    fastify.addHook('onReady', async () => {
      await postgresOrm.start()
    })
    fastify.addHook('onClose', async () => {
      await postgresOrm.stop()
    })
    return Promise.resolve()
  },
)

export { ormPlugin }
