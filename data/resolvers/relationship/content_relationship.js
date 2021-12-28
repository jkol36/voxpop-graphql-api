import CreatorsModel from "../models/Creators"
import CollectionsModel from "../models/Collections"
import VotesModel from "../models/Votes"
import CommentsModel from "../models/Comments"
import DomainsModel from "../models/Domains"

export const contentRelationship = pubsub => {
  return {
    async creator(data) {
      return await CreatorsModel.findById(data.creatorId)
    },
    async collection(data) {
      return await CollectionsModel.findById(data.collectionId)
    },
    async scoreDetails(data) {
      const votes = await VotesModel.find({ contentId: data._id })
      const upvotes = votes.filter(vote => vote.type === "upvote").length
      const downvotes = votes.filter(vote => vote.type === "downvote").length

      return {
        upvotes,
        downvotes,
        total: votes.length
      }
    },
    async comments(data) {
      return await CommentsModel.find({ contentId: data._id })
    },
    async domain(data) {
      return await DomainsModel.findById(data.domainId)
    }
  }
}
