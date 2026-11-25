import { graphql } from '@/lib/graphql/generated/client'

export const StudioCourseRowFragment = graphql(`
  fragment StudioCourseRow on Course {
    id
    title
    status
    access
    lessonCount
    enrolmentCount
    updatedAt
  }
`)

export const StudioCoursesQuery = graphql(`
  query StudioCourses {
    studioCourses {
      id
      ...StudioCourseRow
    }
  }
`)
