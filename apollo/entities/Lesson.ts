import { gql } from '@apollo/client'

const Lesson = gql`
  type Video {
    id: Int
    uri: String
    width: Int
    height: Int
    size: Int
    duration: Int
  }

  input VideoInput {
    id: Int
    uri: String
    width: Int
    height: Int
    size: Int
    duration: Int
  }

  type Lesson {
    id: ID!
    createdAt: Date
    modifiedAt: Date
    name: String!
    slug: LowercaseString!
    description: String!
    isPrivate: Boolean
    isArchived: Boolean
    course: Course
    video: Video!
  }

  input CreateLessonInput {
    name: String!
    slug: LowercaseString!
    description: String!
    courseId: ID!
    video: VideoInput!
    isPrivate: Boolean
  }

  input EditLessonInput {
    name: String
    description: String
    lessonId: ID!
  }

  extend type Query {
    lesson(id: ID, slug: LowercaseString): Lesson
  }

  extend type Mutation {
    createLesson(input: CreateLessonInput!): Lesson
    editLesson(input: EditLessonInput!): Lesson
  }
`

export default Lesson
