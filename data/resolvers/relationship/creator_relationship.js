import ContentsModel from "../models/Contents"
import CollectionsModel from "../models/Collections"
import VotesModel from "../models/Votes"

export const creatorRelationship = pubsub => {
  return {
    async contents(data) {
      return await ContentsModel.find({ creatorId: data._id })
    },
    async collections(data) {
      return await CollectionsModel.find({ creatorId: data._id })
    },
    async scoreDetails(data) {
      const votes = await VotesModel.find({ creatorId: data._id })
      const upvotes = votes.filter(vote => vote.type === "upvote").length
      const downvotes = votes.filter(vote => vote.type === "downvote").length
      return {
        upvotes,
        downvotes,
        total: votes.length
      }
    }
  }
}
