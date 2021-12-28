export const Vote = `
type Vote {
    _id: ID!
    contentId: String
    creatorId: String
    userId: String
    type: String!
    points: Int!
    startWordIndex: Int!
    endWordIndex: Int!
    created: String!
}`
