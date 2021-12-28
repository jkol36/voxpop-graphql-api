import {upsertSong} from './hiphop_utils'

const checkingAsyncContent = async () => {
    const response = await upsertSong({songId: 43})
    console.log(response.primary_artist)
}

checkingAsyncContent()