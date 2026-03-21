import { expect } from '@playwright/test'
import { IResponseError, IResponse } from 'data/types/core.types'
import { validateJsonSchema } from 'utils/validateSchema.utils'

// validate Response: status code, schema
export function validateResponseStatusAndSchema<T extends object>(
  response: IResponse<T>,
  expected: {
    status: number
    schema?: object
  },
) {
  expect
    .soft(response.status, `Status code should be ${expected.status}`)
    .toBe(expected.status)
  if (expected.schema) validateJsonSchema(response.body!, expected.schema)
}

// validate Error Response Body: error response body fields
// export function validateErrorResponseBody<T extends IResponseError>(
//   response: IResponse<T>,
//   expected: {
//     message?: string
//     code?: number
//   },
// ) {
//   // ensure body exists
//   expect.soft(response.body, 'Response body should exist').toBeDefined()
//   if ('message' in expected)
//     expect
//       .soft(
//         response.body!.message,
//         `Error message should be ${expected.message}`,
//       )
//       .toBe(expected.message)
//   if ('code' in expected)
//     expect
//       .soft(response.body!.code, `Code should be ${expected.code}`)
//       .toBe(expected.code)
// }
export function validateErrorResponseBody(
  body: IResponseError | undefined,
  expected: {
    message?: string
    code?: number
  },
) {
  // ensure body exists
  if (!body) {
    expect.soft(body, 'Response body should exist').toBeDefined()
    return
  }
  if ('message' in expected)
    expect
      .soft(body.message, `Error message should be ${expected.message}`)
      .toBe(expected.message)
  if ('code' in expected)
    expect
      .soft(body.code, `Code should be ${expected.code}`)
      .toBe(expected.code)
}
