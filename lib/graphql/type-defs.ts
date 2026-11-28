export const typeDefs = /* GraphQL */ `
  enum CourseStatus {
    DRAFT
    PUBLISHED
    ARCHIVED
  }

  enum CourseAccess {
    FREE
    PREMIUM
  }

  enum CourseCategory {
    DEVELOPMENT
    DESIGN
    BUSINESS
    MARKETING
    PHOTO_VIDEO
    PERSONAL_DEVELOPMENT
  }

  enum CourseLanguage {
    EN
    AR
  }

  enum CourseLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  type Instructor {
    id: ID!
    name: String!
  }

  type Course {
    id: ID!
    slug: String!
    title: String!
    description: String!
    category: CourseCategory!
    language: CourseLanguage!
    level: CourseLevel!
    status: CourseStatus!
    access: CourseAccess!
    instructor: Instructor!
    lessonCount: Int!
    enrolmentCount: Int!
    updatedAt: String!
  }

  input CourseDetailsInput {
    title: String!
    slug: String!
    description: String!
    category: CourseCategory!
    language: CourseLanguage!
    level: CourseLevel!
    access: CourseAccess!
    "Admins only. Instructors are credited to themselves"
    instructorId: ID
  }

  type Query {
    "Courses you can edit: your own, or every course for an admin"
    studioCourses: [Course!]!
    "One course you can edit"
    studioCourse(id: ID!): Course!
    "Everyone you can credit on a course. Admins only"
    instructors: [Instructor!]!
  }

  type Mutation {
    "Creates a draft course"
    createCourse(input: CourseDetailsInput!): Course!
    updateCourse(id: ID!, input: CourseDetailsInput!): Course!
    "An instructor without an account. Admins only"
    createInstructor(name: String!): Instructor!
  }
`
