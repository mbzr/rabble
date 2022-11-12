export const __FORCE_DEV__ = process.env.RAZZLE_FORCE_DEV === 'true'

export const __PROD__ = process.env.NODE_ENV === 'production'

export const EMAIL_ADDRESS_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export const FRONTEND_URL = __PROD__
  ? 'https://rabbleacademy.xyz'
  : 'http://localhost:3000'
