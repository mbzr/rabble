import { GraphQLError, GraphQLScalarType, Kind } from 'graphql'

import { EMAIL_ADDRESS_REGEX } from '@/lib/constants'

const validate = (value: any) => {
  if (typeof value !== 'string') {
    throw new TypeError(`Field error: value is not a string => ${value}`)
  }

  if (!EMAIL_ADDRESS_REGEX.test(value)) {
    throw new TypeError(
      `Field error: value is not a valid email address => ${value}`
    )
  }

  return value
}

const EmailScalarType = new GraphQLScalarType({
  name: 'Email',
  description: 'Email custom scalar type',
  serialize: validate,
  parseValue: validate,
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Expected a string to validate email, instead got a ${ast.kind}`
      )
    }

    return validate(ast.value)
  },
})

export default EmailScalarType
