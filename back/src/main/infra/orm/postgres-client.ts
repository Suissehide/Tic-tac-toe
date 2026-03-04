import { PrismaPg } from '@prisma/adapter-pg'

import { Prisma, PrismaClient } from '../../../generated/client'
import type { IocContainer } from '../../types/application/ioc'
import type {
  PostgresORMInterface,
  PrimaTransactionClient,
} from '../../types/infra/orm/client'
import type { Logger } from '../../types/utils/logger'
import { normalizeEmail, normalizePhone } from '../../utils/helper'

const normalizerExtension = Prisma.defineExtension({
  name: 'normalizer',
  query: {
    $allOperations({ args, query }) {
      if (typeof args.data?.email === 'string') {
        args.data.email = normalizeEmail(args.data.email)
      }
      if (typeof args.data?.phoneNumber === 'string') {
        args.data.phoneNumber = normalizePhone(args.data.phoneNumber)
      }
      if (typeof args.where?.email === 'string') {
        args.where.email = normalizeEmail(args.where.email)
      }
      if (typeof args.where?.phoneNumber === 'string') {
        args.where.phoneNumber = normalizePhone(args.where.phoneNumber)
      }
      return query(args)
    },
  },
})

function getExtendedClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
  return new PrismaClient({ adapter }).$extends(normalizerExtension)
}

export type PostgresPrismaClient = ReturnType<typeof getExtendedClient>

class PostgresOrm implements PostgresORMInterface {
  private readonly logger: Logger
  readonly prisma: PostgresPrismaClient

  constructor({ logger }: IocContainer) {
    this.logger = logger
    this.prisma = getExtendedClient()
  }

  async start(): Promise<void> {
    this.logger.debug('Starting ORM client…')
    await this.prisma.$connect()
    this.logger.debug('ORM client started.')
  }

  async stop(): Promise<void> {
    this.logger.debug('Stopping ORM client…')
    await this.prisma.$disconnect()
    this.logger.debug('ORM client stopped.')
  }

  async healthCheck(): Promise<boolean> {
    this.logger.trace('Postgres health check triggered')
    try {
      await this.prisma.$queryRaw`SELECT 1;`
      return true
    } catch {
      return false
    }
  }

  executeWithTransactionClient<T>(
    functionWithTransactionClient: (
      transaction: PrimaTransactionClient,
    ) => Promise<T>,
    options?: {
      isolationLevel?: Prisma.TransactionIsolationLevel
      maxWait?: number
      timeout?: number
    },
  ): Promise<T> {
    return this.prisma.$transaction(functionWithTransactionClient, options)
  }
}

export { PostgresOrm }
