import { getCourseById } from '@/lib/models/course'

export default async function (lesson: any, _: any, __: any) {
  // console.log('lesson: ', _, args, _ctx)
  const { courseId } = lesson
  const course = await getCourseById(courseId)

  return course
}
