import QuotesModel from "../models/Quotes"

export const quote = pubsub => {
  return async (_, args, context) => {
    return await QuotesModel.findById(args.quoteId)
  }
}

export const quotes = pubsub => {
  return async (_, args, context) => {
    return await QuotesModel.find({ ...args })
  }
}
