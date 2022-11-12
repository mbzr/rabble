import React from 'react'
import { Formik, Form, Field } from 'formik'
import { object, boolean } from 'yup'

import { PrimaryButton } from '@/components/button'
import useUpdateUserNotificatonSettings from '@/apollo/client/mutations/user/useUpdateUserNotificationSettings'
import { GetCurrentUserSettingsType } from '@/lib/types/user'

interface Props {
  user: GetCurrentUserSettingsType
}

interface FormValues {
  newsletter: boolean
}

const validationSchema = object({
  newsletter: boolean(),
})

const NotificationsForm: React.FC<Props> = ({ user }) => {
  const [updateUserNotificatonSettings] = useUpdateUserNotificatonSettings()

  const initialValues: FormValues = {
    newsletter: user.settings.notifications.newsletter,
  }

  const handleSubmit = async (
    values: FormValues,
    { setSubmitting, setErrors }: any
  ) => {
    if (values.newsletter === initialValues.newsletter) {
      return null
    }

    try {
      setSubmitting(true)

      await updateUserNotificatonSettings({
        variables: {
          input: {
            shouldSendNewsletter: values.newsletter,
          },
        },
      })
    } catch (err: any) {
      setErrors({ email: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h2>Notifications</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form noValidate method="post">
            <Field type="checkbox" name="newsletter" />

            <PrimaryButton type="submit" isLoading={isSubmitting}>
              Save
            </PrimaryButton>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default NotificationsForm
