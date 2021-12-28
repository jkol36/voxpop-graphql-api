import ContentsModel from '../models/Contents'
import CreatorsModel from '../models/Creators'

export const quoteRelationship = pubsub => {
    return {
      async content(data) {
        return await ContentsModel.findById(data.contentId)
      },
      async creator(data) {
          return await CreatorsModel.findById(data.creatorId)
      }
    }
  }