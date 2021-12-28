import QuotesModel from "../models/Quotes"
import {logActivity} from "../utils/activities_utils"
import {logger} from "../../utils/logger"

export const addQuote = pubsub => {
    return async (_, args) => {
        logger.info("Function: add quote")
        const quoteData = {...args.quote, created: new Date()}

        try {
            const quote = await new QuotesModel(quoteData).save()
            await logActivity("QUOTED", {quoteId: quote._id}, quoteData.quote)
            return quote
        } catch (err) {
            throw new Error(err)
        }
    }
}
