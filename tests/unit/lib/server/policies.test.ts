import { describe, expect, test } from 'vitest'
import { canViewLesson } from '@/lib/server/policies'

const owner = { id: 'owner', role: 'instructor' as const }
const otherInstructor = { id: 'other', role: 'instructor' as const }
const admin = { id: 'admin', role: 'admin' as const }
const learner = { id: 'learner', role: 'learner' as const }

const freeCourse = { ownerId: owner.id, access: 'free' as const }
const premiumCourse = { ownerId: owner.id, access: 'premium' as const }
const preview = { isFreePreview: true }
const lesson = { isFreePreview: false }

describe('canViewLesson', () => {
  test.each([
    {
      name: 'visitor can view free preview on premium course',
      user: null,
      course: premiumCourse,
      lesson: preview,
      hasPremiumAccess: false,
      expected: true,
    },
    {
      name: 'visitor can view free course lesson',
      user: null,
      course: freeCourse,
      lesson: lesson,
      hasPremiumAccess: false,
      expected: true,
    },
    {
      name: 'visitor cannot view premium course lesson',
      user: null,
      course: premiumCourse,
      lesson: lesson,
      hasPremiumAccess: false,
      expected: false,
    },
    {
      name: 'learner can view free course lesson',
      user: learner,
      course: freeCourse,
      lesson: lesson,
      hasPremiumAccess: false,
      expected: true,
    },
    {
      name: 'learner cannot view premium course without subscription',
      user: learner,
      course: premiumCourse,
      lesson: lesson,
      hasPremiumAccess: false,
      expected: false,
    },
    {
      name: 'learner can view premium course with subscription',
      user: learner,
      course: premiumCourse,
      lesson: lesson,
      hasPremiumAccess: true,
      expected: true,
    },
    {
      name: 'course owner can always view lesson',
      user: owner,
      course: premiumCourse,
      lesson: lesson,
      hasPremiumAccess: false,
      expected: true,
    },
    {
      name: 'other instructor cannot view lesson',
      user: otherInstructor,
      course: premiumCourse,
      lesson: lesson,
      hasPremiumAccess: false,
      expected: false,
    },
    {
      name: 'admin can always view lesson',
      user: admin,
      course: premiumCourse,
      lesson: lesson,
      hasPremiumAccess: false,
      expected: true,
    },
  ])('$name', ({ user, course, lesson, hasPremiumAccess, expected }) => {
    expect(canViewLesson({ user, course, lesson, hasPremiumAccess })).toBe(
      expected,
    )
  })
})
