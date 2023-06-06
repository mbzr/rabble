import React from 'react'
import { Formik, Form, Field } from 'formik'
import { object, boolean } from 'yup'

import useUpdateUserNotificatonSettings from '@/apollo/client/mutations/user/useUpdateUserNotificationSettings'
import { GetCurrentUserSettingsType } from '@/lib/types/user'
import { classNames } from '@/lib/utils/helpers'

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
  const [isSubmitted, setIsSubmitted] = React.useState(false)
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

      setIsSubmitted(true)
    } catch (err: any) {
      setErrors({ email: err.message })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="pt-8">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        validateOnChange={true}
        onSubmit={handleSubmit}
        enableReinitialize={true}
      >
        {({ isSubmitting, dirty }) => (
          <Form noValidate method="post">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Notifications
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Select which type of communication you would like to receive
                from rabble.
              </p>
            </div>
            <div className="mt-6">
              <fieldset>
                <legend className="text-base font-medium text-gray-900">
                  By Email
                </legend>
                <div className="mt-4 space-y-4">
                  <div className="relative flex items-start">
                    <div className="flex items-center h-5">
                      <Field
                        id="newsletter"
                        name="newsletter"
                        type="checkbox"
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="newsletter"
                        className="font-medium text-gray-700"
                      >
                        Weekly newsletter
                      </label>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className={classNames(
                  `w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700`,
                  dirty ? '' : 'opacity-50 pointer-events-none cursor-default'
                )}
              >
                {isSubmitting
                  ? 'Saving...'
                  : !dirty && isSubmitted
                  ? 'Saved!'
                  : 'Save'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default NotificationsForm
