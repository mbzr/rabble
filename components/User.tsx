import React from 'react'

import useCurrentUser from '@/apollo/client/queries/user/useCurrentUser'

const User = () => {
  const { data, loading } = useCurrentUser()

  return (
    <div>
      {loading ? 'loading...' : null}
      <h1>User: {data?.user ? data.user.displayName : null}</h1>
    </div>
  )
}

export default User
