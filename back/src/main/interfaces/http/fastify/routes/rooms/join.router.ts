import type { FastifyPluginAsync } from 'fastify'
import { z } from 'zod'
import { roomStore } from '../../../../../infra/room-store'

const bodySchema = z.object({
  pseudo: z.string().min(1).max(20),
  playerId: z.string().uuid(),
  spectator: z.boolean().default(false),
})

export const joinRoomRouter: FastifyPluginAsync = async (fastify) => {
  fastify.post<{ Params: { code: string } }>('/:code/join', async (request, reply) => {
    const { code } = request.params
    const parsed = bodySchema.safeParse(request.body)
    if (!parsed.success) {
      return reply.status(400).send({ error: 'Invalid body' })
    }

    const { pseudo, playerId, spectator } = parsed.data
    const room = roomStore.getRoom(code)
    if (!room) {
      return reply.status(404).send({ error: 'Room not found' })
    }

    if (!spectator && !roomStore.canJoinAsPlayer(room, playerId)) {
      return reply.status(409).send({ error: 'Room is full' })
    }

    if (!spectator) {
      const player = roomStore.joinAsPlayer(room, playerId, pseudo)
      return reply.send({
        role: player.mark,
        roomCode: code,
        players: Object.fromEntries(room.players.map((p) => [p.mark, p.pseudo])),
        status: room.status,
      })
    }

    return reply.send({
      role: 'spectator',
      roomCode: code,
      players: Object.fromEntries(room.players.map((p) => [p.mark, p.pseudo])),
      status: room.status,
    })
  })
}
