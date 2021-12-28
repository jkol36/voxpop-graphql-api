import VotesModel from "../models/Votes"
import VoteLogsModel from '../models/VoteLogs'
import ContentsModel from '../models/Contents'
import CreatorsModel from '../models/Creators'

import {logger} from "../../utils/logger"
import {logActivity} from '../utils/activities_utils'

export const addVote = pubsub => {
    return async (_, args) => {
        logger.info("Function: add vote")
        const voteData = {...args.vote, created: new Date()}

        try {
            const vote = await new VotesModel(voteData).save()
            await updateScore(vote)
            await generateVoteLogs(vote, voteData.text)
            await logActivity("VOTED", {voteId: vote._id}, voteData.text)
            return vote
        } catch (err) {
            throw new Error(err)
        }
    }
}

const updateScore = async (vote) => {
    const score = vote.type === 'upvote' ? vote.points : -vote.points
    const content = await ContentsModel.findById(vote.contentId)
    const contentScore = content.score + score
    await ContentsModel.findByIdAndUpdate(vote.contentId, {score: contentScore})

    const creator = await CreatorsModel.findById(vote.creatorId)
    const creatorScore = creator.score + score
    await CreatorsModel.findByIdAndUpdate(vote.creatorId, {score: creatorScore})
}

const generateVoteLogs = async (vote, text) => {
    const content = await ContentsModel.findById(vote.contentId)
    const creator = await CreatorsModel.findById(vote.creatorId)
    const votelogsData = {
        userId: vote.userId,
        voteId: vote._id,
        title: content.title,
        author: creator.name,
        action: vote.type,
        tokens: vote.points,
        description: text,
        created: new Date()
    }
    await new VoteLogsModel(votelogsData).save()
}