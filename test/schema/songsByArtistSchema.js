export default (songsByArtistSchema = {
  type: 'object',
  required: ['data'],
  maxProperties: 1,
  properties: {
    data: {
      type: 'object',
      required: ['songsByArtist'],
      maxProperties: 1,
      properties: {
        songsByArtist: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            minProperties: 16,
            properties: {
              annotation_count: {
                type: 'number'
              },
              api_path: {
                type: 'string'
              },
              full_title: {
                type: 'string'
              },
              header_image_thumbnail_url: {
                type: 'string'
              },
              header_image_url: {
                type: 'string'
              },
              id: {
                type: 'number'
              },
              lyrics_owner_id: {
                type: 'number'
              },
              lyrics_state: {
                type: 'string'
              },
              path: {
                type: 'string'
              },
              pyongs_count: {
                type: 'number'
              },
              song_art_image_thumbnail_url: {
                type: 'string'
              },
              stats: {
                type: 'object',
                properties: {
                  hot: {
                    type: 'boolean'
                  },
                  unreviewed_annotations: {
                    type: 'number'
                  },
                  pageviews: {
                    type: 'number'
                  }
                }
              },
              title: {
                type: 'string'
              },
              title_with_featured: {
                type: 'string'
              },
              url: {
                type: 'string'
              },
              primary_artist: {
                type: 'object',
                properties: {
                  api_path: {
                    type: 'string'
                  },
                  header_image_url: {
                    type: 'string'
                  },
                  id: {
                    type: 'number'
                  },
                  image_url: {
                    type: 'string'
                  },
                  is_meme_verified: {
                    type: 'boolean'
                  },
                  is_verified: {
                    type: 'boolean'
                  },
                  name: {
                    type: 'string'
                  },
                  url: {
                    type: 'string'
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
