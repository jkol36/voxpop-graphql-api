import UsersModel from '../models/Users'
import Promise from 'promise'

export const artistRelationship = pubsub => {
    return {
      async followers(data) {
        // console.log('data', data)
        const followers = await Promise.all(
            data.followers.map(async _id => {
                const response = await UsersModel.find({_id})
                return response[0]
            })
        )
        return followers
      }
    }
}