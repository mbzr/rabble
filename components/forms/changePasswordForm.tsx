import React from 'react'
import { Formik, Form, Field, FieldProps } from 'formik'
import { string, object, ref } from 'yup'

import { Input } from '@/components/formElements'
import useChangePasswordMutation from '@/apollo/client/mutations/user/useChangePasswordMutation'
import { classNames } from '@/lib/utils/helpers'

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
  const [isSubmitted, setIsSubmitted] = React.useState(false)
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
        setIsSubmitted(true)
        setStatus({ success: 'Password successfully changed!' })
      }
    } catch (err: any) {
      setErrors({ currentPassword: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-6">
      {isSubmitted ? (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Change Password
            </h3>
          </div>
          <div className="rounded-md bg-green-50 p-4">
            You have successfully changed your password!
          </div>
        </div>
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, isSubmitting, dirty }) => (
            <Form noValidate method="post">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Change Password
                  </h3>
                </div>

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

                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className={classNames(
                        `flex w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none`,
                        dirty
                          ? ''
                          : 'opacity-50 pointer-events-none cursor-default'
                      )}
                    >
                      Change password
                    </button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  )
}

export default ChangePasswordForm
