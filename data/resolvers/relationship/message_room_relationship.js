import MessageModel from "../models/Message";
import UsersModel from "../models/Users";
import ContentsModel from "../models/Contents";

export const messageRoomRelationship = pubsub => {
	return {
		async lastMessage(messageRoom) {
			const {contentId} = messageRoom;
			const lastMessage = await MessageModel.findOne({contentId}).sort({"_id": -1});

			const content = await ContentsModel.findById(contentId)
			const {title} = content;

			if (!lastMessage) return {name: "", avatar: "", text: "", created: "", title};

			const {created, text} = lastMessage;
			const userDetails = await UsersModel.findById(lastMessage.userId)
			const {name, avatar} = userDetails;
			return {name, avatar, text, created, title}
		}
	}
}
