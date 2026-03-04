import { Role } from '../../../../generated/enums'
import type { IocContainer } from '../../../types/application/ioc'
import type {
  UserCreateEntityRepo,
  UserEntityRepo,
  UserRepositoryInterface,
  UserUpdateEntityRepo,
} from '../../../types/infra/orm/repositories/user.repository.interface'
import type { ErrorHandlerInterface } from '../../../types/utils/error-handler'
import { hashPassword } from '../../../utils/hash'
import type { PostgresPrismaClient } from '../postgres-client'

class UserRepository implements UserRepositoryInterface {
  private readonly prisma: PostgresPrismaClient
  private readonly errorHandler: ErrorHandlerInterface

  constructor({ postgresOrm, errorHandler }: IocContainer) {
    this.prisma = postgresOrm.prisma
    this.errorHandler = errorHandler
  }

  findAll(): Promise<UserEntityRepo[]> {
    return this.prisma.user.findMany()
  }

  async findByID(userID: string): Promise<UserEntityRepo> {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { id: userID },
      })
    } catch (err) {
      throw this.errorHandler.errorFromPrismaError({
        entityName: 'User',
        error: err,
      })
    }
  }

  async findByEmail(email: string): Promise<UserEntityRepo> {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { email },
      })
    } catch (err) {
      throw this.errorHandler.errorFromPrismaError({
        entityName: 'User',
        error: err,
      })
    }
  }

  async create(input: UserCreateEntityRepo): Promise<UserEntityRepo> {
    const { password, ...user } = input
    const { hash, salt } = hashPassword(password)
    try {
      return await this.prisma.user.create({
        data: {
          ...user,
          salt,
          password: hash,
          role: Role.NONE,
        },
      })
    } catch (err) {
      throw this.errorHandler.errorFromPrismaError({
        entityName: 'User',
        error: err,
      })
    }
  }

  async update(
    userID: string,
    userUpdateParams: UserUpdateEntityRepo,
  ): Promise<UserEntityRepo> {
    try {
      return await this.prisma.user.update({
        where: { id: userID },
        data: {
          ...userUpdateParams,
        },
      })
    } catch (err) {
      throw this.errorHandler.boomErrorFromPrismaError({
        entityName: 'User',
        error: err,
      })
    }
  }

  async delete(userID: string): Promise<UserEntityRepo> {
    try {
      return await this.prisma.user.delete({
        where: { id: userID },
      })
    } catch (err) {
      throw this.errorHandler.boomErrorFromPrismaError({
        entityName: 'User',
        error: err,
      })
    }
  }
}

export { UserRepository }
