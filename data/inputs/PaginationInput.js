/**
 * sort: DESC | ASC
 * type: Content | Creator | Activities
 */
export const PaginationInput = `
    input PaginationInput {
        sort: String
        type: String
        page: Int!
        limit: Int!
        searchTerm: String,
        searchBy: String,
        dateRange: JSON
    }
`
