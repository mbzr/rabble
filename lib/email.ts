import { Resend } from 'resend'
import { env } from '@/env'

const resend = new Resend(env.RESEND_API_KEY)

interface Email {
  to: string
  subject: string
  text: string
}

export const sendEmail = async ({ to, subject, text }: Email) => {
  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to,
    subject,
    text,
  })
  if (error) throw new Error(`Resend failed: ${error.message}`)
}
