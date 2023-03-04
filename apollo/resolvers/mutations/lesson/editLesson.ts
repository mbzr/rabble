import { ensureAuthenticated } from '@/lib/utils/permissions'
import { editLesson } from '@/lib/models/lesson'

export default ensureAuthenticated(async (_: any, args: any, __: any) => {
  // TODO: check edited slug isn't already taken

  return await editLesson(args)
})
