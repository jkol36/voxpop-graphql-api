import NotificationsModel from "../models/Notifications"

export const notifications = pubsub => {
  return async (_, args, context) => {
    return await NotificationsModel.find({ ...args })
  }
}
