import { expect, test } from 'fixtures/api.fixtures'
import { generateUserData } from 'data/user/generateUserData'
import {
  validateResponseStatusAndSchema,
  validateErrorResponseBody,
} from 'utils/validation/validateResponse.utils'
import { STATUS_CODES } from 'data/statusCodes'
import { registerSchema } from 'data/schemas/register/register.schema'
import _ from 'lodash'
import { RESPONSE_ERROR_MESSAGES, RESPONSE_ERROR_CODES } from 'data/errors'

test.describe('[API] [REGISTER]', () => {
  test.describe('Register User Positive', () => {
    test('Register a new user with valid user data', async ({
      registerApi,
    }) => {
      const newUserData = generateUserData()
      const userRegistered = await registerApi.register(newUserData)
      validateResponseStatusAndSchema(userRegistered, {
        status: STATUS_CODES.OK,
        schema: registerSchema,
      })
      const actualUserData = userRegistered.body
      expect(
        _.omit(actualUserData, ['created', 'id', 'updated', 'name']),
      ).toEqual(_.omit(newUserData, ['password', 'language']))
    })

    test('Register a new user with valid user data and empty optional language field', async ({
      registerApi,
    }) => {
      const userData = generateUserData()
      const userRegistered = await registerApi.register({
        ...userData,
        language: '',
      })
      validateResponseStatusAndSchema(userRegistered, {
        status: STATUS_CODES.OK,
        schema: registerSchema,
      })
      const actualUserData = userRegistered.body
      expect(
        _.omit(actualUserData, ['created', 'id', 'updated', 'name']),
      ).toEqual(_.omit(userData, ['password', 'language']))
    })
  })

  test.describe('Register User Negative', () => {
    test('Errors when registering with existing user data', async ({
      registerApi,
      registerService,
    }) => {
      const userData = generateUserData()
      await registerService.registerNewUser(userData)
      const response = await registerApi.register(userData)
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.BAD_REQUEST,
      })
      // type guard to remove ts error: if condition is true, then response.body must be IResponseError”
      if (!response.body || !('message' in response.body)) {
        throw new Error('Expected error response body')
      }
      validateErrorResponseBody(response.body, {
        code: RESPONSE_ERROR_CODES.SAME_USERNAME,
        message: RESPONSE_ERROR_MESSAGES.SAME_USERNAME,
      })
    })

    test('Errors when registering with existing username', async ({
      registerApi,
      registerService,
    }) => {
      const userData = generateUserData()
      await registerService.registerNewUser(userData)
      const newUserData = generateUserData()
      const response = await registerApi.register({
        ...newUserData,
        username: userData.username,
      })
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.BAD_REQUEST,
      })
      // type guard to remove ts error: if condition is true, then response.body must be IResponseError”
      if (!response.body || !('message' in response.body)) {
        throw new Error('Expected error response body')
      }
      validateErrorResponseBody(response.body, {
        code: RESPONSE_ERROR_CODES.SAME_USERNAME,
        message: RESPONSE_ERROR_MESSAGES.SAME_USERNAME,
      })
    })

    test('Errors when registering with existing User Email', async ({
      registerApi,
      registerService,
    }) => {
      const userData = generateUserData()
      await registerService.registerNewUser(userData)
      const newUserData = generateUserData()
      const response = await registerApi.register({
        ...newUserData,
        email: userData.email,
      })
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.BAD_REQUEST,
      })
      // type guard to remove ts error: if condition is true, then response.body must be IResponseError”
      if (!response.body || !('message' in response.body)) {
        throw new Error('Expected error response body')
      }
      validateErrorResponseBody(response.body, {
        code: RESPONSE_ERROR_CODES.SAME_EMAIL,
        message: RESPONSE_ERROR_MESSAGES.SAME_EMAIL,
      })
    })

    test('Errors when registering without Email', async ({ registerApi }) => {
      const userData = generateUserData()
      const response = await registerApi.register({ ...userData, email: '' })
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.BAD_REQUEST,
      })
      // type guard to remove ts error: if condition is true, then response.body must be IResponseError”
      if (!response.body || !('message' in response.body)) {
        throw new Error('Expected error response body')
      }
      validateErrorResponseBody(response.body, {
        code: RESPONSE_ERROR_CODES.MISSING_FIELD,
        message: RESPONSE_ERROR_MESSAGES.MISSING_FIELD,
      })
    })

    test('Errors when registering without username', async ({
      registerApi,
    }) => {
      const userData = generateUserData()
      const response = await registerApi.register({ ...userData, username: '' })
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.BAD_REQUEST,
      })
      // type guard to remove ts error: if condition is true, then response.body must be IResponseError”
      if (!response.body || !('message' in response.body)) {
        throw new Error('Expected error response body')
      }
      validateErrorResponseBody(response.body, {
        code: RESPONSE_ERROR_CODES.MISSING_FIELD,
        message: RESPONSE_ERROR_MESSAGES.MISSING_FIELD,
      })
    })

    test('Errors when registering without password', async ({
      registerApi,
    }) => {
      const userData = generateUserData()
      const response = await registerApi.register({ ...userData, password: '' })
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.BAD_REQUEST,
      })
      // type guard to remove ts error: if condition is true, then response.body must be IResponseError”
      if (!response.body || !('message' in response.body)) {
        throw new Error('Expected error response body')
      }
      validateErrorResponseBody(response.body, {
        code: RESPONSE_ERROR_CODES.MISSING_FIELD,
        message: RESPONSE_ERROR_MESSAGES.MISSING_FIELD,
      })
    })
  })
})
