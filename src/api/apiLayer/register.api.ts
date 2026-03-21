import { IApiClient, IRequestOptions } from 'api/apiClients/typesApi'
import {
  IRegisterUserRequest,
  IRegisterResponse,
} from 'data/types/register.types'
import { apiConfig } from 'config/apiConfig'

// RegisterApi handles HTTP, responsible only for sending register requests.
export class RegisterApi {
  constructor(private apiClient: IApiClient) {}

  async register(userData: IRegisterUserRequest) {
    const options: IRequestOptions = {
      baseUrl: apiConfig.baseUrl!,
      url: apiConfig.endpoints.register,
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      data: userData,
    }
    return this.apiClient.send<IRegisterResponse>(options)
  }
}
