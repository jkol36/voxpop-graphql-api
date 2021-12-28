import * as types from "./types/"
import * as inputs from "./inputs/"
import {Query} from "./query_definition"
import {Mutation} from "./mutation_definition"
import {Subscription} from "./subscription_definition"

export const typeDefs = [
    `scalar JSON`,
    `scalar Date`,

    /**
     * Types
     **/
    // types.User,
    // types.Vote,
    // types.LyricistSearch,
    // types.LyricistSong,
    // types.Artist,
    // types.Album,
    // types.Song,
    // types.FantasyLabel,
    // types.UserInvites,
    // types.VoteLog,
    ...Object.values(types), // so we don't to keep on adding here and forgetting about adding it here
    /**
     * Inputs
     **/
    // inputs.UserInput,
    // inputs.VoteInput,
    // inputs.CommentInput,
    // inputs.TextInput,
    ...Object.values(inputs), // so we don't to keep on adding here and forgetting about adding it here

    Query,
    Mutation,
    Subscription,

    `
    # we need to tell the server which types represent the root query
    # and root mutation types.
    schema {
      query: Query
      mutation: Mutation
      subscription: Subscription
    }
`
]
