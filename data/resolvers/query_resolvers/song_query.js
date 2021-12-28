import SongsModel from "../models/Songs"
import ActivitiesModel from '../models/Activities'
import { scoreUtil, voteTypeUtil } from "../utils/score_utils"
import { getAllSongs } from "../utils/lyricist_utils"
import Promise from "promise"

const Lyricist = require("lyricist/node6")

const songPromisify = async (_, args) => {
  const songId = args.song_id
  const accessToken = process.env.LYRICIST_TOKEN
  const lyricist = new Lyricist(accessToken)

  const totalScore = await scoreUtil({ song_id: args.song_id })
  const upvotes = await voteTypeUtil({
    song_id: args.song_id,
    vote_type: true
  })
  const downvotes = await voteTypeUtil({
    song_id: args.song_id,
    vote_type: false
  })

  const song = await SongsModel.find({ songId })
  console.log('Getting song...')
  if (song.length > 0) {
    return {
      _id: song[0]._id,
      artist_ids: song[0].artistIds,
      featured_artist_ids: song[0].featuredArtistIds,
      song_id: song[0].songId,
      album_id: song[0].albumId,
      full_title: song[0].fullTitle,
      title: song[0].title,
      lyrics: song[0].lyrics,
      media: song[0].media,
      total_score: totalScore,
      upvotes,
      downvotes
    }
  } else {
    console.log("caching new song...")
    const response = await lyricist.song(songId, { fetchLyrics: true })

    const albumId = response.album && response.album.id
    const artist = response.primary_artist
    const featuredArtists =
      response.featured_artists.map(artist => artist.id) || []

    const payload = {
      albumId: albumId,
      artistIds: [artist.id],
      featuredArtistIds: [...featuredArtists],
      songId,
      fullTitle: response.full_title,
      title: response.title,
      lyrics: response.lyrics,
      media: response.media,
      thumbnail: response.song_art_image_thumbnail_url
    }

    const activities = {
      type: "SONG",
      message: "NEW SONG",
      author: response.primary_artist.name,
      subject: response.title,
      thumbnail: response.song_art_image_thumbnail_url || "https://dummyimage.com/100x100/000/fff"
    }

    const newSong = await new SongsModel(payload).save()
    await new ActivitiesModel(activities).save()
    console.log("caching complete")
    return {
      _id: newSong._id,
      artist_ids: newSong.artistIds,
      featured_artist_ids: newSong.featuredArtistIds,
      song_id: newSong.songId,
      album_id: newSong.albumId,
      full_title: newSong.fullTitle,
      title: newSong.title,
      lyrics: newSong.lyrics,
      media: newSong.media,
      thumbnail: newSong.thumbnail,
      total_score: totalScore,
      upvotes,
      downvotes
    }
  }
}

export const song = pubsub => {
  return songPromisify
}

export const songs = pubsub => {
  return async (_, args) => {
    const artistId = args.artist_id
    const albumId = args.album_id

    let songIds = await getAllSongs(artistId, true, albumId)
    // console.log('songIds', songIds)
    return await Promise.all(
      songIds.map(async id => {
        return await songPromisify(_, { song_id: id })
      })
    )
  }
}
