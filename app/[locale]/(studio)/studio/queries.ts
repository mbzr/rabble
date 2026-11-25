import { graphql } from '@/lib/graphql/generated/client'

export const StudioCoursesQuery = graphql(`
  query StudioCourses {
    studioCourses {
      id
      slug
      title
      status
      access
      lessonCount
      enrolmentCount
      updatedAt
    }
  }
`)
