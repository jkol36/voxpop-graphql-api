import { scoreUtil, voteTypeUtil } from "../utils/score_utils"
import SongsModel from "../models/Songs"
import AlbumsModel from "../models/Albums"
import Promise from "promise"

export const albumRelationship = pubsub => {
  return {
    async songs(data) {
      const album = await AlbumsModel.findOne({ albumId: data.album_id })
      const songIds = album.songIds

      const songs = await Promise.all(
        songIds.map(async id => {
          const totalScore = await scoreUtil({ song_id: id })
          const upvotes = await voteTypeUtil({
            song_id: id,
            vote_type: true
          })
          const downvotes = await voteTypeUtil({
            song_id: id,
            vote_type: false
          })
          const song = await SongsModel.findOne({ songId: id })
          if(song) {
            return {
              _id: song._id,
              artist_ids: song.artistIds,
              featured_artist_ids: song.featuredArtistIds,
              song_id: song.songId,
              album_id: song.albumId,
              full_title: song.fullTitle,
              title: song.title,
              lyrics: song.lyrics,
              media: song.media,
              total_score: totalScore,
              upvotes,
              downvotes
            }
          }
        })
      )
      return songs.filter(item => !!item)
    }
  }
}
