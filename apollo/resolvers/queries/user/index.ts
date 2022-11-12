import getCurrentUser from './getCurrentUser'
import profilePhoto from './profilePhoto'
import settings from './settings'

const userQueries = {
  Query: {
    // User
    currentUser: getCurrentUser,
  },
  User: {
    profilePhoto,
    settings,
  },
}

export default userQueries
