export default (songSchema = {
  type: 'object',
  required: ['data'],
  maxProperties: 1,
  properties: {
    data: {
      type: 'object',
      required: ['song'],
      maxProperties: 1,
      properties: {
        song: {
          type: 'object',
          additionalProperties: false,
          minProperties: 11,
          properties: {
            _id: {
              type: 'string'
            },
            artist_ids: {
              type: 'array'
            },
            featured_artist_ids: {
              type: 'array'
            },
            song_id: {
              type: 'number'
            },
            album_id: {
              type: 'number'
            },
            full_title: {
              type: 'string'
            },
            title: {
              type: 'string'
            },
            lyrics: {
              type: 'string'
            },
            total_score: {
              type: 'number'
            },
            upvotes: {
              type: 'number'
            },
            downvotes: {
              type: 'number'
            }
          }
        }
      }
    }
  }
});
