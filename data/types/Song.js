export const Song = `
type Song {
    _id: ID!
    artist_ids: [Int]!
    featured_artist_ids: [Int]!
    song_id: Int!
    album_id: Int
    full_title: String!
    title: String!
    lyrics: String
    media: [JSON]
    thumbnail: String
    total_score: Int!
    upvotes: Int!
    downvotes: Int!
}
`