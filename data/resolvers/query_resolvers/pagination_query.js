import ContentsModel from "../models/Contents"
import CreatorsModel from "../models/Creators"
import VotesModal from "../models/Votes"
import ActivitiesModel from "../models/Activities"

const getItemsWithScore = async (items, typeId) => {
	const itemsWithScore = await Promise.all(
		items.map(async item => {
			const upvotes = await VotesModal.find({
				[typeId]: item._id,
				type: "upvote"
			})
			const downvotes = await VotesModal.find({
				[typeId]: item._id,
				type: "downvote"
			})
			return {
				...item,
				scoreDetails: {upvotes: upvotes.length, downvotes: downvotes.length}
			}
		})
	)
	return itemsWithScore.map(item => ({
		...item._doc,
		scoreDetails: item.scoreDetails
	}))
}

const appendCreatorToContent = async contents => {
	const contentsWithCreator = await Promise.all(
		contents.map(async content => {
			const creator = await CreatorsModel.findById(content.creatorId)
			return {...content, creator}
		})
	)
	return contentsWithCreator
}

export const paginate = pubsub => {
	return async (_, args, context) => {
		const page = args.page
		const skip = page.page - 1
		const compare = page.sort === "DESC" ? -1 : 1
		const searchTerm = page.searchTerm
		const searchBy = page.searchBy
		const dateRange = page.dateRange
		let total = 0

		switch (page.type) {
			case "Content":
				let contents = []

				let filterArgs = {};
				if (searchBy === "date_range") {
					const {from, to} = dateRange;
					filterArgs.created = {
						$gte: new Date(from).toISOString(),
						$lte: new Date(to).toISOString()
					}
				}

				if (searchTerm) {
					filterArgs.$text = {$search: searchTerm};
				}

				total = await ContentsModel.find(filterArgs).count()
				contents = await ContentsModel.find(filterArgs)
					.sort({score: compare})
					.skip(skip * page.limit)
					.limit(page.limit)

				const contentsWithScore = await getItemsWithScore(contents, "contentId")
				const detailedContents = await appendCreatorToContent(contentsWithScore)
				return {...page, data: detailedContents, total}
			case "Creator":
				let creators = []
				if (searchTerm) {
					total = await CreatorsModel.find({$text: {$search: searchTerm}}).count()
					creators = await CreatorsModel.find({$text: {$search: searchTerm}})
						.sort({score: compare})
						.skip(skip * page.limit)
						.limit(page.limit)
				}
				else {
					total = await CreatorsModel.count({})
					creators = await CreatorsModel.find({})
						.sort({score: compare})
						.skip(skip * page.limit)
						.limit(page.limit)
				}
				const creatorsWithScore = await getItemsWithScore(creators, "creatorId")
				return {...page, data: creatorsWithScore, total}
			case "Activity":
				total = await ActivitiesModel.count({})
				const activities = await ActivitiesModel.find({})
					.sort({created: compare})
					.skip(skip * page.limit)
					.limit(page.limit)
				return {...page, data: activities, total}
			default:
				return
		}
	}
}
