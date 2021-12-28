import CommentsModel from "../models/Comments"
import ContentsModel from "../models/Contents"

export const comments = pubsub => {
  return async (_, args, context) => {
    const comments = await CommentsModel.find({ ...args })
    const commentWithContentDetails = await Promise.all(
      comments.map(async (comment) => {
        const {
          _id,
          contentId,
          creatorId,
          userId,
          text,
          startWordIndex,
          endWordIndex,
          created,
          __v,
          hashtags
        } = comment
        const content = await ContentsModel.findById(contentId)
        if(content && content.title)
          return {
            _id,
            contentId,
            creatorId,
            userId,
            text,
            startWordIndex,
            endWordIndex,
            created,
            __v,
            hashtags,
            content: {
              title: content.title
            }
          }
      })
    )
    return commentWithContentDetails
  }
}

export const comment = pubsub => {
  return async (_, args, context) => {
    return await CommentsModel.findById(args.commentId)
  }
}
