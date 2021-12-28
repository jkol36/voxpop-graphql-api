export const Collection = `
type Collection {
    _id: ID!
    title: String
    description: String
    creatorId: String!
    contentIds: [String]
    options: JSON
}`