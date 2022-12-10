import { signImageUrl } from '@/lib/utils/file-upload'

export default async function getProfilePhoto(user: any, _: any, __: any) {
  const { profilePhoto } = user

  if (!profilePhoto) return null

  return signImageUrl(profilePhoto, {
    w: 120,
    h: 120,
    dpr: 2,
    auto: 'compress',
  })
}
