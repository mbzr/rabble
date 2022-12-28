import React from 'react'
import { Formik, Form, Field, FieldProps } from 'formik'
import { string, object, mixed, boolean } from 'yup'

const tus = require('tus-js-client')

import { PrimaryButton } from '@/components/button'
import { Input } from '@/components/formElements'
import { callApi } from '@/lib/hooks/useApi'
import useCreateLessonMutation from '@/apollo/client/mutations/lesson/useCreateLessonMutation'
import { useRouter } from 'next/router'

interface FormValues {
  name: string
  slug: string
  description: string
  file: File | undefined
  isPrivate: boolean
}

const validationSchema = object({
  name: string().required(),
  slug: string().required(),
  description: string().required(),
  file: mixed().required(),
  isPrivate: boolean().required(),
})

const CreateLessonForm: React.FC<{ course: any }> = ({ course }) => {
  const [progress, setProgress] = React.useState<string | null>(null)
  const [createError, setCreateError] = React.useState<string | null>(null)
  const [createLesson] = useCreateLessonMutation()
  const router = useRouter()

  const initialValues: FormValues = {
    name: '',
    slug: '',
    description: '',
    file: undefined,
    isPrivate: false,
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
    }: {
      setSubmitting: (isSubmitting: boolean) => void
    }
  ) => {
    try {
      if (!values.file || !values.name) {
        return
      }

      setCreateError(null)
      setSubmitting(true)

      const fileSize = values.file.size

      const uploadResponse = await callApi('/lessons/upload', 'POST', {
        name: values.name,
        description: values.description,
        fileSize: fileSize,
        folderUri: course.vimeoFolderUri,
      })

      console.log('uploadResponse', uploadResponse)

      if (!uploadResponse?.result) {
        setCreateError('Error uploading video')
        return
      }

      const tusUpload = new tus.Upload(values.file, {
        endpoint: 'none',
        uploadSize: fileSize,
        retryDelays: [0, 1000, 3000, 5000],
        onError: function (error: string) {
          console.log('Failed because: ' + error)
          throw new Error(error)
        },
        onProgress: function (bytesUploaded: number, bytesTotal: number) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)

          setProgress(percentage)
        },
        onSuccess: function () {
          const { file, ...rest } = values

          createLesson({
            variables: {
              input: {
                ...rest,
                courseId: course.id,
                video: {
                  id: Number(uploadResponse?.result.link.split('/').pop()),
                  uri: uploadResponse?.result.link,
                  width: uploadResponse?.result.width,
                  height: uploadResponse?.result.height,
                  duration: uploadResponse?.result.duration,
                  size: uploadResponse?.result.upload.size,
                },
              },
            },
            onError(error, clientOptions) {
              setSubmitting(false)
              setCreateError('Error uploading video')
            },
            onCompleted: (data) => {
              setSubmitting(false)

              router.push(
                `/admin/courses/${course.slug}/lessons/${data.lesson.slug}`
              )
            },
          })

          console.log(
            'Download %s from %s',
            uploadResponse?.result.name,
            uploadResponse?.result.upload.upload_link
          )
        },
      })

      tusUpload.url = uploadResponse?.result.upload.upload_link
      await tusUpload.start()
    } catch (err: any) {
      setSubmitting(false)
      setCreateError(err.message)
    }
  }

  return (
    <div>
      <h2>Create a new lesson</h2>
      {createError ? <div>{createError}</div> : null}
      {progress ? <div>{progress + '%'}</div> : null}
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

            <div>
              <label htmlFor="file">
                Course Video
                <input
                  type="file"
                  name="file"
                  onChange={(e) => onFileChange(e, { setFieldValue })}
                />
              </label>
            </div>

            <Field type="checkbox" name="isPrivate" />

            <PrimaryButton type="submit" isLoading={isSubmitting}>
              Create
            </PrimaryButton>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default CreateLessonForm
