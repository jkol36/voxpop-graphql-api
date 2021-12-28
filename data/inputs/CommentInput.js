export const CommentInput = `
    input CommentInput {
        contentId: String!
        creatorId: String!
        userId: String!
        text: String!
        startWordIndex: Int!
        endWordIndex: Int!
        hashtags: [String]
        quote: String
    }
`
