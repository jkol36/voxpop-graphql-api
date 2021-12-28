export const Message = `
  type Message {
    _id: String
    contentId: String
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
