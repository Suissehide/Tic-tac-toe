import type { PrismaClient, Soignant } from '../../src/generated/client'
import {
  PATHWAY_DATA,
  PATHWAYS,
  type SlotData,
  SOIGNANT_MAP,
} from './data/pathwayTemplate'

/**
 * Calculer offsetDays
 */
function calculateOffsetDays(weekCalendar: number, dayOfWeek: number): number {
  return weekCalendar * 7 + dayOfWeek
}

export default async function seedPathwayTemplates(
  prisma: PrismaClient,
  soignants: Soignant[],
) {
  console.log('→ Seeding pathway templates...')

  const createdTemplates = []

  for (const [pathwayKey, slots] of Object.entries(PATHWAY_DATA)) {
    const pathway = PATHWAYS[pathwayKey as keyof typeof PATHWAYS]

    console.log(`Creating pathway ${pathway.name} with ${slots.length} slots`)

    const slotTemplates = slots.map((slot) =>
      createSlotTemplate(slot, pathway.color, soignants),
    )

    const template = await prisma.pathwayTemplate.create({
      data: {
        name: pathway.name,
        color: pathway.color,
        slotTemplates: {
          create: slotTemplates,
        },
      },
      include: { slotTemplates: true },
    })

    createdTemplates.push(template)
  }

  console.log(`✓ Created ${createdTemplates.length} pathway templates`)
  console.log(
    `Total slots created: ${createdTemplates.reduce((sum, t) => sum + t.slotTemplates.length, 0)}`,
  )

  return createdTemplates
}

/**
 * Créer un slot template
 */
function createSlotTemplate(
  data: SlotData,
  color: string,
  soignants: Soignant[],
) {
  const soignantIndex = SOIGNANT_MAP[data.soignant] ?? 0
  const soignant = soignants[soignantIndex]

  const [startHour, startMinute] = data.startTime.split(':').map(Number)
  const [endHour, endMinute] = data.endTime.split(':').map(Number)

  const startTime = new Date('1970-01-01T00:00:00Z')
  startTime.setUTCHours(startHour, startMinute, 0, 0)

  const endTime = new Date('1970-01-01T00:00:00Z')
  endTime.setUTCHours(endHour, endMinute, 0, 0)

  const offsetDays = calculateOffsetDays(data.weekCalendar, data.dayOfWeek)

  return {
    startTime,
    endTime,
    offsetDays,
    isIndividual: data.isIndividual,
    color,
    description: data.title,
    thematic: data.title,
    location: data.location,
    soignantID: soignant.id,
  }
}
