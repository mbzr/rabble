import React from 'react'
import Image from 'next/image'
import { Formik, Form, Field, FieldProps, FormikErrors } from 'formik'
import { string, object, mixed } from 'yup'

import { PrimaryButton } from '@/components/button'
import { Input } from '@/components/formElements'
import { UserInfoType } from '@/lib/types/user'
import useEditUserMutation from '@/apollo/client/mutations/user/useEditUserMutation'
import { H1, H2 } from '../globals'
import { classNames } from '@/lib/utils/helpers'

interface Props {
  user: UserInfoType
}

interface FormValues {
  displayName?: string
  email?: string
  file?: File
}

const validationSchema = object({
  displayName: string().required('Enter a display name'),
  email: string()
    .email('Must contain a valid email address')
    .required('Enter an email address'),
  file: mixed(),
})

const EditProfileForm: React.FC<Props> = ({ user }) => {
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [editUser] = useEditUserMutation()

  const initialValues: FormValues = {
    displayName: user.displayName,
    email: user.email,
    file: undefined,
  }

  const onFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    {
      setFieldValue,
    }: {
      setFieldValue: (
        field: string,
        value: any,
        shouldValidate?: boolean
      ) => void
    }
  ) => {
    if (!e.target.files) return

    let reader = new FileReader()
    let file = e.target.files[0]

    if (!file) return

    reader.onloadend = () => {
      setFieldValue('file', file)
    }

    if (file) {
      // console.log('!!!!!', file)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (
    values: FormValues,
    {
      setSubmitting,
      setErrors,
    }: {
      setSubmitting: (isSubmitting: boolean) => void
      setErrors: (errors: FormikErrors<FormValues>) => void
    }
  ) => {
    try {
      setSubmitting(true)

      let payload = values

      if (values.email === initialValues.email) {
        const { email, ...restValues } = values
        payload = {
          ...restValues,
        }
      }

      // console.log('payload', payload)
      await editUser({
        variables: {
          input: payload,
        },
        // TODO: temporary solution cause it makes extra network request
        // need to use a better method to update user cache after edit
        refetchQueries: ['getCurrentUser'],
      })

      setIsSubmitted(true)
    } catch (err: any) {
      setErrors({ email: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, setFieldValue, dirty }) => (
          <Form noValidate method="post">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Profile
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  This information will be displayed publicly so be careful what
                  you share.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <Field name="displayName">
                    {({
                      field,
                      meta: { error, value, initialValue, touched },
                    }: FieldProps) => (
                      <Input
                        type="text"
                        autoComplete="given-name"
                        required
                        error={
                          (touched || value !== initialValue) && Boolean(error)
                            ? error
                            : ''
                        }
                        label="Display name"
                        {...field}
                      />
                    )}
                  </Field>
                </div>
                <div className="sm:col-span-6">
                  <Field name="email">
                    {({
                      field,
                      meta: { error, value, initialValue, touched },
                    }: FieldProps) => (
                      <Input
                        type="email"
                        autoComplete="email"
                        required
                        error={
                          (touched || value !== initialValue) && Boolean(error)
                            ? error
                            : ''
                        }
                        label="Email address"
                        {...field}
                      />
                    )}
                  </Field>
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="file" className="block cursor-pointer">
                    <span className="block text-sm font-medium text-gray-700">
                      Profile photo
                    </span>
                    <input
                      id="file"
                      name="file"
                      type="file"
                      className="sr-only"
                      onChange={(e) => onFileChange(e, { setFieldValue })}
                    ></input>
                    <div className="mt-1 flex items-center">
                      <span className="h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                        <Image
                          priority
                          src={user.profilePhoto || '/default-avatar.png'}
                          alt="profile picture"
                          width={48}
                          height={48}
                        />
                      </span>
                      <button
                        type="button"
                        className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 pointer-events-none"
                      >
                        Change
                      </button>
                    </div>
                  </label>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Cover photo
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className={classNames(
                      `flex w-full justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`,
                      dirty
                        ? ''
                        : 'opacity-50 pointer-events-none cursor-default'
                    )}
                  >
                    {isSubmitting
                      ? 'Saving...'
                      : !dirty && isSubmitted
                      ? 'Saved!'
                      : 'Save'}
                  </button>
                </div>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default EditProfileForm
