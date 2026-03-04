import type { Boom } from '@hapi/boom'
import {
  formatZodErrorFromBoomError,
  isZodError,
} from '../errors/normalizers/boom.error.normalizer'

export class ErrorWithProps extends Error {
  extensions?: object
  statusCode?: number

  constructor(message: string, extensions?: object, statusCode?: number) {
    super(message)
    this.extensions = extensions
    this.statusCode = statusCode
  }
}

export const buildBoomError = (boomError: Boom): never => {
  let errorMessage = boomError.message
  if (isZodError(boomError)) {
    const { message } = formatZodErrorFromBoomError(boomError)
    errorMessage = message
  }
  throw new ErrorWithProps(
    errorMessage,
    { boomError },
    boomError.output.statusCode,
  )
}
