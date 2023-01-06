import { NextApiRequest, NextApiResponse } from 'next'

import { callVimeoApi } from '@/lib/vimeo/client'

export async function verifyUploadHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') return res.status(404).end()

  try {
    const { videoId } = req.query
    //?fields=uri,upload.status,transcode.status
    const response = await callVimeoApi(
      `/videos/${videoId}?fields=uri,upload.status,transcode.status`,
      {
        method: 'GET',
      }
    )

    return res.status(200).send(response?.data)
  } catch (err: any) {
    return res
      .status(err.code || 500)
      .json({ error: err.message || 'Internal Server Error' })
  }
}

export default verifyUploadHandler
