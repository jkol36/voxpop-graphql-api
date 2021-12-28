export default (albumsByArtistSchema = {
  type: 'object',
  required: ['data'],
  properties: {
    data: {
      type: 'object',
      required: ['albumsByArtist'],
      properties: {
        albumsByArtist: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            minProperties: 4,
            properties: {
              name: {
                type: 'string'
              },
              id: {
                type: 'number'
              },
              firstSong: {
                type: 'number'
              },
              songs: {
                type: 'array',
                items: {
                  type: 'object',
                  additionalProperties: false,
                  minProperties: 3,
                  properties: {
                    title: {
                      type: 'string'
                    },
                    songId: {
                      type: 'number'
                    },
                    albumId: {
                      type: 'number'
                    }
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
