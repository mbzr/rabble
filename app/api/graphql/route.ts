import { yoga } from '@/lib/graphql/yoga'

// Next checks route handlers types, and Yoga's handler takes a different second argument
const handle = (request: Request) => yoga.handleRequest(request, {})

export const GET = handle
export const POST = handle
export const OPTIONS = handle
