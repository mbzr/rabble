import axios, { AxiosRequestConfig } from 'axios'
import { useState } from 'react'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

export type Method = 'GET' | 'POST'
export type Result = {
  status: number
  result: any
}

export const callApi = async (
  endpoint: string,
  method?: Method,
  body?: any
): Promise<Result | undefined> => {
  const requestOptions: AxiosRequestConfig = {
    url: endpoint,
    method: method || 'GET',
  }

  if (body && method === 'POST') {
    requestOptions.data = body
  }

  try {
    const request = await api(requestOptions)

    return {
      status: request.status,
      result: request.data,
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const response = error?.response
      const request = error?.request

      if (response) {
        const statusCode = response.status

        console.log('api error response', response.data)
        return Promise.reject({
          code: statusCode,
          message: response.data.error,
        })
      } else if (request) {
        //
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

export type Status = 'neutral' | 'loading' | 'success' | 'error'

const useApi = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [status, setStatus] = useState<Status>('neutral')

  const call = async (endpoint: string, method?: Method, body?: any) => {
    setStatus('loading')

    try {
      const response = await callApi(endpoint, method, body)

      setStatus('success')
      setData(response?.result)

      return response
    } catch (error: any) {
      setStatus('error')
      setError(error.message)
    } finally {
      setStatus('neutral')
    }
  }

  return [call, { data, status, error }] as const
}

export default useApi
