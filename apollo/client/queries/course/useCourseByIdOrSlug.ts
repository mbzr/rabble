import { gql, useQuery } from '@apollo/client'

import { courseInfoFragment } from '@/apollo/client/fragments/course'
import { CourseInfoType } from '@/lib/types/course'

interface GetCourseResponse {
  course: CourseInfoType
}

export const getCourseById = gql`
  query getCourseById($id: ID) {
    course(id: $id) {
      ...courseInfo
    }
  }
  ${courseInfoFragment}
`

export function useCourseById(id: string) {
  return useQuery<GetCourseResponse>(getCourseById, {
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  })
}

export const getCourseBySlug = gql`
  query getCourseBySlug($slug: LowercaseString) {
    course(slug: $slug) {
      ...courseInfo
    }
  }
  ${courseInfoFragment}
`

export function useCourseBySlug(slug: string) {
  return useQuery<GetCourseResponse>(getCourseBySlug, {
    variables: {
      slug,
    },
    fetchPolicy: 'cache-and-network',
  })
}
