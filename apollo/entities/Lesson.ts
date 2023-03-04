import { gql } from '@apollo/client'

const Lesson = gql`
  enum VideoStatus {
    complete
    error
    in_progress
  }

  type Video {
    id: Int
    uri: String
    width: Int
    height: Int
    size: Int
    duration: Int
    status: VideoStatus
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
    isPublished: Boolean
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
  }

  input EditLessonInput {
    name: String
    slug: LowercaseString
    description: String
    isPublished: Boolean
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
