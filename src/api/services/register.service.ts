import { RegisterApi } from 'api/apiLayer/register.api'
import { logStep } from 'utils/report/logStep.utils'
import { IRegisterUserRequest } from 'data/types/register.types'
import { validateResponseStatusAndSchema } from 'utils/validation/validateResponse.utils'
import { STATUS_CODES } from 'data/statusCodes'
import { registerSchema } from 'data/schemas/register/register.schema'

// Register Service handles business logic: register a new user + validation
export class RegisterService {
  constructor(private registerApi: RegisterApi) {}

  @logStep('Register a new User via API')
  async registerNewUser(userDetails: IRegisterUserRequest) {
    const response = await this.registerApi.register(userDetails)
    validateResponseStatusAndSchema(response, {
      status: STATUS_CODES.OK,
      schema: registerSchema,
    })
    const userData = response.body
    return userData
  }
}
