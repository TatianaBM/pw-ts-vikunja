import { IApiClient, IRequestOptions } from 'api/apiClients/typesApi'
import { ILoginRequest, ILoginResponse } from 'data/types/login.types'
import { apiConfig } from 'config/apiConfig'
import { IResponse } from 'data/types/core.types'

/**
 * API client for user authentication endpoint
 *
 * Handles HTTP requests for authenticating users with the Vikunja API.
 * This class is responsible only for constructing and sending HTTP requests
 * to the login endpoint. Business logic and response validation should
 * be handled by the service layer.
 *
 * @example
 * const apiClient = new PlaywrightApiClient(request)
 * const loginApi = new LoginApi(apiClient)
 * const response = await loginApi.login({
 *   username: 'john_doe',
 *   password: 'SecurePass123',
 *   long_token: false
 * })
 */
export class LoginApi {
  /**
   * Creates an instance of LoginApi
   * @param apiClient - The HTTP client used to send requests to the API
   */
  constructor(private apiClient: IApiClient) {}

  /**
   * Authenticate a user with the provided credentials
   *
   * Sends a POST request to the login endpoint with user credentials.
   * The endpoint validates the provided credentials and returns a JWT token
   * if authentication succeeds. Supports optional TOTP (Time-based One-Time Password)
   * for two-factor authentication when configured.
   *
   * @param credentials - User login credentials
   * @param credentials.username - The user's unique username (required)
   * @param credentials.password - The user's account password (required)
   * @param credentials.long_token - Whether to request a long-lived token (optional, defaults to false)
   * @param credentials.totp_passcode - TOTP code for two-factor authentication (optional)
   *
   * @returns Promise containing the login response with authentication token
   * @returns The response includes: token (JWT authentication token for subsequent requests)
   *
   * @example
   * // Basic login
   * const response = await loginApi.login({
   *   username: 'jane_smith',
   *   password: 'SecurePass456',
   *   long_token: false
   * })
   *
   * // Login with 2FA
   * const response = await loginApi.login({
   *   username: 'jane_smith',
   *   password: 'SecurePass456',
   *   long_token: true,
   *   totp_passcode: '123456'
   * })
   *
   * if (response.status === 200) {
   *   const { token } = response.body
   *   console.log('Login successful, token:', token)
   * }
   *
   * @see {@link ILoginRequest} for request data structure
   * @see {@link ILoginResponse} for response data structure
   */
  async login(credentials: ILoginRequest): Promise<IResponse<ILoginResponse>> {
    const options: IRequestOptions = {
      baseUrl: apiConfig.baseUrl,
      url: apiConfig.endpoints.login,
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      data: credentials,
    }
    return this.apiClient.send<ILoginResponse>(options)
  }
}
