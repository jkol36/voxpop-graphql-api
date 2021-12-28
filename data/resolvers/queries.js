import * as lyricistUtils from "./utils/lyricist_utils"
import * as queryResolvers from "./query_resolvers"

export const resolver_query = function (pubsub) {
	return {
		// PUT ALL NEW QUERIES HERE
		content: queryResolvers.content(pubsub),
		contents: queryResolvers.contents(pubsub),
		searchContent: queryResolvers.searchContent(pubsub),
		creator: queryResolvers.creator(pubsub),
		searchCreator: queryResolvers.searchCreator(pubsub),
		collection: queryResolvers.collection(pubsub),
		domain: queryResolvers.domain(pubsub),
		domains: queryResolvers.domains(pubsub),
		users: queryResolvers.getUsers(pubsub),
		user: queryResolvers.findUserById(pubsub),
		userFantasyLabels: queryResolvers.userFantasyLabels(pubsub),
		userInviteRequests: queryResolvers.getUserInvites(pubsub),
		userVoteLogs: queryResolvers.getUserVoteLogs(pubsub),
		quote: queryResolvers.quote(pubsub),
		quotes: queryResolvers.quotes(pubsub),
		paginate: queryResolvers.paginate(pubsub),

		vote: queryResolvers.vote(pubsub),
		votes: queryResolvers.votes(pubsub),
		votePoints: queryResolvers.votePoints(pubsub),

		artist: queryResolvers.artist(pubsub),

		lyricistSearch: lyricistUtils.lyricistSearch(pubsub),
		songsByArtist: lyricistUtils.songsByArtist(pubsub),
		albumsByArtist: lyricistUtils.albumsByArtist(pubsub),
		album: lyricistUtils.album(pubsub),
		albums: queryResolvers.albums(pubsub),
		albumsFromDatabase: queryResolvers.albumsFromDatabase(pubsub),
		trendingSongs: lyricistUtils.trendingSongs(pubsub),
		recommendedSongs: lyricistUtils.recommendedSongs(pubsub),

		activities: queryResolvers.activities(pubsub),

		// Bills
		searchBill: queryResolvers.searchBill(pubsub),
		billText: queryResolvers.billText(pubsub),

		// Text
		text: queryResolvers.text(pubsub),

		// Comments
		comments: queryResolvers.comments(pubsub),
		comment: queryResolvers.comment(pubsub),

		// Messages
		messages: queryResolvers.messages(pubsub),
		userMessages: queryResolvers.userMessages(pubsub),
		userChatRoom: queryResolvers.userChatRoom(pubsub),
		userMessageReactions: queryResolvers.userMessageReactions(pubsub),
		userMessageReactionToolTip: queryResolvers.userMessageReactionToolTip(pubsub),
		userBuddyList: queryResolvers.userBuddyList(pubsub),
		userContentChatRoom: queryResolvers.getUserContentChatRoom(pubsub),
		getBookmarkedContents: queryResolvers.getBookmarkedContents(pubsub),

		// Notifications
		notifications: queryResolvers.notifications(pubsub),
	}
}
