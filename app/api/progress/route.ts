import { z } from 'zod'
import { saveLessonProgress } from '@/lib/server/progress'
import { AppErrorCode, toErrorCode } from '@/lib/server/errors'

const bodySchema = z.object({
  lessonId: z.uuid(),
  lastPositionSeconds: z.number().nonnegative(),
})

const STATUS: Record<AppErrorCode, number> = {
  unauthenticated: 401,
  forbidden: 403,
  not_found: 404,
}

export const POST = async (request: Request) => {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return new Response(null, { status: 400 })
  }

  try {
    await saveLessonProgress(
      parsed.data.lessonId,
      parsed.data.lastPositionSeconds,
    )
  } catch (error) {
    const code = toErrorCode(error)
    if (code) return new Response(null, { status: STATUS[code] })
    throw error
  }

  return new Response(null, { status: 204 })
}
