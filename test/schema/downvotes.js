export default (downVotesSchema = {
  type: 'object',
  required: ['data'],
  maxProperties: 1,
  properties: {
    data: {
      type: 'object',
      required: ['downvotes'],
      maxProperties: 1,
      properties: {
        downvotes: {
          type: 'number'
        }
      }
    }
  }
});
