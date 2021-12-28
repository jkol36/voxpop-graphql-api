import DomainsModel from "../models/Domains"

export const domain = pubsub => {
  return async (_, args, context) => {
    if (!args.domainId) return await DomainsModel.findOne({ key: args.key })
    return await DomainsModel.findById(args.domainId)
  }
}

export const domains = pubsub => {
  return async (_, args, context) => {
    const props = { ...args }
    delete props.limit
    return await DomainsModel.find({ ...props })
  }
}
