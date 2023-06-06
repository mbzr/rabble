import React from 'react'
import { Formik, Form, Field, FieldProps } from 'formik'

import { Input } from '@/components/formElements'
import useApi from '@/lib/hooks/useApi'
import { AuthFormValues, authValidationSchema, login } from '@/lib/auth/helpers'
import Link from 'next/link'

const SignupForm: React.FC<{}> = () => {
  const [callApi] = useApi()

  const initialValues: AuthFormValues = {
    email: '',
    password: '',
  }

  const handleSubmit = async (values: AuthFormValues, actions: any) => {
    try {
      actions.setSubmitting(true)

      await callApi(`/auth/signup`, 'POST', {
        email: values.email,
        password: values.password,
      })

      await login(values)
    } catch (err: any) {
      actions.setStatus({ error: err.message ?? 'Something went wrong.' })
    } finally {
      actions.setSubmitting(false)
    }
  }

  return (
    <>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Register
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <Formik
              initialValues={initialValues}
              validationSchema={authValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ status, isSubmitting }) => (
                <>
                  {status && status.error ? <div>{status.error}</div> : null}

                  <Form noValidate method="post">
                    <div className="space-y-6">
                      <Field name="email">
                        {({
                          field,
                          meta: { error, value, initialValue, touched },
                        }: FieldProps) => (
                          <Input
                            type="email"
                            required
                            label={'Email address'}
                            error={
                              (touched || value !== initialValue) &&
                              Boolean(error)
                                ? error
                                : ''
                            }
                            {...field}
                          />
                        )}
                      </Field>
                      <Field name="password">
                        {({
                          field,
                          meta: { error, value, initialValue, touched },
                        }: FieldProps) => (
                          <Input
                            type="password"
                            required
                            label={'Password'}
                            error={
                              (touched || value !== initialValue) &&
                              Boolean(error)
                                ? error
                                : ''
                            }
                            {...field}
                          />
                        )}
                      </Field>
                      <div className="flex items-center justify-end">
                        <div className="text-sm">
                          <Link
                            href="/login"
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Already have an account? Sign in.
                          </Link>
                        </div>
                      </div>
                      <div>
                        <button
                          type="submit"
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          disabled={isSubmitting}
                        >
                          Sign up
                        </button>
                      </div>
                    </div>
                  </Form>
                </>
              )}
            </Formik>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <div>
                  <a
                    href="#"
                    className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 w-full"
                  >
                    <svg
                      className="w-4 h-4 mr-2 -ml-1"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fab"
                      data-icon="github"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 496 512"
                    >
                      <path
                        fill="currentColor"
                        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                      ></path>
                    </svg>
                    Continue with Github
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SignupForm
