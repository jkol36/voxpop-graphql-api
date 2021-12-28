import CommentsModel from "../models/Comments"
import NotificationsModel from "../models/Notifications"
import ContentsModel from "../models/Contents"
import DomainsModel from "../models/Domains"
import UserModel from '../models/Users';
import {logger} from "../../utils/logger"
import {logActivity} from "../utils/activities_utils"
import {uniq, find} from "lodash"
import {NOTIFICATION_CREATED} from '../../utils/constants';

export const addComment = pubsub => {
    return async (_, args) => {
        logger.info("Function: addComment")

        try {
            const comment = await new CommentsModel({
                ...args.comment,
                created: new Date()
            }).save()

            await logActivity("COMMENTED", {commentId: comment._id}, comment.text)

            // test commit
            if (comment) {
                const {contentId, userId} = args.comment
                const commenterUserData = await UserModel.findOne({_id: userId});
                let label = `${commenterUserData.name} commented on your content.`
                const hasCommentNotif = await NotificationsModel.findOne({contentId, notifType: "comment"})
                const content = await ContentsModel.findOne({_id: contentId})
                const contentDomain = await DomainsModel.findOne({_id: content.domainId})

                // Content creator user info
                const userData = await UserModel.findOne({creatorId: content.creatorId})
                const comments = await CommentsModel.find({contentId})

                // Comparisons return false because of white spaces
                const contentCreatorId = userData._id.toString().trim()
                const commenterUserId = commenterUserData._id.toString().trim()

                let users = []
                comments.forEach(item => {
                    const userId = item.userId.toString().trim()
                    if (userId !== contentCreatorId)
                        users.push(userId)
                })
                const usersCommented = uniq(users)
                if (usersCommented.length === 2) {
                    const _id = find(usersCommented, item => item != commenterUserData.userId)
                    const secondCommenterUserData = await UserModel.findOne({_id})
                    label = `${commenterUserData.name} and ${secondCommenterUserData.name} commented on your content.`
                } else if (usersCommented.length > 2) {
                    label = `${commenterUserData.name} and ${usersCommented.length - 1} others commented on your content.`
                }
                if (hasCommentNotif) {
                    await NotificationsModel.update(
                        {_id: hasCommentNotif._id},
                        {
                            $set: {
                                label,
                                status: "new",
                                created: new Date(),
                            }
                        },
                        {upsert: true, new: true}
                    )

                    const notify = await NotificationsModel.find({userId: userData._id})
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
                } else if (contentCreatorId !== commenterUserId) {
                    // Prevent adding notifications when user comments on his own content
                    await new NotificationsModel({
                        userId: userData._id,
                        contentId,
                        contentDomain: contentDomain.url,
                        label,
                        status: "new",
                        created: new Date(),
                        notifType: "comment"
                    }).save()
                    const notify = await NotificationsModel.find({userId: userData._id})
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
            return comment
        } catch (err) {
            throw new Error(err)
        }
    }
}

export const editComment = pubsub => {
    return async (_, args) => {
        logger.info("Function: editComment")

        try {
            const comment = await CommentsModel.findByIdAndUpdate(
                args.comment_id,
                args.comment,
                {new: true, upsert: true}
            )
            return comment
        } catch (err) {
            throw new Error(err)
        }
    }
}

export const deleteComment = pubsub => {
    return async (_, args) => {
        logger.info("Function: deleteComment")

        try {
            await CommentsModel.findByIdAndRemove(args.comment_id)
            return {deleted: true}
        } catch (err) {
            throw new Error(err)
        }
    }
}
