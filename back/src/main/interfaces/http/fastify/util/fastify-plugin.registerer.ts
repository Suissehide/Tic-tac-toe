import type { FastifyInstance } from 'fastify'
import type {
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyPluginOptions,
} from 'fastify/types/plugin'
import type { FastifyRegisterOptions } from 'fastify/types/register'

import type { FastifyPluginRegister } from '../../../../types/interfaces/http/fastify/util/fastify-plugin.registerer'

const registerPlugin: FastifyPluginRegister = async <
  Options extends FastifyPluginOptions,
>(
  fastify: FastifyInstance,
  name: string,
  plugin: FastifyPluginAsync<Options> | FastifyPluginCallback<Options>,
  opts: FastifyRegisterOptions<Options>,
) => {
  const { log } = fastify
  log.trace(`Registering plugin: ${name}`)
  await fastify.register(plugin, opts)
  log.debug(`Plugin successfully registered: ${name}`)
}

export { registerPlugin }
