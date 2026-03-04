import type { PrismaClient } from '../../src/generated/client'

export default async function seedTodos(prisma: PrismaClient) {
  console.log('→ Seeding todos...')

  await prisma.todo.createMany({
    data: [
      {
        title: 'Vérifier le dossier médical de Claire',
        description: 'S’assurer que les derniers résultats sont à jour.',
        createDate: new Date(),
        completed: false,
      },
      {
        title: 'Préparer atelier nutrition',
        description:
          'Réviser la présentation PowerPoint et les supports imprimés.',
        createDate: new Date(),
        completed: true,
      },
    ],
  })
}
