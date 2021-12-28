import NotificationsModel from "../models/Notifications"

export const notificationsRelationship = pubsub => {
	return {
		async notifications(data) {
			return await NotificationsModel.find({...data});
		},
	}
}
