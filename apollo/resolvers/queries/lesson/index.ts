import getLesson from './getLesson'
import course from './course'

const lessonQueries = {
  Query: {
    lesson: getLesson,
  },
  Lesson: {
    course,
  },
}

export default lessonQueries
