import ArtistsModel from "../models/Artists"
import UsersModel from "../models/Users"
import { scoreUtil, voteTypeUtil } from "../utils/score_utils"
import { remove } from "lodash"

export const follow = pubsub => {
  return async (_, args) => {
    const artistId = args.artist_id
    const userId = args.user_id

    let artist = await ArtistsModel.find({ artistId })
    // console.log("artist", artist)

    if(!artist[0].followers.find(id => id == userId)){
        artist[0].followers = [...artist[0].followers, userId]
    }

    try {
      const totalScore = await scoreUtil({ artist_id: args.artist_id })
      const upvotes = await voteTypeUtil({
        artist_id: args.artist_id,
        vote_type: true
      })
      const downvotes = await voteTypeUtil({
        artist_id: args.artist_id,
        vote_type: false
      })

      const updatedArtist = await ArtistsModel.update({ artistId }, artist[0], {
        upsert: true,
        new: true
      })
      // console.log("updated artist", updatedArtist)

      artist = await ArtistsModel.find({ artistId })

      const users = await Promise.all(
        artist[0].followers.map(async id => {
          let user = await UsersModel.find({ _id: id })
          console.log("user", user)
          return {
            _id: user[0]._id,
            name: user[0].name,
            username: user[0].username,
            email: user[0].email,
            avatar: user[0].avatar
          }
        })
      )

      return {
        _id: artist[0]._id,
        artist_id: artist[0].artistId,
        name: artist[0].name,
        image_url: artist[0].imageUrl,
        total_score: totalScore,
        upvotes,
        downvotes,
        followers: users
      }
    } catch (err) {
      throw new Error(err)
    }
  }
}

export const unfollow = pubsub => {
  return async (_, args) => {
    const artistId = args.artist_id
    const userId = args.user_id

    let artist = await ArtistsModel.find({ artistId })
    // console.log("artist", artist)
    const followers = remove(artist[0].followers, id => id === userId)
    artist[0].followers = [...followers]
    // console.log('followers', followers)

    try {
      const totalScore = await scoreUtil({ artist_id: args.artist_id })
      const upvotes = await voteTypeUtil({
        artist_id: args.artist_id,
        vote_type: true
      })
      const downvotes = await voteTypeUtil({
        artist_id: args.artist_id,
        vote_type: false
      })

      const updatedArtist = await ArtistsModel.update({ artistId }, artist[0], {
        upsert: true,
        new: true
      })
      // console.log("updated artist", updatedArtist)

      artist = await ArtistsModel.find({ artistId })

      const users = await Promise.all(
        followers.map(async id => {
          let user = await UsersModel.find({ _id: id })
          // console.log("user", user)
          return {
            _id: user[0]._id,
            name: user[0].name,
            username: user[0].username,
            email: user[0].email,
            avatar: user[0].avatar
          }
        })
      )

      return {
        _id: artist[0]._id,
        artist_id: artist[0].artistId,
        name: artist[0].name,
        image_url: artist[0].imageUrl,
        total_score: totalScore,
        upvotes,
        downvotes,
        followers: users
      }
    } catch (err) {
      throw new Error(err)
    }
  }
}
