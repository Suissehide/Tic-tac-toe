import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../src/generated/client'
import seedPathwayTemplates from './seed/pathwayTemplate'
import seedPatients from './seed/patient'
import seedSoignants from './seed/soignant'
import seedTodos from './seed/todo'
import seedUsers from './seed/user'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Starting database seeding...')

  await seedUsers(prisma)
  const soignants = await seedSoignants(prisma)
  await seedPatients(prisma)
  await seedPathwayTemplates(prisma, soignants)
  await seedTodos(prisma)

  console.log('✅ Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
