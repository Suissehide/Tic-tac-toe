export interface ErrorResponse {
  error: string
  message: string
  statusCode: number
}

export type ErrorNormalizer = (
  error: unknown,
) => Partial<ErrorResponse> | undefined
