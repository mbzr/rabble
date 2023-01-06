import { Upload } from 'tus-js-client'

import { callApi } from '@/lib/hooks/useApi'

export const uploadVideoToVimeo = async (params: any): Promise<any> => {
  const { name, description, file, folderUri, progressCallback } = params

  const createResponse = await callApi('/lessons/create-upload', 'POST', {
    name,
    description,
    fileSize: file.size,
    folderUri,
  })

  if (!createResponse || !createResponse.result) {
    throw new Error('Failed to create upload')
  }

  const { result } = createResponse

  return new Promise((resolve, reject) => {
    const tusUpload = new Upload(file, {
      endpoint: 'none',
      uploadSize: file.size,
      retryDelays: [0, 1000, 3000, 5000],
      onError: function (error: any) {
        console.log('Failed because: ' + error)
        reject(new Error(error))
      },
      onProgress: function (bytesUploaded: number, bytesTotal: number) {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
        // console.log(bytesUploaded, bytesTotal, percentage + '%')
        progressCallback && progressCallback(percentage)
      },
      onSuccess: function () {
        resolve(result)

        console.log(
          'Download %s from %s',
          result.name,
          result.upload.upload_link
        )
      },
    })

    tusUpload.url = result.upload.upload_link
    tusUpload.start()
  })
}
