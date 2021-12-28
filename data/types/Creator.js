export const Creator = `
type Creator {
    _id: ID!
    name: String!
    profileImageUrl: String
    followers: [String]
    created: String!
    options: JSON
    collections: [Collection]
    contents: [Content]
    score: Int!
    scoreDetails: Score
}
`
