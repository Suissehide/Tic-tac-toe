import type {
  Prisma,
  User,
} from '../../../../../generated/client'

export type UserEntityRepo = User
export type UserCreateEntityRepo = Pick<
  UserEntityRepo,
  'email' | 'password'
> & { firstName?: string; lastName?: string }
export type UserUpdateEntityRepo = Pick<
  Prisma.UserUncheckedUpdateInput,
  'email' | 'role'
> & { firstName?: string; lastName?: string }

export interface UserRepositoryInterface {
  findAll: () => Promise<UserEntityRepo[]>
  findByID: (userId: string) => Promise<UserEntityRepo>
  findByEmail: (email: string) => Promise<UserEntityRepo>
  create: (user: UserCreateEntityRepo) => Promise<UserEntityRepo>
  update: (
    userID: string,
    userUpdateParams: UserUpdateEntityRepo,
  ) => Promise<UserEntityRepo>
  delete: (userID: string) => Promise<UserEntityRepo>
}
