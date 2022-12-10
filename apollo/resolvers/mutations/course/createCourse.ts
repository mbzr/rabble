import { ensureAuthenticated } from '@/lib/auth/helpers'
import {
  createCourse,
  createCourseOwner,
  getCourseBySlug,
} from '@/lib/models/course'

export default ensureAuthenticated(async (_: any, args: any, ctx: any) => {
  const courseWithSlug = await getCourseBySlug(args.input.slug)

  if (courseWithSlug) {
    return new Error('A course with this slug already exists, please try again')
  }

  const newCourse = await createCourse(args, ctx.user.id)

  return await createCourseOwner(newCourse.id, ctx.user.id).then(
    () => newCourse
  )
})
