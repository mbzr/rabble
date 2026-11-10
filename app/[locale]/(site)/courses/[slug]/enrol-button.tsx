'use client'

import { useActionState } from 'react'
import { useTranslations } from 'next-intl'
import { Loader2 } from 'lucide-react'
import { enrolInCourseAction } from './actions'
import type { ActionResult } from '@/lib/action-result'
import { useRouter } from '@/i18n/navigation'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

interface EnrolButtonProps {
  courseId: string
  firstLessonHref: string
}

export const EnrolButton = ({
  courseId,
  firstLessonHref,
}: EnrolButtonProps) => {
  const router = useRouter()
  const tErrors = useTranslations('ActionErrors')
  const t = useTranslations('Course')

  const [result, formAction, pending] = useActionState(
    async (): Promise<ActionResult> => {
      const result = await enrolInCourseAction(courseId)
      if (result.ok) router.push(firstLessonHref)
      return result
    },
    null,
  )

  return (
    <form action={formAction} className="flex flex-col items-start gap-3">
      {result && !result.ok && (
        <Alert variant="destructive">
          <AlertDescription>{tErrors(result.error)}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" size="lg" disabled={pending} aria-busy={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> {t('enrolling')}
          </>
        ) : (
          t('enrol')
        )}
      </Button>
    </form>
  )
}
