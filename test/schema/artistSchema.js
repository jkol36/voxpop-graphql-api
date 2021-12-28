export default (artistSchema = {
  type: 'object',
  maxProperties: 1,
  required: ['data'],
  properties: {
    data: {
      type: 'object',
      maxProperties: 1,
      required: ['artist'],
      properties: {
        artist: {
          type: 'object',
          maxProperties: 8,
          additionalProperties: false,
          properties: {
            _id: {
              type: 'string'
            },
            artist_id: {
              type: 'number'
            },
            name: {
              type: 'string'
            },
            image_url: {
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
            },
            followers: {
              type: 'number'
            }
          }
        }
      }
    }
  }
});
