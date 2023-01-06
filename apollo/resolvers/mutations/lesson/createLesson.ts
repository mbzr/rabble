import { ensureAuthenticated } from '@/lib/utils/permissions'
import {
  createLesson,
  createLessonOwner,
  getLessonBySlug,
} from '@/lib/models/lesson'

export default ensureAuthenticated(async (_: any, args: any, ctx: any) => {
  const lessonWithSlug = await getLessonBySlug(args.input.slug)

  if (lessonWithSlug) {
    return new Error('A lesson with this slug already exists, please try again')
  }

  const newLesson = await createLesson(args, ctx.user.id)

  return await createLessonOwner(newLesson.id, ctx.user.id).then(
    () => newLesson
  )
})
