import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { CourseForm } from '../course-form'
import { getStudioUser } from '../../get-studio-user'

const NewCourse = async () => {
  const [currentUser, t] = await Promise.all([
    getStudioUser('/studio/courses/new'),
    getTranslations('CourseForm'),
  ])

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold">{t('newTitle')}</h1>
      <CourseForm isAdmin={currentUser.role === 'admin'} />
    </div>
  )
}

const NewCoursePage = () => (
  <Suspense fallback={null}>
    <NewCourse />
  </Suspense>
)

export default NewCoursePage
