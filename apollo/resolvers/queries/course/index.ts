import getCourseCoverPhoto from './coverPhoto'
import getCourse from './getCourse'
import lessons from './lessons'

const courseQueries = {
  Query: {
    course: getCourse,
  },
  Course: {
    coverPhoto: getCourseCoverPhoto,
    lessons: lessons,
  },
}

export default courseQueries
