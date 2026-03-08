import type { FastifyPluginCallback } from 'fastify'
import { z } from 'zod'

import { roomStore } from '../../../../../infra/room-store'

const bodySchema = z.object({
  pseudo: z.string().min(1).max(20),
  playerId: z.string().uuid(),
})

export const createRoomRouter: FastifyPluginCallback = (fastify) => {
  fastify.post('/', (request, reply) => {
    const parsed = bodySchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid body' })
    }
    const { pseudo, playerId } = parsed.data
    const room = roomStore.createRoom(playerId, pseudo)
    return reply.status(201).send({ roomCode: room.code })
  })
}
