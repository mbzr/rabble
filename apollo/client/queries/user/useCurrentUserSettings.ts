import { gql, useQuery } from '@apollo/client'

import {
  userInfoFragment,
  userSettingsFragment,
} from '@/apollo/client/fragments/user'
import { GetCurrentUserSettingsType } from '@/lib/types/user'

interface GetCurrentUserSettingsResponse {
  user: GetCurrentUserSettingsType
}

export const getCurrentUserSettingsQuery = gql`
  query getCurrentUserSettings {
    user: currentUser {
      ...userInfo
      ...userSettings
    }
  }
  ${userInfoFragment}
  ${userSettingsFragment}
`

export default function useCurrentUserSettings() {
  return useQuery<GetCurrentUserSettingsResponse>(getCurrentUserSettingsQuery, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  })
}
