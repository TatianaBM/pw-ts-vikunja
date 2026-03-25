import { IApiClient, IRequestOptions } from 'api/apiClients/typesApi'
import {
  IRegisterUserRequest,
  IRegisterResponse,
} from 'data/types/register.types'
import { apiConfig } from 'config/apiConfig'
import { IResponse } from 'data/types/core.types'

// RegisterApi handles HTTP, responsible only for sending register requests.
/**
 * API client for user registration endpoints
 *
 * Handles HTTP requests for registering new users with the Vikunja API.
 * This class is responsible only for constructing and sending HTTP requests
 * to the registration endpoint. Business logic and response validation should
 * be handled by the service layer.
 *
 * @example
 * const apiClient = new PlaywrightApiClient(request)
 * const registerApi = new RegisterApi(apiClient)
 * const response = await registerApi.register({
 *   username: 'john_doe',
 *   email: 'john@example.com',
 *   password: 'SecurePass123',
 *   language: 'en'
 * })
 */
export class RegisterApi {
  /**
   * Creates an instance of RegisterApi
   * @param apiClient - The HTTP client used to send requests to the API
   */
  constructor(private apiClient: IApiClient) {}

  /**
   * Register a new user with the provided credentials
   *
   * Sends a POST request to the registration endpoint with user data.
   * The endpoint validates the provided credentials and creates a new user
   * account if all validations pass.
   *
   * @param userData - User registration data containing username, email, password, and language
   * @param userData.username - Unique username for the new user (required)
   * @param userData.email - Valid email address for the new user (required)
   * @param userData.password - Password for the new user account (required)
   * @param userData.language - User's preferred language code (optional, defaults to 'en')
   *
   * @returns Promise containing the registration response with created user details
   * @returns The response includes: id, username, email, name, created, updated timestamps
   *
   * @example
   * const response = await registerApi.register({
   *   username: 'jane_smith',
   *   email: 'jane@example.com',
   *   password: 'SecurePass456',
   *   language: 'en'
   * })
   *
   * if (response.status === 200) {
   *   console.log('User registered successfully:', response.body)
   * }
   *
   * @see {@link IRegisterUserRequest} for request data structure
   * @see {@link IRegisterResponse} for response data structure
   */
  async register(
    userData: IRegisterUserRequest,
  ): Promise<IResponse<IRegisterResponse>> {
    const options: IRequestOptions = {
      baseUrl: apiConfig.baseUrl,
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
