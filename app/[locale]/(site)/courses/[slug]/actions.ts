'use server'

import { refresh } from 'next/cache'
import { z } from 'zod'
import type { ActionResult } from '@/lib/action-result'
import { enrolInCourse } from '@/lib/server/enrolments'
import { toErrorCode } from '@/lib/server/errors'

export const enrolInCourseAction = async (
  courseId: string,
): Promise<ActionResult> => {
  const parsedCourseId = z.uuid().safeParse(courseId) // validate the courseId is a valid UUID

  if (!parsedCourseId.success) {
    return { ok: false, error: 'invalid_input' }
  }

  try {
    await enrolInCourse(parsedCourseId.data)
  } catch (error) {
    const code = toErrorCode(error)
    if (code) {
      return { ok: false, error: code }
    }
    throw error
  }

  refresh() // refetch dynamic data so the page shows the new enrolment
  return { ok: true, data: undefined }
}
