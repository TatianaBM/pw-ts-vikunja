import { expect } from '@playwright/test'
import { IResponseError, IResponse } from 'data/types/core.types'
import { validateJsonSchema } from 'utils/validateSchema.utils'

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

// type guard to remove ts error: if condition is true, then response.body must be IResponseError
export function ensureErrorResponseBody(
  body: unknown,
): asserts body is IResponseError {
  if (!body || typeof body !== 'object' || !('message' in body)) {
    throw new Error('Expected error response body')
  }
}
