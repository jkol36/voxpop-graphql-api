export default (topArtistsSchema = {
  type: 'object',
  required: ['data'],
  maxProperties: 1,
  properties: {
    data: {
      type: 'object',
      required: ['topArtists'],
      maxProperties: 1,
      properties: {
        topArtists: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              totalScore: {
                type: 'number'
              },
              artistId: {
                type: 'number'
              },
              artistName: {
                type: 'string'
              }
            }
          }
        }
      }
    }
  }
});
