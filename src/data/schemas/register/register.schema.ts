export const registerSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    created: {
      type: 'string',
    },
    email: {
      type: 'string',
    },
    id: {
      type: 'integer',
    },
    name: {
      type: 'string',
    },
    updated: {
      type: 'string',
    },
    username: {
      type: 'string',
    },
  },
  required: ['created', 'email', 'id', 'name', 'updated', 'username'],
}
