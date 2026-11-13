// where to go after signing in
// /course/123 works, https://example.com will not
export const safeNextPath = (
  value: unknown,
  siteUrl: string,
): string | null => {
  if (typeof value !== 'string' || !value.startsWith('/')) return null

  const url = URL.parse(value, siteUrl)
  return url?.origin === new URL(siteUrl).origin
    ? `${url.pathname}${url.search}`
    : null
}

export const withNext = (pathname: string, next: string | null) =>
  next ? { pathname, query: { next } } : { pathname }
