import { gql } from '@apollo/client'

const Course = gql`
  enum Level {
    ALL
    BEGINNER
    INTERMEDIATE
    EXPERT
  }

  type Course {
    id: ID!
    createdAt: Date
    modifiedAt: Date
    name: String!
    slug: LowercaseString!
    description: String!
    coverPhoto: String
    isPrivate: Boolean
    isArchived: Boolean
    isPremium: Boolean
    owner: User
    vimeoFolderUri: String
    lessons: [Lesson]
    lessonCount: Int
    totalDuration: Int
    level: Level
    rating: Int
    memberCount: Int
  }

  input CreateCourseInput {
    name: String!
    slug: LowercaseString!
    description: String!
    coverFile: Upload
    isPrivate: Boolean
    vimeoFolderUri: String!
  }

  input EditCourseInput {
    name: String
    description: String
    coverFile: Upload
    courseId: ID!
  }

  extend type Query {
    course(id: ID, slug: LowercaseString): Course
  }

  extend type Mutation {
    createCourse(input: CreateCourseInput!): Course
    editCourse(input: EditCourseInput!): Course
  }
`

export default Course
