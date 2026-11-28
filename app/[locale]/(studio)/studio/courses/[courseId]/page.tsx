import { getTranslations } from 'next-intl/server'
import { Suspense } from 'react'
import { CourseEditor } from '../course-editor'
import { getStudioUser } from '../../get-studio-user'

type EditCoursePageProps = PageProps<'/[locale]/studio/courses/[courseId]'>

const EditCourse = async ({ params }: Pick<EditCoursePageProps, 'params'>) => {
  const { courseId } = await params
  const [currentUser, t] = await Promise.all([
    getStudioUser(`/studio/courses/${courseId}`),
    getTranslations('CourseForm'),
  ])

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold">{t('editTitle')}</h1>
      <CourseEditor
        courseId={courseId}
        isAdmin={currentUser.role === 'admin'}
      />
    </div>
  )
}

const EditCoursePage = ({ params }: EditCoursePageProps) => (
  <Suspense fallback={null}>
    <EditCourse params={params} />
  </Suspense>
)

export default EditCoursePage
