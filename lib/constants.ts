export const __FORCE_DEV__ = process.env.RAZZLE_FORCE_DEV === 'true'

export const __PROD__ = process.env.NODE_ENV === 'production'

export const EMAIL_ADDRESS_REGEX =
  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

export const FRONTEND_URL = __PROD__
  ? 'https://rabbleacademy.xyz'
  : 'http://localhost:3000'

/**
 * (?=.{8,}): Set the minimum number of characters

  ((?=.[!@#$%^&()-=+{};:,<.>]){1}): Verify if there is at least 1 character of the list "!@#$%^&*()-=+{};:,<.>"

  (?=.*\d): Verify if there is a digit

  ((?=.*[a-z]){1}): Verify if there is a lower case alphabetical character

  ((?=.*[A-Z]){1}): Verify if there is an upper case alphabetical character
  */
export const PASSWORD_REGEX =
  /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/
