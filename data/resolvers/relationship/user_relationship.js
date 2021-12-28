import TextsModel from "../models/Texts"
import UserModel from '../models/Users';
import CreatorsModel from "../models/Creators"
import VotesModel from '../models/Votes'
import QuotesModel from '../models/Quotes'
import VoteLogsModel from '../models/VoteLogs'
import ContentsModel from "../models/Contents";
import CommentsModel from "../models/Comments"

export const userRelationship = pubsub => {
	return {
		async submissions(data) {
			return await TextsModel.find({authorId: data._id})
		},
		async contents(data) {
			return await ContentsModel.find({creatorId: data.creatorId}) 
		},
		async creator(data) {
			return await CreatorsModel.findById(data.creatorId)
		},
		async scoreDetails(data) {
			const votes = await VotesModel.find({userId: data._id})
			const upvotes = votes.filter(vote => vote.type === "upvote").length
			const downvotes = votes.filter(vote => vote.type === "downvote").length

			return {
				upvotes,
				downvotes,
				total: votes.length
			}
		},
		async history(data) {
			const history = await VoteLogsModel.find({userId: data._id})
			return await Promise.all(
				history.map(async vote => {
				const voteDetail = await VotesModel.findOne({ _id: vote.voteId })
				const contentVoted = await ContentsModel.findOne({_id: voteDetail && voteDetail.contentId})
				const votes = await VotesModel.find({ contentId: contentVoted && contentVoted._id })
				const upvotes = votes.filter(vote => vote.type === "upvote").length
				const downvotes = votes.filter(vote => vote.type === "downvote").length
				const scoreDetails = {
					upvotes,
					downvotes,
					total: votes.length
				}
				return {
					_id: vote._id,
					userId: vote.userId,
					voteId: vote.voteId,
					title: vote.title,
					author: vote.author,
					action: vote.action,
					description: vote.description,
					created: vote.created,
					scoreDetails
				}
			}))
		},
		async quotes(data) {
			return await QuotesModel.find({userId: data._id})
		},
		async comments(data) {
			const comments = await CommentsModel.find({userId: data.id})
			return await Promise.all(
				comments.map(async comment => {
				const contentCommented = await ContentsModel.findOne({_id: comment.contentId}) 
				const votes = await VotesModel.find({ contentId: contentCommented._id })
				const upvotes = votes.filter(vote => vote.type === "upvote").length
				const downvotes = votes.filter(vote => vote.type === "downvote").length
				const scoreDetails = {
					upvotes,
					downvotes,
					total: votes.length
				}
				return {
					_id: comment._id,
					text: comment.text,
					contentId: comment.contentId,
					created: comment.created,
					contentTitle: contentCommented.title,
					scoreDetails
				}
			}))
		},
		async followedUserProfileData(data) {
			return await Promise.all(
				data._followingId.map(async id => { 
					const user = await UserModel.findOne({_id: id})
					return {
						async contents() {
							return await ContentsModel.find({creatorId: user.creatorId}) 
						},
						async history() {
							const history = await VoteLogsModel.find({userId: user._id})
							return await Promise.all(
								history.map(async vote => {
									const voteDetail = await VotesModel.findOne({ _id: vote.voteId })
									const contentVoted = await ContentsModel.findOne({_id: voteDetail && voteDetail.contentId})
									const votes = await VotesModel.find({ contentId: contentVoted && contentVoted._id })
									const upvotes = votes.filter(vote => vote.type === "upvote").length
									const downvotes = votes.filter(vote => vote.type === "downvote").length
									const scoreDetails = {
										upvotes,
										downvotes,
										total: votes.length
									}
									return {
										_id: vote._id,
										userId: vote.userId,
										voteId: vote.voteId,
										title: vote.title,
										author: vote.author,
										action: vote.action,
										description: vote.description,
										created: vote.created,
										scoreDetails
									}
								}))
						},
						async comments() {
							const comments = await CommentsModel.find({userId: user._id})
							return await Promise.all(
								comments.map(async comment => {
								const contentCommented = await ContentsModel.findOne({_id: comment.contentId}) 
								const votes = await VotesModel.find({ contentId: contentCommented._id })
								const upvotes = votes.filter(vote => vote.type === "upvote").length
								const downvotes = votes.filter(vote => vote.type === "downvote").length
								const scoreDetails = {
									upvotes,
									downvotes,
									total: votes.length
								}
								return {
									_id: comment._id,
									text: comment.text,
									contentId: comment.contentId,
									created: comment.created,
									contentTitle: contentCommented.title,
									commenterName: user.name,
									scoreDetails
								}
							}))
						},
						async quotes() {
							return await QuotesModel.find({userId: user._id})
						}
					}
				})
			)
		}
	}
}
