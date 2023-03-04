import { Knex } from 'knex'

import { User } from '@/lib/types/user'
import { Course } from '@/lib/types/course'
import { Lesson } from '@/lib/types/lesson'

declare module 'knex/types/tables' {
  interface Tables {
    users: Omit<User, 'settings'>
    courses: Course & { ownerId: string }
    lessons: Lesson & { courseId: string }
  }
}
