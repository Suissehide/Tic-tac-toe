import type {
  UserEntityRepo,
  UserUpdateEntityRepo,
} from '../infra/orm/repositories/user.repository.interface'

export type UserEntityDomain = UserEntityRepo
export type UserDTO = Pick<
  UserEntityRepo,
  'id' | 'email' | 'firstName' | 'lastName' | 'role'
>

export type UserUpdateEntityDomain = Pick<
  UserUpdateEntityRepo,
  'email' | 'firstName' | 'lastName' | 'role'
>

export interface UserDomainInterface {
  findAll: () => Promise<UserEntityDomain[]>
  findByID: (userID: string) => Promise<UserEntityDomain>
  update: (
    userID: string,
    userUpdateParams: UserUpdateEntityDomain,
  ) => Promise<UserEntityDomain>
  delete: (userID: string) => Promise<UserEntityDomain>
}
