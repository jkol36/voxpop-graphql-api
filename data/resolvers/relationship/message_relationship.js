import ReactionModel from "../models/Reaction"

export const messageRelationship = pubsub => {
	return {
		async reaction(data) {
			return await ReactionModel.find({...data});
		},
	}
}
