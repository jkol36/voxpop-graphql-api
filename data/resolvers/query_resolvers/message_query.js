import MessageModel from "../models/Message"
import UsersModel from "../models/Users"
import UserMessageModel from "../models/UserMessage";
import MessageRoomModel from "../models/MessageRoom";
import ReactionModel from "../models/Reaction";
import {uniqueArrayObjects} from "../utils/common_utils";

export const messages = pubsub => {
	return async (_, args) => {
		const messages = await MessageModel.find({...args});

		const messagesWithUserData = await Promise.all(
			messages.map(async message => {
				const {_id, contentId, userId, title, text, imageUrl} = message;
				const user = await UsersModel.findOne({_id: userId});
				return {
					_id,
					contentId,
					userId,
					userName: user.name,
					userAvatar: user.avatar,
					title,
					text,
					imageUrl,
					date: message.created
				}
			})
		);

		return messagesWithUserData;
	}
}

export const userMessages = pubsub => {
	return async (_, args) => {
		// args = {messageRoomId}
		const messages = await UserMessageModel.find({...args});

		const messagesWithUserData = await Promise.all(
			messages.map(async message => {
				const {_id, messageRoomId, userId, title, text, imageUrl, created} = message;
				const user = await UsersModel.findOne({_id: userId});
				return {
					_id,
					messageRoomId,
					userId,
					userName: user.name,
					userAvatar: user.avatar,
					title,
					text,
					imageUrl,
					date: created
				}
			})
		);

		return messagesWithUserData;
	}
}

const getUserChatRoom = async (users) => {
	let messageRoom = await MessageRoomModel.findOne({users: {$all: users}, messageType: "USER"});
	if (!messageRoom) {
		const messageRoomData = {users, messageType: "USER"};
		messageRoom = await new MessageRoomModel(messageRoomData).save();
	}
	return messageRoom;
}

export const userChatRoom = pubsub => {
	return async (_, args, context) => {
		const user = context.user;
		const users = [user._id, args.userId];
		const messageRoom = await getUserChatRoom(users);
		return messageRoom;
	}
}


export const userMessageReactions = pubsub => {
	return async (_, args, context) => {
		const {messageId} = args;
		if (!messageId) {
			throw new Error("Message Id is empty or invalid.");
		}
		const messageReactions = await ReactionModel.find(args)
		return messageReactions;
	}
}

export const userMessageReactionToolTip = pubsub => {
	return async (_, args, context) => {
		const {reactionId, messageId} = args;
		if (!reactionId || !messageId) {
			throw new Error("Message Id or Reaction Id is empty or invalid.");
		}
		const userReaction = await ReactionModel.findById(reactionId);
		if (!userReaction) {
			return [];
		}

		const {reaction} = userReaction;
		const userReactions = await ReactionModel.find({messageId, reaction});
		return userReactions;
	}
}

export const userBuddyList = pubsub => {
	return async (_, args, context) => {
		const userId = context.user._id;
		const user = await UsersModel.findOne({_id: userId});
		const {_followingId} = user;
		let buddyList = [];
		for (let followingUserId of uniqueArrayObjects(_followingId)) {
			const followedUser = await UsersModel.findOne({_id: followingUserId}, {name: 1, avatar: 1});
			const userArgs = [userId, followingUserId];
			const messageRoom = await getUserChatRoom(userArgs);
			const lastMessage = await UserMessageModel.findOne({
				$query: {messageRoomId: messageRoom._id},
				$orderby: {$natural: -1}
			})
			const {_id, name, avatar} = followedUser;
			buddyList.push({buddyId: _id, name, avatar, messageRoom, lastMessage});
		}
		return buddyList;
	}
}


export const getUserContentChatRoom = pubsub => {
	return async (_, args, context) => {
		try {
			const messageType = "CONTENT";
			const {contentId} = args;
			const userId = context.user._id;
			let messageRoom = await MessageRoomModel.findOne({
				contentId: contentId,
				messageType
			});
			if (messageRoom) {
				//Check user if exist
				const {users} = messageRoom;
				const usersStringArray = users.map(user => user.toString());
				const isUserExists = usersStringArray.includes(userId);
				if (isUserExists) {
					return messageRoom
				}
			}
			return {
				_id: 0,
				users: [],
				messageType: "NONE",
			};
		} catch (err) {
			throw new Error(err)
		}
	}
}

export const getBookmarkedContents = pubsub => {
	return async (_, args, context) => {
		try {
			const messageType = "CONTENT";
			const userId = context.user._id;
			const ObjectId = require('mongodb').ObjectId;
			const userObjectId = new ObjectId(userId);
			let bookmarkedMessageRooms = await MessageRoomModel.find({
				messageType,
				users: {"$in": [userObjectId]}
			});
			if (bookmarkedMessageRooms) {
				return bookmarkedMessageRooms
			} else {
				throw new Error("No bookmarked contents.");
			}
		} catch (err) {
			throw new Error(err)
		}
	}
}