export default (scoreBySongSchema = {
  type: 'object',
  required: ['data'],
  maxProperties: 1,
  properties: {
    data: {
      type: 'object',
      maxProperties: 1,
      required: ['scoreBySong'],
      properties: {
        scoreBySong: {
          type: 'number'
        }
      }
    }
  }
});
