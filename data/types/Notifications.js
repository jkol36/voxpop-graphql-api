export const Notifications = `
type Notifications {
    _id: String!
    userId: String
    senderUserId: String
    messageRoomId: String
    followerUserId: String
    contentId: String
    contentDomain: String
    label: String
    status: String
    created: String
    notifType: String
    notifications: Notifications
}`
