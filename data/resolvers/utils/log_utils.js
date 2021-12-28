
import VoteLogsModel from "../models/VoteLogs"
import SongsModel from "../models/Songs"
import ArtistsModel from "../models/Artists"

export const logVote = async (vote, text) => {
	const song = await SongsModel.findOne({songId: vote._songId});
	const artist = await ArtistsModel.findOne({artistId: vote._artistId});

	const logData = {
		_voteId: vote._id,
		_userId: vote._userId,
		songTitle: song.title,
		songArtist: artist.name,
		description: text,
		action: vote.isUpvote ? "UPVOTE" : "DOWNVOTE",
		tokens: vote.tokens,
		created: new Date()
	}
	const log = await new VoteLogsModel(logData).save();
}