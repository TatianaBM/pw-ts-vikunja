import { IApiClient, IRequestOptions } from '../apiClients/typesApi'
import { ICredentials } from '../../data/types/credentials.types'
import { apiConfig } from '../config/apiConfig'
import { ILoginResponse } from '../../data/types/credentials.types'

// LoginApi handles HTTP , responsible only for sending login requests.
export class LoginApi {
  constructor(private apiClient: IApiClient) {}

  async login(credentials: ICredentials) {
    const options: IRequestOptions = {
      baseUrl: apiConfig.baseUrl!,
      url: apiConfig.endpoints.login,
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      data: credentials,
    }
    return await this.apiClient.send<ILoginResponse>(options)
  }
}
