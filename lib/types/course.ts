import { LessonInfoType } from './lesson'

export enum Level {
  ALL = 'ALL',
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  EXPERT = 'EXPERT',
}

/**
 * This is equivalent to:
 * type LevelStrings = 'ALL' | 'BEGINNER' | 'INTERMEDIATE' | 'EXPERT';
 */
export type LevelStrings = keyof typeof Level
export interface Course {
  id: string
  createdAt: Date
  modifiedAt: Date | null
  name: string
  slug: string
  description: string
  coverPhoto: string | null
  isPublished: boolean
  isArchived: boolean
  isPremium: boolean
  vimeoFolderUri: string
  level: LevelStrings
}

export type CourseInfoType = Pick<
  Course,
  | 'id'
  | 'name'
  | 'slug'
  | 'description'
  | 'createdAt'
  | 'isPublished'
  | 'isArchived'
  | 'coverPhoto'
  | 'vimeoFolderUri'
  | 'level'
> & { lessons: LessonInfoType[] }

export type CreateCourseInput = {
  name: string
  slug: string
  description: string
  coverFile?: object
  isPublished: boolean
  vimeoFolderUri: string
  level: LevelStrings
}

export type EditCourseInput = {
  name: string
  slug: string
  description: string
  coverFile?: object
  isPublished: boolean
  level: LevelStrings
  courseId: string
}
