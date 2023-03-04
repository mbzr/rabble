import { v4 } from 'uuid'
import { indexOf, toLower } from 'lodash'
import sanitize from 'sanitize-filename'

import s3Client from './s3'
import imgixClient from './imgix'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png']

export const uploadImage = async (
  file: any,
  entity: any,
  id: string
): Promise<string> => {
  const result = await file
  const { filename, createReadStream, mimetype } = result
  const stream = createReadStream()
  const sanitized = sanitize(filename)
  const encoded = encodeURIComponent(sanitized)

  return new Promise((res) => {
    // mimetype not in the ALLOWED_MIME_TYPES collection
    if (indexOf(ALLOWED_MIME_TYPES, toLower(mimetype)) < 0) {
      throw new Error(
        `Server has rejected the file with unsupported type ${mimetype}. Try uploading another image.`
      )
    }

    const path = `rabble-academy/${entity}/${id}`
    const fileKey = `${v4()}-${encoded}`
    return s3Client.upload(
      {
        Bucket: path,
        Key: fileKey,
        Body: stream,
      },
      (err: any, data: any) => {
        if (err) throw new Error(err)
        if (!data || !data.Key) {
          throw new Error(`We've encountered unexpected problems.`)
        }
        // console.log('data.Key', data.Key)
        const url = data.Key
        res(url)
      }
    )
  })
  // .then(() => console.log('Image Upload successful'))
  // .catch((err: any) => {
  //   console.error(err)
  // })
}

export const signImageUrl = (url: string, params?: object) => {
  return imgixClient.buildURL(url, params)
}
