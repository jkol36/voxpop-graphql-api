import {resolver_query} from "./resolvers/queries"
import {resolver_mutations} from "./resolvers/mutations"
import {resolver_subscriptions} from "./resolvers/subscriptions"
import * as relationship from "./resolvers/relationship/"
import {PubSub} from "graphql-subscriptions"
import GraphQLJSON from "graphql-type-json"

const pubsub = new PubSub()
const resolvers = {
	// Include JSON as a scalar type
	JSON: GraphQLJSON,

	// Get/query data functions
	Query: resolver_query(pubsub),

	// Insert/Update functions
	Mutation: resolver_mutations(pubsub),

	Subscription: resolver_subscriptions(pubsub),

	// Object/Model relationships
	User: relationship.userRelationship(pubsub),
	Album: relationship.albumRelationship(pubsub),
	Artist: relationship.artistRelationship(pubsub),
	Content: relationship.contentRelationship(pubsub),
	Creator: relationship.creatorRelationship(pubsub),
	Quote: relationship.quoteRelationship(pubsub),
	Domain: relationship.domainRelationship(pubsub),
	Message: relationship.messageRelationship(pubsub),
	UserMessage: relationship.userMessageRelationship(pubsub),
	Reaction: relationship.userReactionsRelationship(pubsub),
	MessageRoom: relationship.messageRoomRelationship(pubsub),
	Notifications: relationship.notificationsRelationship(pubsub),
}

export {resolvers, pubsub}
