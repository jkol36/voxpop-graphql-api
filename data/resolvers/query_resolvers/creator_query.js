import CreatorModel from "../models/Creators"
import UsersModel from '../models/Users'
import { upsertArtist } from "../utils/hiphop_utils"

export const creator = pubsub => {
  return async (_, args, context) => {
    switch (context.domain) {
      case "hiphop":
        let creator = {}
        if (!args.creatorId) creator = await CreatorModel.findOne({ ...args })
        else creator = await CreatorModel.findById(args.creatorId)

        if (!creator) return await upsertArtist(args.options)
        return creator
      default:
        return await CreatorModel.findById(args.creatorId)
    }
  }
}

export const creators = pubsub => {
  return async (_, args, context) => {
    // TODO Logic and functions
  }
}

export const searchCreator = pubsub => {
  return async (_, args, context) => {
    return await UsersModel.find({
      name:  new RegExp(args.text, 'i')
    })
  }
}
