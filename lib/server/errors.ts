export type AppErrorCode = 'unauthenticated' | 'forbidden' | 'not_found'

export class AppError extends Error {
  readonly code: AppErrorCode

  constructor(code: AppErrorCode, message?: string) {
    super(message)
    this.name = new.target.name
    this.code = code
  }
}

export class UnauthenticatedError extends AppError {
  constructor(message?: string) {
    super('unauthenticated', message)
  }
}

export class ForbiddenError extends AppError {
  constructor(message?: string) {
    super('forbidden', message)
  }
}

export class NotFoundError extends AppError {
  constructor(message?: string) {
    super('not_found', message)
  }
}

export const toErrorCode = (error: unknown): AppErrorCode | null => {
  if (error instanceof AppError) {
    return error.code
  }

  return null
}
