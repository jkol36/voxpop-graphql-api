import ArtistsModel from "../models/Artists"
import { getAllSongs, getAllAlbumIds } from "../utils/lyricist_utils"
import { scoreUtil, voteTypeUtil } from "../utils/score_utils"

const Lyricist = require("lyricist/node6")

export const artist = pubsub => {
  return async (_, args) => {
    console.log("Function: artistSearch")

    try {
      const response = await ArtistsModel.find({ artistId: args.artist_id })
      const totalScore = await scoreUtil({ artist_id: args.artist_id })
      const upvotes = await voteTypeUtil({
        artist_id: args.artist_id,
        vote_type: true
      })
      const downvotes = await voteTypeUtil({
        artist_id: args.artist_id,
        vote_type: false
      })

      if (response.length > 0) {
        // console.log('response', response)
        return {
          _id: response[0]._id,
          artist_id: response[0].artistId,
          name: response[0].name,
          image_url: response[0].imageUrl,
          total_score: totalScore,
          upvotes,
          downvotes,
          followers: [...response[0].followers]
        }
      } else {
        const accessToken = process.env.LYRICIST_TOKEN
        const lyricist = new Lyricist(accessToken)
        const artistData = await lyricist.artist(args.artist_id)

        const songIds = await getAllSongs(args.artist_id, true)
        const albumIds = await getAllAlbumIds(args.artist_id)

        const payload = {
          name: artistData.name,
          imageUrl: artistData.image_url,
          artistId: artistData.id,
          albums: albumIds,
          songs: songIds,
          followers: []
        }

        const newArtist = await new ArtistsModel(payload).save()

        return {
          _id: newArtist._id || "",
          artist_id: newArtist.artistId,
          name: newArtist.name,
          image_url: newArtist.imageUrl,
          total_score: totalScore,
          upvotes,
          downvotes,
          followers: []
        }
      }
    } catch (err) {
      throw new Error(err)
    }
  }
}
