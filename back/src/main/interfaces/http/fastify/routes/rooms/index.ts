import type { FastifyPluginAsync } from 'fastify'
import { createRoomRouter } from './create.router'
import { joinRoomRouter } from './join.router'

export const roomsRouter: FastifyPluginAsync = async (fastify) => {
  await fastify.register(createRoomRouter)
  await fastify.register(joinRoomRouter)
}
