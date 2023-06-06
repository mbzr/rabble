import React from 'react'

import { PrimaryButton } from 'components/button'
import { H2 } from '../globals'

const DeleteAccountForm = () => {
  return (
    <div className="space-y-8 pt-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Delete Account
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Warning this action cannot be reversed.
      </p>
      <div className="flex justify-end">
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
        >
          Delete Account
        </button>
      </div>
    </div>
  )
}

export default DeleteAccountForm
