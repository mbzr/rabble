import { type AppErrorCode } from './server/errors'

export type ErrorCode = AppErrorCode | 'invalid_input'

export type ActionResult<T = void> =
  { ok: true; data: T } | { ok: false; error: ErrorCode }
