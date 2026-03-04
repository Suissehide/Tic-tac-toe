import type { PrismaClient } from '../../src/generated/client'
import { SOIGNANTS } from './data/soignant'

export default async function seedSoignants(prisma: PrismaClient) {
  console.log('→ Seeding soignants...')

  const createdSoignants = await Promise.all(
    SOIGNANTS.map((s) => prisma.soignant.create({ data: s })),
  )

  console.log(`✓ Created ${createdSoignants.length} soignants`)

  return createdSoignants
}
