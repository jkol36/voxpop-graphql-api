export const VoteLog = `
type VoteLog {
    _id: String!
    _userId: String!,
    _voteId: String!,
    songTitle: String,
    songArtist: String,
    description: String,
    action: String,
    tokens: Int,
    created: String
}`
