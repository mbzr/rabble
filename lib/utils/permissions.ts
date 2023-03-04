import db from '@/knex/db'

export const ensureAuthenticated =
  (resolver: Function) =>
  async (parent: any, args: any, ctx: any, info: any) => {
    if (!ctx.user || !ctx.user.id) {
      return new Error('Unauthorized. You must be logged in to do this.')
    }

    return resolver(parent, args, ctx, info)
  }

export const SLUG_DENYLIST = [
  'admin',
  'api',
  'auth',
  'courses',
  'course',
  'dashboard',
  'home',
  'login',
  'logout',
  'profile',
  'signup',
  'register',
  'settings',
  'users',
  'user',
  'new',
  'edit',
  'lessons',
  'lesson',
]

export const isSlugDenylisted = async (slug: string) => {
  // TODO: check if slug is allowed
  // return SLUG_DENYLIST.indexOf(slug) > -1
}

export const isCourseOwner = async (userId: string, courseId: string) => {
  // TODO: check if user is owner of course
}

export const isAdmin = async (userId: string) => {
  return db('users').where({ id: userId, role: 'ADMIN' }).first()
}
