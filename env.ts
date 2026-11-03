import { z } from 'zod'

const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_URL: z.url(),
  RABBLE_AWS_ACCESS_KEY_ID: z.string().min(1),
  RABBLE_AWS_SECRET_ACCESS_KEY: z.string().min(1),
  RABBLE_AWS_REGION: z.string().min(1),
  RABBLE_S3_BUCKET: z.string().min(1),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  throw new Error(
    `Invalid environment variables:\n${z.prettifyError(parsed.error)}`,
  )
}

export const env = parsed.data