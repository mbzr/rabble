import db from '@/knex/db'
import { CreateLessonInput } from '../types/lesson'

export const createLesson = async (
  {
    input,
  }: {
    input: CreateLessonInput
  },
  userId: string
): Promise<any> => {
  const { courseId, name, description, slug, video } = input

  const res = await db('lessons').returning('*').insert({
    courseId,
    name,
    slug,
    description,
    video,
    isPublished: false,
    createdAt: new Date(),
    modifiedAt: null,
    isArchived: false,
  })

  return (res && res[0]) || null
}

export const createLessonOwner = async (
  lessonId: string,
  userId: string
): Promise<any> => {
  const res = await db('users_lessons').returning('*').insert({
    lessonId,
    userId,
    createdAt: new Date(),
    completedAt: null,
    isOwner: true,
    isMember: true,
  })

  return (res && res[0]) || null
}

export const getLessonById = async (id: string) => {
  const rows = await db('lessons').where({ id })

  return (rows && rows[0]) || null
}

export const getLessonBySlug = async (slug: string) => {
  const rows = await db('lessons').where({ slug })

  return (rows && rows[0]) || null
}

export const getLessonsByCourse = async (courseId: string) => {
  const rows = await db('lessons').where({ courseId })

  return rows || null
}
