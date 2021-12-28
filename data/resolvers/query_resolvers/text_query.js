import TextModel from '../models/Texts'

export const text = (pubsub) => {
	return async (_, args, context) => {
        return await TextModel.findOne({url: args.code})
    }
}