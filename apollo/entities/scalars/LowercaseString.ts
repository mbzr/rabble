import { GraphQLScalarType, Kind } from 'graphql'

const LowercaseString = new GraphQLScalarType({
  name: 'LowercaseString',
  description: 'Returns all strings in lower case',
  parseValue(value: any) {
    return value.toLowerCase()
  },
  serialize(value: any) {
    return value.toLowerCase()
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return ast.value.toLowerCase()
    }
    return null
  },
})

export default LowercaseString
