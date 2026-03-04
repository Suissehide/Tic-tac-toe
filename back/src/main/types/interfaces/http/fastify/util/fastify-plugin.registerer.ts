import type {
  FastifyBaseLogger,
  FastifyInstance,
  FastifyTypeProvider,
  RawServerDefault,
} from 'fastify'
import type {
  FastifyPluginAsync,
  FastifyPluginCallback,
  FastifyPluginOptions,
} from 'fastify/types/plugin'
import type { FastifyRegisterOptions } from 'fastify/types/register'
import type { RawServerBase } from 'fastify/types/utils'

export interface FastifyPluginRegister<
  RawServer extends RawServerBase = RawServerDefault,
  TypeProviderDefault extends FastifyTypeProvider = FastifyTypeProvider,
  LoggerDefault extends FastifyBaseLogger = FastifyBaseLogger,
> {
  (
    fastify: FastifyInstance,
    name: string,
    plugin: FastifyPluginAsync | FastifyPluginCallback,
    opts?: FastifyRegisterOptions<FastifyPluginOptions>,
  ): Promise<void>
  <
    Options extends FastifyPluginOptions,
    Server extends RawServerBase = RawServer,
    TypeProvider extends FastifyTypeProvider = TypeProviderDefault,
    Logger extends FastifyBaseLogger = LoggerDefault,
  >(
    fastify: FastifyInstance,
    name: string,
    plugin:
      | FastifyPluginAsync<Options, Server, TypeProvider, Logger>
      | FastifyPluginCallback<Options, Server, TypeProvider, Logger>,
    opts?: FastifyRegisterOptions<Options>,
  ): Promise<void>
}
