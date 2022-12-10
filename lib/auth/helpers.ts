import { signIn } from 'next-auth/react'
import { string, object } from 'yup'
// import { PASSWORD_REGEX } from '../constants'

export interface AuthFormValues {
  email: string
  password: string
}

export const authValidationSchema = object().shape({
  email: string().email('Invalid email').required('This field is required'),
  password: string()
    // .matches(
    //   PASSWORD_REGEX,
    //   'Password must be atleast 8 characters, one uppercase, one number and one special case character.'
    // )
    .required('This field is required'),
})

export async function login(values: AuthFormValues) {
  return await signIn('credentials', {
    redirect: false,
    email: values.email,
    password: values.password,
    callbackUrl: `${window.location.origin}`,
  }).then(function response() {
    if (typeof window !== 'undefined') window.location.href = '/'
  })
}

export const ensureAuthenticated =
  (resolver: Function) =>
  async (parent: any, args: any, ctx: any, info: any) => {
    if (!ctx.user || !ctx.user.id) {
      return new Error('Unauthorized. You must be logged in to do this.')
    }

    return resolver(parent, args, ctx, info)
  }
