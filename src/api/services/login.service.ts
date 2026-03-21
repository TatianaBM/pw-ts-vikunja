import { LoginApi } from 'api/apiLayer/login.api'
import { logStep } from 'utils/report/logStep.utils'
import { ICredentials } from 'data/types/credentials.types'
import { credentials } from 'config/env'
import { validateResponseStatusAndSchema } from 'utils/validation/validateResponse.utils'
import { STATUS_CODES } from 'data/statusCodes'
import { expect } from '@playwright/test'

// LoginService handles business logic + validation
export class LoginService {
  constructor(private loginApi: LoginApi) {}

  @logStep('Login as User via API')
  async loginAsUser(customCredentials?: ICredentials) {
    // pass credentials if customCredentials is null or underfined
    const response = await this.loginApi.login(customCredentials ?? credentials)
    validateResponseStatusAndSchema(response, {
      status: STATUS_CODES.OK,
    })
    const token = response.body!.token
    expect(token).toBeTruthy()
    return token
  }
}
