import { GraphQLScalarType, Kind } from 'graphql'

const DateScalarType = new GraphQLScalarType({
  name: 'Date',
  description: 'Date custom scalar type',
  serialize(value: any) {
    // throw error if date invalid
    if (!(value instanceof Date) || isNaN(value.getTime())) {
      throw new TypeError(`Field error: value is an invalid date => ${value}`)
    }

    // Convert outgoing Date to integer for JSON
    return value.getTime()
  },
  parseValue(value: any) {
    // Convert incoming integer to Date
    return new Date(value)
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      // Convert hard-coded AST string to integer and then to Date
      return new Date(parseInt(ast.value, 10))
    }

    // Invalid hard-coded value (not an integer)
    return null
  },
})

export default DateScalarType
