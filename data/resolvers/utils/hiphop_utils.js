import CollectionsModel from '../models/Collections'
import CreatorsModel from '../models/Creators'
import ContentsModel from '../models/Contents'
const Lyricist = require("lyricist/node6")

export const upsertSong = async options => {
    if(!options.songId) throw new Error('Error: Song not available!')

    const hiphop = new Lyricist(process.env.LYRICIST_TOKEN)
    const song = await hiphop.song(options.songId, {fetchLyrics: true})
    const creator = await upsertArtist(song.primary_artist)
    const collection = await upsertAlbum({...song.album, creatorId: creator._id})
    
    const props = {
        collectionId: collection._id,
        creatorId: creator._id,
        coCreatorIds: [],
        title: song.title,
        text: song.lyrics,
        media: song.media,
        thumbnail: song.header_image_thumbnail_url,
        options: {songId: options.songId}
    }
    return await ContentsModel(props).save()
}

const upsertArtist = async artist => {
    const creator = await CreatorsModel.findOne({options: {artistId: artist.id}})
    if(!creator) {
        const props = {
            name: artist.name,
            profileImageUrl: artist.image_url,
            followers: [],
            created: new Date(),
            options: {artistId: artist.id}
        }
        return await new CreatorsModel(props).save()
    }
    return creator
}

const upsertAlbum = async album => {
    const collection = await CollectionsModel.findOne({options: {albumId: album.id}})
    if(!collection) {
        const props = {
            title: album.name,
            description: "",
            creatorId: album.creatorId,
            contentIds: [],
            options: {albumId: album.id} 
        }
        return await new CollectionsModel(props).save()
    }
    return collection
}