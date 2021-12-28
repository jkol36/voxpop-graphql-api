import DomainsModel from "../models/Domains"
import { logger } from "../../utils/logger"
import Domains from "../models/Domains"

export const createDomain = pubsub => {
  return async (_, args, context) => {
    logger.info("Function: createDomain")
    try {
      const isExist = await DomainsModel.findOne({ key: args.domain.key })
      if (isExist) throw new Error("Document already exist!")
      return await new DomainsModel({
        ...args.domain,
        allowedUserIds: [args.domain.userId],
        adminIds: [args.domain.userId],
        created: new Date()
      }).save()
    } catch (err) {
      throw new Error(err)
    }
  }
}

export const acceptUserToBoard = pubsub => {
  return async (_, args, context) => {
    logger.info("Function: acceptUserToBoard")

    try {
      const domain = await DomainsModel.findById(args.domainId)
      const allowedUserIds = [...domain.allowedUserIds, args.userId]
      const userIndex = domain.pendingUserIds.findIndex(
        id => id === args.userId
      )
      const pendingUserIds = [...domain.pendingUserIds]
      pendingUserIds.splice(userIndex, 1)

      return await DomainsModel.findByIdAndUpdate(
        args.domainId,
        {
          allowedUserIds,
          pendingUserIds
        },
        { new: true }
      )
    } catch (err) {
      throw new Error(err)
    }
  }
}

export const addPendingUser = pubsub => {
  return async (_, args, context) => {
    logger.info("Function: addPendingUser")

    try {
      const domain = await DomainsModel.findById(args.domainId)
      const pendingUserIds = [...domain.pendingUserIds, args.userId]
      return await DomainsModel.findByIdAndUpdate(
        args.domainId,
        { pendingUserIds },
        { new: true }
      )
    } catch (err) {
      throw new Error(err)
    }
  }
}
