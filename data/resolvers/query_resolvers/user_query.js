import {isUndefined} from 'lodash';
import UserModel from '../models/Users';
import VotesModel from '../models/Votes';
import ArtistsModel from '../models/Artists';
import VoteLogsModel from '../models/VoteLogs';
import {scoreUtil} from "../utils/score_utils"
import {uniqueArrayObjects} from "../utils/common_utils";

export const getUsers = (pubsub) => {
	return async (_, args, context) => {

		let users = await UserModel.find(function (err, usersData) {
			if (!err) {
				return usersData;
			} else {
				throw err;
			}
		});

		return users;
	}
}

export const findUserById = (pubsub) => {
	return async (_, args, context) => {
		try {
			let userId = args && args.user_id;
			const username = args && args.username;
			let user = {};

			if (username !== "" && username !== undefined) {
				user = await UserModel.findOne({username});
			} else if (userId !== "" && userId !== undefined) {
				user = await UserModel.findOne({_id: userId});
			} else if ('creatorId' in args && args.creatorId !== undefined) {
				const ObjectId = require('mongodb').ObjectId;
				user = await UserModel.findOne({creatorId: new ObjectId(args.creatorId)});
			} else {
				userId = context.user._id;
				user = await UserModel.findOne({_id: userId});
			}

			//Check user
			const b = Object.is(user, null);
			if (b) {
				throw new Error("User not found");
			}

			userId = user._id;
			// get user total votes
			const userVotes = await VotesModel.find({_userId: userId});

			user.vote_cast = isUndefined(userVotes) ? 0 : userVotes.length;

			user._followingId = uniqueArrayObjects(user._followingId);
			user._followersId = uniqueArrayObjects(user._followersId);

			// calculate user points
			const followedArtists = await getUsersFollowedArtists(userId);

			const artistScoresArray = Array.from(followedArtists, followedArtist => followedArtist.score);

			user.points = isUndefined(artistScoresArray) ? 0 : artistScoresArray.reduce((a, b) => a + b, 0);

			return user;
		} catch (err) {
			throw new Error(err);
		}
	}
}


export const searchUser = async (queryName, context) => {
	const users = await UserModel.find({
		name: {
			$regex: new RegExp(queryName, "i")
		},
		_id: {$ne: context.user._id}
	});

	return users;
}


export const userFantasyLabels = (pubsub) => {
	return async (_, args) => {
		try {
			let userId = args && args.user_id;
			const username = args && args.username;
			let user = {};

			if (userId === "" && username !== "") {
				user = await UserModel.findOne({username});
			} else {
				user = await UserModel.findOne({_id: userId});
			}

			//Check user
			const b = Object.is(user, null);
			if (b) {
				throw new Error("User not found");
			}

			userId = user._id;
			const fantasyLabels = await getUsersFollowedArtists(userId);
			//return top 10 followed artists only
			return fantasyLabels.slice(0, 10);
		}
		catch (err) {
			throw new Error(err)
		}
	}
}

const getUsersFollowedArtists = async (userId) => {
	const artists = await ArtistsModel.find({followers: {$all: [userId]}});
	const usersFollowedArtists = await Promise.all(
		artists.map(async artist => {
			const totalScore = await scoreUtil({artist_id: artist.artistId})
			console.log(artist.name, totalScore);
			return {
				user_id: userId,
				artist_id: artist.artistId,
				name: artist.name,
				image_url: artist.imageUrl,
				score: totalScore
			};

		})
	)
	usersFollowedArtists.sort((a, b) => b.score - a.score);
	return usersFollowedArtists;
}

export const getUserVoteLogs = (pubsub) => {
	return async (_, args, context) => {
		try {
			let userId = args && args.user_id;
			const username = args && args.username;
			let user = {};

			if (userId === "" && username !== "") {
				user = await UserModel.findOne({username});
			} else if (userId !== "" && username === "") {
				user = await UserModel.findOne({_id: userId});
			} else {
				userId = context.user._id;
				user = await UserModel.findOne({_id: userId});
			}


			//Check user
			const b = Object.is(user, null);
			if (b) {
				throw new Error("User not found");
			}

			userId = user._id;

			// get user total votes
			const voteLog = await VoteLogsModel.find({_userId: userId});

			return voteLog;
		} catch (err) {
			throw new Error(err);
		}
	}
}
