export const Comment = `
type Comment {
    _id: ID!
    contentId: String!
    scoreDetails: Score
    contentTitle: String
    commenterName: String
    creatorId: String!
    userId: String!
    text: String
    startWordIndex: Int!
    endWordIndex: Int!
    created: String!
    hashtags: [String]
    quote: String
}`
