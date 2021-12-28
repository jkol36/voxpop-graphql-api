export default (scoreSchema = {
  type: 'object',
  required: ['data'],
  maxProperties: 1,
  properties: {
    data: {
      type: 'object',
      required: ['upvotes'],
      maxProperties: 1,
      properties: {
        upvotes: {
          type: 'number'
        }
      }
    }
  }
});
