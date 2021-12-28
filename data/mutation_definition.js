export const Mutation = `type Mutation {

    # Mutation for adding users
    addUser(user: UserInput): User

    # Mutation for updating users
    updateUserProfile(user: UserInput): User

    # Mutation for setting admin user right
    updateUserAdminRight(user_id: String!, admin: Boolean!): User

    # Mutation for following/un-following a User
    followUser(user_id: String!, action: String!): User

    # Mutation for updating/inserting votes
    addVote(vote: VoteInput!): Vote

    # Mutation for following an artist
    follow(artist_id: Int!, user_id: String!): Artist

    # Mutation for unfollowing an artist
    unfollow(artist_id: Int!, user_id: String!): Artist

    # Mutation for creating new comments
    addComment(comment: CommentInput!): Comment

    # Mutation for updating / editing old comments
    editComment(comment_id: String!, comment: CommentInput!): JSON

    # Mutation for removing / deleting old comments
    deleteComment(comment_id: String!): JSON

    # Mutation for sending email invites notification to user
    sendUserInvite(mail_to: String!, resendFlag: Boolean!): JSON

    # Mutation for sending email invite approval to user
    sendUserInviteApproval(user_invite_id: String!, action: String!): JSON

    # Mutation for creating new texts
    addContent(content: ContentInput!): Content

    # Mutation for adding quote
    addQuote(quote: QuoteInput!): Quote

    # Mutation for creating a domain
    createDomain(domain: DomainInput!): Domain

    # Mutation for accepting a user to a subscoreboard
    acceptUserToBoard(domainId: String!, userId: String!): Domain

    # Mutation for adding new pending user to a subscoreboard
    addPendingUser(domainId: String!, userId: String!): Domain

    # Mutation for adding a message
    createMessage(message: MessageInput!): Message

    # Mutation for user message
    createUserMessage(message: UserMessageInput!, userId: String!): UserMessage

    # Mutation for user reaction
    createUserReaction(messageId: String!, reaction: String!): Reaction
    deleteUserReaction(reactionId: String!): Reaction
    
    # Save Content To Buddy List Button
    createContentChatRoom(contentId: String!): MessageRoom
    removeContentChatRoom(contentId: String!): MessageRoom
     
    # Mutation for updating a user notification
    updateNotificationStatus(userId: String!, status: String!): JSON
}`
