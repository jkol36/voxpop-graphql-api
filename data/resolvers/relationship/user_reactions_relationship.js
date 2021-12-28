import UserModel from '../models/Users';

export const userReactionsRelationship = pubsub => {
	return {
		async user(userReaction) {
			const {userId} = userReaction;
			return await UserModel.findById(userId);
		},
	}
}
