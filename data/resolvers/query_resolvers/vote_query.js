import VotesModel from "../models/Votes"

export const votes = pubsub => {
  return async (_, args, context) => {
    return await VotesModel.find({ ...args })
  }
}

export const vote = pubsub => {
  return async (_, args, context) => {
    return await VotesModel.findById(args.voteId)
  }
}

export const votePoints = pubsub => {
  return async (_, args, context) => {
    return {
      total: (await VotesModel.find({ ...args })).length,
      upvotes: (await VotesModel.find({ ...args, type: "upvote" })).length,
      downvotes: (await VotesModel.find({ ...args, type: "downvote" })).length
    }
  }
}
