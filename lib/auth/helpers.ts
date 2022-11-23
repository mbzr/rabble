import { signIn } from 'next-auth/react'
import { string, object } from 'yup'

export interface AuthFormValues {
  email: string
  password: string
}

export const authValidationSchema = object().shape({
  email: string().email('Invalid email').required('This field is required'),
  password: string().required('This field is required'),
})

export async function login(values: AuthFormValues) {
  return await signIn('credentials', {
    redirect: false,
    email: values.email,
    password: values.password,
    callbackUrl: `${window.location.origin}`,
  }).then(function response(res) {
    if (res?.ok) {
      if (typeof window !== 'undefined') window.location.href = '/'
    } else {
      if (res?.error) {
        throw new Error(res.error)
      }
    }
  })
}
