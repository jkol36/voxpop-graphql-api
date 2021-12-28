import UserModel from '../models/Users';
import {logger} from "../../utils/logger";
import bcrypt from 'bcryptjs';
import NotificationsModel from "../models/Notifications"
import {NOTIFICATION_CREATED} from '../../utils/constants';

export const addUser = (pubsub) => {
	return async (_, args) => {
		logger.info(args);
		const userData = args.user;
		const salt = bcrypt.genSaltSync(10);
		userData.hash_password = bcrypt.hashSync(userData.password, salt);
		try {
			return await new UserModel(userData).save();
		} catch (err) {
			throw err.errmsg;
		}
	}
}

export const updateUser = (pubsub) => {
	return async (_, args) => {
		console.log(args);
		const userData = args.user;
		const salt = bcrypt.genSaltSync(10);

		try {
			if ('password' in userData) {
				userData.hash_password = bcrypt.hashSync(userData.password, salt);
			}
			await UserModel.update({_id: userData._id}, userData, {upsert: true, new: true});
			const query = {_id: userData._id};
			const user = await UserModel.findOne(query);
			console.log(user);
			return user;
		} catch (err) {
			logger.error(JSON.stringify(err));
			throw `Update failed! ${err}`;
		}
	}
}

export const followUser = (pubsub) => {
	return async (_, args, context) => {
		try {
			console.log("[MUTATION] followUser");
			const userId = context.user._id;
			const followingUserId = args.user_id;
			const followAction = "follow";

			if (userId == followingUserId) {
				console.log("Can't follow the same user.");
				throw "Can't follow the same user.";
			}

			let userData = await UserModel.findOne({_id: userId});
			let followingUserData = await UserModel.findOne({_id: followingUserId});

			if (followAction === args.action) {
				console.log("Following...");
				const ObjectId = require('mongodb').ObjectId;
				const followerUserObjectId = new ObjectId(followingUserId);
				if (!userData._followingId.includes(followerUserObjectId)) {
					console.log("Inserting user to userData._followingId");
					userData._followingId.push(followerUserObjectId);
				}

				const followingUserObjectId = new ObjectId(userId);
				if (!followingUserData._followersId.includes(followingUserObjectId)) {
					console.log("Inserting user to followingUserData._followersId");
					followingUserData._followersId.push(followingUserObjectId);
				}

				// Prevent duplicate 'following' notification.
				const beenFollowed = await NotificationsModel.findOne({userId: followingUserId, followerUserId: userId, notifType: "follow"})
				if(!beenFollowed) {
					await new NotificationsModel({
						userId: followingUserId,
						followerUserId: userId,
						label: `${userData.name} has started following you.`,
						status: "new",
						created: new Date(),
						notifType: "follow"
					}).save()

					const notify = await NotificationsModel.find({userId: followingUserId})
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
				}
			}
			else {
				console.log("Un-follow...");
				//Remove following user from the current user
				userData._followingId = userData._followingId.filter((followerId) => followerId != followingUserId);

				//Remove current user from the follower users
				followingUserData._followersId = followingUserData._followersId.filter((followerId) => followerId != userId);
			}

			await UserModel.update({_id: userId}, userData, {upsert: true, new: true});
			await UserModel.update({_id: followingUserId}, followingUserData, {upsert: true, new: true});
			return userData;
		} catch (err) {
			throw `Update failed: ${err}`;
		}
	}
}

export const updateUserAdminRight = (pubsub) => {
	return async (_, args) => {
		try {
			const user_id = args.user_id;
			const admin = args.admin;
			await UserModel.update({_id: user_id}, {$set: {admin, primary: true}}, {upsert: true, new: true});
			const user = await UserModel.findOne({_id: user_id});
			return user
		} catch (err) {
			throw `Update failed: ${err}`;
		}
	}
}