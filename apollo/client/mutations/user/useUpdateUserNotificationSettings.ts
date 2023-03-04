import { gql, useMutation } from '@apollo/client'

import { UserInfoType } from '@/lib/types/user'
import {
  userInfoFragment,
  userSettingsFragment,
} from '@/apollo/client/fragments/user'

interface Vars {
  input: {
    shouldSendNewsletter: boolean
  }
}

export const updateUserNotificationSettingsMutation = gql`
  mutation updateUserNotificationSettings(
    $input: UpdateUserNotificationSettingsInput!
  ) {
    updateUserNotificationSettings(input: $input) {
      ...userInfo
      ...userSettings
    }
  }
  ${userInfoFragment}
  ${userSettingsFragment}
`

export default function useUpdateUserNotificatonSettings() {
  return useMutation<UserInfoType, Vars>(updateUserNotificationSettingsMutation)
}
