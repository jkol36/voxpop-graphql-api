import NotificationsModel from "../models/Notifications"
import {NOTIFICATION_CREATED} from '../../utils/constants';

export const updateNotificationStatus = pubsub => {
  return async (_, args) => {
    if(args.status === "visited") {
        await NotificationsModel.update({_id: args.userId},{$set: {status: args.status }},{upsert: true, new: true})
    } else {
      const userNotifications = await NotificationsModel.find({userId: args.userId})
      userNotifications.forEach(async item => {
        if(item.status === "new")
          await NotificationsModel.update({_id: item._id},{$set: {status: args.status }},{upsert: true, new: true})
      })
    }
    const notify = await NotificationsModel.find({userId: args.userId})
				let notificationCreated = []
				notify.forEach(item => {
					const notification = {
						_id: item._id,
						userId: item.userId,
						senderUserId: item.senderUserId,
						messageRoomId: item.messageRoomId,
						followerUserId: item.followerUserId,
						contentId: item.contentId,
						contentDomain: item.contentDomain,
						label: item.label,
						status: item.status,
						created: item.created,
						notifType: item.notifType
					}
					notificationCreated.push(notification)
				});
		pubsub.publish(NOTIFICATION_CREATED, {notificationCreated})
  }
}
