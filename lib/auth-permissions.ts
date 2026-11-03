import { createAccessControl } from 'better-auth/plugins/access'
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access'

export const ac = createAccessControl(defaultStatements)

export const roles = {
  learner: ac.newRole({}),
  instructor: ac.newRole({}),
  admin: ac.newRole(adminAc.statements),
}
