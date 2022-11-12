import React from 'react'

import { PrimaryButton } from 'components/button'

const DeleteAccountForm = () => {
  return (
    <div>
      <h3>Delete my account</h3>
      <p>Warning, this action cannot be reversed.</p>
      <PrimaryButton>Delete account</PrimaryButton>
    </div>
  )
}

export default DeleteAccountForm
