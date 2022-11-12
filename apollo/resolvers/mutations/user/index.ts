import editUser from './editUser'
import updateUserNotificationSettings from './updateUserNotificationSettings'
import changePassword from './changePassword'

const userMutations = {
  Mutation: {
    // User
    editUser,
    updateUserNotificationSettings,
    changePassword,
  },
}

export default userMutations
