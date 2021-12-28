export const Artist = `
type Artist {
    _id: ID!
    artist_id: Int!
    name: String!
    image_url: String!
    total_score: Int
    upvotes: Int
    downvotes: Int
    followers: [User]
    albums: [Album]
    songs: [Song]
}`