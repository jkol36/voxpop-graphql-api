import Promise from "promise"
import AlbumsModel from "../models/Albums"
import { getAllSongs } from "../utils/lyricist_utils"

const Lyricist = require("lyricist/node6")

export const albums = pubsub => {
  return async (_, args) => {
    console.log("Function: albumsByArtist")
    const artistId = args.artist_id

    const response = await AlbumsModel.find({ artistId })

    if (response.length > 0) {
      return response.map(album => ({
        _id: album._id,
        artist_id: album.artistId,
        album_id: album.albumId,
        title: album.title
      }))
    } else {
      const songs = await getAllSongs(artistId, false)
      const accessToken = process.env.LYRICIST_TOKEN
      const lyricist = new Lyricist(accessToken)

      // Get album of same artist
      let albums = await Promise.all(
        songs.map(async song => {
          const fullSong = await lyricist.song(song.id)
          const album = fullSong.album
          if (!!album) {
            const albumArtist = album.artist
            if (albumArtist.id === artistId) {
              let albumPayload = {
                name: album.name,
                id: album.id
              }
              albumPayload.songs = {
                title: fullSong.title,
                songId: fullSong.id,
                albumId: album.id
              }
              return albumPayload
            }
          }
        })
      )
      // Remove nulls from array
      albums = albums.filter(album => !!album)

      // Getting the album ids and making them unique
      let albumIds = albums.map(album => album.id)
      albumIds = [...new Set(albumIds)]
      // Grouping songs of the same album
      let sortedAlbums = []
      for (let i = 0; i < albumIds.length; i++) {
        const albumId = albumIds[i]
        const filteredAlbums = albums.filter(album => album.id === albumId)
        const songList = filteredAlbums.map(album => album.songs)
        const payload = {
          albumId,
          artistId,
          songIds: songList.map(song => song.songId),
          title: filteredAlbums[0].name
        }
        const newAlbum = await new AlbumsModel(payload).save()
        sortedAlbums.push(newAlbum)
      }
      return sortedAlbums
    }
  }
}

export const albumsFromDatabase = pubsub => {
  return async (_, args) => {
    console.log("Function: albumsFromDatabase")
    const artistId = args.artist_id

    const response = await AlbumsModel.find({ artistId })

    return response.map(album => ({
      _id: album._id,
      artist_id: album.artistId,
      album_id: album.albumId,
      title: album.title
    }))
  }
}
