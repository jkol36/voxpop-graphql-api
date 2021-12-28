export const UserMessage = `
  type UserMessage {
    _id: String
    messageRoomId: String
    userId: String
    userName: String
    userAvatar: String
    title: String
    text: String
    imageUrl: String
    date: String
    reaction: [Reaction]
  }
 `