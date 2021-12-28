import {MESSAGE_CREATED, USER_MESSAGE_CREATED, USER_REACTION, NOTIFICATION_CREATED} from '../../utils/constants';
import MessageModel from "../models/Message";
import MessageRoomModel from "../models/MessageRoom";
import UserMessageModel from "../models/UserMessage";
import UsersModel from "../models/Users";
import ReactionModel from "../models/Reaction";
import NotificationsModel from "../models/Notifications"

export const createMessage = pubsub => {
	return async (_, args, context) => {
		console.log("[MUTATION] createMessage");
		try {
			const user = context.user;
			const userDetails = await UsersModel.findById(user._id)
			const message = await new MessageModel({
				...args.message,
				userId: user._id,
				created: new Date()
			}).save();
			const messageCreated = {
				_id: message._id,
				contentId: message.contentId,
				userId: user._id,
				userName: userDetails.name,
				userAvatar: userDetails.avatar,
				title: message.title,
				text: message.text,
				imageUrl: message.imageUrl,
				date: message.created
			}
			pubsub.publish(MESSAGE_CREATED, {messageCreated});
			return messageCreated;
		} catch (err) {
			throw new Error(err)
		}
	}
}

export const createUserMessage = pubsub => {
	return async (_, args, context) => {
		console.log("[MUTATION] createUserMessage");

		async function createUserMessage(messageRoom, user, userDetails) {
			const userMessage = await new UserMessageModel({
				messageRoomId: messageRoom._id,
				...args.message,
				userId: user._id,
				created: new Date()
			}).save();
			const userMessageCreated = {
				_id: userMessage._id,
				messageRoomId: messageRoom._id,
				userId: user._id,
				userName: userDetails.name,
				userAvatar: userDetails.avatar,
				title: userMessage.title,
				text: userMessage.text,
				imageUrl: userMessage.imageUrl,
				date: userMessage.created
			}

			const hasMessageNotif = await NotificationsModel.findOne({userId: args.userId, messageRoomId: userMessage.messageRoomId})

			if(hasMessageNotif) {
				await NotificationsModel.update(
					{userId: hasMessageNotif.userId, messageRoomId: hasMessageNotif.messageRoomId},
					{$set: {
						status: "new",
						created: new Date()
					  }
					},
					{upsert: true, new: true}
				  )
			} else {
				 await new NotificationsModel({
					userId: args.userId,
					senderUserId: user._id,
					messageRoomId: userMessage.messageRoomId,
					label: `${userDetails.name} sent you a message`,
					status: "new",
					created: new Date(),
					notifType: "message"
				}).save()
			}
			const notify = await NotificationsModel.find({userId: args.userId})
			console.log({notify})
			let notificationCreated = []
			notify.forEach(item => {
				const notification = {
					_id: item._id,
					userId: item.userId,
					senderUserId: item.senderUserId,
					messageRoomId: item.messageRoomId,
					followerUserId: item.followerUserId,
					contentId: item.contentId,
					contentDomain: item.contentDomain,
					label: item.label,
					status: item.status,
					created: item.created,
					notifType: item.notifType
				}
				notificationCreated.push(notification)
			});
			pubsub.publish(NOTIFICATION_CREATED, {notificationCreated})
			
			return userMessageCreated;
		}

		try {
			let userMessageCreated = {};
			const user = context.user;
			const userDetails = await UsersModel.findById(user._id)
			const users = [user._id, args.userId];
			const messageRoom = await MessageRoomModel.findOne({users: {$all: users}, messageType: "USER"});
			if (messageRoom) {
				console.log("User chatroom already exists!");
				userMessageCreated = await createUserMessage(messageRoom, user, userDetails);
			} else {
				console.log("Creating user chatroom...");
				const messageRoomData = {users, messageType: "USER"};
				const messageRoom = await new MessageRoomModel(messageRoomData).save();
				userMessageCreated = await createUserMessage(messageRoom, user, userDetails);
			}

			pubsub.publish(USER_MESSAGE_CREATED, {userMessageCreated});
			return userMessageCreated;
		} catch (err) {
			throw new Error(err)
		}
	}
}

export const createUserReaction = pubsub => {
	return async (_, args, context) => {
		console.log("[MUTATION] createUserReaction");
		try {
			const user = context.user;
			const userReaction = await new ReactionModel({
				...args,
				userId: user._id,
				created: new Date()
			}).save();
			pubsub.publish(USER_REACTION, {userReaction});
			return userReaction;
		} catch (err) {
			throw new Error(err)
		}
	}
}

export const deleteUserReaction = pubsub => {
	return async (_, args, context) => {
		console.log("[MUTATION] deleteUserReaction");
		try {
			const {reactionId} = args;
			const userReaction = await ReactionModel.findById(reactionId)
			await ReactionModel.findByIdAndRemove(reactionId);
			pubsub.publish(USER_REACTION, {userReaction});
			return userReaction;
		} catch (err) {
			throw new Error(err)
		}
	}
}

export const createContentChatRoom = pubsub => {
	return async (_, args, context) => {
		console.log("[MUTATION] createContentChatRoom");
		const messageType = "CONTENT";
		try {
			const userId = context.user._id;
			const {contentId} = args;
			let messageRoom = await MessageRoomModel.findOne({
				contentId: contentId,
				messageType
			});
			if (messageRoom) {
				//Check user if exist
				const {users, _id} = messageRoom;
				console.log("Content chatroom already exists!");
				const usersStringArray = users.map(user => user.toString());
				if (!usersStringArray.includes(userId)) {
					console.log("User not found in content chatroom. Adding user " + userId);
					users.push(userId);
					messageRoom = await MessageRoomModel.findByIdAndUpdate(_id, {users}, {new: true});
				}
			} else {
				console.log("Creating Content chatroom...");
				const messageRoomData = {users: [userId], contentId, messageType};
				messageRoom = await new MessageRoomModel(messageRoomData).save();
			}
			return messageRoom;
		} catch (err) {
			throw new Error(err)
		}
	}
}


export const removeContentChatRoom = pubsub => {
	return async (_, args, context) => {
		console.log("[MUTATION] removeContentChatRoom");
		const messageType = "CONTENT";
		try {
			const userId = context.user._id;
			const {contentId} = args;
			let messageRoom = await MessageRoomModel.findOne({
				contentId: contentId,
				messageType
			});
			if (messageRoom) {
				const {users, _id} = messageRoom;
				const newUsers = users.filter(user => user.toString() !== userId);
				messageRoom = await MessageRoomModel.findByIdAndUpdate(_id, {users: newUsers}, {new: true});
			} else {
				throw new Error("Bookmarked content not found!")
			}
			return messageRoom;
		} catch (err) {
			throw new Error(err)
		}
	}
}