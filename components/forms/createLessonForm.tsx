import React from 'react'
import { Formik, Form, Field, FieldProps, FormikBag, FormikProps } from 'formik'
import { string, object, mixed } from 'yup'

import { PrimaryButton } from '@/components/button'
import { Input } from '@/components/formElements'
import useCreateLessonMutation from '@/apollo/client/mutations/lesson/useCreateLessonMutation'
import { uploadVideoToVimeo } from '@/lib/vimeo/helpers'
import { slugger } from '@/lib/utils/helpers'
import { SLUG_DENYLIST } from '@/lib/utils/permissions'
// import { callApi } from '@/lib/hooks/useApi'

interface FormValues {
  name: string
  slug: string
  description: string
  file: File | undefined
}

const validationSchema = object({
  name: string().required().max(20, "You've reached character limit"),
  slug: string()
    .matches(/^[a-z](-?[a-z])*$/, 'Must be a slug')
    .max(24, "You've reached character limit")
    .required(),
  description: string().required().max(140, "You've reached character limit"),
  file: mixed().required(),
})

export type CreateLessonFormProps = {
  courseId: string
  folderUri: string
}

const CreateLessonForm: React.FC<CreateLessonFormProps> = ({
  courseId,
  folderUri,
}) => {
  const [progress, setProgress] = React.useState<string | null>(null)
  const [createError, setCreateError] = React.useState<string | null>(null)
  const [isUploading, setIsUploading] = React.useState<boolean>(false)
  const [createLesson] = useCreateLessonMutation()

  const initialValues: FormValues = {
    name: '',
    slug: '',
    description: '',
    file: undefined,
  }

  const onNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    { setFieldValue }: any
  ) => {
    let name = e.target.value
    setFieldValue('name', name)
    let slug = slugger(name)
    setFieldValue('slug', slug, false)
  }

  const onSlugChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    { setFieldValue }: any
  ) => {
    let slug = e.target.value
    slug = slugger(slug)
    setFieldValue('slug', slug, false)
  }

  const onFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    { setFieldValue }: any
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

  const handleSubmit = async (values: FormValues, { setFieldError }: any) => {
    try {
      if (SLUG_DENYLIST.indexOf(values.slug) > -1) {
        return setFieldError('slug', 'This slug is not allowed')
      }

      setProgress(null)
      setCreateError(null)
      setIsUploading(true)

      const { file, ...rest } = values
      await uploadVideoToVimeo({
        file,
        name: values.name,
        description: values.description,
        folderUri: folderUri,
        progressCallback: (progress: string) => {
          setProgress(progress)
        },
        successCallback: (result: any) => {
          createLesson({
            variables: {
              input: {
                ...rest,
                slug: values.name,
                courseId: courseId,
                video: {
                  id: Number(result.link.split('/').pop()),
                  uri: result.link,
                  width: result.width,
                  height: result.height,
                  duration: result.duration,
                  size: result.upload.size,
                },
              },
            },
            onError(error: string, clientOptions) {
              setIsUploading(false)
              setCreateError('Error uploading video')
            },
            onCompleted: (data) => {
              setIsUploading(false)
            },
          })
        },
      })
    } catch (err: any) {
      setIsUploading(false)
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
        {({ setFieldValue }) => (
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
                  onChange={(e) => onNameChange(e, { setFieldValue })}
                />
              )}
            </Field>

            <Field name="slug">
              {({
                field,
                meta: { error, value, initialValue, touched },
              }: FieldProps) => {
                console.log('object', error, value, initialValue, touched)
                return (
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
                )
              }}
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
                Lesson Video
                <input
                  type="file"
                  name="file"
                  onChange={(e) => onFileChange(e, { setFieldValue })}
                />
              </label>
            </div>

            <PrimaryButton type="submit" isLoading={isUploading}>
              Create
            </PrimaryButton>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default CreateLessonForm
