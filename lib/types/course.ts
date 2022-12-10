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
  ownerId: string
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
>

export type CreateCourseInput = {
  name: string
  slug: string
  description: string
  coverFile?: object
  isPrivate: boolean
}

export type EditCourseInput = {
  name: string
  description: string
  coverFile: object
  courseId: string
}
