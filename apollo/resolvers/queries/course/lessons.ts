import { getLessonsByCourse } from '@/lib/models/lesson'

export default async function (course: any, _: any, __: any) {
  const { id } = course
  const lessons = await getLessonsByCourse(id)

  return lessons
}
