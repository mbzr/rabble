'use client'

import { useQuery } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { CourseEditorQuery } from '../queries'
import { CourseForm } from './course-form'

interface CourseEditorProps {
  courseId: string
  isAdmin: boolean
}

export const CourseEditor = ({ courseId, isAdmin }: CourseEditorProps) => {
  const t = useTranslations('CourseForm')
  const { data, loading, error } = useQuery(CourseEditorQuery, {
    variables: { id: courseId },
    ssr: false,
  })

  if (loading) return <Skeleton className="h-96 w-full max-w-2xl" />

  if (error || !data) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{t('loadError')}</AlertDescription>
      </Alert>
    )
  }

  return <CourseForm isAdmin={isAdmin} course={data.studioCourse} />
}
