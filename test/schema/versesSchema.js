export default (versesSchema = {
  type: 'object',
  required: ['data'],
  maxProperties: 1,
  properties: {
    data: {
      type: 'object',
      required: ['verses'],
      maxProperties: 1,
      properties: {
        verses: {
          type: 'array',
          items: {
            type: 'object',
            additionalProperties: false,
            minProperties: 6,
            properties: {
              id: {
                type: 'number'
              },
              line: {
                type: 'number'
              },
              word: {
                type: 'string'
              },
              score: {
                type: 'number'
              },
              end: {
                type: 'boolean'
              },
              start: {
                type: 'boolean'
              }
            }
          }
        }
      }
    }
  }
});
