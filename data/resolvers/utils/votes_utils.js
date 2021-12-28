import chalk from "chalk"
import VotesModel from "../models/Votes"
import { Error } from "mongoose"
import {logVote} from "./log_utils";

const Lyricist = require("lyricist/node6")

export const vote = pubsub => {
  return async (_, args) => {
    console.log("Function: getVotes")
    const voteId = args.id

    try {
      return await VotesModel.findOne({ _id: voteId })
    } catch (err) {
      throw new Error(err)
    }
  }
}

export const votes = pubsub => {
  return async (_, args) => {
    console.log(chalk.bgYellow(chalk.black("Function: votes")))

    const userId = args.user_id
    const songId = args.song_id
    const isUpvote = args.is_upvote

    let payload = {}
    if (userId) payload._userId = userId
    if (songId) payload._songId = songId
    if (isUpvote || typeof isUpvote === "boolean") payload.isUpvote = isUpvote

    if (userId || songId) {
      try {
        return await VotesModel.find(payload)
      } catch (err) {
        throw new Error(err)
      }
    }

    throw new Error("User Id and Song Id are empty!")
  }
}

const getSong = async songId => {
  const accessToken = process.env.LYRICIST_TOKEN
  const lyricist = new Lyricist(accessToken)
  let response = {}

  try {
    response = await lyricist.song(songId, { fetchLyrics: true })
  } catch (err) {
    if (err.code === "ENOTFOUND") {
      getSong(songId)
    }
  }
  return response
}

export const createVote = pubsub => {
  return async (_, args) => {
    console.log(chalk.bgGreen(chalk.black("Function: createVote")))
    const vote = args.vote

    const song = await getSong(vote.song_id)

    let text = ""
    if (song.lyrics) {
      text = song.lyrics.substring(vote.start_index, vote.end_index)
    }

    const tokens = text.length > 0 ? text.split(/\s+/g).length : 0

    const payload = {
      _songId: vote.song_id,
      _userId: vote.user_id,
      _artistId: vote.artist_id,
      startIndex: vote.start_index,
      endIndex: vote.end_index,
      isUpvote: vote.is_upvote,
      tokens: tokens,
      created: new Date()
    }

    try {
      const voteData = await new VotesModel(payload).save();
	    await logVote(voteData, text);
      return voteData;
    } catch (err) {
      throw new Error(err)
    }
  }
}
