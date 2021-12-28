import Promise from "promise"
import SongsModel from "../models/Songs"
import ArtistsModel from "../models/Artists"
import {searchUser} from "../query_resolvers/user_query"

const Lyricist = require("lyricist/node6")

export const lyricistSearch = pubsub => {
	return async (_, args, context) => {
		console.log("Function: lyricistSearch")
		const query = args.query
		const accessToken = process.env.LYRICIST_TOKEN
		const lyricist = new Lyricist(accessToken)
		const lyricistResponse = await lyricist.search(query)

		const filteredResponse = lyricistResponse.map(resp => ({
			title: resp.title,
			image: resp.song_art_image_thumbnail_url,
			songId: resp.id,
			artistId: resp.primary_artist.id,
			artistName: resp.primary_artist.name
		}))

		const userSearch = await searchUser(query, context)

		filteredResponse.concat(userSearch, context)

		const response = [
			{
				category: {
					name: "lyricist",
					results: filteredResponse
				}
			},
			{
				category: {
					name: "users",
					results: userSearch
				}
			}
		]
		return {query, response}
	}
}

export const album = pubsub => {
	return async (_, args) => {
		console.log("Function: album")
		const albumId = args.album_id
		const accessToken = process.env.LYRICIST_TOKEN
		const lyricist = new Lyricist(accessToken)
		const response = await lyricist.album(albumId, {fetchTracklist: true})
		return {response}
	}
}

export const songsByArtist = pubsub => {
	return async (_, args) => {
		console.log("Function: songsByArtist")
		const artistId = args.artist_id
		const page = args.page || 1
		const perPage = args.per_page || 20
		const sort = args.sort || "title"
		const onlySongId = args.only_song_id || false
		const accessToken = process.env.LYRICIST_TOKEN
		const lyricist = new Lyricist(accessToken)

		if (!args.page && !args.per_page && !args.sort) {
			return await getAllSongs(artistId, onlySongId)
		} else {
			const response = await lyricist.songsByArtist(artistId, {
				page,
				perPage,
				sort
			})
			return {response}
		}
	}
}

export const albumsByArtist = pubsub => {
	return async (_, args) => {
		console.log("Function: albumsByArtist")
		const artistId = args.artist_id

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
				name: filteredAlbums[0].name,
				id: albumId,
				firstSong: songList[0].songId,
				songs: songList
			}
			sortedAlbums.push(payload)
		}
		return sortedAlbums
	}
}

export const getAllAlbumIds = async artistId => {
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
	return [...new Set(albumIds)]
}

export const getAllSongs = async (artistId, onlySongId, albumId) => {
	const accessToken = process.env.LYRICIST_TOKEN
	const lyricist = new Lyricist(accessToken)

	let pageCount = 1
	let allSongs = []
	while (true) {
		let response = {}
		try {
			response = await lyricist.songsByArtist(artistId, {
				page: pageCount,
				perPage: 50,
				sort: "popularity"
			})
		} catch (err) {
			throw new Error(err)
		}

		if (response.length > 0) {
			allSongs = allSongs.concat(response)
		} else {
			break
		}

		// console.log("Page Count: ", pageCount)
		pageCount++
	}

	if (albumId) {
		//Adding album_id for each song object
		for (let i = 0; i < allSongs.length; i++) {
			try {
				const album = (await lyricist.song(allSongs[i].id)).album
				allSongs[i].album_id = album && album.id
			} catch (err) {
				throw new Error(err)
			}
		}

		//Filter songs via albums
		allSongs = allSongs.filter(item => item.album_id === albumId)
	}

	if (onlySongId) {
		return allSongs.map(song => song.id)
	}

	return allSongs
}

export const trendingSongs = pubsub => {
	return async (_, args) => {
		let promises = []
		const count = await SongsModel.count()
		console.log("count", count)

		for (let i = 0; i < args.limit; i++) {
			const random = Math.floor(Math.random() * count)
			let song = await SongsModel.findOne().skip(random)

			let trendingSong = {
				_id: song._id,
				title: song.title,
				songId: song.songId,
				thumbnail: song.thumbnail || "https://dummyimage.com/100x100/000/fff",
				artistName: "Unknown Artist"
			}

			if (song.artistIds) {
				console.log("artist dis", song.artistIds)
				const artist = await ArtistsModel.findOne({artistId: song.artistIds[0]})
				if (artist) {
					trendingSong = {
						...trendingSong,
						artistName: artist.name,
						artistId: song.artistIds[0]
					}
				} else {
					console.log("skipping...")
					i--
					continue
				}
			}

			promises.push(trendingSong)
		}

		return promises
	}
}

export const recommendedSongs = pubsub => {
	return async (_, args) => {
		let promises = []
		const count = await SongsModel.count()
		console.log("count", count)

		for (let i = 0; i < args.limit; i++) {
			const random = Math.floor(Math.random() * count)
			let song = await SongsModel.findOne().skip(random)
			let trendingSong = {
				_id: song._id,
				title: song.title,
				songId: song.songId,
				thumbnail: song.thumbnail || "https://dummyimage.com/100x100/000/fff",
				artistName: "Unknown Artist"
			}

			if (song.artistIds) {
				const artist = await ArtistsModel.findOne({artistId: song.artistIds[0]})
				if (artist) {
					trendingSong = {
						...trendingSong,
						artistName: artist.name,
						artistId: song.artistIds[0]
					}
				} else {
					console.log("skipping...")
					i--
					continue
				}
			}

			promises.push(trendingSong)
		}

		return promises
	}
}
