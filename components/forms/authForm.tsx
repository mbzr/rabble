import React from 'react'
import { Formik, Form, Field, FieldProps } from 'formik'
import { string, object } from 'yup'

import { Input } from '@/components/formElements'
import { PrimaryButton } from '@/components/button'
import { FormWrapper } from '@/components/forms/style'
import useApi from '@/lib/hooks/useApi'

interface Props {
  type: 'signup' | 'login'
}

interface FormValues {
  email: string
  password: string
}

const validationSchema = object().shape({
  email: string().required('This field is required'),
  password: string().required('This field is required'),
})

const AuthForm: React.FC<Props> = ({ type }) => {
  const [status, callApi] = useApi()

  const initialValues: FormValues = {
    email: '',
    password: '',
  }

  const handleSubmit = async (values: FormValues) => {
    try {
      await callApi(`/api/auth/${type}`, 'POST', {
        email: values.email,
        password: values.password,
      })
    } catch (err: any) {
      console.error(err.message)
    }
  }

  return (
    <FormWrapper>
      {status === 'error' && <div>Something went wrong. Please try again.</div>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
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
            isLoading={status === 'loading'}
          >
            {type}
          </PrimaryButton>
        </Form>
      </Formik>
    </FormWrapper>
  )
}

export default AuthForm
