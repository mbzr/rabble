export type Video = {
  id: number
  uri: string
  width: number
  height: number
  size: number
  duration: number
}

export interface Lesson {
  id: string
  createdAt: Date
  modifiedAt: Date | null
  name: string
  slug: string
  description: string
  isPrivate: boolean
  isArchived: boolean
  video: Video
}

export type LessonInfoType = Pick<
  Lesson,
  | 'id'
  | 'name'
  | 'slug'
  | 'description'
  | 'createdAt'
  | 'isPrivate'
  | 'isArchived'
  | 'video'
>

export type CreateLessonInput = {
  name: string
  slug: string
  description: string
  courseId: string
  isPrivate: boolean
  video: Video
}

export type EditLessonInput = {
  name?: string
  description?: string
  lessonId: string
}
