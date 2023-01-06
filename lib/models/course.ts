import db from '@/knex/db'
import { CreateCourseInput } from '../types/course'
import { uploadImage } from '../utils/file-upload'

export const createCourse = async (
  {
    input,
  }: {
    input: CreateCourseInput
  },
  userId: string
): Promise<any> => {
  const {
    name,
    description,
    slug,
    coverFile,
    isPublished,
    vimeoFolderUri,
    level,
  } = input

  return db('courses')
    .returning('*')
    .insert({
      name,
      description,
      slug,
      isPublished,
      vimeoFolderUri,
      level,
      createdAt: new Date(),
      modifiedAt: null,
      coverPhoto: null,
      ownerId: userId,
      isArchived: false,
      isPremium: false,
    })
    .then((res: any) => {
      const course = res ? res[0] : undefined

      if (course && coverFile) {
        return uploadImage(coverFile, 'courses', course.id)
          .then((coverPhoto) => {
            // update the course with the coverPhoto
            return db('courses')
              .returning('*')
              .where({ id: course.id })
              .update({
                ...course,
                coverPhoto,
              })
              .then((res: any) => (res && res[0]) || null)
          })
          .catch((err: any) => console.error(err))
      }

      return course
    })
}

export const createCourseOwner = async (
  courseId: string,
  userId: string
): Promise<any> => {
  const res = await db('users_courses').returning('*').insert({
    courseId,
    userId,
    createdAt: new Date(),
    isOwner: true,
    isMember: true,
    receiveNotifications: true,
  })

  return (res && res[0]) || null
}

export const getCourseById = async (id: string) => {
  const rows = await db('courses').where({ id })

  return (rows && rows[0]) || null
}

export const getCourseBySlug = async (slug: string) => {
  const rows = await db('courses').where({ slug })

  return (rows && rows[0]) || null
}

export const editCourse = async ({ input }: any) => {
  const { name, slug, description, coverFile, isPublished, level, courseId } =
    input

  const courseRecord = await db('courses')
    .where({ id: courseId })
    .then((result: any) => {
      // console.log('result', result)
      if (!result || result.length === 0) {
        throw new Error('No course found.')
      }

      return Object.assign({}, result[0], {
        name,
        slug,
        description,
        isPublished,
        level,
        modifiedAt: new Date(),
      })
    })

  if (coverFile) {
    return await uploadImage(coverFile, 'courses', courseId)
      .then((coverPhoto: string) => {
        // update the course with the coverPhoto
        return db('courses')
          .where({ id: courseId })
          .update({
            ...courseRecord,
            coverPhoto,
          })
          .then((res: any) => (res && res[0]) || null)
      })
      .catch((err: any) => console.error(err))
  } else {
    return await db('courses')
      .where({ id: courseId })
      .update({
        ...courseRecord,
      })
      .then((res: any) => (res && res[0]) || null)
      .catch((err: any) => console.error(err))
  }
}
