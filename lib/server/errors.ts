export type AppErrorCode =
  'unauthenticated' | 'forbidden' | 'not_found' | 'invalid_input'

const DEFAULT_MESSAGES: Record<AppErrorCode, string> = {
  unauthenticated: 'Sign in to continue',
  forbidden: "You don't have permission to do that",
  not_found: 'Not found',
  invalid_input: 'Some fields need fixing',
}

export class AppError extends Error {
  readonly code: AppErrorCode

  constructor(code: AppErrorCode, message?: string) {
    super(message ?? DEFAULT_MESSAGES[code])
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

// Field name to a short code the form translates, for example { slug: 'taken' }
export class ValidationError extends AppError {
  readonly fieldErrors: Record<string, string>

  constructor(fieldErrors: Record<string, string>) {
    super('invalid_input')
    this.fieldErrors = fieldErrors
  }
}

export const toErrorCode = (error: unknown): AppErrorCode | null =>
  error instanceof AppError ? error.code : null
