import ReactionModel from "../models/Reaction"

export const userMessageRelationship = pubsub => {
	return {
		async reaction(data) {
			return await ReactionModel.find({...data});
		},
	}
}
