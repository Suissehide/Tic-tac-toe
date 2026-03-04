import * as crypto from 'node:crypto'

import { type PrismaClient, Role } from '../../src/generated/client'

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, 'sha512')
    .toString('hex')

  return { hash, salt }
}

export default async function seedUsers(prisma: PrismaClient) {
  console.log('→ Seeding users...')

  const adminPass = hashPassword('Admin123!')
  const userPass = hashPassword('User123!')

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@qwetle.fr',
        password: adminPass.hash,
        salt: adminPass.salt,
        firstName: 'Léo',
        lastName: 'Couffinhal',
        role: Role.ADMIN,
      },
      {
        email: 'sabrina.bernadet@example.com',
        password: userPass.hash,
        salt: userPass.salt,
        firstName: 'Sabrina',
        lastName: 'Bernadet',
        role: Role.ADMIN,
      },
    ],
    skipDuplicates: true,
  })
}
