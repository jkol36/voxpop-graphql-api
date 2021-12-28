const scoreSchema = {
  type: 'object',
  required: ['data'],
  maxProperties: 1,
  properties: {
    data: {
      type: 'object',
      required: ['score'],
      maxProperties: 1,
      properties: {
        score: {
          type: 'number'
        }
      }
    }
  }
};
