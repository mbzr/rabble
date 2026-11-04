import { authClient } from '@/lib/auth-client'
import type messages from '@/messages/en.json'

type ErrorKey = keyof (typeof messages)['Errors']

const authErrorKeys = {
  INVALID_EMAIL: 'invalidEmail',
  INVALID_EMAIL_OR_PASSWORD: 'invalidEmailOrPassword',
  INVALID_PASSWORD: 'invalidPassword',
  PASSWORD_TOO_LONG: 'passwordTooLong',
  PASSWORD_TOO_SHORT: 'passwordTooShort',
  USER_ALREADY_EXISTS: 'generic',
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: 'generic',
} as const satisfies Partial<
  Record<keyof typeof authClient.$ERROR_CODES, ErrorKey>
>

const isAuthErrorCode = (code: string): code is keyof typeof authErrorKeys =>
  code in authErrorKeys

export const authErrorKey = (code: string | undefined): ErrorKey => {
  if (code && isAuthErrorCode(code)) return authErrorKeys[code]
  return 'generic'
}
