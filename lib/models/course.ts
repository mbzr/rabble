import db from '../db'
import { CreateCourseInput } from '../types/course'

export const createCourse = async (
  {
    input,
  }: {
    input: CreateCourseInput
  },
  userId: string
): Promise<any> => {
  const { name, description, slug, coverFile, isPrivate } = input

  const res = await db('courses').returning('*').insert({
    name,
    description,
    slug,
    isPrivate,
    createdAt: new Date(),
    modifiedAt: null,
    coverPhoto: null,
    ownerId: userId,
    isArchived: false,
    isPremium: false,
  })

  return res && res[0]
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
    isBlocked: false,
    isPending: false,
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
