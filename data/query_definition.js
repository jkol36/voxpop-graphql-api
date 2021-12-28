export const Query = `
type Query {
  " Get domain by id "
  domain(domainId: String, key: String): Domain

  " Get all domains "
  domains(created: String, key: String, title: String, limit: Int): [Domain]

  " New query "
  content(contentId: String, options: JSON): Content

  " Get all the contents "
  contents(collectionId: String, creatorId: String, domainId: String, userId: String): [Content]
  
  " Search content titles "
  searchContent(text: String!): [Content]

  " Get a creator "
  creator(creatorId: String, options: JSON): Creator

  " Search creator name "
  searchCreator(text: String!): [User]

  " Get a collection "
  collection(collectionId: String, options: JSON): Collection

  " This will query the list of available users "
  users: [User]

  " This will query the notifications "
  notifications(userId: String): JSON
   
  " This will query the list of user invite requests "
  userInviteRequests: [UserInvites] 
  
  " This will query the user "
  user(user_id: String, username: String, creatorId: String): User 
  
  " This will query the user vote logs "
  userVoteLogs(user_id: String, username: String): [VoteLog]
  
  " This will query list of artist followed by the user  "
  userFantasyLabels(user_id: String!, username: String): [FantasyLabel]
  
  " This will query the list of votes "
  vote(id: String!): Vote

  " This will query the list of votes "
  votes(userId: String, contentId: String, type: String): [Vote]

  " This will query the points of votes "
  votePoints(userId: String, contentId: String, creatorId: String): JSON

  " This will query a quote "
  quote(quoteId: String!): Quote

  " This will query a list of quote "
  quotes(contentId: String, creatorId: String): [Quote]
    
  " This will query the artist information "
  artist(artist_id: Int!): Artist

  " This will query songs of the artist "
  songsByArtist(artist_id: Int!, page: Int, per_page: Int, sort: String, only_song_id: Boolean): JSON

  " This will query the albums of the artist  "
  albumsByArtist(artist_id: Int!): [JSON]

  " This will query the albums of an artist from the database "
  albumsFromDatabase(artist_id: Int!): [Album]

  " This will query the albums of an artist "
  albums(artist_id: Int!): [Album]

  " This will query the album of the specified id "
  album(album_id: Int!): JSON

  " This will search any song, author, etc. information from Lyricist API "
  lyricistSearch(query: String!): LyricistSearch
  
  " This will query a song "
  song(song_id: Int!): Song

  " This will query the songs of an artist "
  songs(artist_id: Int!, album_id: Int): [Song]
  
  " This will give you the total score of a song "
  scoreBySong(song_id: Int!): JSON

  " This will give you the total score of a song "
  score(user_id: Int, song_id: Int, artist_id: Int): JSON

  " This will give you the total upvotes of a song "
  upvotes(user_id: Int, song_id: Int, artist_id: Int): JSON

  " This will give you the total downvotes of a song "
  downvotes(user_id: Int, song_id: Int, artist_id: Int): JSON

  " This will give you the scores of custom votes "
  customScores(textId: String, userId: String, authorId: String): JSON

  " This will give the trending songs "
  trendingSongs(limit: Int): JSON

  " This will give the recommended songs "
  recommendedSongs(limit: Int): JSON

  " This will give the public news feed "
  activities(offset: Int, limit: Int, searchKey: String): JSON
  
  " This will search any information from ProPublica Congress API "
  searchBill(query: String): JSON

  " This will get you the text of the bill "
  billText(bill_id: String): JSON

  " This will return the text submitted by a user "
  text(code: String!): Text

  " This will return comments "
  comments(songId: Int, userId: String, artistId: Int): JSON

  " This will return a comment "
  comment(commentId: String): JSON

  " Pagination "
  paginate(page: PaginationInput!): Pagination 
   
  " Content Chats "
  messages(contentId: String!): [Message]
   
  " User Chats "
  userMessages(messageRoomId: String!): [UserMessage]
   
  " Get user chat room details "
  userChatRoom(userId: String!): MessageRoom   
  
  " Get message reactions "
  userMessageReactions(messageId: String!): [Reaction]
  
  " Get message reactions user tooltip "
  userMessageReactionToolTip(messageId: String!, reactionId: String!): [Reaction]
  
  " Get user buddy list"
  userBuddyList: JSON
    
  " Get user content chat room"
  userContentChatRoom(contentId: String!): MessageRoom
    
  " Get user bookmarked contents chat room"
  getBookmarkedContents: [MessageRoom]
  
 }`
