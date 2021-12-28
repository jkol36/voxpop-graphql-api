import UsersModel from "../models/Users"
import Promise from "promise"

export const domainRelationship = pubsub => {
  return {
    async pendingUsers(data) {
      return await Promise.all(
        data.pendingUserIds.map(async id => {
          return await UsersModel.findById(id)
        })
      )
    }
  }
}
