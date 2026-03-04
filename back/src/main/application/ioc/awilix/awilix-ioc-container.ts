import { type Cradle, diContainer } from '@fastify/awilix'
import { type AwilixContainer, asClass, asValue } from 'awilix'
import type { Resolver } from 'awilix/lib/resolvers'
import { AuthDomain } from '../../../domain/auth.domain'
import { UserDomain } from '../../../domain/user.domain'
import { HttpClient } from '../../../infra/http/http-client'
import { PinoLogger } from '../../../infra/logger/pino/pino-logger'
import { PostgresOrm } from '../../../infra/orm/postgres-client'
import { UserRepository } from '../../../infra/orm/repositories/user.repository'
import { FastifyHttpServer } from '../../../interfaces/http/fastify/fastify-http-server'
import type { Config } from '../../../types/application/config'
import type { IocContainer } from '../../../types/application/ioc'
import { ErrorHandler } from '../../../utils/error-handler'
import { recordToString } from '../../../utils/helper'

declare module '@fastify/awilix' {
  interface Cradle extends IocContainer {}
}

class AwilixIocContainer {
  get instances() {
    return diContainer.cradle
  }

  constructor(config: Config) {
    // Config
    this.#registerConfig(config)
    // Logger
    const container = this.#registerLogger()
    const logger = container.resolve('logger')
    logger.debug('Initializing IoC container…')
    logger.debug(`Loaded config:\n\t${recordToString(config)}`)
    // DB
    this.#registerPrismaOrm()
    // Auth
    this.#registerAuthDomain()
    // User
    this.#registerUserDomain()
    this.#registerUserRepository()

    // Server
    this.#registerHttpServer()
    this.#registerHttpClient()
    // Error
    this.registerErrorHandler()

    logger.info('IoC container initialized.')
  }

  private register<T>(
    value: keyof IocContainer,
    register: Resolver<T>,
  ): AwilixContainer<Cradle> {
    return diContainer.register(value, register)
  }

  #registerConfig(config: Config): void {
    this.register('config', asValue(config))
  }

  #registerHttpClient(): void {
    this.register('httpClient', asClass(HttpClient).singleton())
  }
  #registerHttpServer(): void {
    this.register('httpServer', asClass(FastifyHttpServer).singleton())
  }

  #registerLogger(): AwilixContainer<Cradle> {
    return this.register('logger', asClass(PinoLogger).singleton())
  }

  #registerPrismaOrm(): void {
    this.register('postgresOrm', asClass(PostgresOrm).singleton())
  }

  // Error
  private registerErrorHandler(): void {
    this.register('errorHandler', asClass(ErrorHandler).singleton())
  }

  // Auth
  #registerAuthDomain(): void {
    this.register('authDomain', asClass(AuthDomain).singleton())
  }

  // User
  #registerUserDomain(): void {
    this.register('userDomain', asClass(UserDomain).singleton())
  }
  #registerUserRepository(): void {
    this.register('userRepository', asClass(UserRepository).singleton())
  }
}

export { AwilixIocContainer }
