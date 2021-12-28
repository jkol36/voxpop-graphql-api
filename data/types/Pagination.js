export const Pagination = `
type Pagination {
    sort: String
    type: String
    page: Int!
    limit: Int!
    total: Int!
    data: [JSON]
}
`