import getCourseCoverPhoto from './coverPhoto'
import getCourse from './getCourse'

const courseQueries = {
  Query: {
    course: getCourse,
  },
  Course: {
    coverPhoto: getCourseCoverPhoto,
  },
}

export default courseQueries
