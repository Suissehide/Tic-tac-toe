import type { PostgresOrm } from '../../infra/orm/postgres-client'
import type { AuthDomainInterface } from '../domain/auth.domain.interface'
import type { UserDomainInterface } from '../domain/user.domain.interface'
import type { HttpClientInterface } from '../infra/http/http-client'
import type { UserRepositoryInterface } from '../infra/orm/repositories/user.repository.interface'
import type { HttpServer } from '../interfaces/http/server'
import type { ErrorHandlerInterface } from '../utils/error-handler'
import type { Logger } from '../utils/logger'
import type { Config } from './config'

export interface IocContainer {
  readonly config: Config
  readonly httpServer: HttpServer
  readonly httpClient: HttpClientInterface
  readonly logger: Logger
  readonly errorHandler: ErrorHandlerInterface
  // DB
  readonly postgresOrm: PostgresOrm
  // Auth
  readonly authDomain: AuthDomainInterface
  // User
  readonly userDomain: UserDomainInterface
  readonly userRepository: UserRepositoryInterface
}
