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

  type Course {
    id: ID!
    slug: String!
    title: String!
    status: CourseStatus!
    access: CourseAccess!
    lessonCount: Int!
    enrolmentCount: Int!
    updatedAt: String!
  }

  type Query {
    "courses that are editable by the current user, if they are an instructor of or every course for an admin"
    studioCourses: [Course!]!
  }
`
