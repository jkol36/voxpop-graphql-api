export const MessageRoom = `
type MessageRoom {
    _id: ID!
    users: [String!]
    messageType: String!
    contentId: String
    created: String
    lastMessage: JSON
}`
