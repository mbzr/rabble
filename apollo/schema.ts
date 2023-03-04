import { gql } from '@apollo/client'
import { makeExecutableSchema } from '@graphql-tools/schema'

// Types
import * as customScalars from './entities/scalars'
import User from './entities/User'
import Course from './entities/Course'
import Lesson from './entities/Lesson'

// Resolvers
import resolvers from './resolvers'

const Root = gql`
  # root GraphQL data
  # https://stackoverflow.com/questions/59608833/apollo-graphql-error-query-root-type-must-be-provided
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  schema {
    query: Query
    mutation: Mutation
  }

  enum CacheControlScope {
    PUBLIC
    PRIVATE
  }

  directive @cacheControl(
    maxAge: Int
    scope: CacheControlScope
    inheritMaxAge: Boolean
  ) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION

  enum Role {
    ADMIN
    INSTRUCTOR
    MEMBER
  }
`

export const schema = makeExecutableSchema({
  typeDefs: [customScalars.typeDefs, Root, User, Course, Lesson],
  resolvers,
})
