import axios from 'axios'

const vimeoApi = axios.create({
  baseURL: 'https://api.vimeo.com',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${process.env.VIMEO_ACCESS_TOKEN}`,
  },
})

export const callVimeoApi = async (
  endpoint: string,
  { method, params }: { method: string; params?: object }
) => {
  try {
    const request = await vimeoApi({
      method: method || 'POST',
      url: endpoint,
      data: params ? JSON.stringify(params) : undefined,
    })

    return request
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const response = error?.response
      const request = error?.request

      if (response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const statusCode = response.status
        if (statusCode === 400) {
          return Promise.reject({
            code: statusCode,
            message: 'Invalid parameters.',
          })
        } else if (statusCode === 401 || statusCode === 403) {
          return Promise.reject({
            code: statusCode,
            message: 'Unauthorized request.',
          })
        } else if (statusCode === 404) {
          return Promise.reject({
            code: statusCode,
            message: 'Requested resource not found.',
          })
        } else if (statusCode === 429) {
          return Promise.reject({
            code: statusCode,
            message: "You're making too many requests.",
          })
        } else {
          return Promise.reject({
            code: statusCode,
            message: 'Unexpected error occurred.',
          })
        }
      } else if (request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
      } else {
        return Promise.reject({
          code: 500,
          message: 'Unknown error.',
        })
      }
    } else {
      return Promise.reject({
        code: 500,
        message: error.message || 'Unexpected error occurred.',
      })
    }
  }
}
