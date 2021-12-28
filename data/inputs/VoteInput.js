export const VoteInput = `
input VoteInput {
    contentId: String!
    creatorId: String
    userId: String
    type: String!
    points: Int!
    startWordIndex: Int!
    text: String!
    endWordIndex: Int!
}
`
