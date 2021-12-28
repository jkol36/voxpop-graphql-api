export const Content = `
type Content {
    _id: ID!
    collectionId: String
    creatorId: String!
    coCreatorIds: [String]
    domainId: String
    created: String
    title: String
    url: String
    text: String
    media: [JSON]
    thumbnail: String
    options: JSON
    creator: Creator
    collection: Collection
    score: Int!
    scoreDetails: Score
    comments: [Comment]
    domain: Domain
}`
