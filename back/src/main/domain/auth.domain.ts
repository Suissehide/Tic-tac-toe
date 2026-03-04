import Boom from '@hapi/boom'

import type { Config } from '../types/application/config'
import type { IocContainer } from '../types/application/ioc'
import type {
  AuthDomainInterface,
  CreateUserInput,
  RegisterResponse,
  SignInResponse,
  SignOutResponse,
} from '../types/domain/auth.domain.interface'
import type { UserRepositoryInterface } from '../types/infra/orm/repositories/user.repository.interface'
import type { JwtPayload } from '../types/interfaces/http/fastify/plugins/jwt.plugin'
import type { Logger } from '../types/utils/logger'
import { generateJwt, verifyJwt } from '../utils/auth-helper'
import { verifyPassword } from '../utils/hash'

class AuthDomain implements AuthDomainInterface {
  private readonly logger: Logger
  private readonly userRepository: UserRepositoryInterface
  private readonly config: Config

  // Constantes pour éviter les timing attacks
  private readonly DUMMY_SALT = '$2b$10$dummysaltfordummyhash'
  private readonly DUMMY_HASH =
    '$2b$10$dummysaltfordummyhash.dummyhashdummyhashdummyhash'

  constructor({ userRepository, config, logger }: IocContainer) {
    this.userRepository = userRepository
    this.config = config
    this.logger = logger
  }

  private generateTokens(userID: string): {
    accessToken: string
    refreshToken: string
  } {
    const { jwtSecret, jwtRefreshSecret, jwtExpiresIn, jwtRefreshExpiresIn } =
      this.config

    return {
      accessToken: generateJwt({ userID }, jwtSecret, {
        expiresIn: jwtExpiresIn,
      }),
      refreshToken: generateJwt({ userID }, jwtRefreshSecret, {
        expiresIn: jwtRefreshExpiresIn,
      }),
    }
  }

  async signIn(email: string, password: string): Promise<SignInResponse> {
    const user = await this.userRepository.findByEmail(email)

    // Protection contre les timing attacks : toujours vérifier le mot de passe
    const isValidPassword = verifyPassword({
      password,
      salt: user?.salt ?? this.DUMMY_SALT,
      hash: user?.password ?? this.DUMMY_HASH,
    })

    if (!user || !isValidPassword) {
      this.logger.warn(`Failed login attempt for email: ${email}`)
      throw Boom.unauthorized('Invalid email or password')
    }

    const { accessToken, refreshToken } = this.generateTokens(user.id)

    return {
      accessToken,
      refreshToken,
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }
  }

  async refresh(currentRefreshToken: string): Promise<SignInResponse> {
    const { jwtRefreshSecret } = this.config

    let payload: JwtPayload
    try {
      payload = verifyJwt<JwtPayload>(currentRefreshToken, jwtRefreshSecret)
    } catch (err) {
      this.logger.warn(`Refresh token invalid or expired: ${err}`)
      throw Boom.unauthorized('Invalid refresh token')
    }

    const user = await this.userRepository.findByID(payload.userID)
    if (!user) {
      this.logger.warn('User not found for this refresh token')
      throw Boom.unauthorized('Invalid refresh token')
    }

    const { accessToken, refreshToken } = this.generateTokens(user.id)

    return {
      accessToken,
      refreshToken,
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    }
  }

  async register(createUserInput: CreateUserInput): Promise<RegisterResponse> {
    await this.userRepository.create(createUserInput)
    return {
      success: true,
    }
  }

  signOut(): SignOutResponse {
    return {
      success: true,
    }
  }
}

export { AuthDomain }
