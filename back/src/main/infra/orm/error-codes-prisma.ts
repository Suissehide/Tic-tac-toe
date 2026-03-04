// Source: https://www.prisma.io/docs/orm/reference/error-reference

const PrismaErrorCodes = {
  // Prisma Client (Query Engine) Errors
  OPERATION_DEPENDS_ON_MISSING_RECORD: 'P2025',
  OPERATION_FAILED_ON_UNIQUE_CONSTRAINT: 'P2002',
  FOREIGN_KEY_CONSTRAINT_FAILED: 'P2003',
}

export default PrismaErrorCodes
