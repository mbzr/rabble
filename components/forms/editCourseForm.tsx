import React from 'react'
import Image from 'next/image'
import { Formik, Form, Field, FieldProps } from 'formik'
import { string, object, mixed, boolean } from 'yup'

import { PrimaryButton } from '@/components/button'
import { Input } from '@/components/formElements'
import { EditCourseInput } from '@/lib/types/course'
import { slugger } from '@/lib/utils/helpers'
import useEditCourseMutation from '@/apollo/client/mutations/course/useEditCourseMutation'

type FormValues = Omit<EditCourseInput, 'courseId'>

const validationSchema = object({
  name: string().required(),
  slug: string()
    .matches(/^[a-z](-?[a-z])*$/, 'Must be a slug')
    .max(70, "You've reached character limit")
    .required(),
  description: string().max(140, "You've reached character limit").required(),
  coverFile: mixed(),
  isPublished: boolean().required(),
  level: mixed().required(),
})

const EditCourseForm: React.FC<{ course: any }> = ({ course }) => {
  const [editError, setEditError] = React.useState(null)
  const [editCourse] = useEditCourseMutation()

  const initialValues: FormValues = {
    name: course.name,
    slug: course.slug,
    description: course.description,
    isPublished: course.isPublished,
    coverFile: undefined,
    level: course.level,
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
    setEditError(null)

    try {
      setSubmitting(true)

      // TODO: maybe, should also call vimeo api to update the video title & description 🤔
      await editCourse({
        variables: {
          input: {
            ...values,
            courseId: course.id,
          },
        },
      })
    } catch (err: any) {
      setEditError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2>Edit course</h2>
      {editError && <div>{editError}</div>}
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
                  disabled
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

            <Field type="checkbox" name="isPublished" />

            <div>
              <Image
                priority
                src={course.coverPhoto || '/default_profile_photo.png'}
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
              Update Course
            </PrimaryButton>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default EditCourseForm
