export const Domain = `
type Domain {
    _id: ID!
    title: String!
    description: String
    url: String!
    key: String!
    created: String!
    privacy: String!
    allowedUserIds: [String]!
    adminIds: [String]!
    pendingUsers: [User]
    pendingUserIds: [String]
}
`
