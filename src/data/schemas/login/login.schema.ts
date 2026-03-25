export const loginSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    token: {
      type: 'string',
    },
  },
  required: ['token'],
}
