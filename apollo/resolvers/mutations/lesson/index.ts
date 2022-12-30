import createLesson from './createLesson'
// import editLesson from './editLesson'

const lessonMutations = {
  Mutation: {
    createLesson,
    editLesson: () => null,
  },
}

export default lessonMutations
