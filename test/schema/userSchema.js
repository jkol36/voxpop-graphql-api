export default (usersSchema = {
  type: 'object',
  maxProperties: 1,
  required: ['data'],
  properties: {
    data: {
      type: 'object',
      maxProperties: 1,
      required: ['user'],
      properties: {
        user: {
          type: 'object',
          minProperties: 8,
          additionalProperties: false,
          properties: {
            _id: {
              type: 'string'
            },
            name: {
              type: 'string'
            },
            username: {
              type: 'string'
            },
            email: {
              type: 'string'
            },
            hash_password: {
              type: 'string'
            },
            created: {
              type: 'string'
            },
            avatar: {
              type: 'string'
            },
            tokens: {
              type: 'number'
            }
          }
        }
      }
    }
  }
});
