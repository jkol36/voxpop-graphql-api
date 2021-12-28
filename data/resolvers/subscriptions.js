import {withFilter} from 'graphql-subscriptions';
import {MESSAGE_CREATED, USER_MESSAGE_CREATED, USER_REACTION, NOTIFICATION_CREATED} from '../utils/constants';

export const resolver_subscriptions = function (pubsub) {
	return {
		artistRankings: {
			subscribe: withFilter(() => pubsub.asyncIterator('artistRankings'), (payload, variables) => {
				console.log("[PUBSUB] artistRankings")
				return payload.id === variables.id;
			}),
		},
		messageCreated: {
			subscribe: withFilter(() => pubsub.asyncIterator(MESSAGE_CREATED), (payload, variables) => {
				console.log("[PUBSUB] messageCreated")
				return payload.messageCreated.contentId.toString() === variables.contentId.toString();
			}),
		},
		userMessageCreated: { 	
			subscribe: withFilter(() => pubsub.asyncIterator(USER_MESSAGE_CREATED), (payload, variables) => {
				console.log("[PUBSUB] userMessageCreated")
				// console.log({payload: payload.userMessageCreated.messageRoomId, variables: variables.messageRoomId});
				return payload.userMessageCreated.messageRoomId.toString() === variables.messageRoomId.toString();
			}),
		},
		userReaction: {
			subscribe: withFilter(() => pubsub.asyncIterator(USER_REACTION), (payload, variables) => {
				console.log("[PUBSUB] userReaction")
				// console.log({payload, variables});
				return payload.userReaction.messageId.toString() === variables.messageId.toString();
			}),
		},

		notificationCreated: {
			subscribe: withFilter(() => pubsub.asyncIterator(NOTIFICATION_CREATED), (payload, variables) => {
				console.log("[PUBSUB] notificationCreated")
				// console.log("notifPayload", payload)
				return true
			}),
		},
	}
}

