import React from 'react'
import { Formik, Form, Field, FieldProps } from 'formik'
import Link from 'next/link'

import { Input } from '@/components/formElements'
import { PrimaryButton } from '@/components/button'
import { FormWrapper } from '@/components/forms/style'
import { AuthFormValues, authValidationSchema, login } from '@/lib/auth/helpers'

const LoginForm: React.FC<{}> = () => {
  const initialValues: AuthFormValues = {
    email: '',
    password: '',
  }

  const handleSubmit = async (values: AuthFormValues, actions: any) => {
    try {
      actions.setSubmitting(true)

      await login(values)
    } catch (err: any) {
      actions.setStatus({ error: err.message ?? 'Something went wrong.' })
    } finally {
      actions.setSubmitting(false)
    }
  }

  return (
    <FormWrapper>
      <Formik
        initialValues={initialValues}
        validationSchema={authValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ status, isSubmitting }) => (
          <>
            {status && status.error ? <div>{status.error}</div> : null}

            <Form noValidate method="post">
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
                      (touched || value !== initialValue) && Boolean(error)
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
                      (touched || value !== initialValue) && Boolean(error)
                        ? error
                        : ''
                    }
                    {...field}
                  />
                )}
              </Field>
              <PrimaryButton
                type="submit"
                size={'full'}
                isLoading={isSubmitting}
              >
                Login
              </PrimaryButton>
            </Form>
            <p>
              Dont have an account? <Link href="/signup">Signup now</Link>
            </p>
          </>
        )}
      </Formik>
    </FormWrapper>
  )
}

export default LoginForm
