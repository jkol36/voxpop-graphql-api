export const Quote = `
type Quote {
    _id: String!
    contentId: String
    creatorId: String
    userId: String
    quote: String
    created: String
    content: Content
    creator: Creator
    scoreDetails: Score
}
`