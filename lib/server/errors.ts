export class UnauthenticatedError extends Error {
  readonly code = 'UNAUTHENTICATED'
}

export class ForbiddenError extends Error {
  readonly code = 'FORBIDDEN'
}

export class NotFoundError extends Error {
  readonly code = 'NOT_FOUND'
}
