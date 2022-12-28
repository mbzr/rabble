import { merge } from 'lodash'

import * as customScalars from '../entities/scalars'
import userQueries from './queries/user'
import userMutations from './mutations/user'
import courseQueries from './queries/course'
import courseMutations from './mutations/course'
import lessonQueries from './queries/lesson'
import lessonMutations from './mutations/lesson'

const resolvers = merge(
  {},
  customScalars.resolvers,
  userQueries,
  userMutations,
  courseQueries,
  courseMutations,
  lessonQueries,
  lessonMutations
)

export default resolvers
