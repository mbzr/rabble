import React from 'react'
import { Formik, Form, Field, FieldProps } from 'formik'
import { string, object } from 'yup'

import { PrimaryButton } from '@/components/button'
import { Input } from '@/components/formElements'
import { EditLessonInput, LessonInfoType } from '@/lib/types/lesson'
import { slugger } from '@/lib/utils/helpers'
import useEditLessonMutation from '@/apollo/client/mutations/lesson/useEditLessonMutation'

type FormValues = Omit<EditLessonInput, 'lessonId'>

const validationSchema = object({
  name: string().required(),
  slug: string()
    .matches(/^[a-z](-?[a-z])*$/, 'Must be a slug')
    .max(70, "You've reached character limit")
    .required(),
  description: string().max(140, "You've reached character limit").required(),
})

export type EditLessonFormProps = {
  lesson: LessonInfoType
}

const EditLessonForm: React.FC<{ lesson: any }> = ({ lesson }) => {
  const [editError, setEditError] = React.useState(null)
  const [editLesson] = useEditLessonMutation()

  const initialValues: FormValues = {
    name: lesson.name,
    slug: lesson.slug,
    description: lesson.description,
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
      await editLesson({
        variables: {
          input: {
            ...values,
            lessonId: lesson.id,
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
      <h2>Edit lesson</h2>
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

            <PrimaryButton type="submit" isLoading={isSubmitting}>
              Update Lesson
            </PrimaryButton>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default EditLessonForm
