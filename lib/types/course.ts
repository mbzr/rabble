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
  modifiedAt: Date
  name: string
  slug: string
  description: string
  coverPhoto: string
  isPrivate: boolean
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
  | 'isPrivate'
  | 'isArchived'
  | 'coverPhoto'
  | 'vimeoFolderUri'
  | 'level'
>

export type CreateCourseInput = {
  name: string
  slug: string
  description: string
  coverFile?: object
  isPrivate: boolean
  vimeoFolderUri: string
  level: LevelStrings
}

export type EditCourseInput = {
  name: string
  slug: string
  description: string
  coverFile?: object
  isPrivate: boolean
  level: LevelStrings
  courseId: string
}
