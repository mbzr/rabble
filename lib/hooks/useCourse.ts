import { useRouter } from 'next/router'

import { useCourseBySlug } from '@/apollo/client/queries/course/useCourseByIdOrSlug'

const useCourse = () => {
  const router = useRouter()
  let { courseSlug } = router.query
  courseSlug ??= '' as string
  const { data, loading, error } = useCourseBySlug(courseSlug as string)

  const course = data?.course

  return {
    course,
    loading,
    error,
  }
}

export default useCourse
