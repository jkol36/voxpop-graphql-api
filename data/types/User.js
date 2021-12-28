export const User = `
type User {
    _id: String!
    creatorId: String!
    name: String!
    username: String!
    email: String!
    hash_password: String!
    created: String!
    avatar: String
    tokens: Int!
    _followersId: [String]!
    _followingId: [String]!
    vote_cast: Int!
    points: Int!
    admin: Boolean
    primary: Boolean
    submissions: [Text]
    creator: Creator
    score: Int!
    scoreDetails: Score
    history: JSON
    quotes: [Quote]
    contents: [Content]
    comments: [Comment]
    followedUserProfileData: [FollowedUserProfileData]
}`
