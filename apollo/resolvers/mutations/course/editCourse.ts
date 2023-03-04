import { ensureAuthenticated } from '@/lib/utils/permissions'
import { editCourse } from '@/lib/models/course'

export default ensureAuthenticated(async (_: any, args: any, __: any) => {
  // const { courseId } = args.input

  // TODO: check if user is owner of course before edit
  // const isCourseOwner = await isCourseOwner(user.id, courseId)

  // TODO: check edited slug isn't already taken

  return await editCourse(args)
})
