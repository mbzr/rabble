import { gql } from '@apollo/client'
import { GraphQLUpload } from 'graphql-upload'

import DateScalarType from './Date'
import EmailScalarType from './Email'
import LowercaseString from './LowercaseString'

export const typeDefs = gql`
  scalar Date
  scalar Email
  scalar Upload
  scalar LowercaseString
`

export const resolvers = {
  Date: DateScalarType,
  Email: EmailScalarType,
  Upload: GraphQLUpload,
  LowercaseString: LowercaseString,
}
