import { IApiClient, IRequestOptions, IResponse } from 'api/apiClients/typesApi'

// Here we define the base structure
// abstract class must be extended by another class, cannot be instantiated directly
// send() → public method that handles request flow
// transformResponse() → internal helper for formatting/normalizing
// ts enforces that BaseApiClient must have send method cause it implements IApiClient
export abstract class BaseApiClient implements IApiClient {
  // abstract send() means subclasses must implement it
  abstract send<T extends object>(
    options: IRequestOptions,
  ): Promise<IResponse<T>>

  // Encapsulation via protected
  // abstract transformResponse() means subclasses must implement it
  // protected => Accessible inside the class and subclasses
  protected abstract transformResponse(): Promise<IResponse<object>>
}
