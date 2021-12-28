import TextsModel from '../models/Texts'
import {logger} from "../../utils/logger"
import crypto from 'crypto'

export const createText = pubsub => {
    return async (_, args) => {
        logger.info("Function: createText")
        const text = {...args.text, url: crypto.randomBytes(20).toString('hex') }
        try {
            return await new TextsModel(text).save()
        } catch(err) {
            throw new Error(err)
        }
    }
}

export const editText = pubsub => {
    return async(_, args) => {
        logger.info("Function: editText")

        try {
            return await TextsModel.findByIdAndUpdate(args.text_id, args.text, {new: true, upsert: true})
        } catch(err) {
            throw new Error(err)
        }
    }
}

export const deleteText = pubsub => {
    return async(_, args) => {
        logger.info('Function: deleteText')

        try {
            await TextsModel.findByIdAndRemove(args.text_id)
            return true
        } catch(err) {
            throw new Error(err)
        }
    }
}