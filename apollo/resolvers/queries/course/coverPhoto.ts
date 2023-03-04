import { signImageUrl } from '@/lib/utils/file-upload'

export default async function getCourseCoverPhoto(
  course: any,
  _: any,
  __: any
) {
  const { coverPhoto } = course

  if (!coverPhoto) return null

  return signImageUrl(coverPhoto, {
    w: 120,
    h: 120,
    dpr: 2,
    auto: 'compress',
  })
}
