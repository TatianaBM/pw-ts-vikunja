import { test as base, expect } from '@playwright/test'
import { LoginApi } from 'api/apiLayer/login.api'
import { RegisterApi } from 'api/apiLayer/register.api'
import { LoginService } from 'api/services/login.service'
import { RegisterService } from 'api/services/register.service'
import { PlaywrightApiClient } from 'api/apiClients/requestApiClient'

export interface IApi {
  // API
  loginApi: LoginApi
  registerApi: RegisterApi
  // Services
  loginService: LoginService
  registerService: RegisterService
}

const test = base.extend<IApi>({
  // api
  loginApi: async ({ request }, use) => {
    const apiClient = new PlaywrightApiClient(request)
    const api = new LoginApi(apiClient)
    await use(api)
  },

  registerApi: async ({ request }, use) => {
    const apiClient = new PlaywrightApiClient(request)
    const api = new RegisterApi(apiClient)
    await use(api)
  },

  // services
  loginService: async ({ loginApi }, use) => {
    await use(new LoginService(loginApi))
  },

  registerService: async ({ registerApi }, use) => {
    await use(new RegisterService(registerApi))
  },
})
export { test, expect }
