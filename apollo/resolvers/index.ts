import { merge } from 'lodash'

import * as customScalars from '../entities/scalars'
import courseMutations from './mutations/course'
import userMutations from './mutations/user'
import courseQueries from './queries/course'
import userQueries from './queries/user'

const resolvers = merge(
  {},
  customScalars.resolvers,
  userQueries,
  userMutations,
  courseQueries,
  courseMutations
)

export default resolvers
