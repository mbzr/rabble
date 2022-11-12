import { useState } from 'react'

export type Method = 'GET' | 'POST'
export type Result = {
  ok: boolean
  status: number
  result: string | object | null | boolean
}

const callApi = async (
  endpoint: string,
  method?: Method,
  body?: any
): Promise<Result> => {
  const requestOptions: RequestInit = {
    method: method || 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  }

  if (method === 'POST') {
    requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  const request = await fetch(endpoint, requestOptions)

  return {
    ok: request.ok,
    status: request.status,
    result: await request.json(),
  }
}

export type Status = 'neutral' | 'loading' | 'success' | 'error'

const useApi = () => {
  const [status, setStatus] = useState<Status>('neutral')

  const call = async (endpoint: string, method?: Method, body?: any) => {
    setStatus('loading')

    const response = await callApi(endpoint, method, body)

    if (response.status === 200 || response.status === 201) {
      setStatus('success')
    } else {
      setStatus('error')
    }
    return response.result
  }

  return [status, call] as const
}

export default useApi
