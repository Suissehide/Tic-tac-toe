import type { FastifyPluginAsync } from 'fastify'

const healthcheckRouter: FastifyPluginAsync = (fastify) => {
  fastify.get('/health', async () => {
    const { postgresOrm } = fastify.iocContainer
    const isPostgresHealthy = await postgresOrm.healthCheck()
    const postgresDatabaseStatus = isPostgresHealthy ? 'up' : 'down'
    return {
      web: { status: 'up' },
      postgres: { status: postgresDatabaseStatus },
    }
  })
  return Promise.resolve()
}

export { healthcheckRouter }
