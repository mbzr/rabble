// tests choose who is logged in by setting the request headers
let requestHeaders = new Headers()

export const setRequestHeaders = (value: Headers) => {
  requestHeaders = value
}

export const headers = async () => requestHeaders
