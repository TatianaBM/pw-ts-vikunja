import { LoginApi } from 'api/apiLayer/login.api'
import { logStep } from 'utils/report/logStep.utils'
import { validateResponseStatusAndSchema } from 'utils/validation/validateResponse.utils'
import { STATUS_CODES } from 'data/statusCodes'
import { expect } from '@playwright/test'
import { ILoginRequest } from 'data/types/login.types'
import { loginSchema } from 'data/schemas/login/login.schema'

// LoginService handles business logic + validation
export class LoginService {
  constructor(private loginApi: LoginApi) {}

  @logStep('Login as User via API')
  async loginAsUser(credentials: ILoginRequest) {
    const response = await this.loginApi.login(credentials)
    validateResponseStatusAndSchema(response, {
      status: STATUS_CODES.OK,
      schema: loginSchema,
    })
    // Now TypeScript understands that after this check, response.body is ILoginSuccessResponse
    if (!response.body || !('token' in response.body)) {
      throw new Error('login failed')
    }
    const token = response.body.token
    expect(token).toBeTruthy()
    return token
  }
}
