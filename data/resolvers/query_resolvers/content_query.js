import ContentsModel from "../models/Contents"
import {upsertSong} from "../utils/hiphop_utils"

export const content = pubsub => {
	return async (_, args, context) => {
		switch (context.domain) {
			case "hiphop":
				let content = {}
				if (!args.contentId) content = await ContentsModel.findOne({...args})
				else content = await ContentsModel.findById(args.contentId)

				if (!content) return await upsertSong(args.options)
				return content
			default:
				return await ContentsModel.findById(args.contentId)
		}
	}
}

export const contents = pubsub => {
	return async (_, args, context) => {
		switch (context.domain) {
			case "hiphop":
				return await ContentsModel.find({...args});
			default:
				return await ContentsModel.find({...args});
		}
	}
}

export const searchContent = pubsub => {
	return async (_, args, context) => {
		return await ContentsModel.find({
			title: new RegExp(args.text, 'i')
		})
	}
}
