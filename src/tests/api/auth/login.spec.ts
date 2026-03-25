import { expect, test } from 'fixtures/api.fixtures'
import {
  validateErrorResponseBody,
  validateResponseStatusAndSchema,
  ensureErrorResponseBody,
} from 'utils/validation/validateResponse.utils'
import { STATUS_CODES } from 'data/statusCodes'
import { loginSchema } from 'data/schemas/login/login.schema'
import { ILoginRequest } from 'data/types/login.types'
import { generateUserData } from 'data/user/generateUserData'
import { loginOptions, longTokenOptions } from 'data/login/login.data'
import { RESPONSE_ERROR_MESSAGES, RESPONSE_ERROR_CODES } from 'data/errors'

test.describe('[API] [LOGIN]', () => {
  const newUserData = generateUserData()
  let validCredentials: ILoginRequest = {
    username: newUserData.email,
    password: newUserData.password,
    long_token: true,
  }
  test.beforeAll('Register a new user', async ({ registerService }) => {
    await registerService.registerNewUser(newUserData)
  })
  test.describe('Login User Positive', () => {
    loginOptions.forEach((loginOption) => {
      test(`Successful login with valid user credentials: use ${loginOption} to login`, async ({
        loginApi,
      }) => {
        validCredentials = {
          username: newUserData[loginOption],
          password: newUserData.password,
          long_token: true,
        }
        const response = await loginApi.login(validCredentials)
        validateResponseStatusAndSchema(response, {
          status: STATUS_CODES.OK,
          schema: loginSchema,
        })
        if (!response.body || !('token' in response.body)) {
          throw new Error('login failed')
        }
        expect(response.body.token).toBeTruthy()
      })
    })

    longTokenOptions.forEach((tokenOption) => {
      test(`Successful login with valid user credentials: with email, long_token is set to ${tokenOption}`, async ({
        loginApi,
      }) => {
        validCredentials = {
          username: newUserData.email,
          password: newUserData.password,
          long_token: tokenOption,
        }
        const response = await loginApi.login(validCredentials)
        validateResponseStatusAndSchema(response, {
          status: STATUS_CODES.OK,
          schema: loginSchema,
        })
        if (!response.body || !('token' in response.body)) {
          throw new Error('login failed')
        }
        expect(response.body.token).toBeTruthy()
      })
    })

    longTokenOptions.forEach((tokenOption) => {
      test(`Successful login with valid user credentials: with username, long_token is set to ${tokenOption}`, async ({
        loginApi,
      }) => {
        validCredentials = {
          username: newUserData.username,
          password: newUserData.password,
          long_token: tokenOption,
        }
        const response = await loginApi.login(validCredentials)
        validateResponseStatusAndSchema(response, {
          status: STATUS_CODES.OK,
          schema: loginSchema,
        })
        if (!response.body || !('token' in response.body)) {
          throw new Error('login failed')
        }
        expect(response.body.token).toBeTruthy()
      })
    })
  })

  test.describe('Login User Negative', () => {
    test('Fails to login with invalid email', async ({ loginApi }) => {
      const { email: invalidEmail } = generateUserData()
      const response = await loginApi.login({
        ...validCredentials,
        username: invalidEmail,
      })
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.FORBIDDEN,
      })
      ensureErrorResponseBody(response.body)
      validateErrorResponseBody(response.body, {
        code: RESPONSE_ERROR_CODES.WRONG_USER_DATA,
        message: RESPONSE_ERROR_MESSAGES.WRONG_USER_DATA,
      })
    })

    test('Fails to login with invalid username', async ({ loginApi }) => {
      const { username: invalidUsername } = generateUserData()
      const response = await loginApi.login({
        ...validCredentials,
        username: invalidUsername,
      })
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.FORBIDDEN,
      })
      ensureErrorResponseBody(response.body)
      validateErrorResponseBody(response.body, {
        code: RESPONSE_ERROR_CODES.WRONG_USER_DATA,
        message: RESPONSE_ERROR_MESSAGES.WRONG_USER_DATA,
      })
    })

    test('Fails to login with invalid password', async ({ loginApi }) => {
      const { password: invalidPassword } = generateUserData()
      const response = await loginApi.login({
        ...validCredentials,
        password: invalidPassword,
      })
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.FORBIDDEN,
      })
      ensureErrorResponseBody(response.body)
      validateErrorResponseBody(response.body, {
        code: RESPONSE_ERROR_CODES.WRONG_USER_DATA,
        message: RESPONSE_ERROR_MESSAGES.WRONG_USER_DATA,
      })
    })

    test('Fails to login with empty password', async ({ loginApi }) => {
      const response = await loginApi.login({
        ...validCredentials,
        password: '',
      })
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.FORBIDDEN,
      })
      ensureErrorResponseBody(response.body)
      validateErrorResponseBody(response.body, {
        code: RESPONSE_ERROR_CODES.WRONG_USER_DATA,
        message: RESPONSE_ERROR_MESSAGES.WRONG_USER_DATA,
      })
    })

    test('Fails to login with invalid data type for password', async ({
      loginApi,
    }) => {
      const response = await loginApi.login({
        ...validCredentials,
        password: [validCredentials.password] as unknown as string,
      })
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.BAD_REQUEST,
      })
      ensureErrorResponseBody(response.body)
      validateErrorResponseBody(response.body, {
        message: RESPONSE_ERROR_MESSAGES.MISSING_TOKEN,
      })
    })

    test('Fails to login with empty username field', async ({ loginApi }) => {
      const response = await loginApi.login({
        ...validCredentials,
        username: '',
      })
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.FORBIDDEN,
      })
      ensureErrorResponseBody(response.body)
      validateErrorResponseBody(response.body, {
        code: RESPONSE_ERROR_CODES.WRONG_USER_DATA,
        message: RESPONSE_ERROR_MESSAGES.WRONG_USER_DATA,
      })
    })

    test('Fails to login with empty long_token field', async ({ loginApi }) => {
      const response = await loginApi.login({
        ...validCredentials,
        long_token: '' as unknown as boolean,
      })
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.BAD_REQUEST,
      })
      ensureErrorResponseBody(response.body)
      validateErrorResponseBody(response.body, {
        message: RESPONSE_ERROR_MESSAGES.MISSING_TOKEN,
      })
    })

    test('Fails to login with invalid data type for long_token field', async ({
      loginApi,
    }) => {
      const response = await loginApi.login({
        ...validCredentials,
        long_token: [true] as unknown as boolean,
      })
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.BAD_REQUEST,
      })
      ensureErrorResponseBody(response.body)
      validateErrorResponseBody(response.body, {
        message: RESPONSE_ERROR_MESSAGES.MISSING_TOKEN,
      })
    })

    test('Fails to login with empty required fields', async ({ loginApi }) => {
      const response = await loginApi.login({
        username: '',
        password: '',
        long_token: '' as unknown as boolean,
      })
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.BAD_REQUEST,
      })
      ensureErrorResponseBody(response.body)
      validateErrorResponseBody(response.body, {
        message: RESPONSE_ERROR_MESSAGES.MISSING_TOKEN,
      })
    })

    test('Fails to login with missing password field', async ({ loginApi }) => {
      const response = await loginApi.login({
        username: validCredentials.username,
        long_token: validCredentials.long_token,
      } as unknown as ILoginRequest)
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.BAD_REQUEST,
      })
      ensureErrorResponseBody(response.body)
      validateErrorResponseBody(response.body, {
        message: RESPONSE_ERROR_MESSAGES.MISSING_TOKEN,
      })
    })

    test('Fails to login with missing username field', async ({ loginApi }) => {
      const response = await loginApi.login({
        password: validCredentials.password,
        long_token: validCredentials.long_token,
      } as unknown as ILoginRequest)
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.BAD_REQUEST,
      })
      ensureErrorResponseBody(response.body)
      validateErrorResponseBody(response.body, {
        message: RESPONSE_ERROR_MESSAGES.MISSING_TOKEN,
      })
    })

    test('Fails to login with missing long_token field', async ({
      loginApi,
    }) => {
      const response = await loginApi.login({
        username: validCredentials.username,
        password: validCredentials.password,
      } as unknown as ILoginRequest)
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.BAD_REQUEST,
      })
      ensureErrorResponseBody(response.body)
      validateErrorResponseBody(response.body, {
        message: RESPONSE_ERROR_MESSAGES.MISSING_TOKEN,
      })
    })

    test('Fails to login with missing required fields', async ({
      loginApi,
    }) => {
      const response = await loginApi.login({} as unknown as ILoginRequest)
      validateResponseStatusAndSchema(response, {
        status: STATUS_CODES.BAD_REQUEST,
      })
      ensureErrorResponseBody(response.body)
      validateErrorResponseBody(response.body, {
        message: RESPONSE_ERROR_MESSAGES.MISSING_TOKEN,
      })
    })
  })
})
