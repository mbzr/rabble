import { gql, useMutation } from '@apollo/client'

import { ChangePasswordType } from '@/lib/types/user'

interface ChangePasswordResponse {
  __typename?: 'Mutation'
  changePassword: boolean
}

interface ChangePasswordVariables {
  input: ChangePasswordType
}

export const changePasswordMutation = gql`
  mutation changePassword($input: ChangePasswordInput!) {
    changePassword(input: $input)
  }
`

export default function useChangePasswordMutation() {
  return useMutation<ChangePasswordResponse, ChangePasswordVariables>(
    changePasswordMutation
  )
}
