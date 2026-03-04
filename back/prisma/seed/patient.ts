import type { PrismaClient } from '../../src/generated/client'
import { PATIENTS } from './data/patient'

export default async function seedPatients(prisma: PrismaClient) {
  console.log('→ Seeding patients...')

  const createdPatients = await Promise.all(
    PATIENTS.map((p) =>
      prisma.patient.create({
        data: {
          ...p,
          createDate: new Date(),
        },
      }),
    ),
  )

  console.log(`✓ Created ${createdPatients.length} patients`)

  return createdPatients
}
