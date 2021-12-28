export default (lyricistSearchSchema = {
  type: 'object',
  required: ['data'],
  maxProperties: 1,
  properties: {
    data: {
      type: 'object',
      required: ['lyricistSearch'],
      maxProperties: 1,
      properties: {
        lyricistSearch: {
          type: 'object',
          required: ['query', 'response'],
          maxProperties: 2,
          properties: {
            query: {
              type: 'string'
            },
            response: {
              type: 'array',
              items: {
                type: 'object',
                additionalProperties: false,
                minProperties: 5,
                properties: {
                  title: {
                    type: 'string'
                  },
                  image: {
                    type: 'string'
                  },
                  songId: {
                    type: 'number'
                  },
                  artistId: {
                    type: 'number'
                  },
                  artistName: {
                    typd: 'string'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
});
