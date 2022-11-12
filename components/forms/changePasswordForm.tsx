import React from 'react'
import { Formik, Form, Field, FieldProps } from 'formik'
import { string, object, ref } from 'yup'

import { PrimaryButton } from '@/components/button'
import { Input } from '@/components/formElements'
import useChangePasswordMutation from '@/apollo/client/mutations/user/useChangePasswordMutation'

interface FormValues {
  currentPassword: string
  newPassword: string
  newPassword2: string
}

const validationSchema = object().shape({
  currentPassword: string().required('You must enter your current password'),
  newPassword: string().required('This field is required'),
  newPassword2: string().when('newPassword', {
    is: (val: string) => (val && val.length > 0 ? true : false),
    then: string().oneOf([ref('newPassword')], 'Both passwords must match'),
  }),
})

const ChangePasswordForm: React.FC<{}> = () => {
  const [changePassword] = useChangePasswordMutation()

  const initialValues: FormValues = {
    currentPassword: '',
    newPassword: '',
    newPassword2: '',
  }

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setErrors, setStatus }: any
  ) => {
    try {
      setSubmitting(true)

      const didChangePassword = await changePassword({
        variables: {
          input: values,
        },
        // TODO: temporary solution cause it makes extra network request
        // need to use a better method to update user cache after edit
        refetchQueries: ['getCurrentUser'],
      })

      if (didChangePassword) {
        setStatus({ success: 'Password successfully changed!' })
      }
    } catch (err: any) {
      setErrors({ currentPassword: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2>Change password</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, status }) => (
          <Form noValidate method="post">
            {status && status.success ? (
              <div>Password successfully changed</div>
            ) : (
              ''
            )}
            <Field name="currentPassword">
              {({
                field,
                meta: { error, value, initialValue, touched },
              }: FieldProps) => (
                <Input
                  type="password"
                  required
                  label={'Current Password'}
                  error={
                    (touched || value !== initialValue) && Boolean(error)
                      ? error
                      : ''
                  }
                  {...field}
                />
              )}
            </Field>
            <Field name="newPassword">
              {({
                field,
                meta: { error, value, initialValue, touched },
              }: FieldProps) => (
                <Input
                  type="password"
                  label={'New Password'}
                  required
                  error={
                    (touched || value !== initialValue) && Boolean(error)
                      ? error
                      : ''
                  }
                  {...field}
                />
              )}
            </Field>
            {values.newPassword && (
              <Field name="newPassword2">
                {({
                  field,
                  meta: { error, value, initialValue, touched },
                }: FieldProps) => (
                  <Input
                    type="password"
                    label={'Confirm Password'}
                    required
                    error={
                      (touched || value !== initialValue) && Boolean(error)
                        ? error
                        : ''
                    }
                    {...field}
                  />
                )}
              </Field>
            )}

            <PrimaryButton type="submit" isLoading={isSubmitting}>
              Change
            </PrimaryButton>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ChangePasswordForm
