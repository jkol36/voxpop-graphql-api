import ActivitiesModel from "../models/Activities"
import ContentsModel from "../models/Contents"
import CreatorsModel from '../models/Creators'
import CommentsModel from "../models/Comments"
import VotesModel from "../models/Votes"
import QuotesModel from "../models/Quotes"

export const activities = pubsub => {
    return async (_, args) => {
        console.log("Function: activities")
        const {limit, offset, searchKey} = args
        const searchArgs = searchKey ? {
            $text: {
                $search: searchKey,
                $caseSensitive: false
            }
        } : {}
        console.log("searchArgs", searchArgs)
        const total = await ContentsModel.find(searchArgs).count()
        const activitiesResult = await ActivitiesModel.find(searchArgs).sort({created: 'desc'}).skip(offset * limit).limit(limit)
        if (activitiesResult.length > 0) {

            const activities = await Promise.all(
                activitiesResult.map(async activity => {
                    let data = {}
                    let response
                    let content
                    switch (activity.event) {
                        case "POSTED":
                            data = await ContentsModel.findById(activity.ids.contentId)
                            const postCreator = await CreatorsModel.findById(data.creatorId)
                            data = {...data._doc, creator: postCreator}
                            content = data.title;
                            response = {event: activity.event, data, _id: activity._id}
                            break;
                        case "VOTED":
                            data = await VotesModel.findById(activity.ids.voteId)
                            const voterContent = await ContentsModel.findById(data.contentId)
                            const voterCreator = await CreatorsModel.findById(data.creatorId)
                            data = {...data._doc, content: voterContent, creator: voterCreator}
                            response = {event: activity.event, data, _id: activity._id}
                            content = data.content.title
                            break;
                        case "COMMENTED":
                            data = await CommentsModel.findById(activity.ids.commentId)
                            const commenterContent = await ContentsModel.findById(data.contentId)
                            const commenterCreator = await CreatorsModel.findById(data.creatorId)
                            data = {...data._doc, content: commenterContent, creator: commenterCreator}
                            response = {event: activity.event, data, _id: activity._id}
                            content = data.text
                            break;
                        case "QUOTED":
                            data = await QuotesModel.findById(activity.ids.quoteId)
                            const quoterContent = await ContentsModel.findById(data.contentId)
                            const quoterCreator = await CreatorsModel.findById(data.creatorId)
                            data = {...data._doc, content: quoterContent, creator: quoterCreator}
                            response = {event: activity.event, data, _id: activity._id}
                            content = data.quote
                            break;
                        default:
                            break
                    }
                    const {_id} = activity
                    await ActivitiesModel.update(
                        {_id: activity._id},
                        {
                            $set: {
                                content
                            }
                        }
                    )
                    return response;
                })
            )
            return {activities, total}
        }
        return []
    }
}
