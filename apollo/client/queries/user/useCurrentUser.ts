import { gql, useQuery } from '@apollo/client'

import userInfoFragment from '@/apollo/client/fragments/user/userInfo'
import { UserInfoType } from '@/lib/types/user'

interface GetCurrentUserResponse {
  user: UserInfoType
}

export const getCurrentUserQuery = gql`
  query getCurrentUser {
    user: currentUser {
      ...userInfo
    }
  }
  ${userInfoFragment}
`

export default function useCurrentUser() {
  return useQuery<GetCurrentUserResponse>(getCurrentUserQuery, {
    fetchPolicy: 'cache-first',
  })
}
