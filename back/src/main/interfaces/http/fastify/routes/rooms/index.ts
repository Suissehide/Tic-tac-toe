import type { FastifyPluginAsync } from 'fastify'

import { createRoomRouter } from './create.router'
import { joinRoomRouter } from './join.router'
import { wsRoomRouter } from './ws.router'

export const roomsRouter: FastifyPluginAsync = async (fastify) => {
  await fastify.register(createRoomRouter)
  await fastify.register(joinRoomRouter)
  await fastify.register(wsRoomRouter)
}
