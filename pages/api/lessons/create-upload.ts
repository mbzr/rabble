import { NextApiRequest, NextApiResponse } from 'next'

import { callVimeoApi } from '@/lib/vimeo/client'

export async function createUploadHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') return res.status(404).end()

  try {
    const { fileSize, name, description, folderUri } = req.body

    //?fields=uri,name,upload
    const response = await callVimeoApi(
      '/me/videos?fields=name,upload,width,height,duration,link',
      {
        method: 'POST',
        params: {
          // TODO: add support for other upload approaches
          upload: {
            approach: 'tus',
            size: fileSize,
          },
          // TODO: add more fields, like privacy
          name,
          description,
          folder_uri: folderUri,
        },
      }
    )

    return res.status(200).send(response?.data)
  } catch (err: any) {
    return res
      .status(err.code || 500)
      .json({ error: err.message || 'Internal Server Error' })
  }
}

export default createUploadHandler
