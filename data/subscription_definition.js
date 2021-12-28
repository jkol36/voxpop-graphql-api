export const Subscription = `
# HHSB Subscription

type Subscription {
    artistRankings: [Artist]
    
    # Create message subscription
    messageCreated(contentId: String!): Message
    
    # Create user message subscription
    userMessageCreated(messageRoomId: String!): UserMessage
    
    # Create user reaction subscription
    userReaction(messageId: String!): Reaction

    # Create notification subscription
    notificationCreated(userId: String!): [JSON]
}

`