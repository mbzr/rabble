import tus from 'tus-js-client'

import { callVimeoApi } from './client'

export const uploadVideoToVimeo = async (file: any, params = {}) => {
  const fileSize = file.size

  try {
    const response = await callVimeoApi('/me/videos?fields=uri,name,upload', {
      method: 'POST',
      params: {
        upload: {
          approach: 'tus',
          size: fileSize,
        },
        name: 'Test Title',
        ...params,
      },
    })

    console.log('file upload: data -', response?.data)
    var upload = new tus.Upload(file, {
      endpoint: 'none',
      uploadSize: fileSize,
      retryDelays: [0, 1000, 3000, 5000],
      onError: function (error: any) {
        console.log('Failed because: ' + error)
      },
      onProgress: function (bytesUploaded: number, bytesTotal: number) {
        var percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)
        console.log(bytesUploaded, bytesTotal, percentage + '%')
      },
      onSuccess: function () {
        console.log('Download %s from %s', upload.file.name, upload.url)
      },
    })

    upload.url = response?.data.upload.upload_link
    upload.start()
  } catch (error) {
    console.error('Error: Unable to initiate an upload.', error)
  }
}
