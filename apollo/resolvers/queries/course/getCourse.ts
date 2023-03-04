import { getCourseById, getCourseBySlug } from '@/lib/models/course'

export default async function getCourse(_: any, args: any, _ctx: any) {
  if (args.id) return await getCourseById(args.id)
  if (args.slug) return await getCourseBySlug(args.slug)

  return null
}
