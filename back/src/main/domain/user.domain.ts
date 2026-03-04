import type { PostgresPrismaClient } from '../infra/orm/postgres-client'
import type { IocContainer } from '../types/application/ioc'
import type {
  UserDomainInterface,
  UserEntityDomain,
  UserUpdateEntityDomain,
} from '../types/domain/user.domain.interface'
import type { UserRepositoryInterface } from '../types/infra/orm/repositories/user.repository.interface'

class UserDomain implements UserDomainInterface {
  private readonly prisma: PostgresPrismaClient
  private readonly userRepository: UserRepositoryInterface

  constructor({ postgresOrm, userRepository }: IocContainer) {
    this.prisma = postgresOrm.prisma
    this.userRepository = userRepository
  }

  findAll(): Promise<UserEntityDomain[]> {
    return this.userRepository.findAll()
  }

  findByID(userID: string): Promise<UserEntityDomain> {
    return this.userRepository.findByID(userID)
  }

  update(
    userID: string,
    userUpdateParams: UserUpdateEntityDomain,
  ): Promise<UserEntityDomain> {
    return this.userRepository.update(userID, userUpdateParams)
  }

  delete(userID: string): Promise<UserEntityDomain> {
    return this.userRepository.delete(userID)
  }
}

export { UserDomain }
