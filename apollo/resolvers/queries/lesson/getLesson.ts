import { getLessonById, getLessonBySlug } from '@/lib/models/lesson'

export default async function getLesson(_: any, args: any, _ctx: any) {
  if (args.id) return await getLessonById(args.id)
  if (args.slug) return await getLessonBySlug(args.slug)

  return null
}
