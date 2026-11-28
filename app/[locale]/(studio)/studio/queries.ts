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

// the fields the course form edits
export const CourseEditorFieldsFragment = graphql(`
  fragment CourseEditorFields on Course {
    id
    slug
    title
    description
    category
    language
    level
    access
    status
    instructor {
      id
      name
    }
  }
`)

export const CourseEditorQuery = graphql(`
  query CourseEditor($id: ID!) {
    studioCourse(id: $id) {
      id
      ...CourseEditorFields
    }
  }
`)

export const InstructorsQuery = graphql(`
  query Instructors {
    instructors {
      id
      name
    }
  }
`)

export const CreateCourseMutation = graphql(`
  mutation CreateCourse($input: CourseDetailsInput!) {
    createCourse(input: $input) {
      id
      ...CourseEditorFields
      ...StudioCourseRow
    }
  }
`)

export const UpdateCourseMutation = graphql(`
  mutation UpdateCourse($id: ID!, $input: CourseDetailsInput!) {
    updateCourse(id: $id, input: $input) {
      id
      ...CourseEditorFields
      ...StudioCourseRow
    }
  }
`)

export const CreateInstructorMutation = graphql(`
  mutation CreateInstructor($name: String!) {
    createInstructor(name: $name) {
      id
      name
    }
  }
`)
