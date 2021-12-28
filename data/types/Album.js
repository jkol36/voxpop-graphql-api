export const Album = `
type Album {
    _id: ID!
    artist_id: Int!
    album_id: Int!
    title: String!
    songs: [Song]
}
`