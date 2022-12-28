import React from 'react'
import Image from 'next/image'
import { Formik, Form, Field, FieldProps } from 'formik'
import { string, object, mixed, boolean } from 'yup'
import { useRouter } from 'next/router'

import { PrimaryButton } from '@/components/button'
import { Input } from '@/components/formElements'
import useCreateCourseMutation from '@/apollo/client/mutations/course/useCreateCourseMutation'
import { CreateCourseInput } from '@/lib/types/course'
import { slugger } from '@/lib/utils/helpers'
import { callApi } from '@/lib/hooks/useApi'

type FormValues = Omit<CreateCourseInput, 'vimeoFolderUri'>

const validationSchema = object({
  name: string().required(),
  slug: string()
    .matches(/^[a-z](-?[a-z])*$/, 'Must be a slug')
    .max(70, "You've reached character limit")
    .required(),
  description: string().max(140, "You've reached character limit").required(),
  coverFile: mixed(),
  isPrivate: boolean().required(),
  level: mixed().required(),
})

const CreateCourseForm = () => {
  const [createError, setCreateError] = React.useState(null)
  const [createCourse] = useCreateCourseMutation()
  const router = useRouter()

  const initialValues: FormValues = {
    name: '',
    slug: '',
    description: '',
    isPrivate: false,
    coverFile: undefined,
    level: 'ALL',
  }

  const onSlugChange = (
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
    let slug = e.target.value
    slug = slugger(slug)
    setFieldValue('slug', slug)
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
      setFieldValue('coverFile', file)
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
    }: {
      setSubmitting: (isSubmitting: boolean) => void
    }
  ) => {
    setCreateError(null)

    try {
      setSubmitting(true)

      const body = {
        name: values.name,
      }

      const apiResponse = await callApi('/courses', 'POST', body)

      if (apiResponse && apiResponse.result) {
        console.log('apiResponse', apiResponse)
        await createCourse({
          variables: {
            input: {
              ...values,
              vimeoFolderUri: apiResponse.result.uri,
            },
          },
          onCompleted: (data) => {
            console.log('create data', data)

            router.push(`/admin/courses/${data?.course?.slug}`)
          },
        })
      }
    } catch (err: any) {
      setCreateError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2>Create a new course</h2>
      {createError && <div>{createError}</div>}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form noValidate method="post">
            <Field name="name">
              {({
                field,
                meta: { error, value, initialValue, touched },
              }: FieldProps) => (
                <Input
                  type="text"
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
            <Field name="slug">
              {({
                field,
                meta: { error, value, initialValue, touched },
              }: FieldProps) => (
                <Input
                  type="text"
                  required
                  error={
                    (touched || value !== initialValue) && Boolean(error)
                      ? error
                      : ''
                  }
                  {...field}
                  onChange={(e) => onSlugChange(e, { setFieldValue })}
                />
              )}
            </Field>
            <Field name="description">
              {({
                field,
                meta: { error, value, initialValue, touched },
              }: FieldProps) => (
                <Input
                  type="text"
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

            <Field as="select" name="level">
              <option value="ALL">ALL</option>
              <option value="BEGINNER">BEGINNER</option>
              <option value="INTERMEDIATE">INTERMEDIATE</option>
              <option value="EXPERT">EXPERT</option>
            </Field>

            <Field type="checkbox" name="isPrivate" />

            <div>
              <Image
                priority
                src={'/default_profile_photo.png'}
                alt="cover picture"
                width={150}
                height={150}
              />

              <label htmlFor="coverFile">
                Cover Photo
                <input
                  type="file"
                  name="coverFile"
                  onChange={(e) => onFileChange(e, { setFieldValue })}
                />
              </label>
            </div>

            <PrimaryButton type="submit" isLoading={isSubmitting}>
              Create Course
            </PrimaryButton>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default CreateCourseForm
