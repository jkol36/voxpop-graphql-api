import UserInvitesModel from '../models/UserInvites';

export const getUserInvites = (pubsub) => {
    return async (_, args, context) => {
        const userInvites = await UserInvitesModel.find();
        return userInvites;
    }
}