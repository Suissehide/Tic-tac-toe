import { sign, verify } from 'jsonwebtoken'

import { createHash } from 'node:crypto'
import type { SignOptions } from 'jsonwebtoken'

type JwtOptions = SignOptions
type JwtPayload = string | Buffer | object

const hashSecret = (secret: string) => {
  return createHash('sha256').update(secret).digest('hex')
}

const generateJwt = <T extends JwtPayload>(
  payload: T,
  secret: string,
  options?: JwtOptions,
): string => {
  const encodedJwtSecret = hashSecret(secret)
  return sign(payload, encodedJwtSecret, options)
}

const verifyJwt = <T>(token: string, secret: string): T => {
  const encodedJwtSecret = hashSecret(secret)
  return verify(token, encodedJwtSecret) as T
}

export { hashSecret, generateJwt, verifyJwt }
