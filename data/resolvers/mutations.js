import * as mutations from "./mutation_resolvers"

export const resolver_mutations = function(pubsub) {
  return {
    // User mutations
    addUser: mutations.addUser(pubsub),
    updateUserProfile: mutations.updateUser(pubsub),
    followUser: mutations.followUser(pubsub),
    sendUserInvite: mutations.sendUserInvite(pubsub),
    sendUserInviteApproval: mutations.sendUserInviteApproval(pubsub),
    updateUserAdminRight: mutations.updateUserAdminRight(pubsub),

    // Domain
    createDomain: mutations.createDomain(pubsub),
    acceptUserToBoard: mutations.acceptUserToBoard(pubsub),
    addPendingUser: mutations.addPendingUser(pubsub),

    // Votes muations
    addVote: mutations.addVote(pubsub),

    // Artist mutations
    follow: mutations.follow(pubsub),
    unfollow: mutations.unfollow(pubsub),

    // Comment mutations
    addComment: mutations.addComment(pubsub),
    editComment: mutations.editComment(pubsub),
    deleteComment: mutations.deleteComment(pubsub),

    // Texts Mutations
    addContent: mutations.addContent(pubsub),

    // Quotes Mutations
    addQuote: mutations.addQuote(pubsub),

    // Message Mutations
    createMessage: mutations.createMessage(pubsub),
	  createUserMessage: mutations.createUserMessage(pubsub),
	  createUserReaction: mutations.createUserReaction(pubsub),
	  deleteUserReaction: mutations.deleteUserReaction(pubsub),
	  createContentChatRoom: mutations.createContentChatRoom(pubsub),
    removeContentChatRoom: mutations.removeContentChatRoom(pubsub),
    
    // Notification Mutations
    updateNotificationStatus: mutations.updateNotificationStatus(pubsub)
  }
}
