'use client'

import { CombinedGraphQLErrors } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useTranslations } from 'next-intl'
import { type SubmitEvent, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from '@/i18n/navigation'
import { type FragmentType, useFragment } from '@/lib/graphql/generated/client'
import type { CourseDetailsInput } from '@/lib/graphql/generated/client/graphql'
import {
  COURSE_ACCESS,
  COURSE_CATEGORIES,
  COURSE_LANGUAGES,
  COURSE_LEVELS,
} from '@/lib/schemas/course'
import slugify from 'slugify'
import {
  CourseEditorFieldsFragment,
  CreateCourseMutation,
  StudioCoursesQuery,
  UpdateCourseMutation,
} from '../queries'
import { InstructorPicker } from './instructor-picker'

// the codes the server sends in fieldErrors. Anything else shows a general message
const ERROR_CODES = [
  'too_small',
  'too_big',
  'invalid_format',
  'invalid_value',
  'taken',
  'locked',
  'required',
  'not_found',
] as const
type ErrorCode = (typeof ERROR_CODES)[number] | 'unexpected'

const toErrorCodes = (fieldErrors: unknown): Record<string, ErrorCode> =>
  Object.fromEntries(
    Object.entries(fieldErrors ?? {}).map(([field, code]) => [
      field,
      ERROR_CODES.find((known) => known === code) ?? 'unexpected',
    ]),
  )

// 'photo-video' in the database is PHOTO_VIDEO in GraphQL
const toEnum = (value: string) => value.toUpperCase().replaceAll('-', '_')

interface CourseFormProps {
  isAdmin: boolean
  // left out on the new course page
  course?: FragmentType<typeof CourseEditorFieldsFragment>
}

export const CourseForm = ({ isAdmin, course: courseRef }: CourseFormProps) => {
  const course = useFragment(CourseEditorFieldsFragment, courseRef)
  const t = useTranslations('CourseForm')
  const tCatalog = useTranslations('Catalog')
  const tStudio = useTranslations('Studio')
  const router = useRouter()

  const [title, setTitle] = useState(course?.title ?? '')
  const [slug, setSlug] = useState(course?.slug ?? '')
  // a new course's slug follows the title until you type your own
  const [slugTouched, setSlugTouched] = useState(course !== undefined)
  const [fieldErrors, setFieldErrors] = useState<Record<string, ErrorCode>>({})
  const [saved, setSaved] = useState(false)

  const [createCourse, created] = useMutation(CreateCourseMutation, {
    refetchQueries: [StudioCoursesQuery],
  })
  const [updateCourse, updated] = useMutation(UpdateCourseMutation)
  const saving = created.loading || updated.loading
  const slugLocked = course !== undefined && course.status !== 'DRAFT'

  const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const input: CourseDetailsInput = {
      title,
      slug,
      description: String(form.get('description') ?? ''),
      category: form.get('category') as CourseDetailsInput['category'],
      language: form.get('language') as CourseDetailsInput['language'],
      level: form.get('level') as CourseDetailsInput['level'],
      access: form.get('access') as CourseDetailsInput['access'],
      instructorId: isAdmin
        ? String(form.get('instructorId') || '') || undefined
        : undefined,
    }
    setFieldErrors({})
    setSaved(false)

    try {
      if (course) {
        await updateCourse({ variables: { id: course.id, input } })
        setSaved(true)
      } else {
        const result = await createCourse({ variables: { input } })
        if (result.data)
          router.push(`/studio/courses/${result.data.createCourse.id}`)
      }
    } catch (error) {
      const sent = CombinedGraphQLErrors.is(error)
        ? error.errors[0]?.extensions?.fieldErrors
        : undefined
      setFieldErrors(sent ? toErrorCodes(sent) : { form: 'unexpected' })
    }
  }

  const errorFor = (field: string) => {
    const code = fieldErrors[field]
    return code ? <FieldError>{t(`errors.${code}`)}</FieldError> : null
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-2xl flex-col gap-6"
      noValidate
    >
      {fieldErrors.form ? (
        <Alert variant="destructive">
          <AlertDescription>{t('errors.unexpected')}</AlertDescription>
        </Alert>
      ) : null}

      <Field data-invalid={Boolean(fieldErrors.title)}>
        <FieldLabel htmlFor="title">{t('title')}</FieldLabel>
        <Input
          id="title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            if (!slugTouched) setSlug(slugify(event.target.value))
          }}
          dir="auto"
          aria-invalid={Boolean(fieldErrors.title)}
          required
        />
        {errorFor('title')}
      </Field>

      <Field data-invalid={Boolean(fieldErrors.slug)}>
        <FieldLabel htmlFor="slug">{t('slug')}</FieldLabel>
        <Input
          id="slug"
          value={slug}
          onChange={(event) => {
            setSlug(event.target.value)
            setSlugTouched(true)
          }}
          disabled={slugLocked}
          dir="ltr"
          aria-invalid={Boolean(fieldErrors.slug)}
          required
        />
        <FieldDescription>
          {slugLocked ? t('slugLocked') : t('slugHint')}
        </FieldDescription>
        {errorFor('slug')}
      </Field>

      <Field data-invalid={Boolean(fieldErrors.description)}>
        <FieldLabel htmlFor="description">{t('description')}</FieldLabel>
        <Textarea
          id="description"
          name="description"
          defaultValue={course?.description ?? ''}
          rows={5}
          dir="auto"
          aria-invalid={Boolean(fieldErrors.description)}
        />
        {errorFor('description')}
      </Field>

      <div className="grid gap-6 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="category">{t('category')}</FieldLabel>
          <NativeSelect
            id="category"
            name="category"
            defaultValue={course?.category ?? 'DESIGN'}
          >
            {COURSE_CATEGORIES.map((category) => (
              <NativeSelectOption key={category} value={toEnum(category)}>
                {tCatalog(`categories.${category}`)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>

        <Field>
          <FieldLabel htmlFor="language">{t('language')}</FieldLabel>
          <NativeSelect
            id="language"
            name="language"
            defaultValue={course?.language ?? 'EN'}
          >
            {COURSE_LANGUAGES.map((language) => (
              <NativeSelectOption key={language} value={toEnum(language)}>
                {tCatalog(`languages.${language}`)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>

        <Field>
          <FieldLabel htmlFor="level">{t('level')}</FieldLabel>
          <NativeSelect
            id="level"
            name="level"
            defaultValue={course?.level ?? 'BEGINNER'}
          >
            {COURSE_LEVELS.map((level) => (
              <NativeSelectOption key={level} value={toEnum(level)}>
                {tCatalog(`levels.${level}`)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>

        <Field>
          <FieldLabel htmlFor="access">{t('access')}</FieldLabel>
          <NativeSelect
            id="access"
            name="access"
            defaultValue={course?.access ?? 'FREE'}
          >
            {COURSE_ACCESS.map((access) => (
              <NativeSelectOption key={access} value={toEnum(access)}>
                {tStudio(`access.${toEnum(access) as 'FREE' | 'PREMIUM'}`)}
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
      </div>

      {isAdmin ? (
        <Field data-invalid={Boolean(fieldErrors.instructorId)}>
          <FieldLabel htmlFor="instructorId">{t('instructor')}</FieldLabel>
          <InstructorPicker
            defaultValue={course?.instructor.id}
            invalid={Boolean(fieldErrors.instructorId)}
          />
          {errorFor('instructorId')}
        </Field>
      ) : null}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving} aria-busy={saving}>
          {saving ? t('saving') : course ? t('save') : t('create')}
        </Button>
        <p role="status" className="text-muted-foreground text-sm">
          {saved ? t('saved') : null}
        </p>
      </div>
    </form>
  )
}
