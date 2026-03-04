import type { ITXClientDenyList } from '@prisma/client/runtime/client'

import type { Prisma } from '../../../../generated/client'
import type { PostgresPrismaClient } from '../../../infra/orm/postgres-client'

export interface PostgresORMInterface extends Orm {
  executeWithTransactionClient: <T>(
    functionWithTransactionClient: (
      transaction: PrimaTransactionClient,
    ) => Promise<T>,
    options?: {
      isolationLevel?: Prisma.TransactionIsolationLevel
      maxWait?: number
      timeout?: number
    },
  ) => Promise<T>
}

interface Orm {
  healthCheck: () => Promise<boolean>
  start: () => Promise<void>
  stop: () => Promise<void>
}

export type PrimaTransactionClient = Omit<
  PostgresPrismaClient,
  ITXClientDenyList
>
